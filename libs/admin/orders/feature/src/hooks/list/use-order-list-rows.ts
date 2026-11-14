import { useGetWorkspaceDraftsQuery, useGetWorkspaceOrdersQuery } from '@admin/orders/data-access';

import type { Mode } from './use-order-list-url-state';
import type { ListQuery } from '@admin/orders/model';

/** Rows of the open tab; the other list and a wrong date range are not requested. */
export function useOrderListRows(query: ListQuery, mode: Mode, invalidDateRange: boolean) {
  const orders = useGetWorkspaceOrdersQuery(query, { skip: mode !== 'orders' || invalidDateRange });
  const drafts = useGetWorkspaceDraftsQuery(query, { skip: mode !== 'drafts' || invalidDateRange });
  const active = mode === 'orders' ? orders : drafts;
  return {
    rows: (mode === 'orders' ? orders.data?.items : drafts.data?.items) ?? [],
    total: active.data?.pageInfo.totalRecords ?? 0,
    loading: active.isLoading || active.isFetching,
    failed: active.isError,
    retry: () => void active.refetch(),
  };
}
