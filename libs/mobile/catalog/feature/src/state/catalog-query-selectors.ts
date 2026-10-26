import {
  findCatalogCategoryPath,
  type CatalogCategoryOption,
  type CatalogCategoryPathItem,
  type CatalogFilterSelection,
  type CatalogSort,
} from '@mobile/catalog/model';

export interface SelectedCatalogCategory {
  label: string;
  path: readonly CatalogCategoryPathItem[];
}

export function selectedCatalogCategory(
  categories: readonly CatalogCategoryOption[],
  categoryId: number | undefined,
): SelectedCatalogCategory | undefined {
  const path = findCatalogCategoryPath(categories, categoryId);
  const last = path?.[path.length - 1];
  return path && last ? { label: last.label, path } : undefined;
}

const sortChipLabels: Record<CatalogSort, string> = {
  IdAsc: 'ID ↑',
  IdDesc: 'ID ↓',
  NameAsc: 'Назва А–Я',
  NameDesc: 'Назва Я–А',
  PriceAsc: 'Ціна ↑',
  PriceDesc: 'Ціна ↓',
};

/** Short label for the sort chip; undefined for the default sort. */
export function sortChipLabel(sort: CatalogSort): string | undefined {
  return sort === 'IdAsc' ? undefined : sortChipLabels[sort];
}

/** Filters shown behind the "Фільтри" entry (category has its own entry). */
export function countActiveFilters(filters: CatalogFilterSelection): number {
  const priceRange = filters.priceFrom !== undefined || filters.priceTo !== undefined;
  return [filters.inStock, filters.isNew, filters.isSale, priceRange].filter(Boolean).length;
}
