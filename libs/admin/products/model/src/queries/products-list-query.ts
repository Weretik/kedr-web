export type ProductsListSort =
  | 'id-asc'
  | 'id-desc'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc';

export interface ProductsListQuery {
  searchTerm?: string;
  inStock?: boolean;
  isSale?: boolean;
  isNew?: boolean;
  priceFrom?: number;
  priceTo?: number;
  sort: ProductsListSort;
  page: number;
  pageSize: number;
}

export const DEFAULT_PRODUCTS_LIST_QUERY: ProductsListQuery = {
  inStock: false,
  page: 1,
  pageSize: 20,
  sort: 'id-asc',
};

const MAX_PAGE_SIZE = 100;

const productsListSortValues: readonly ProductsListSort[] = [
  'id-asc',
  'id-desc',
  'name-asc',
  'name-desc',
  'price-asc',
  'price-desc',
];

export function normalizeProductsListQuery(query: ProductsListQuery): ProductsListQuery {
  return {
    searchTerm: normalizeSearchTerm(query.searchTerm),
    inStock: query.inStock ?? DEFAULT_PRODUCTS_LIST_QUERY.inStock,
    isSale: query.isSale === true ? true : undefined,
    isNew: query.isNew === true ? true : undefined,
    priceFrom: normalizePrice(query.priceFrom),
    priceTo: normalizePrice(query.priceTo),
    sort: isProductsListSort(query.sort) ? query.sort : DEFAULT_PRODUCTS_LIST_QUERY.sort,
    page: normalizePositiveInteger(query.page, DEFAULT_PRODUCTS_LIST_QUERY.page),
    pageSize: Math.min(
      normalizePositiveInteger(query.pageSize, DEFAULT_PRODUCTS_LIST_QUERY.pageSize),
      MAX_PAGE_SIZE,
    ),
  };
}

export function isProductsListSort(value: unknown): value is ProductsListSort {
  return typeof value === 'string' && productsListSortValues.includes(value as ProductsListSort);
}

function normalizeSearchTerm(value: string | undefined): string | undefined {
  const normalized = value?.trim();

  return normalized || undefined;
}

function normalizePrice(value: number | undefined): number | undefined {
  return value != null && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function normalizePositiveInteger(value: number, fallback: number): number {
  return Number.isInteger(value) && value >= 1 ? value : fallback;
}
