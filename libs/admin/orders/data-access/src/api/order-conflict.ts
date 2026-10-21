import { mapOrderConflict } from '../mappers/orders.mapper';

import type { OrderQuote } from '@admin/orders/model';

export type OrderSubmissionConflict =
  { type: 'quote-changed'; quote: OrderQuote } | { type: 'idempotency-conflict' };

export function getOrderSubmissionConflict(cause: unknown): OrderSubmissionConflict | null {
  if (typeof cause !== 'object' || cause === null || !('conflict' in cause)) return null;
  const conflict = mapOrderConflict(cause.conflict);
  if (conflict?.code === 'quote_changed' && conflict.quote)
    return { type: 'quote-changed', quote: conflict.quote };
  if (conflict?.code === 'idempotency_conflict') return { type: 'idempotency-conflict' };
  return null;
}
