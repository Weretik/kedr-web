import { Typography } from '@mui/material';

import { isOneCSyncProblem } from './order-status-chip';

import type { OrderSummary } from '@admin/orders/model';

export type OrderSyncState = Pick<
  OrderSummary,
  'syncStatus' | 'syncError' | 'syncAttempts' | 'syncLastAttemptAtUtc' | 'syncNextAttemptAtUtc'
>;

const timeFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

export const formatSyncTime = (value: string) => timeFormat.format(new Date(value));

/** «Спроб: 3 · наступна 16.11.26, 14:00»: what happened to a problem order, empty otherwise. */
export function syncAttemptsText(sync: OrderSyncState): string | null {
  if (!isOneCSyncProblem(sync.syncStatus) || sync.syncAttempts === 0) return null;
  const next = sync.syncNextAttemptAtUtc
    ? ` · наступна ${formatSyncTime(sync.syncNextAttemptAtUtc)}`
    : '';
  return `Спроб: ${sync.syncAttempts}${next}`;
}

/** One short line under the 1C label in the orders table: the reason and the attempts of a problem. */
export function OrderSyncNote({ sync }: { sync: OrderSyncState }) {
  if (!isOneCSyncProblem(sync.syncStatus)) return null;
  const text = [sync.syncError, syncAttemptsText(sync)].filter(Boolean).join(' · ');
  if (!text) return null;

  return (
    <Typography
      color="text.secondary"
      component="p"
      noWrap
      sx={{ maxWidth: '100%' }}
      title={text}
      variant="caption"
    >
      {text}
    </Typography>
  );
}
