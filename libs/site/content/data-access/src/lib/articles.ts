import 'server-only';

import { ARTICLE_SLUGS } from '@site/content/model';

import { ARTICLES_SOURCE } from './articles-source';

import type { Article } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

function localizeArticles(locale: Locale): readonly Article[] {
  return Object.freeze(
    ARTICLES_SOURCE.map((source) => {
      const paragraphs = Object.freeze([...source.paragraphs[locale]]);
      const firstParagraph = paragraphs[0] ?? '';
      return Object.freeze({
        id: source.id,
        slug: ARTICLE_SLUGS[source.id],
        title: source.title[locale],
        excerpt: firstParagraph.split(/(?<=[.!?])\s+/u)[0],
        paragraphs,
        image: source.image,
        publishedAt: source.publishedAt,
      });
    }),
  );
}

const ARTICLES_BY_LOCALE = Object.freeze({
  uk: localizeArticles('uk'),
  ru: localizeArticles('ru'),
});

/** Reads the complete localized source. Filtering and paging belong to content/model. */
export function getArticles(locale: Locale): readonly Article[] {
  return ARTICLES_BY_LOCALE[locale];
}

/** Known legacy IDs are redirected by the app; this lookup accepts only stable slugs. */
export function getArticle(locale: Locale, slug: string): Article | undefined {
  return getArticles(locale).find((article) => article.slug === slug);
}
