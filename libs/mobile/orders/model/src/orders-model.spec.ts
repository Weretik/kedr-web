import { toOrderDetail } from './index';

describe('toOrderDetail', () => {
  it('reads the order in kopecks with its adjustments (R-013)', () => {
    expect(
      toOrderDetail({
        comment: null,
        counterpartyId: 'c-1',
        counterpartyName: 'Будмаркет',
        createdAtUtc: '2026-11-05T09:00:00Z',
        lines: [
          { amount: 1608, priceAdjustment: -10, productId: '7', productName: 'Петля', quantity: 4 },
        ],
        orderId: 42,
        orderNumber: 'КД-0042',
        syncStatus: 'Synced',
        totalAmount: 1608,
      }),
    ).toEqual({
      comment: null,
      createdAtUtc: '2026-11-05T09:00:00Z',
      customerName: 'Будмаркет',
      lines: [
        {
          adjustmentKopecks: -1000,
          amountKopecks: 160_800,
          productId: '7',
          productName: 'Петля',
          quantity: 4,
        },
      ],
      oneCDocumentNumber: null,
      orderId: 42,
      orderNumber: 'КД-0042',
      syncStatus: 'Synced',
      totalKopecks: 160_800,
    });
  });
});
