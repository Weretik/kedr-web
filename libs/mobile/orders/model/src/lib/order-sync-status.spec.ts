import {
  getOrderSyncStatusKind,
  getOrderSyncStatusLabel,
  type OrderSyncStatus,
  type OrderSyncStatusKind,
} from './order-sync-status';

describe('order sync status presentation', () => {
  it.each<[OrderSyncStatus, string, OrderSyncStatusKind]>([
    ['Pending', 'Очікує на відправлення в 1С', 'warning'],
    ['Sent', 'Надіслано до 1С', 'informational'],
    ['Accepted', 'Прийнято в 1С', 'success'],
    ['BusinessError', 'Помилка обробки', 'error'],
    ['TransportError', 'Помилка з’єднання', 'error'],
    ['RetryScheduled', 'Повторну спробу заплановано', 'warning'],
    ['DeadLetter', 'Не вдалося синхронізувати', 'error'],
  ])('maps %s to its Ukrainian label and semantic kind', (status, label, kind) => {
    expect(getOrderSyncStatusLabel(status)).toBe(label);
    expect(getOrderSyncStatusKind(status)).toBe(kind);
  });
});
