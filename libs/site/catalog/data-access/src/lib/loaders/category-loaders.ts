import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { CATALOG_CACHE_TAGS, FAILURE_LIFE } from '../cache-tags';
import { mapCategoryDetails, readRedirectSlug } from '../mappers/category-details.mapper';

import type { CategoryDetails } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** A category page read: the category, a permanent move to another slug, a missing slug, or an API failure. */
export type CategoryResult =
  | { kind: 'ok'; category: CategoryDetails }
  | { kind: 'moved'; slug: string }
  | { kind: 'not-found' }
  | { kind: 'unavailable' };

/**
 * One category by slug. A former slug answers with the current one, and a deleted category with an active
 * ancestor answers 404 naming it; both become `moved`, so the page redirects permanently.
 */
export async function getCategory(locale: Locale, slug: string): Promise<CategoryResult> {
  'use cache';
  cacheTag(
    CATALOG_CACHE_TAGS.all,
    CATALOG_CACHE_TAGS.categories,
    CATALOG_CACHE_TAGS.category(slug),
  );

  const result = await siteApiGet('/api/catalog/{lang}/categories/by-slug/{categorySlug}', {
    path: { lang: locale, categorySlug: slug },
  });

  if (result.kind === 'unavailable') {
    cacheLife(FAILURE_LIFE);
    return { kind: 'unavailable' };
  }

  cacheLife('hours');
  if (result.kind === 'ok') {
    return result.data.slug === slug
      ? { kind: 'ok', category: mapCategoryDetails(result.data) }
      : { kind: 'moved', slug: result.data.slug };
  }

  const redirectSlug = result.kind === 'not-found' ? readRedirectSlug(result.body) : null;
  return redirectSlug && redirectSlug !== slug
    ? { kind: 'moved', slug: redirectSlug }
    : { kind: 'not-found' };
}
