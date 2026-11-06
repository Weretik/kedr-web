import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { CATALOG_CACHE_TAGS, FAILURE_LIFE } from '../cache-tags';
import { mapModelListPage } from '../mappers/model-list-page.mapper';
import { toProductListRequest } from '../requests/product-list-request';

import type { ProductListScope } from '../requests/product-list-request';
import type { ListingQuery, ProductListPage } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

const emptyPage = (query: ListingQuery): ProductListPage => ({
  items: [],
  page: query.page,
  pageSize: query.perPage,
  totalPages: 0,
  totalRecords: 0,
  filters: [],
  exactMatch: null,
});

/**
 * One page of site models (spec site/product/002) of a category subtree or of a search, at retail price; `null`
 * when the API is unavailable. An unknown attribute or value in the URL lists nothing, so the page offers the
 * reset. The query is already normalized by the listing model, so equal choices share a cache entry.
 */
export async function getProductListPage(
  locale: Locale,
  scope: ProductListScope,
  query: ListingQuery,
): Promise<ProductListPage | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAGS.all, CATALOG_CACHE_TAGS.products);

  const request = toProductListRequest(scope, { ...query, view: 'grid' });
  const result =
    'categorySlug' in scope
      ? await siteApiGet('/api/catalog/{lang}/{categorySlug}/models', {
          path: { lang: locale, categorySlug: scope.categorySlug },
          query: request,
        })
      : await siteApiGet('/api/catalog/{lang}/models', { path: { lang: locale }, query: request });

  if (result.kind === 'not-found') {
    cacheLife('hours');
    return emptyPage(query);
  }
  if (result.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }

  cacheLife('hours');
  return mapModelListPage(result.data);
}
