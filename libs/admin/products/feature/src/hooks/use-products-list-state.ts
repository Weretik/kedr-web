import { DEFAULT_PRODUCTS_LIST_QUERY } from '@admin/products/model';
import { useReducer } from 'react';

import type { ProductsListQuery, ProductsListSort } from '@admin/products/model';

type ProductsListFilter = 'isNew' | 'isSale';

interface ProductsListState {
  appliedQuery: ProductsListQuery;
  priceFromDraft: string;
  priceToDraft: string;
  searchDraft: string;
}

type ProductsListAction =
  | { type: 'apply-price-range'; priceFrom?: number; priceTo?: number }
  | { type: 'apply-search' }
  | { filter: ProductsListFilter; type: 'set-filter'; value: boolean }
  | { type: 'set-in-stock'; value: boolean }
  | { type: 'set-page'; value: number }
  | { type: 'set-page-size'; value: number }
  | { type: 'set-price-from-draft'; value: string }
  | { type: 'set-price-to-draft'; value: string }
  | { type: 'set-search-draft'; value: string }
  | { type: 'set-sort'; value: ProductsListSort }
  | { type: 'reset' };

const createInitialState = (): ProductsListState => ({
  appliedQuery: { ...DEFAULT_PRODUCTS_LIST_QUERY },
  priceFromDraft: '',
  priceToDraft: '',
  searchDraft: '',
});

const resetPage = (query: ProductsListQuery): ProductsListQuery => ({
  ...query,
  page: DEFAULT_PRODUCTS_LIST_QUERY.page,
});

function productsListReducer(state: ProductsListState, action: ProductsListAction): ProductsListState {
  switch (action.type) {
    case 'set-search-draft':
      return { ...state, searchDraft: action.value };
    case 'apply-search':
      return {
        ...state,
        appliedQuery: resetPage({
          ...state.appliedQuery,
          searchTerm: state.searchDraft.trim() || undefined,
        }),
      };
    case 'set-in-stock':
      return {
        ...state,
        appliedQuery: resetPage({ ...state.appliedQuery, inStock: action.value }),
      };
    case 'set-page':
      return {
        ...state,
        appliedQuery: { ...state.appliedQuery, page: Math.max(DEFAULT_PRODUCTS_LIST_QUERY.page, action.value) },
      };
    case 'set-page-size':
      return {
        ...state,
        appliedQuery: resetPage({ ...state.appliedQuery, pageSize: action.value }),
      };
    case 'set-filter':
      return {
        ...state,
        appliedQuery: resetPage({
          ...state.appliedQuery,
          [action.filter]: action.value ? true : undefined,
        }),
      };
    case 'set-price-from-draft':
      return { ...state, priceFromDraft: action.value };
    case 'set-price-to-draft':
      return { ...state, priceToDraft: action.value };
    case 'apply-price-range':
      return {
        ...state,
        appliedQuery: resetPage({
          ...state.appliedQuery,
          priceFrom: action.priceFrom,
          priceTo: action.priceTo,
        }),
      };
    case 'set-sort':
      return {
        ...state,
        appliedQuery: resetPage({ ...state.appliedQuery, sort: action.value }),
      };
    case 'reset':
      return {
        appliedQuery: {
          ...DEFAULT_PRODUCTS_LIST_QUERY,
          pageSize: state.appliedQuery.pageSize,
        },
        priceFromDraft: '',
        priceToDraft: '',
        searchDraft: '',
      };
  }
}

export function useProductsListState() {
  const [state, dispatch] = useReducer(productsListReducer, undefined, createInitialState);
  const priceRangeError = getPriceRangeError(state.priceFromDraft, state.priceToDraft);

  return {
    appliedQuery: state.appliedQuery,
    canReset: hasActiveFilters(state),
    priceFromDraft: state.priceFromDraft,
    priceRangeError,
    priceToDraft: state.priceToDraft,
    searchDraft: state.searchDraft,
    applyPriceRange: () => {
      if (priceRangeError) {
        return;
      }

      dispatch({
        type: 'apply-price-range',
        priceFrom: toOptionalPrice(state.priceFromDraft),
        priceTo: toOptionalPrice(state.priceToDraft),
      });
    },
    applySearch: () => dispatch({ type: 'apply-search' }),
    reset: () => dispatch({ type: 'reset' }),
    setFilter: (filter: ProductsListFilter, value: boolean) =>
      dispatch({ type: 'set-filter', filter, value }),
    setInStock: (value: boolean) => dispatch({ type: 'set-in-stock', value }),
    setPage: (value: number) => dispatch({ type: 'set-page', value }),
    setPageSize: (value: number) => dispatch({ type: 'set-page-size', value }),
    setPriceFromDraft: (value: string) => dispatch({ type: 'set-price-from-draft', value }),
    setPriceToDraft: (value: string) => dispatch({ type: 'set-price-to-draft', value }),
    setSearchDraft: (value: string) => dispatch({ type: 'set-search-draft', value }),
    setSort: (value: ProductsListSort) => dispatch({ type: 'set-sort', value }),
  };
}

function getPriceRangeError(priceFromDraft: string, priceToDraft: string): string | undefined {
  const priceFrom = toOptionalPrice(priceFromDraft);
  const priceTo = toOptionalPrice(priceToDraft);

  if (hasInvalidPrice(priceFromDraft) || hasInvalidPrice(priceToDraft)) {
    return 'Вкажіть ціну як невід’ємне число.';
  }

  if (priceFrom !== undefined && priceTo !== undefined && priceFrom > priceTo) {
    return 'Мінімальна ціна не може бути більшою за максимальну.';
  }

  return undefined;
}

function hasActiveFilters(state: ProductsListState): boolean {
  const { appliedQuery } = state;

  return (
    state.searchDraft.length > 0 ||
    state.priceFromDraft.length > 0 ||
    state.priceToDraft.length > 0 ||
    appliedQuery.searchTerm !== undefined ||
    appliedQuery.inStock !== DEFAULT_PRODUCTS_LIST_QUERY.inStock ||
    appliedQuery.isSale === true ||
    appliedQuery.isNew === true ||
    appliedQuery.priceFrom !== undefined ||
    appliedQuery.priceTo !== undefined ||
    appliedQuery.sort !== DEFAULT_PRODUCTS_LIST_QUERY.sort ||
    appliedQuery.page !== DEFAULT_PRODUCTS_LIST_QUERY.page
  );
}

function hasInvalidPrice(value: string): boolean {
  return value.trim().length > 0 && toOptionalPrice(value) === undefined;
}

function toOptionalPrice(value: string): number | undefined {
  const normalized = value.trim();

  if (!normalized) {
    return undefined;
  }

  const price = Number(normalized);

  return Number.isFinite(price) && price >= 0 ? price : undefined;
}
