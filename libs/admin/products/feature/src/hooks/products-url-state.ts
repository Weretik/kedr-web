import { DEFAULT_PRODUCTS_LIST_QUERY, normalizeProductsListQuery } from '@admin/products/model';

import type { MissingPhotoQuery, ProductsListQuery } from '@admin/products/model';

const booleanKeys = ['inStock', 'isSale', 'isNew'] as const;

export interface ProductsUrlState {
  mode: 'all' | 'missing' | 'site';
  allQuery: ProductsListQuery;
  missingQuery: MissingPhotoQuery;
  siteQuery: ProductsListQuery;
}

export function readProductsUrlState(params: URLSearchParams): ProductsUrlState {
  const allQuery = normalizeProductsListQuery({
    ...DEFAULT_PRODUCTS_LIST_QUERY,
    searchTerm: params.get('searchTerm') ?? undefined,
    inStock: readBoolean(params, 'inStock'),
    isSale: readBoolean(params, 'isSale'),
    isNew: readBoolean(params, 'isNew'),
    categoryId: readPositiveInteger(params.get('categoryId'), 0) || undefined,
    priceFrom: readNumber(params.get('priceFrom')),
    priceTo: readNumber(params.get('priceTo')),
    sort: (params.get('sort') ?? DEFAULT_PRODUCTS_LIST_QUERY.sort) as ProductsListQuery['sort'],
    page: readPositiveInteger(params.get('page'), 1),
    pageSize: readPositiveInteger(params.get('pageSize'), 20),
  });
  const missingQuery = normalizeProductsListQuery({
    ...DEFAULT_PRODUCTS_LIST_QUERY,
    searchTerm: params.get('missingSearchTerm') ?? undefined,
    inStock: readBoolean(params, 'missingInStock'),
    isSale: readBoolean(params, 'missingIsSale'),
    isNew: readBoolean(params, 'missingIsNew'),
    categoryId: readPositiveInteger(params.get('missingCategoryId'), 0) || undefined,
    sort: (params.get('missingSort') ?? DEFAULT_PRODUCTS_LIST_QUERY.sort) as ProductsListQuery['sort'],
    page: readPositiveInteger(params.get('missingPage'), 1),
    pageSize: readPositiveInteger(params.get('missingPageSize'), 20),
  });
  const siteQuery = normalizeProductsListQuery({
    ...DEFAULT_PRODUCTS_LIST_QUERY,
    searchTerm: params.get('siteSearchTerm') ?? undefined,
    inStock: readBoolean(params, 'siteInStock'),
    isSale: readBoolean(params, 'siteIsSale'),
    isNew: readBoolean(params, 'siteIsNew'),
    categoryId: readPositiveInteger(params.get('siteCategoryId'), 0) || undefined,
    exportToSite: true,
    priceFrom: readNumber(params.get('sitePriceFrom')),
    priceTo: readNumber(params.get('sitePriceTo')),
    sort: (params.get('siteSort') ?? DEFAULT_PRODUCTS_LIST_QUERY.sort) as ProductsListQuery['sort'],
    page: readPositiveInteger(params.get('sitePage'), 1),
    pageSize: readPositiveInteger(params.get('sitePageSize'), 20),
  });

  return {
    mode: params.get('mode') === 'missing' || params.get('mode') === 'site' ? params.get('mode') as 'missing' | 'site' : 'all',
    allQuery,
    siteQuery,
    missingQuery: {
      searchTerm: missingQuery.searchTerm,
      inStock: missingQuery.inStock,
      isSale: missingQuery.isSale,
      isNew: missingQuery.isNew,
      categoryId: missingQuery.categoryId,
      sort: missingQuery.sort,
      page: missingQuery.page,
      pageSize: missingQuery.pageSize,
    },
  };
}

export function writeProductsUrlState(state: ProductsUrlState): URLSearchParams {
  const params = new URLSearchParams();
  const all = normalizeProductsListQuery(state.allQuery);
  const missing = normalizeProductsListQuery(state.missingQuery);
  const site = normalizeProductsListQuery({ ...state.siteQuery, exportToSite: true });
  if (state.mode !== 'all') params.set('mode', state.mode);
  writeQuery(params, '', all);
  writeQuery(params, 'missing', missing);
  writeQuery(params, 'site', site);
  return params;
}

function writeQuery(params: URLSearchParams, prefix: '' | 'missing' | 'site', query: ProductsListQuery) {
  const key = (name: string) => prefix ? `${prefix}${name[0].toUpperCase()}${name.slice(1)}` : name;
  if (query.searchTerm) params.set(key('searchTerm'), query.searchTerm);
  for (const name of booleanKeys) {
    if (typeof query[name] === 'boolean') params.set(key(name), String(query[name]));
  }
  if (query.categoryId !== undefined) params.set(key('categoryId'), String(query.categoryId));
  if (prefix !== 'missing') {
    if (query.priceFrom !== undefined) params.set(key('priceFrom'), String(query.priceFrom));
    if (query.priceTo !== undefined) params.set(key('priceTo'), String(query.priceTo));
  }
  if (query.sort !== DEFAULT_PRODUCTS_LIST_QUERY.sort) params.set(key('sort'), query.sort);
  if (query.page !== 1) params.set(key('page'), String(query.page));
  if (query.pageSize !== 20) params.set(key('pageSize'), String(query.pageSize));
}

function readBoolean(params: URLSearchParams, key: string): boolean | undefined {
  const value = params.get(key);
  return value === 'true' ? true : value === 'false' ? false : undefined;
}

function readNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

function readPositiveInteger(value: string | null, fallback: number): number {
  if (value === null) return fallback;
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}
