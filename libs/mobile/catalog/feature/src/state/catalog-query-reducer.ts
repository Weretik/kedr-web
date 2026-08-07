import {
  defaultCatalogQuery,
  type CatalogFilterSelection,
  type CatalogQuery,
  type CatalogSort,
} from '@mobile/catalog/model';

import { normalizeCatalogSearchPhrase } from './catalog-search-history';

type CatalogFilterField = Exclude<keyof CatalogFilterSelection, 'categoryId' | 'categorySlug'>;

export interface CatalogQueryState {
  categoryVisible: boolean;
  draftCategoryId?: number;
  draftFilters: CatalogFilterSelection;
  draftSearch: string;
  filtersVisible: boolean;
  query: CatalogQuery;
  searchVisible: boolean;
  sortVisible: boolean;
}

export type CatalogQueryAction =
  | { type: 'searchChanged'; value: string }
  | { type: 'searchCommitted' }
  | { type: 'searchOpened' }
  | { type: 'searchDismissed' }
  | { type: 'searchApplied' }
  | { type: 'filtersOpened' }
  | { type: 'filtersDismissed' }
  | { type: 'filtersChanged'; filters: CatalogFilterSelection }
  | { type: 'filtersApplied' }
  | { type: 'filtersReset' }
  | { type: 'queryReset' }
  | { type: 'sortOpened' }
  | { type: 'sortDismissed' }
  | { type: 'sortChanged'; sort: CatalogSort }
  | { type: 'categoryOpened' }
  | { type: 'categoryDismissed' }
  | { type: 'categoryChanged'; categoryId?: number }
  | { type: 'categorySelected'; categoryId?: number }
  | { type: 'categoryApplied' }
  | { type: 'filterRemoved'; field: CatalogFilterField }
  | { type: 'priceRangeRemoved' }
  | { type: 'categoryRemoved' }
  | { type: 'sortReset' }
  | { type: 'nextPage' }
  | { type: 'firstPage' };

export const initialCatalogQueryState: CatalogQueryState = {
  categoryVisible: false,
  draftFilters: {},
  draftSearch: '',
  filtersVisible: false,
  query: defaultCatalogQuery,
  searchVisible: false,
  sortVisible: false,
};

export function catalogQueryReducer(
  state: CatalogQueryState,
  action: CatalogQueryAction,
): CatalogQueryState {
  switch (action.type) {
    case 'searchChanged':
      return { ...state, draftSearch: action.value };
    case 'searchCommitted':
      return applySearch(state);
    case 'searchOpened':
      return { ...state, draftSearch: state.query.search, searchVisible: true };
    case 'searchDismissed':
      return { ...state, draftSearch: state.query.search, searchVisible: false };
    case 'searchApplied':
      return { ...applySearch(state), searchVisible: false };
    case 'filtersOpened':
      return { ...state, draftFilters: state.query.filters, filtersVisible: true };
    case 'filtersDismissed':
      return { ...state, draftFilters: state.query.filters, filtersVisible: false };
    case 'filtersChanged':
      return { ...state, draftFilters: action.filters };
    case 'filtersApplied':
      return {
        ...state,
        filtersVisible: false,
        query: { ...state.query, filters: state.draftFilters, page: 1 },
      };
    case 'filtersReset':
      return { ...state, draftFilters: withoutFilterFields(state.draftFilters) };
    case 'queryReset':
      return {
        ...state,
        query: { ...state.query, filters: withoutFilterFields(state.query.filters), page: 1 },
      };
    case 'sortOpened':
      return { ...state, sortVisible: true };
    case 'sortDismissed':
      return { ...state, sortVisible: false };
    case 'sortChanged':
      return {
        ...state,
        query: { ...state.query, page: 1, sort: action.sort },
        sortVisible: false,
      };
    case 'categoryOpened':
      return { ...state, categoryVisible: true, draftCategoryId: state.query.filters.categoryId };
    case 'categoryDismissed':
      return { ...state, categoryVisible: false, draftCategoryId: state.query.filters.categoryId };
    case 'categoryChanged':
      return { ...state, draftCategoryId: action.categoryId };
    case 'categorySelected':
      return {
        ...state,
        query: {
          ...state.query,
          filters: {
            ...state.query.filters,
            categoryId: action.categoryId,
            categorySlug: undefined,
          },
          page: 1,
        },
      };
    case 'categoryApplied':
      return {
        ...state,
        categoryVisible: false,
        query: {
          ...state.query,
          filters: {
            ...state.query.filters,
            categoryId: state.draftCategoryId,
            categorySlug: undefined,
          },
          page: 1,
        },
      };
    case 'filterRemoved':
      return {
        ...state,
        query: {
          ...state.query,
          filters: withoutField(state.query.filters, action.field),
          page: 1,
        },
      };
    case 'priceRangeRemoved':
      return {
        ...state,
        query: {
          ...state.query,
          filters: { ...state.query.filters, priceFrom: undefined, priceTo: undefined },
          page: 1,
        },
      };
    case 'categoryRemoved':
      return {
        ...state,
        query: {
          ...state.query,
          filters: { ...state.query.filters, categoryId: undefined, categorySlug: undefined },
          page: 1,
        },
      };
    case 'sortReset':
      return { ...state, query: { ...state.query, page: 1, sort: 'IdAsc' } };
    case 'nextPage':
      return { ...state, query: { ...state.query, page: state.query.page + 1 } };
    case 'firstPage':
      return { ...state, query: { ...state.query, page: 1 } };
  }
}

function applySearch(state: CatalogQueryState): CatalogQueryState {
  return {
    ...state,
    draftSearch: normalizeCatalogSearchPhrase(state.draftSearch),
    query: { ...state.query, page: 1, search: normalizeCatalogSearchPhrase(state.draftSearch) },
  };
}

function withoutFilterFields(filters: CatalogFilterSelection): CatalogFilterSelection {
  return { categoryId: filters.categoryId, categorySlug: filters.categorySlug };
}

function withoutField(
  filters: CatalogFilterSelection,
  field: CatalogFilterField,
): CatalogFilterSelection {
  return { ...filters, [field]: undefined };
}
