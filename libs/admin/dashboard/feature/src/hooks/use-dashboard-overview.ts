import {
  useGetDashboardCatalogQuery,
  useGetDashboardContentQuery,
  useGetDashboardOrdersQuery,
} from '@admin/dashboard/data-access';
import { attentionItems } from '@admin/dashboard/model';
import { useMemo } from 'react';

const fresh = { refetchOnMountOrArgChange: true } as const;

/** The three «Огляд» blocks; each loads and fails on its own, and a failed block adds no problems. */
export function useDashboardOverview(now: Date) {
  const orders = useGetDashboardOrdersQuery(undefined, fresh);
  const catalog = useGetDashboardCatalogQuery(undefined, fresh);
  const content = useGetDashboardContentQuery(undefined, fresh);

  const items = useMemo(
    () =>
      attentionItems({ orders: orders.data, catalog: catalog.data, content: content.data, now }),
    [orders.data, catalog.data, content.data, now],
  );
  const failed = [
    orders.isError ? 'замовлення' : null,
    catalog.isError ? 'каталог' : null,
    content.isError ? 'контент сайту' : null,
  ].filter((name): name is string => name !== null);

  return {
    items,
    orders: orders.data,
    isLoading: orders.isLoading || catalog.isLoading || content.isLoading,
    failed,
  };
}
