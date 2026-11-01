import { productPath } from '@site/catalog/model';
import { siteConfig } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';

import type { ProductSummary } from '@site/catalog/model';
import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

/** A breadcrumb with its localized path, for example `/uk/catalog/ruchky`. */
export type BreadcrumbItem = { name: string; path: string };

/** `BreadcrumbList` with the same items as the visible breadcrumbs; the last item is the page itself. */
export function buildBreadcrumbListJsonLd(
  items: readonly BreadcrumbItem[],
  config: SiteConfig = siteConfig,
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${config.siteUrl}${item.path}`,
    })),
  };
}

/** `ItemList` of product page URLs shown on a listing page, in their order. */
export function buildProductItemListJsonLd(
  locale: Locale,
  products: readonly ProductSummary[],
  config: SiteConfig = siteConfig,
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${config.siteUrl}${localizedPath(locale, productPath(product.slug))}`,
    })),
  };
}
