import { CATALOG_PATH } from '@site/catalog/model';
import { getArticle, getArticles } from '@site/content/data-access';
import { buildArticleJsonLd, buildArticleMetadata } from '@site/content/seo';
import { ArticleContent } from '@site/content/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';
import { notFound } from 'next/navigation';

import type { Article } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

type ArticlePageProps = { locale: Locale; slug: string };

/**
 * Cache Components needs at least one static param. When the API is unreachable at build time this slug is
 * prerendered instead, and the page answers 404 for it without calling the API.
 */
export const ARTICLE_PLACEHOLDER_SLUG = '__placeholder__';

/**
 * A missing or unpublished slug answers 404. An unavailable API throws: the visitor gets the error page with
 * status 500, never an empty 200 page.
 */
async function loadArticleOrRespond(locale: Locale, slug: string): Promise<Article> {
  if (slug === ARTICLE_PLACEHOLDER_SLUG) notFound();
  const result = await getArticle(locale, slug);
  if (result.kind === 'ok') return result.article;
  if (result.kind === 'not-found') notFound();
  throw new Error(`Content API is unavailable for article "${slug}"`);
}

export async function ArticlePage({ locale, slug }: ArticlePageProps) {
  const article = await loadArticleOrRespond(locale, slug);
  return (
    <>
      <ArticleContent
        locale={locale}
        article={article}
        links={{
          catalog: localizedPath(locale, CATALOG_PATH),
          wholesale: localizedPath(locale, '/wholesale'),
        }}
      />
      <JsonLd data={buildArticleJsonLd(locale, article)} />
    </>
  );
}

export async function generateArticleMetadata(locale: Locale, slug: string) {
  return buildArticleMetadata(locale, await loadArticleOrRespond(locale, slug));
}

/** Every published article is prerendered at build; a new one renders on its first request and is kept. */
export async function getArticleStaticParams(locale: Locale): Promise<{ slug: string }[]> {
  const articles = await getArticles(locale);
  return articles?.length
    ? articles.map(({ slug }) => ({ slug }))
    : [{ slug: ARTICLE_PLACEHOLDER_SLUG }];
}
