import { COMPANY, siteConfig } from '@site/core/config';
import { LOCALE_LANGUAGE_TAGS } from '@site/core/i18n';
import { buildCanonicalPath } from '@site/core/seo';

import { ARTICLES_SEO_COPY } from './articles-seo-copy';

import type { ArticleSeoData } from './article-seo-types';
import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

function breadcrumbItems(locale: Locale, config: SiteConfig, article?: ArticleSeoData) {
  const copy = ARTICLES_SEO_COPY[locale];
  const items = [
    { name: copy.home, path: '/' },
    { name: copy.title, path: '/articles' },
    ...(article ? [{ name: article.title, path: '/articles/' + article.slug }] : []),
  ];
  return items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: config.siteUrl + buildCanonicalPath(locale, item.path),
  }));
}

/** The list represents navigation, not a single Article. */
export function buildArticlesBreadcrumbJsonLd(
  locale: Locale,
  config: SiteConfig = siteConfig,
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems(locale, config),
  };
}

/** The detail graph mirrors the visible breadcrumbs and confirmed source fields only. */
export function buildArticleJsonLd(
  locale: Locale,
  article: ArticleSeoData,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const canonical = config.siteUrl + buildCanonicalPath(locale, '/articles/' + article.slug);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: breadcrumbItems(locale, config, article) },
      {
        '@type': 'Article',
        '@id': canonical + '#article',
        headline: article.title,
        description: article.excerpt,
        ...(article.image ? { image: new URL(article.image, config.siteUrl).href } : {}),
        inLanguage: LOCALE_LANGUAGE_TAGS[locale],
        datePublished: article.publishedAt,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        publisher: { '@type': 'Organization', name: COMPANY.name, url: config.siteUrl },
      },
    ],
  };
}
