import { useQuery } from '@tanstack/react-query';

import { fetchOrderDetail, type OrderDetailFetcher } from './order-detail-client';

import type { OrderDetail } from '@mobile/orders/model';

export type OrderDetailState =
  | { kind: 'failed' }
  | { kind: 'loading' }
  | { kind: 'offline' }
  | { kind: 'ready'; order: OrderDetail };

/**
 * Reads the order online and keeps it in the query cache, so reopening it shows it at once while it refreshes;
 * offline an order not read before says it opens with the network (R-013).
 */
export function useOrderDetail(
  orderId: number,
  isOnline: boolean | null,
  fetcher: OrderDetailFetcher = fetchOrderDetail,
): OrderDetailState {
  const query = useQuery({
    enabled: isOnline === true,
    queryFn: () => fetcher(orderId),
    queryKey: ['order-detail', orderId],
    staleTime: 0,
  });

  if (query.data) return { kind: 'ready', order: query.data };
  if (isOnline === false) return { kind: 'offline' };
  if (query.isError) return { kind: 'failed' };
  return { kind: 'loading' };
}
