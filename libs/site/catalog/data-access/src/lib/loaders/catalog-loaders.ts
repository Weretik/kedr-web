import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { CATALOG_CACHE_TAGS } from '../cache-tags';
import { mapCatalogSections } from '../mappers/catalog-sections.mapper';
import { mapProductSummary } from '../mappers/product-summary.mapper';

import type { CatalogSection, ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

// A failed read is cached briefly and retried in the background, but still prerendered (expire ≥ 5 minutes).
const FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3600 };

const IN_STOCK_LIMIT = 8;

/** Category tree for menus and the catalog index; `null` when the API is unavailable. */
export async function getCatalogSections(locale: Locale): Promise<CatalogSection[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAGS.all, CATALOG_CACHE_TAGS.categories);

  const result = await siteApiGet('/api/catalog/{lang}/categories', { path: { lang: locale } });
  if (result.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }

  cacheLife('hours');
  return mapCatalogSections(result.data);
}

/** Newest products in stock at retail price; `null` when the API is unavailable. */
export async function getInStockProducts(locale: Locale): Promise<ProductSummary[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAGS.all, CATALOG_CACHE_TAGS.products);

  const result = await siteApiGet('/api/catalog/{lang}/products', {
    path: { lang: locale },
    query: { inStock: true, sort: 'IdDesc', page: 1, pageSize: IN_STOCK_LIMIT },
  });
  if (result.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }

  cacheLife('hours');
  return result.data.value.map(mapProductSummary);
}
