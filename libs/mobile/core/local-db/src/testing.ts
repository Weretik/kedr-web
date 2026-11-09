import { notifyManager, QueryClientProvider } from '@tanstack/react-query';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { createElement, type ReactNode } from 'react';

import { migrateLocalDatabase, schema, type LocalDatabase } from './database/local-database';
import { createAppQueryClient } from './react/app-query-client';

// Query results reach the screen at once instead of on a timer, so they land inside the act() of the render or
// press that started the read, as on a device a moment later.
notifyManager.setScheduler((callback) => callback());

/** A migrated in-memory database on `better-sqlite3`, for Jest only. */
export function createTestLocalDatabase(): LocalDatabase {
  const db = drizzle(new Database(':memory:'), { schema }) as unknown as LocalDatabase;
  migrateLocalDatabase(db);
  return db;
}

/** A wrapper with a fresh query cache, for a hook that reads the server without the local database. */
export function queryWrapper() {
  const client = createAppQueryClient(Infinity);
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };
}
