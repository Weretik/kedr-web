import { parseOrderHistoryPage } from './order-history.mapper';

const response = {
  pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 2, totalRecords: 21 },
  value: [
    {
      counterpartyId: 'cp-1',
      counterpartyName: 'Клієнт',
      createdAtUtc: '2026-09-17T11:35:00Z',
      lineCount: 2,
      oneCDocumentNumber: null,
      orderId: 42,
      orderNumber: 'SO-42',
      syncStatus: 'Pending',
      totalAmount: 25_000,
    },
  ],
};

describe('order history mapper', () => {
  it('validates and maps a generated order page shape', () => {
    expect(parseOrderHistoryPage(response)).toEqual({
      items: [
        {
          counterpartyName: 'Клієнт',
          createdAtUtc: '2026-09-17T11:35:00Z',
          lineCount: 2,
          orderId: 42,
          orderNumber: 'SO-42',
          syncStatus: 'Pending',
          totalAmount: 25_000,
        },
      ],
      pageNumber: 1,
      pageSize: 20,
      totalPages: 2,
      totalRecords: 21,
    });
  });

  it('maps an unknown customer to a valid empty page', () => {
    expect(
      parseOrderHistoryPage({
        ...response,
        pagedInfo: { ...response.pagedInfo, totalPages: 0, totalRecords: 0 },
        value: [],
      }).items,
    ).toEqual([]);
  });

  it('rejects invalid external data', () => {
    expect(() =>
      parseOrderHistoryPage({ ...response, value: [{ ...response.value[0], orderId: 0 }] }),
    ).toThrow();
  });
});
