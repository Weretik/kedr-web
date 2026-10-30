export type ProductsListSort =
  | 'id-asc'
  | 'id-desc'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'category-asc'
  | 'category-desc';

export interface ProductsListQuery {
  searchTerm?: string;
  inStock?: boolean;
  isSale?: boolean;
  isNew?: boolean;
  exportToSite?: boolean;
  /** Soft-deleted products only (administrators); the server then supports search and paging only. */
  deleted?: boolean;
  categoryId?: number;
  priceFrom?: number;
  priceTo?: number;
  sort: ProductsListSort;
  page: number;
  pageSize: number;
}

export const DEFAULT_PRODUCTS_LIST_QUERY: ProductsListQuery = {
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
  'category-asc',
  'category-desc',
];

export function normalizeProductsListQuery(query: ProductsListQuery): ProductsListQuery {
  return {
    searchTerm: normalizeSearchTerm(query.searchTerm),
    inStock: typeof query.inStock === 'boolean' ? query.inStock : undefined,
    isSale: typeof query.isSale === 'boolean' ? query.isSale : undefined,
    isNew: typeof query.isNew === 'boolean' ? query.isNew : undefined,
    exportToSite: typeof query.exportToSite === 'boolean' ? query.exportToSite : undefined,
    deleted: query.deleted === true ? true : undefined,
    categoryId:
      Number.isInteger(query.categoryId) && (query.categoryId ?? 0) > 0
        ? query.categoryId
        : undefined,
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

  return normalized?.slice(0, 100) || undefined;
}

function normalizePrice(value: number | undefined): number | undefined {
  return value != null && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function normalizePositiveInteger(value: number, fallback: number): number {
  return Number.isInteger(value) && value >= 1 ? value : fallback;
}
