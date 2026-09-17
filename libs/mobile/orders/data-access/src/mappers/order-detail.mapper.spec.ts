import { parseOrderDetail } from './order-detail.mapper';

const response = {
  comment: 'Терміново',
  counterparty: { counterpartyId: 'cp-1', name: 'Клієнт', phone: null },
  createdAtUtc: '2026-09-17T11:35:00Z',
  lines: [{ amount: 2500, productId: 'p-1', productName: 'Кабель', quantity: 2 }],
  orderId: 42,
  orderNumber: 'SO-42',
  sync: {
    acceptedAtUtc: '2026-09-17T11:40:00Z',
    oneCDocumentNumber: '1C-42',
    status: 'Accepted',
  },
  totalAmount: 2500,
};

describe('order detail mapper', () => {
  it('validates and maps a complete detail', () => {
    expect(parseOrderDetail(response)).toEqual({
      acceptedAtUtc: '2026-09-17T11:40:00Z',
      comment: 'Терміново',
      counterparty: response.counterparty,
      createdAtUtc: response.createdAtUtc,
      lines: response.lines,
      oneCDocumentNumber: '1C-42',
      orderId: 42,
      orderNumber: 'SO-42',
      syncStatus: 'Accepted',
      totalAmount: 2500,
    });
  });

  it('preserves nullable optional values', () => {
    const detail = parseOrderDetail({
      ...response,
      comment: null,
      sync: { acceptedAtUtc: null, oneCDocumentNumber: null, status: 'Pending' },
    });
    expect(detail.comment).toBeNull();
    expect(detail.acceptedAtUtc).toBeNull();
    expect(detail.oneCDocumentNumber).toBeNull();
  });

  it('rejects invalid external data', () => {
    expect(() => parseOrderDetail({ ...response, lines: [] })).toThrow();
  });
});
