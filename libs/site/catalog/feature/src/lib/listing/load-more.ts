'use server';

import { getProductListPage } from '@site/catalog/data-access';
import { parseListingQuery } from '@site/catalog/model';
import { isLocale } from '@site/core/i18n';

import type { ProductListScope } from '@site/catalog/data-access';
import type { ProductListPage } from '@site/catalog/model';

const MAX_SEARCH_LENGTH = 200;

const validScope = (scope: unknown): ProductListScope | null => {
  if (typeof scope !== 'object' || scope === null) return null;
  const { categoryId, searchTerm } = scope as { categoryId?: unknown; searchTerm?: unknown };
  if (Number.isInteger(categoryId) && (categoryId as number) > 0)
    return { categoryId: categoryId as number };
  if (
    typeof searchTerm === 'string' &&
    searchTerm.trim() &&
    searchTerm.length <= MAX_SEARCH_LENGTH
  ) {
    return { searchTerm: searchTerm.trim() };
  }
  return null;
};

/**
 * «Показати ще»: one more page of the same listing. Arguments come from the browser, so they are validated
 * and the query string is parsed again by the listing model before the cached loader runs.
 */
export async function loadMoreProducts(
  locale: unknown,
  scope: unknown,
  search: unknown,
  page: unknown,
): Promise<ProductListPage | null> {
  const lang = String(locale);
  const listingScope = validScope(scope);
  if (!isLocale(lang) || !listingScope || typeof search !== 'string') return null;

  const query = parseListingQuery({
    ...Object.fromEntries(new URLSearchParams(search)),
    page: String(page),
  });
  if (query.page !== page) return null;

  return getProductListPage(lang, listingScope, query);
}
