import type { CatalogFilterSelection, CatalogQuery, CatalogSort } from './catalog-query';

const catalogSortValues: readonly CatalogSort[] = [
  'IdAsc',
  'IdDesc',
  'NameAsc',
  'NameDesc',
  'PriceAsc',
  'PriceDesc',
];

export function isCatalogFilterSelectionValid(filters: CatalogFilterSelection): boolean {
  if (
    filters.categoryId !== undefined &&
    (!Number.isInteger(filters.categoryId) || filters.categoryId < 1)
  ) {
    return false;
  }

  if (filters.categorySlug !== undefined && filters.categorySlug.length > 100) {
    return false;
  }

  if (
    filters.priceFrom !== undefined &&
    (!Number.isFinite(filters.priceFrom) || filters.priceFrom < 0)
  ) {
    return false;
  }

  if (filters.priceTo !== undefined && (!Number.isFinite(filters.priceTo) || filters.priceTo < 0)) {
    return false;
  }

  return (
    filters.priceFrom === undefined ||
    filters.priceTo === undefined ||
    filters.priceFrom <= filters.priceTo
  );
}

export function isCatalogQueryValid(query: CatalogQuery): boolean {
  return (
    Number.isInteger(query.page) &&
    query.page >= 1 &&
    catalogSortValues.includes(query.sort) &&
    isCatalogFilterSelectionValid(query.filters)
  );
}
