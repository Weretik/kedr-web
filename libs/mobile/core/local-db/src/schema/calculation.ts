import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * One calculation per customer (R-009). `review` holds the server's reason when a queued order or draft came back
 * (R-012); `sourceDraft*` link a calculation opened from a draft.
 */
export const calculations = sqliteTable('calculations', {
  counterpartyId: text('counterparty_id').primaryKey(),
  comment: text('comment'),
  sourceDraftId: integer('source_draft_id'),
  sourceDraftVersion: text('source_draft_version'),
  sourceDraftTitle: text('source_draft_title'),
  review: text('review', { mode: 'json' }).$type<{ reason: string; changedProductIds: number[] }>(),
});

/** Lines of a calculation: product, quantity and the per-unit adjustment in kopecks. Prices are read live. */
export const calculationLines = sqliteTable(
  'calculation_lines',
  {
    counterpartyId: text('counterparty_id').notNull(),
    productId: integer('product_id').notNull(),
    quantity: integer('quantity').notNull(),
    adjustmentKopecks: integer('adjustment_kopecks').notNull(),
    position: integer('position').notNull(),
  },
  (table) => [primaryKey({ columns: [table.counterpartyId, table.productId] })],
);

/** The send queue: orders and draft changes waiting for the network or for the manager's review. */
export const outbox = sqliteTable('outbox', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(),
  counterpartyId: text('counterparty_id').notNull(),
  payload: text('payload', { mode: 'json' }).$type<unknown>().notNull(),
  idempotencyKey: text('idempotency_key').notNull(),
  state: text('state').notNull(),
  attempts: integer('attempts').notNull(),
  lastError: text('last_error'),
  nextAttemptAt: integer('next_attempt_at').notNull(),
  createdAt: integer('created_at').notNull(),
  review: text('review', { mode: 'json' }).$type<{ reason: string; changedProductIds: number[] }>(),
  orderNumber: text('order_number'),
});
