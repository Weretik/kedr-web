import {
  useGetCatalogCategoriesQuery,
  useGetCatalogProductsQuery,
} from '@mobile/catalog/data-access';
import { useCallback, useEffect, useReducer, useState } from 'react';

import { catalogQueryReducer, initialCatalogQueryState } from '../state/catalog-query-reducer';
import {
  removeCatalogSearchHistoryEntry,
  upsertCatalogSearchHistory,
} from '../state/catalog-search-history';
import {
  loadCatalogSearchHistory,
  saveCatalogSearchHistory,
} from '../storage/catalog-search-history-storage';

export function useCatalogController() {
  const [state, dispatch] = useReducer(catalogQueryReducer, initialCatalogQueryState);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const categoriesQueryResult = useGetCatalogCategoriesQuery();
  const queryResult = useGetCatalogProductsQuery(state.query, { refetchOnMountOrArgChange: true });
  const { currentData, isFetching, refetch } = queryResult;

  useEffect(() => {
    let subscribed = true;
    void loadCatalogSearchHistory().then((history) => {
      if (subscribed) setSearchHistory(history);
    });

    return () => {
      subscribed = false;
    };
  }, []);

  const refresh = useCallback(() => {
    if (state.query.page === 1) void refetch();
    else dispatch({ type: 'firstPage' });
  }, [refetch, state.query.page]);

  const loadNextPage = useCallback(() => {
    if (currentData && !isFetching && currentData.pageNumber < currentData.totalPages)
      dispatch({ type: 'nextPage' });
  }, [currentData, isFetching]);

  const clearSearch = useCallback(() => {
    dispatch({ type: 'searchChanged', value: '' });
    dispatch({ type: 'searchApplied' });
  }, []);

  const applySearch = useCallback(() => {
    const nextHistory = upsertCatalogSearchHistory(searchHistory, state.draftSearch);
    dispatch({ type: 'searchApplied' });

    if (
      nextHistory.length === searchHistory.length &&
      nextHistory.every((phrase, index) => phrase === searchHistory[index])
    )
      return;

    setSearchHistory(nextHistory);
    void saveCatalogSearchHistory(nextHistory).catch(() => undefined);
  }, [searchHistory, state.draftSearch]);

  const selectSearchHistory = useCallback((phrase: string) => {
    dispatch({ type: 'searchChanged', value: phrase });
    dispatch({ type: 'searchApplied' });
  }, []);

  const removeSearchHistoryEntry = useCallback((phrase: string) => {
    setSearchHistory((current) => {
      const next = removeCatalogSearchHistoryEntry(current, phrase);
      void saveCatalogSearchHistory(next).catch(() => undefined);
      return next;
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    void saveCatalogSearchHistory([]).catch(() => undefined);
  }, []);

  const retryCategories = useCallback(() => {
    void categoriesQueryResult.refetch();
  }, [categoriesQueryResult.refetch]);

  return {
    applySearch,
    clearSearchHistory,
    categoriesQueryResult,
    clearSearch,
    dispatch,
    items: currentData?.items ?? [],
    loadNextPage,
    queryResult,
    refresh,
    removeSearchHistoryEntry,
    retryCategories,
    searchHistory,
    selectSearchHistory,
    state,
  };
}
