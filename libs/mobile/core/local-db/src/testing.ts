import { notifyManager } from '@tanstack/react-query';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { migrateLocalDatabase, schema, type LocalDatabase } from './database/local-database';

// Query results reach the screen at once instead of on a timer, so they land inside the act() of the render or
// press that started the read, as on a device a moment later.
notifyManager.setScheduler((callback) => callback());

/** A migrated in-memory database on `better-sqlite3`, for Jest only. */
export function createTestLocalDatabase(): LocalDatabase {
  const db = drizzle(new Database(':memory:'), { schema }) as unknown as LocalDatabase;
  migrateLocalDatabase(db);
  return db;
}
