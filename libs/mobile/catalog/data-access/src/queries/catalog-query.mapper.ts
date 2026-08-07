import type { CatalogQuery } from '@mobile/catalog/model';

const defaultPageSize = 20;

export function toCatalogProductsParams(
  query: CatalogQuery,
): Record<string, boolean | number | string> {
  const search = query.search.trim();
  const { filters } = query;

  return {
    ...(filters.categoryId === undefined ? {} : { categoryId: filters.categoryId }),
    ...(filters.categorySlug ? { categorySlug: filters.categorySlug } : {}),
    ...(filters.inStock === undefined ? {} : { inStock: filters.inStock }),
    ...(filters.isNew === undefined ? {} : { isNew: filters.isNew }),
    ...(filters.isSale === undefined ? {} : { isSale: filters.isSale }),
    ...(filters.priceFrom === undefined ? {} : { priceFrom: filters.priceFrom }),
    ...(filters.priceTo === undefined ? {} : { priceTo: filters.priceTo }),
    ...(search ? { searchTerm: search } : {}),
    page: query.page,
    pageSize: defaultPageSize,
    sort: query.sort,
  };
}
