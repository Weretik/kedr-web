import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fromProductsGridFilterModel } from '../model/products-grid-filters';
import { readProductsUrlState, writeProductsUrlState } from '../model/products-url-state';

import type { ProductsListMode, ProductsUrlState } from '../model/products-url-state';
import type { ProductsListQuery, ProductsListSort } from '@admin/products/model';
import type { GridFilterModel } from '@mui/x-data-grid';

type QueryKey = 'allQuery' | 'missingQuery' | 'siteQuery' | 'deletedQuery';
type BooleanFilterField = 'inStock' | 'isSale' | 'isNew';

const queryKeys: Record<ProductsListMode, QueryKey> = {
  all: 'allQuery',
  missing: 'missingQuery',
  site: 'siteQuery',
  deleted: 'deletedQuery',
};

/**
 * Products list tabs and their queries, kept in the URL. Every change except paging returns to page 1.
 * The «Видалені» tab falls back to «Усі товари» for users who may not see it.
 */
export function useProductsListState(canSeeDeleted: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlState = useMemo(() => readProductsUrlState(searchParams), [searchParams]);
  const mode: ProductsListMode =
    urlState.mode === 'deleted' && !canSeeDeleted ? 'all' : urlState.mode;
  const currentQuery: ProductsListQuery = urlState[queryKeys[mode]];

  const write = (next: ProductsUrlState) => setSearchParams(writeProductsUrlState(next));
  const updateCurrent = (patch: Partial<ProductsListQuery>, keepPage = false) =>
    write({
      ...urlState,
      [queryKeys[mode]]: { ...currentQuery, ...patch, ...(keepPage ? {} : { page: 1 }) },
    });

  return {
    urlState,
    mode,
    currentQuery,
    /** Current URL search, kept when opening a product so «Назад» restores the list. */
    search: searchParams.toString(),
    changeMode: (nextMode: ProductsListMode) =>
      write({
        ...urlState,
        mode: nextMode,
        [queryKeys[nextMode]]: { ...urlState[queryKeys[nextMode]], page: 1 },
      }),
    changePage: (page: number) => updateCurrent({ page }, true),
    changePageSize: (pageSize: number) => updateCurrent({ pageSize }),
    changeSort: (sort: ProductsListSort) => updateCurrent({ sort }),
    changeFilters: (model: GridFilterModel) =>
      updateCurrent(fromProductsGridFilterModel(model, mode === 'missing')),
    changeBooleanFilter: (field: BooleanFilterField, value: boolean | undefined) =>
      updateCurrent({ [field]: value }),
    changeCategory: (categoryId: number | undefined) => updateCurrent({ categoryId }),
    changeDeletedQuery: (deletedQuery: ProductsListQuery) => write({ ...urlState, deletedQuery }),
  };
}
