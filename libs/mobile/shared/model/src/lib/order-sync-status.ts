export const ORDER_SYNC_STATUSES = [
  'Pending',
  'Sent',
  'Accepted',
  'BusinessError',
  'TransportError',
  'RetryScheduled',
  'DeadLetter',
] as const;

export type OrderSyncStatus = (typeof ORDER_SYNC_STATUSES)[number];
export type OrderSyncStatusKind = 'error' | 'informational' | 'success' | 'warning';

const labels: Readonly<Record<OrderSyncStatus, string>> = {
  Accepted: 'Прийнято в 1С',
  BusinessError: 'Помилка обробки',
  DeadLetter: 'Не вдалося синхронізувати',
  Pending: 'Очікує на відправлення в 1С',
  RetryScheduled: 'Повторну спробу заплановано',
  Sent: 'Надіслано до 1С',
  TransportError: 'Помилка з’єднання',
};

const kinds: Readonly<Record<OrderSyncStatus, OrderSyncStatusKind>> = {
  Accepted: 'success',
  BusinessError: 'error',
  DeadLetter: 'error',
  Pending: 'warning',
  RetryScheduled: 'warning',
  Sent: 'informational',
  TransportError: 'error',
};

export function getOrderSyncStatusLabel(status: OrderSyncStatus): string {
  return labels[status];
}

export function getOrderSyncStatusKind(status: OrderSyncStatus): OrderSyncStatusKind {
  return kinds[status];
}
