import { Box, ButtonBase, Popover, Typography } from '@mui/material';
import { useState } from 'react';

import { isOneCSyncProblem } from './order-status-chip';

import type { OrderSummary } from '@admin/orders/model';
import type { MouseEvent } from 'react';

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

/**
 * One short line under the 1C label in the orders table: the reason and the attempts of a problem. A click opens the
 * whole reason, which the line cuts.
 */
export function OrderSyncNote({ sync }: { sync: OrderSyncState }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  if (!isOneCSyncProblem(sync.syncStatus)) return null;
  const attempts = syncAttemptsText(sync);
  const text = [sync.syncError, attempts].filter(Boolean).join(' · ');
  if (!text) return null;

  const open = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchor(event.currentTarget);
  };

  return (
    <>
      <ButtonBase
        aria-label="Показати повний опис помилки 1С"
        onClick={open}
        sx={{ justifyContent: 'flex-start', maxWidth: '100%', textAlign: 'left' }}
      >
        <Typography
          color="text.secondary"
          component="span"
          noWrap
          sx={{ textDecoration: 'underline dotted' }}
          variant="caption"
        >
          {text}
        </Typography>
      </ButtonBase>
      <Popover
        anchorEl={anchor}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClick={(event) => event.stopPropagation()}
        onClose={() => setAnchor(null)}
        open={anchor !== null}
      >
        <Box sx={{ maxWidth: 480, p: 2 }}>
          <Typography gutterBottom variant="subtitle2">
            Помилка 1С
          </Typography>
          {sync.syncError && (
            <Typography sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }} variant="body2">
              {sync.syncError}
            </Typography>
          )}
          {attempts && (
            <Typography color="text.secondary" sx={{ mt: 1 }} variant="caption" component="p">
              {attempts}
            </Typography>
          )}
        </Box>
      </Popover>
    </>
  );
}
