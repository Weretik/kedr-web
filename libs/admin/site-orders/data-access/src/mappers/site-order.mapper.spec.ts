import { describe, expect, it } from 'vitest';

import { mapSiteOrderDetail, mapSiteOrderPage } from './site-order.mapper';

const orderId = '3f2b8c1e-7a4d-4e1b-9c2a-1d2e3f4a5b6c';

describe('site order mappers', () => {
  it('maps a page of the contract rows', () => {
    const page = mapSiteOrderPage({
      pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 1 },
      value: [
        {
          orderId,
          placedAtUtc: '2026-11-24T07:45:00Z',
          firstName: 'Ірина',
          phone: '+380671234567',
          lineCount: 30,
          total: 7209,
          telegramStatus: 'failed',
          telegramLastError: 'Forbidden: bot was kicked',
          oneCOrderId: 42,
          oneCOrderNumber: 'SO-20261126-42',
          oneCDocumentNumber: 'DOC-7',
          isSuccess: true,
        },
      ],
      isSuccess: true,
    });
    expect(page).toEqual({
      items: [
        {
          orderId,
          placedAtUtc: '2026-11-24T07:45:00Z',
          firstName: 'Ірина',
          phone: '+380671234567',
          lineCount: 30,
          total: 7209,
          telegramStatus: 'failed',
          telegramLastError: 'Forbidden: bot was kicked',
          oneCOrderId: 42,
          oneCOrderNumber: 'SO-20261126-42',
          oneCDocumentNumber: 'DOC-7',
        },
      ],
      pageNumber: 1,
      pageSize: 20,
      totalPages: 1,
      totalRecords: 1,
    });
  });

  it('treats a missing row list as an empty page', () => {
    expect(
      mapSiteOrderPage({
        pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 0, totalRecords: 0 },
        value: null,
      }).items,
    ).toEqual([]);
  });

  it('maps the detail with its lines', () => {
    const detail = mapSiteOrderDetail({
      orderId,
      placedAtUtc: '2026-11-24T07:45:00Z',
      firstName: 'Тест',
      phone: '0671234567',
      total: 409.5,
      telegramStatus: 'sent',
      telegramSentAtUtc: '2026-11-24T07:45:02Z',
      telegramLastAttemptAtUtc: null,
      telegramLastError: null,
      comment: '  Дзвоніть після 14:00 ',
      items: [{ productId: '27254', title: 'Ручка', unitPrice: 136.5, quantity: 3, amount: 409.5 }],
    });
    expect(detail.items).toEqual([
      { productId: '27254', title: 'Ручка', unitPrice: 136.5, quantity: 3, amount: 409.5 },
    ]);
    expect(detail.telegramStatus).toBe('sent');
    expect(detail.comment).toBe('  Дзвоніть після 14:00 ');
    expect([detail.oneCOrderId, detail.oneCOrderNumber, detail.oneCDocumentNumber]).toEqual([
      null,
      null,
      null,
    ]);
  });

  it('rejects an unknown delivery state', () => {
    expect(() =>
      mapSiteOrderDetail({
        orderId,
        placedAtUtc: '2026-11-24T07:45:00Z',
        firstName: 'Тест',
        phone: '067',
        total: 0,
        telegramStatus: 'lost',
        telegramSentAtUtc: null,
        telegramLastAttemptAtUtc: null,
        telegramLastError: null,
        items: [],
      }),
    ).toThrow();
  });
});
