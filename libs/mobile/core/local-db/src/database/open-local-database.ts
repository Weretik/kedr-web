import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import { migrateLocalDatabase, schema, type LocalDatabase } from './local-database';
import { openLocalReader, type LocalReader } from './local-reader';

const databaseName = 'kedr-manager.db';

let database: LocalDatabase | null = null;

/** Opens the device database once, turns on WAL, and brings its schema up to date. */
export function getLocalDatabase(): LocalDatabase {
  if (database) return database;

  const connection = openDatabaseSync(databaseName);
  connection.execSync('PRAGMA journal_mode = WAL');
  const db = drizzle(connection, { schema }) as unknown as LocalDatabase;
  migrateLocalDatabase(db);
  database = db;
  return db;
}

let reader: LocalReader | null = null;

/** The read connection for screens, opened after the main one has migrated the file. */
export function getLocalReader(): LocalReader {
  if (reader) return reader;
  getLocalDatabase();
  reader = openLocalReader(databaseName);
  return reader;
}
