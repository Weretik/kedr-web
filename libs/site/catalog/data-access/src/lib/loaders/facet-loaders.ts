import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { CATALOG_CACHE_TAGS, FAILURE_LIFE } from '../cache-tags';
import { mapCategoryFacets } from '../mappers/category-facets.mapper';
import { toFacetsRequest } from '../requests/product-list-request';

import type { CategoryFacets, ListingQuery } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Attribute filters of a category with card counts for the visitor's choices (spec catalog/006); `null` when the
 * API is unavailable or a choice is unknown. Call it with choices already kept to the offered ones.
 */
export async function getCategoryFacets(
  locale: Locale,
  categorySlug: string,
  query: ListingQuery,
): Promise<CategoryFacets | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAGS.all, CATALOG_CACHE_TAGS.products);

  const result = await siteApiGet('/api/catalog/{lang}/{categorySlug}/facets', {
    path: { lang: locale, categorySlug },
    query: toFacetsRequest(query),
  });
  if (result.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }

  cacheLife('hours');
  return mapCategoryFacets(result.data);
}
