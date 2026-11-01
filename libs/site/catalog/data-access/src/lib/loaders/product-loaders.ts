import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { CATALOG_CACHE_TAGS, FAILURE_LIFE } from '../cache-tags';
import { mapProductListPage } from '../mappers/product-list-page.mapper';
import { toProductListRequest } from '../requests/product-list-request';

import type { ProductListScope } from '../requests/product-list-request';
import type { ListingQuery, ProductListPage } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * One page of products of a category subtree or of a search, at retail price; `null` when the API is
 * unavailable. The query is already normalized by the listing model, so equal choices share a cache entry.
 */
export async function getProductListPage(
  locale: Locale,
  scope: ProductListScope,
  query: ListingQuery,
): Promise<ProductListPage | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAGS.all, CATALOG_CACHE_TAGS.products);

  const result = await siteApiGet('/api/catalog/{lang}/products', {
    path: { lang: locale },
    query: toProductListRequest(scope, { ...query, view: 'grid' }),
  });
  if (result.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }

  cacheLife('hours');
  return mapProductListPage(result.data);
}
