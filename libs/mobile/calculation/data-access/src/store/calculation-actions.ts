import { randomUUID } from 'expo-crypto';

import { clearCalculation, readCalculation, writeCalculation } from './calculation-store';
import { deleteEntry, readOutbox, saveEntry } from './outbox-store';

import type { ServerDraft } from '../api/order-workspace-api';
import type {
  CalculationLine,
  DraftRef,
  OrderPayload,
  OutboxEntry,
  OutboxReview,
} from '@mobile/calculation/model';
import type { LocalDatabase } from '@mobile/core/local-db';

/** Clock and id source; tests pass fixed ones. */
export interface QueueEnvironment {
  now: () => number;
  newId: () => string;
}

export const deviceEnvironment: QueueEnvironment = { newId: randomUUID, now: Date.now };

function newEntry<K extends OutboxEntry['kind']>(
  kind: K,
  counterpartyId: string,
  payload: Extract<OutboxEntry, { kind: K }>['payload'],
  env: QueueEnvironment,
): OutboxEntry {
  const now = env.now();
  return {
    attempts: 0,
    counterpartyId,
    createdAt: now,
    id: env.newId(),
    idempotencyKey: env.newId(),
    kind,
    lastError: null,
    nextAttemptAt: now,
    orderNumber: null,
    payload,
    review: null,
    state: 'pending',
  } as OutboxEntry;
}

/** Drops returned entries of the customer: the manager is sending a reviewed version now. */
function dropReviewed(db: LocalDatabase, counterpartyId: string, kind: OutboxEntry['kind']): void {
  for (const entry of readOutbox(db)) {
    if (
      entry.counterpartyId === counterpartyId &&
      entry.kind === kind &&
      entry.state === 'needs-review'
    ) {
      deleteEntry(db, entry.id);
    }
  }
}

/**
 * «Відправити в 1С»: the order goes to the send queue with its own idempotency key and the calculation is emptied
 * (R-011). Online the queue sends it at once; offline it shows «У черзі» until the network returns.
 */
export function enqueueOrder(
  db: LocalDatabase,
  payload: Omit<OrderPayload, 'sourceDraft'>,
  env: QueueEnvironment = deviceEnvironment,
): OutboxEntry {
  const { sourceDraft } = readCalculation(db, payload.counterpartyId);
  dropReviewed(db, payload.counterpartyId, 'order-create');
  const entry = newEntry(
    'order-create',
    payload.counterpartyId,
    {
      ...payload,
      sourceDraft: sourceDraft ? { id: sourceDraft.id, version: sourceDraft.version } : null,
    },
    env,
  );
  saveEntry(db, entry);
  clearCalculation(db, payload.counterpartyId);
  return entry;
}

/** «Чернетка»: saves the calculation as a named draft through the queue and empties it (R-010). */
export function enqueueDraftSave(
  db: LocalDatabase,
  counterpartyId: string,
  title: string,
  env: QueueEnvironment = deviceEnvironment,
): OutboxEntry {
  const calculation = readCalculation(db, counterpartyId);
  dropReviewed(db, counterpartyId, 'draft-save');
  const draft: DraftRef | null = calculation.sourceDraft
    ? { id: calculation.sourceDraft.id, version: calculation.sourceDraft.version }
    : null;
  const entry = newEntry(
    'draft-save',
    counterpartyId,
    { counterpartyId, draft, lines: calculation.lines, note: calculation.comment, title },
    env,
  );
  saveEntry(db, entry);
  clearCalculation(db, counterpartyId);
  return entry;
}

export function enqueueDraftDelete(
  db: LocalDatabase,
  counterpartyId: string,
  draft: DraftRef,
  env: QueueEnvironment = deviceEnvironment,
): OutboxEntry {
  const entry = newEntry('draft-delete', counterpartyId, { counterpartyId, draft }, env);
  saveEntry(db, entry);
  return entry;
}

/** Opens a saved draft in the customer's calculation, ready to change or send (SC-014). */
export function openDraftInCalculation(db: LocalDatabase, draft: ServerDraft): void {
  writeCalculation(db, {
    comment: draft.note,
    counterpartyId: draft.counterpartyId,
    lines: draft.lines,
    review: null,
    sourceDraft: { id: draft.draftId, title: draft.title, version: draft.version },
  });
}

function linesOf(entry: OutboxEntry): CalculationLine[] {
  return entry.kind === 'draft-delete' ? [] : entry.payload.lines;
}

/**
 * Puts a returned order or draft back into the calculation with the server's reason and changed lines (R-012,
 * SC-017). The queue entry is removed: sending again creates a new one.
 */
export function returnToCalculation(
  db: LocalDatabase,
  entry: OutboxEntry,
  review: OutboxReview,
): void {
  const comment =
    entry.kind === 'order-create'
      ? entry.payload.comment
      : entry.kind === 'draft-save'
        ? entry.payload.note
        : null;
  const draft =
    entry.kind === 'order-create'
      ? entry.payload.sourceDraft
      : entry.kind === 'draft-save'
        ? entry.payload.draft
        : null;
  writeCalculation(db, {
    comment,
    counterpartyId: entry.counterpartyId,
    lines: linesOf(entry),
    review,
    sourceDraft: draft
      ? { ...draft, title: entry.kind === 'draft-save' ? entry.payload.title : '' }
      : null,
  });
  deleteEntry(db, entry.id);
}

/**
 * Opens a returned entry in its customer's calculation. Refuses while that calculation has lines, so nothing the
 * manager is working on is overwritten.
 */
export function openReturnedEntry(db: LocalDatabase, entry: OutboxEntry): boolean {
  if (entry.state !== 'needs-review' || !entry.review) return false;
  if (readCalculation(db, entry.counterpartyId).lines.length > 0) return false;
  returnToCalculation(db, entry, entry.review);
  return true;
}
