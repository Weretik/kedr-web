import 'server-only';

import { siteConfig } from '@site/core/config';
import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { ARTICLE_CACHE_TAGS, ARTICLE_FAILURE_LIFE, ARTICLE_LIFE } from './article-cache';
import { mapArticle, mapArticleSummary } from './article.mapper';

import type { Article } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** One article page read: the article, a slug that is not published, or an API failure. */
export type ArticleResult =
  { kind: 'ok'; article: Article } | { kind: 'not-found' } | { kind: 'unavailable' };

/**
 * Published articles of one language, newest first, without bodies (cards, search by title and excerpt,
 * sitemap); `null` when the API is unavailable.
 */
export async function getArticles(locale: Locale): Promise<readonly Article[] | null> {
  'use cache';
  cacheTag(ARTICLE_CACHE_TAGS.all, ARTICLE_CACHE_TAGS.articles);

  const result = await siteApiGet('/api/content/{lang}/articles', { path: { lang: locale } });
  if (result.kind !== 'ok') {
    cacheLife(ARTICLE_FAILURE_LIFE);
    return null;
  }

  cacheLife(ARTICLE_LIFE);
  return result.data.map((item) => mapArticleSummary(item, siteConfig.apiUrl));
}

/** One published article with its sanitized body. */
export async function getArticle(locale: Locale, slug: string): Promise<ArticleResult> {
  'use cache';
  cacheTag(ARTICLE_CACHE_TAGS.all, ARTICLE_CACHE_TAGS.articles, ARTICLE_CACHE_TAGS.article(slug));

  const result = await siteApiGet('/api/content/{lang}/articles/{slug}', {
    path: { lang: locale, slug },
  });
  if (result.kind === 'ok') {
    cacheLife(ARTICLE_LIFE);
    return { kind: 'ok', article: mapArticle(result.data, siteConfig.apiUrl) };
  }
  if (result.kind === 'not-found' || result.kind === 'gone') {
    cacheLife(ARTICLE_LIFE);
    return { kind: 'not-found' };
  }

  cacheLife(ARTICLE_FAILURE_LIFE);
  return { kind: 'unavailable' };
}
