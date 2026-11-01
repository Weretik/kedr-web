import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { CATALOG_CACHE_TAGS, FAILURE_LIFE } from '../cache-tags';
import { mapCatalogSections } from '../mappers/catalog-sections.mapper';
import { mapCatalogTree } from '../mappers/category-tree.mapper';
import { mapProductSummary } from '../mappers/product-summary.mapper';

import type { CatalogSection, CatalogTreeNode, ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

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

/** The whole category tree with counts for the tree panel, mega menu, and sitemap; `null` when unavailable. */
export async function getCatalogTree(locale: Locale): Promise<CatalogTreeNode[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAGS.all, CATALOG_CACHE_TAGS.categories);

  const result = await siteApiGet('/api/catalog/{lang}/categories', { path: { lang: locale } });
  if (result.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }

  cacheLife('hours');
  return mapCatalogTree(result.data);
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
