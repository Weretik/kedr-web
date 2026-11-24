import { describe, expect, it } from 'vitest';

import { siteOrderDeliveryIssue } from './site-order-delivery';

describe('siteOrderDeliveryIssue', () => {
  it('says nothing about a delivered order or a first attempt still waiting', () => {
    expect(siteOrderDeliveryIssue({ telegramStatus: 'sent', telegramLastError: null })).toBeNull();
    expect(
      siteOrderDeliveryIssue({ telegramStatus: 'pending', telegramLastError: null }),
    ).toBeNull();
    expect(
      siteOrderDeliveryIssue({ telegramStatus: 'pending', telegramLastError: '  ' }),
    ).toBeNull();
  });

  it('warns about an order that is still retried after an error', () => {
    expect(
      siteOrderDeliveryIssue({
        telegramStatus: 'pending',
        telegramLastError: 'Forbidden: bot was kicked',
      }),
    ).toEqual({
      tone: 'warning',
      label: 'Не надіслано',
      reason: 'Повторимо автоматично. Остання помилка: Forbidden: bot was kicked',
    });
  });

  it('marks a failed order as an error, with or without a reason', () => {
    expect(
      siteOrderDeliveryIssue({ telegramStatus: 'failed', telegramLastError: 'chat not found' }),
    ).toEqual({
      tone: 'error',
      label: 'Не надіслано',
      reason: 'Спроби надіслати в Telegram закінчились. chat not found',
    });
    expect(
      siteOrderDeliveryIssue({ telegramStatus: 'failed', telegramLastError: null })?.reason,
    ).toBe('Спроби надіслати в Telegram закінчились. Причину не отримано.');
  });
});
