import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** The last stored version of each snapshot: its ETag and when the device took it (epoch ms). */
export const syncState = sqliteTable('sync_state', {
  resource: text('resource').primaryKey(),
  etag: text('etag').notNull(),
  syncedAt: integer('synced_at').notNull(),
});
