import { getOrderSyncStatusLabel, type OrderSyncStatus } from './order-sync-status';

describe('getOrderSyncStatusLabel', () => {
  it.each<[OrderSyncStatus, string]>([
    ['Pending', 'Очікує на відправлення в 1С'],
    ['Sent', 'Надіслано до 1С'],
    ['Accepted', 'Прийнято в 1С'],
    ['BusinessError', 'Помилка обробки'],
    ['TransportError', 'Помилка з’єднання'],
    ['RetryScheduled', 'Повторну спробу заплановано'],
    ['DeadLetter', 'Не вдалося синхронізувати'],
  ])('maps %s to a manager-facing Ukrainian label', (status, expected) => {
    expect(getOrderSyncStatusLabel(status)).toBe(expected);
  });
});
