import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * The last orders and drafts of a customer as the order workspace returned them, so the customer card shows them
 * offline. Rows are JSON lists in the shape of `@mobile/customers/model`; `fetchedAt` is epoch ms.
 */
export const customerActivity = sqliteTable('customer_activity', {
  counterpartyId: text('counterparty_id').primaryKey(),
  orders: text('orders', { mode: 'json' }).$type<unknown[]>().notNull(),
  drafts: text('drafts', { mode: 'json' }).$type<unknown[]>().notNull(),
  fetchedAt: integer('fetched_at').notNull(),
});
