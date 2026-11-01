import { CATALOG_PATH, SEARCH_PATH } from '@site/catalog/model';
import { buildPageMetadata } from '@site/core/seo';

import { CATALOG_SEO_TEXT } from './catalog-seo-text';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** The catalog hub: indexable, self canonical. */
export function buildCatalogHubMetadata(locale: Locale, config?: SiteConfig): Metadata {
  const text = CATALOG_SEO_TEXT[locale];
  return buildPageMetadata(
    { locale, path: CATALOG_PATH, title: text.hubTitle, description: text.hubDescription },
    config,
  );
}

/** Search results are never indexed; the term is shown in the title for the visitor's tab. */
export function buildSearchMetadata(locale: Locale, term: string, config?: SiteConfig): Metadata {
  const text = CATALOG_SEO_TEXT[locale];
  return buildPageMetadata(
    {
      locale,
      path: SEARCH_PATH,
      title: term ? text.searchTitle(term) : text.searchEmptyTitle,
      description: text.searchDescription,
      indexable: false,
    },
    config,
  );
}
