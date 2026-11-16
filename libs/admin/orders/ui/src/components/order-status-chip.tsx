import { StatusPill } from '@admin/shared/ui';

import type { StatusTone } from '@admin/shared/ui';

const syncStatuses: Readonly<Record<string, { label: string; tone: StatusTone }>> = {
  Accepted: { label: 'Прийнято в 1С', tone: 'success' },
  BusinessError: { label: 'Помилка обробки в 1С', tone: 'error' },
  DeadLetter: { label: 'Потрібна перевірка', tone: 'error' },
  Pending: { label: 'Очікує відправлення', tone: 'info' },
  RetryScheduled: { label: 'Заплановано повтор', tone: 'warning' },
};

const unknownStatus = { label: 'Невідомий стан', tone: 'neutral' } as const;

/** 1C refused the order or every automatic attempt failed: a manager can send it again. */
export const canRetryOneCSync = (status: string) =>
  status === 'BusinessError' || status === 'DeadLetter';

/** A state worth explaining next to the label: a refusal, a failed attempt, or no attempts left. */
export const isOneCSyncProblem = (status: string) =>
  canRetryOneCSync(status) || status === 'RetryScheduled';

/** 1C sync status as a Ukrainian label; a raw API code never reaches the UI. */
export function OrderStatusChip({ status }: { status: string }) {
  const { label, tone } = syncStatuses[status] ?? unknownStatus;

  return <StatusPill label={label} tone={tone} />;
}
