import { mergeOrderSummaries } from './order-history-pagination';

import type { OrderSummary } from '@mobile/orders/model';

const order = (orderId: number, orderNumber = `${orderId}`): OrderSummary => ({
  counterpartyName: 'Клієнт',
  createdAtUtc: '2026-09-17T11:35:00Z',
  lineCount: 1,
  orderId,
  orderNumber,
  syncStatus: 'Pending',
  totalAmount: 10,
});

describe('mergeOrderSummaries', () => {
  it('appends pages and replaces a duplicate with the latest value', () => {
    expect(mergeOrderSummaries([order(1), order(2)], [order(2, 'оновлено'), order(3)])).toEqual([
      order(1),
      order(2, 'оновлено'),
      order(3),
    ]);
  });
});
