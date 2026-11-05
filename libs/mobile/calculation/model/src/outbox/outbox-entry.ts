import type { CalculationLine } from '../lines/calculation-line';

export type OutboxKind = 'draft-delete' | 'draft-save' | 'order-create';

/**
 * `pending` waits for its turn or its next attempt; `needs-review` was rejected by the server and went back to the
 * manager; `done` was delivered and stays only so the order shows its number until the lists refresh.
 */
export type OutboxState = 'done' | 'needs-review' | 'pending';

export interface DraftRef {
  id: number;
  version: string;
}

export interface OrderPayload {
  counterpartyId: string;
  customerName: string;
  lines: CalculationLine[];
  /** The customer price (before the adjustment) the manager saw per product; a different server price stops the order (R-012). */
  expectedBaseKopecks: Record<string, number>;
  totalKopecks: number;
  comment: string | null;
  /** The draft the calculation came from; it is deleted once the order exists. */
  sourceDraft: DraftRef | null;
}

export interface DraftSavePayload {
  counterpartyId: string;
  title: string;
  note: string | null;
  lines: CalculationLine[];
  /** Null creates a new draft; otherwise the draft is replaced if nobody changed it since. */
  draft: DraftRef | null;
}

export interface DraftDeletePayload {
  counterpartyId: string;
  draft: DraftRef;
}

export interface OutboxReview {
  reason: string;
  /** Lines whose price or stock the server changed; they are highlighted in the calculation. */
  changedProductIds: number[];
}

interface OutboxBase {
  id: string;
  counterpartyId: string;
  idempotencyKey: string;
  state: OutboxState;
  attempts: number;
  lastError: string | null;
  nextAttemptAt: number;
  createdAt: number;
  review: OutboxReview | null;
  /** The number of the created order, shown in place of «У черзі» once delivered. */
  orderNumber: string | null;
}

export type OutboxEntry =
  | (OutboxBase & { kind: 'order-create'; payload: OrderPayload })
  | (OutboxBase & { kind: 'draft-save'; payload: DraftSavePayload })
  | (OutboxBase & { kind: 'draft-delete'; payload: DraftDeletePayload });

/** What one attempt to deliver an entry ended with. */
export type SendOutcome =
  | { kind: 'sent'; orderNumber: string | null }
  | { kind: 'retry'; error: string }
  | { kind: 'review'; review: OutboxReview }
  /** The session is gone: the queue waits for sign-in without counting an attempt. */
  | { kind: 'paused' };

const retryDelays = [5_000, 30_000, 120_000];
const steadyDelay = 300_000;

/** 5 s, 30 s, 2 min, then every 5 min (design: send queue). */
export function retryDelayMs(attempts: number): number {
  return retryDelays[attempts - 1] ?? steadyDelay;
}

export function applyOutcome<T extends OutboxEntry>(
  entry: T,
  outcome: SendOutcome,
  now: number,
): T {
  switch (outcome.kind) {
    case 'sent':
      return {
        ...entry,
        lastError: null,
        orderNumber: outcome.orderNumber,
        review: null,
        state: 'done',
      };
    case 'review':
      return {
        ...entry,
        lastError: outcome.review.reason,
        review: outcome.review,
        state: 'needs-review',
      };
    case 'retry': {
      const attempts = entry.attempts + 1;
      return {
        ...entry,
        attempts,
        lastError: outcome.error,
        nextAttemptAt: now + retryDelayMs(attempts),
      };
    }
    case 'paused':
      return entry;
  }
}

/**
 * The oldest pending entry if its time has come. The queue sends one entry at a time in creation order, so a
 * waiting entry also holds the ones after it (a draft is never deleted before it was saved).
 */
export function nextDueEntry<T extends OutboxEntry>(entries: readonly T[], now: number): T | null {
  const oldest = entries
    .filter((entry) => entry.state === 'pending')
    .sort((a, b) => a.createdAt - b.createdAt)[0];
  return oldest && oldest.nextAttemptAt <= now ? oldest : null;
}

/** Products whose server price differs from the price the manager saw. */
export function changedPrices(
  expected: Readonly<Record<string, number>>,
  quoted: readonly { productId: number; baseUnitKopecks: number }[],
): number[] {
  return quoted
    .filter(
      (line) =>
        expected[line.productId] !== undefined && expected[line.productId] !== line.baseUnitKopecks,
    )
    .map((line) => line.productId);
}
