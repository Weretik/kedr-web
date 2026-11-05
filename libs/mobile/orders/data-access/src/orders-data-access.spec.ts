import { act, renderHook } from '@testing-library/react-native';

import { useOrderDetail } from './hooks/use-order-detail';

import type { OrderDetail } from '@mobile/orders/model';

const order: OrderDetail = {
  comment: null,
  createdAtUtc: '2026-11-05T09:00:00Z',
  customerName: 'Будмаркет',
  lines: [],
  oneCDocumentNumber: null,
  orderId: 42,
  orderNumber: 'КД-0042',
  syncStatus: 'Synced',
  totalKopecks: 0,
};

describe('useOrderDetail', () => {
  it('reads the order online', async () => {
    const fetcher = jest.fn().mockResolvedValue(order);
    const { result } = await renderHook(() => useOrderDetail(42, true, fetcher));
    await act(async () => undefined);

    expect(fetcher).toHaveBeenCalledWith(42);
    expect(result.current).toEqual({ kind: 'ready', order });
  });

  it('says the order opens with the network', async () => {
    const fetcher = jest.fn();
    const { result } = await renderHook(() => useOrderDetail(42, false, fetcher));

    expect(fetcher).not.toHaveBeenCalled();
    expect(result.current).toEqual({ kind: 'offline' });
  });

  it('reports a failed read', async () => {
    const fetcher = jest.fn().mockRejectedValue(new Error('404'));
    const { result } = await renderHook(() => useOrderDetail(42, true, fetcher));
    await act(async () => undefined);

    expect(result.current).toEqual({ kind: 'failed' });
  });
});
