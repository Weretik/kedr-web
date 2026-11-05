import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { migrateLocalDatabase, schema, type LocalDatabase } from './database/local-database';

/** A migrated in-memory database on `better-sqlite3`, for Jest only. */
export function createTestLocalDatabase(): LocalDatabase {
  const db = drizzle(new Database(':memory:'), { schema }) as unknown as LocalDatabase;
  migrateLocalDatabase(db);
  return db;
}
