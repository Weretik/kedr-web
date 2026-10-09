import { useGetOrderHistoryQuery } from '@mobile/orders/data-access';
import { useCallback, useReducer } from 'react';

import {
  initialOrderHistoryPageState,
  orderHistoryPageReducer,
} from '../state/order-history-page-reducer';

export function useOrderHistoryPages(counterpartyId?: string) {
  const [state, dispatch] = useReducer(orderHistoryPageReducer, initialOrderHistoryPageState);
  const query = useGetOrderHistoryQuery(
    { counterpartyId, page: state.page },
    { refetchOnMountOrArgChange: true },
  );
  const { currentData, isFetching } = query;

  const firstPage = useCallback(() => dispatch({ type: 'firstPage' }), []);
  const loadNextPage = useCallback(() => {
    if (currentData && !isFetching && currentData.pageNumber < currentData.totalPages)
      dispatch({ type: 'nextPage' });
  }, [currentData, isFetching]);
  const refresh = useCallback(() => {
    if (state.page === 1) void query.refetch();
    else firstPage();
  }, [firstPage, query.refetch, state.page]);

  return {
    firstPage,
    hasNextPage: Boolean(currentData && currentData.pageNumber < currentData.totalPages),
    items: currentData?.items ?? [],
    loadNextPage,
    query,
    refresh,
    state,
  };
}
