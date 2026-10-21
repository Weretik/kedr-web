import { describe, expect, it } from 'vitest';

import { mapDraftRecord, mapOrderConflict, mapOrderPage, mapQuote } from './orders.mapper';

describe('Admin workspace runtime contract', () => {
  it('keeps server paging and count rather than deriving total from page length', () => {
    expect(
      mapOrderPage({
        pagedInfo: { pageNumber: 2, pageSize: 20, totalPages: 4, totalRecords: 61 },
        value: [
          {
            orderId: 12,
            orderNumber: 'SO-12',
            counterpartyId: 'C1',
            counterpartyName: 'Клієнт',
            createdAtUtc: '2026-10-21T10:00:00Z',
            lineCount: 1,
            totalAmount: 20,
            syncStatus: 'Pending',
          },
        ],
      }).pageInfo.totalRecords,
    ).toBe(61);
  });
  it('rejects a quote with missing prices before checkout', () => {
    expect(() =>
      mapQuote({
        counterpartyId: 'C1',
        lines: [
          { productId: '7', productName: 'Товар', quantity: 1, unitPrice: null, lineAmount: null },
        ],
        totalAmount: 0,
        quoteFingerprint: 'F',
      }),
    ).toThrow();
  });
  it('keeps an unavailable draft editable with version and saved lines', () => {
    const detail = mapDraftRecord({
      draftId: 1,
      version: 'abc',
      title: 'Повторити',
      note: null,
      counterpartyId: 'C1',
      counterpartyName: 'Клієнт',
      createdAtUtc: '2026-10-21T10:00:00Z',
      updatedAtUtc: '2026-10-21T10:00:00Z',
      lines: [
        { productId: '7', productName: null, quantity: 2, unitPrice: null, lineAmount: null },
      ],
      totalAmount: null,
      pricingStatus: 'Unavailable',
      pricingErrorCode: 'unavailable_price',
    });
    expect(detail.lines[0]).toMatchObject({ productId: '7', quantity: 2 });
    expect(detail.version).toBe('abc');
    expect(detail.totalAmount).toBeNull();
  });
  it('parses current quote from a 409 price conflict', () => {
    expect(
      mapOrderConflict({
        code: 'quote_changed',
        quote: {
          counterpartyId: 'C1',
          lines: [
            { productId: '7', productName: 'Товар', quantity: 1, unitPrice: 12, lineAmount: 12 },
          ],
          totalAmount: 12,
          quoteFingerprint: 'new',
        },
      })?.quote?.totalAmount,
    ).toBe(12);
  });
});
