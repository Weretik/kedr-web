import { mergeOrderHistoryPages } from './order-history-pages';

describe('mergeOrderHistoryPages', () => {
  it('accumulates unique orders and resets on page one', () => {
    const current = page(1, [1, 2]);
    mergeOrderHistoryPages(current, page(2, [2, 3]));
    expect(current.items.map((item) => item.orderId)).toEqual([1, 2, 3]);

    mergeOrderHistoryPages(current, page(1, [4]));
    expect(current.items.map((item) => item.orderId)).toEqual([4]);
  });
});

function page(pageNumber: number, ids: number[]) {
  return {
    items: ids.map((orderId) => ({
      counterpartyName: 'ТОВ Кедр',
      createdAtUtc: '2026-09-17T11:35:00Z',
      lineCount: 1,
      orderId,
      orderNumber: String(orderId),
      syncStatus: 'Pending' as const,
      totalAmount: 10,
    })),
    pageNumber,
    pageSize: 20,
    totalPages: 2,
    totalRecords: 3,
  };
}
