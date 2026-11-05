import { sql } from 'drizzle-orm';

import { migrations } from '../migrations/migrations';
import * as schema from '../schema';

import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

export { schema };

/**
 * The device database. The app uses the `expo-sqlite` driver and tests use `better-sqlite3`; both are synchronous
 * SQLite drivers with the same Drizzle API.
 */
export type LocalDatabase = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

/** Tables that hold synced or local business data; all are emptied on sign-out. */
const dataTables = [
  schema.categories,
  schema.priceTypes,
  schema.products,
  schema.productPrices,
  schema.customers,
  schema.customerCategoryPriceTypes,
  schema.syncState,
] as const;

/** Applies the migrations the database has not seen yet, each in its own transaction. */
export function migrateLocalDatabase(db: LocalDatabase): void {
  const row = db.get<{ user_version: number }>(sql`PRAGMA user_version`);
  const current = row?.user_version ?? 0;

  for (let version = current; version < migrations.length; version++) {
    db.transaction((tx) => {
      for (const statement of migrations[version]) tx.run(sql.raw(statement));
      tx.run(sql.raw(`PRAGMA user_version = ${version + 1}`));
    });
  }
}

/** Empties every data table, for sign-out or a switch to another account. */
export function wipeLocalDatabase(db: LocalDatabase): void {
  db.transaction((tx) => {
    for (const table of dataTables) tx.delete(table).run();
  });
}
