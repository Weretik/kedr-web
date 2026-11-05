import { useEffect, useEffectEvent, useState } from 'react';

import { fetchOrderDetail, type OrderDetailFetcher } from '../api/order-detail-client';

import type { OrderDetail } from '@mobile/orders/model';

export type OrderDetailState =
  | { kind: 'failed' }
  | { kind: 'loading' }
  | { kind: 'offline' }
  | { kind: 'ready'; order: OrderDetail };

/** Reads the order online; offline the screen says it opens with the network (R-013). Key the caller by order. */
export function useOrderDetail(
  orderId: number,
  isOnline: boolean | null,
  fetcher: OrderDetailFetcher = fetchOrderDetail,
): OrderDetailState {
  const [loaded, setLoaded] = useState<OrderDetailState | null>(null);

  const load = useEffectEvent((isActive: () => boolean) => {
    fetcher(orderId)
      .then((order) => {
        if (isActive()) setLoaded({ kind: 'ready', order });
      })
      .catch(() => {
        if (isActive()) setLoaded({ kind: 'failed' });
      });
  });

  useEffect(() => {
    if (isOnline !== true) return;
    let active = true;
    load(() => active);
    return () => {
      active = false;
    };
  }, [orderId, isOnline]);

  if (loaded?.kind === 'ready') return loaded;
  if (isOnline === false) return { kind: 'offline' };
  return loaded ?? { kind: 'loading' };
}
