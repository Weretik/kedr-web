import { siteConfig } from '@site/core/config';
import { buildPageMetadata } from '@site/core/seo';

import { ARTICLES_SEO_COPY } from './articles-seo-copy';

import type { ArticleSeoData, ArticlesSeoInput } from './article-seo-types';
import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** The feature supplies one normalized query resolution for HTML, links and metadata. */
export function buildArticlesMetadata(
  locale: Locale,
  input: ArticlesSeoInput,
  config: SiteConfig = siteConfig,
): Metadata {
  const copy = ARTICLES_SEO_COPY[locale];
  const hasSearch = input.q.length > 0;
  const baseTitle = hasSearch ? copy.searchTitle + ': ' + input.q : copy.listTitle;
  const title = input.page > 1 ? baseTitle + ' — ' + copy.page + ' ' + input.page : baseTitle;
  const metadata = buildPageMetadata(
    {
      locale,
      path: '/articles',
      search: input.search,
      title,
      description: copy.description,
      indexable: !hasSearch && input.pageSize === 10,
    },
    config,
  );

  // A query can match different articles across languages, so search pages have no hreflang.
  if (hasSearch) metadata.alternates = { canonical: metadata.alternates?.canonical };
  return metadata;
}

/** Source title, excerpt and publication date; no author or modification date is fabricated. */
export function buildArticleMetadata(
  locale: Locale,
  article: ArticleSeoData,
  config: SiteConfig = siteConfig,
): Metadata {
  const metadata = buildPageMetadata(
    {
      locale,
      path: '/articles/' + article.slug,
      title: article.title,
      description: article.excerpt,
    },
    config,
  );

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: article.publishedAt,
      ...(article.image
        ? { images: [{ url: new URL(article.image, config.siteUrl).href, alt: article.title }] }
        : {}),
    },
  };
}
