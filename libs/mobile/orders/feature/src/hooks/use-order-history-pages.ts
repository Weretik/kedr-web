import { useGetOrderHistoryQuery } from '@mobile/orders/data-access';
import { useCallback, useEffect, useReducer, useState } from 'react';

import {
  initialOrderHistoryPageState,
  orderHistoryPageReducer,
} from '../state/order-history-page-reducer';
import { mergeOrderSummaries } from '../state/order-history-pagination';

import type { OrderSummary } from '@mobile/orders/model';

export function useOrderHistoryPages(counterpartyId?: string) {
  const [state, dispatch] = useReducer(orderHistoryPageReducer, initialOrderHistoryPageState);
  const [items, setItems] = useState<OrderSummary[]>([]);
  const query = useGetOrderHistoryQuery(
    { counterpartyId, page: state.page },
    { refetchOnMountOrArgChange: true },
  );
  const { currentData, isFetching } = query;

  useEffect(() => setItems([]), [counterpartyId]);
  useEffect(() => {
    if (!currentData) return;
    setItems((current) =>
      state.page === 1 ? currentData.items : mergeOrderSummaries(current, currentData.items),
    );
  }, [currentData, state.page]);

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
    items,
    loadNextPage,
    query,
    refresh,
    state,
  };
}
