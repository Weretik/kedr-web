import { StatusPill } from '@admin/shared/ui';

import type { StatusTone } from '@admin/shared/ui';

const syncStatuses: Readonly<Record<string, { label: string; tone: StatusTone }>> = {
  Accepted: { label: 'Прийнято в 1С', tone: 'success' },
  BusinessError: { label: 'Помилка обробки в 1С', tone: 'error' },
  DeadLetter: { label: 'Потрібна перевірка', tone: 'error' },
  Pending: { label: 'Очікує відправлення', tone: 'info' },
  RetryScheduled: { label: 'Заплановано повтор', tone: 'warning' },
  Sent: { label: 'Відправлено до 1С', tone: 'info' },
  TransportError: { label: 'Помилка зв’язку з 1С', tone: 'error' },
};

const unknownStatus = { label: 'Невідомий стан', tone: 'neutral' } as const;

/** 1C sync status as a Ukrainian label; a raw API code never reaches the UI. */
export function OrderStatusChip({ status }: { status: string }) {
  const { label, tone } = syncStatuses[status] ?? unknownStatus;

  return <StatusPill label={label} tone={tone} />;
}
