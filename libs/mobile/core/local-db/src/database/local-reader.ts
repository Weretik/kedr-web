import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { openDatabaseSync } from 'expo-sqlite';

import { schema, type LocalDatabase } from './local-database';

import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

/**
 * Reads for screens. On the device it is a second, read-only use of the database file whose queries run on the
 * SQLite thread, so a large read does not hold the screen; in tests it is the synchronous test database. Always
 * `await` its queries.
 */
export type LocalReader = BaseSQLiteDatabase<'async' | 'sync', unknown, typeof schema>;

/** The test database reads the same way; awaiting a synchronous result is harmless. */
export function readerOf(database: LocalDatabase): LocalReader {
  return database as unknown as LocalReader;
}

type Row = unknown[];

/**
 * Opens a separate connection for reads. WAL lets it read the last committed state while the sync writes through
 * the main connection.
 */
export function openLocalReader(databaseName: string): LocalReader {
  const connection = openDatabaseSync(databaseName, { useNewConnection: true });
  const reader = drizzle(
    async (query, params, method) => {
      const statement = await connection.prepareAsync(query);
      try {
        const result = await statement.executeForRawResultAsync(params as never);
        if (method === 'run') return { rows: [] };
        if (method === 'get') return { rows: ((await result.getFirstAsync()) ?? undefined) as Row };
        return { rows: (await result.getAllAsync()) as Row[] };
      } finally {
        await statement.finalizeAsync();
      }
    },
    { schema },
  );
  return reader as unknown as LocalReader;
}
