import {
  OrderHistoryEmpty,
  OrderHistoryError,
  OrderHistoryList,
  OrderHistoryLoading,
} from '@mobile/orders/ui';

import type { useOrderHistoryController } from '../hooks/use-order-history-controller';
import type { OrderSummary } from '@mobile/orders/model';

type Controller = ReturnType<typeof useOrderHistoryController>;

export function OrderHistoryResults({
  controller,
  onOpenOrder,
}: Readonly<{ controller: Controller; onOpenOrder: (order: OrderSummary) => void }>) {
  const { filter, history } = controller;
  const { items, query, state } = history;

  if (query.isLoading && items.length === 0) return <OrderHistoryLoading />;
  if (query.isError && state.page === 1 && items.length === 0)
    return <OrderHistoryError onRetry={() => void query.refetch()} />;
  if (!query.isFetching && items.length === 0)
    return <OrderHistoryEmpty filtered={Boolean(filter.customer)} onClear={filter.clearFilter} />;

  return (
    <OrderHistoryList
      items={items}
      hasNextPage={history.hasNextPage}
      loadingNextPage={state.page > 1 && query.isFetching}
      nextPageError={state.page > 1 && query.isError}
      onLoadMore={history.loadNextPage}
      onOpenOrder={onOpenOrder}
      onRefresh={history.refresh}
      onRetryNextPage={() => void query.refetch()}
      refreshing={state.page === 1 && query.isFetching && items.length > 0}
    />
  );
}
