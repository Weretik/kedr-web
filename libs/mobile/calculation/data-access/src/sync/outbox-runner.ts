import {
  applyOutcome,
  changedPrices,
  nextDueEntry,
  type OutboxEntry,
  type SendOutcome,
} from '@mobile/calculation/model';

import { toWorkspaceFailure } from '../api/workspace-failure';
import {
  deviceEnvironment,
  enqueueDraftDelete,
  returnToCalculation,
  type QueueEnvironment,
} from '../store/calculation-actions';
import { readCalculation } from '../store/calculation-store';
import { deleteEntry, readOutbox, saveEntry } from '../store/outbox-store';

import type { OrderWorkspaceApi } from '../api/order-workspace-api';
import type { LocalDatabase } from '@mobile/core/local-db';

const pricesChanged = 'Ціни змінилися, перевірте розрахунок';
/** A delivered order keeps its number in the list for a day, until the order lists have it. */
const keepDoneMs = 24 * 60 * 60 * 1000;

async function attempt(entry: OutboxEntry, api: OrderWorkspaceApi): Promise<SendOutcome> {
  try {
    switch (entry.kind) {
      case 'order-create': {
        const { payload } = entry;
        // The server quote is checked first, so an order never goes out with other numbers (R-011, R-012).
        const quote = await api.quote(payload.counterpartyId, payload.lines);
        const changed = changedPrices(payload.expectedBaseKopecks, quote.lines);
        if (changed.length > 0)
          return { kind: 'review', review: { changedProductIds: changed, reason: pricesChanged } };
        const order = await api.createOrder(
          {
            comment: payload.comment,
            counterpartyId: payload.counterpartyId,
            lines: payload.lines,
            quoteFingerprint: quote.fingerprint,
          },
          entry.idempotencyKey,
        );
        return { kind: 'sent', orderNumber: order.orderNumber };
      }
      case 'draft-save': {
        const { payload } = entry;
        const input = {
          counterpartyId: payload.counterpartyId,
          lines: payload.lines,
          note: payload.note,
          title: payload.title,
        };
        if (payload.draft) await api.updateDraft(payload.draft.id, payload.draft.version, input);
        else await api.createDraft(input, entry.idempotencyKey);
        return { kind: 'sent', orderNumber: null };
      }
      case 'draft-delete':
        await api.deleteDraft(entry.payload.draft.id, entry.payload.draft.version);
        return { kind: 'sent', orderNumber: null };
    }
  } catch (error) {
    const failure = toWorkspaceFailure(error);
    // A draft that is already gone needs nothing more.
    if (
      entry.kind === 'draft-delete' &&
      failure.kind === 'rejected' &&
      failure.code === 'not_found'
    ) {
      return { kind: 'sent', orderNumber: null };
    }
    if (failure.kind === 'unauthorized') return { kind: 'paused' };
    if (failure.kind === 'transient') return { error: failure.message, kind: 'retry' };
    const changed =
      failure.code === 'quote_changed'
        ? entry.kind === 'order-create'
          ? entry.payload.lines.map((line) => line.productId)
          : []
        : [];
    return { kind: 'review', review: { changedProductIds: changed, reason: failure.message } };
  }
}

export type RunResult = 'idle' | 'paused' | 'waiting';

/**
 * Sends due entries one at a time in creation order until the queue is empty, waits for a retry, or the session is
 * gone (design: send queue). A returned entry goes back into an empty calculation at once; otherwise it waits in the
 * list until the manager opens it.
 */
export async function drainOutbox(
  db: LocalDatabase,
  api: OrderWorkspaceApi,
  env: QueueEnvironment = deviceEnvironment,
  /** Called after an order or draft change reached the server, so lists of that customer can refresh. */
  onDelivered?: (entry: OutboxEntry) => void,
): Promise<RunResult> {
  for (const entry of readOutbox(db)) {
    if (entry.state === 'done' && entry.createdAt < env.now() - keepDoneMs)
      deleteEntry(db, entry.id);
  }
  for (;;) {
    const entry = nextDueEntry(readOutbox(db), env.now());
    if (!entry) {
      return readOutbox(db).some((item) => item.state === 'pending') ? 'waiting' : 'idle';
    }
    const outcome = await attempt(entry, api);
    if (outcome.kind === 'paused') return 'paused';

    const next = applyOutcome(entry, outcome, env.now());
    // Only an order shows anything once delivered; a sent draft change leaves the queue at once.
    if (outcome.kind === 'sent' && entry.kind !== 'order-create') deleteEntry(db, entry.id);
    else saveEntry(db, next);
    if (outcome.kind === 'review' && readCalculation(db, entry.counterpartyId).lines.length === 0) {
      returnToCalculation(db, next, outcome.review);
    }
    if (outcome.kind === 'sent' && entry.kind === 'order-create' && entry.payload.sourceDraft) {
      enqueueDraftDelete(db, entry.counterpartyId, entry.payload.sourceDraft, env);
    }
    if (outcome.kind === 'sent') onDelivered?.(entry);
    if (outcome.kind === 'retry') return 'waiting';
  }
}
