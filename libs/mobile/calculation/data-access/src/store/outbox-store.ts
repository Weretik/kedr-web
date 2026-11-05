import { markLocalDataChanged, outbox, type LocalDatabase } from '@mobile/core/local-db';
import { asc, eq } from 'drizzle-orm';

import type { OutboxEntry } from '@mobile/calculation/model';

type OutboxRow = typeof outbox.$inferSelect;

const toEntry = (row: OutboxRow): OutboxEntry =>
  ({
    attempts: row.attempts,
    counterpartyId: row.counterpartyId,
    createdAt: row.createdAt,
    id: row.id,
    idempotencyKey: row.idempotencyKey,
    kind: row.kind,
    lastError: row.lastError,
    nextAttemptAt: row.nextAttemptAt,
    orderNumber: row.orderNumber,
    payload: row.payload,
    review: row.review ?? null,
    state: row.state,
  }) as OutboxEntry;

export function readOutbox(db: LocalDatabase): OutboxEntry[] {
  return db.select().from(outbox).orderBy(asc(outbox.createdAt)).all().map(toEntry);
}

/** Inserts or replaces the entry. */
export function saveEntry(db: LocalDatabase, entry: OutboxEntry): void {
  const row = { ...entry, payload: entry.payload as unknown };
  db.insert(outbox).values(row).onConflictDoUpdate({ set: row, target: outbox.id }).run();
  markLocalDataChanged();
}

export function deleteEntry(db: LocalDatabase, id: string): void {
  db.delete(outbox).where(eq(outbox.id, id)).run();
  markLocalDataChanged();
}
