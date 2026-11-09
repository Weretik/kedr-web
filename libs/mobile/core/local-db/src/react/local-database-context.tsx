import { keepPreviousData, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { createContext, use, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';

import { createAppQueryClient } from './app-query-client';
import {
  getLocalDataVersion,
  subscribeLocalData,
  type LocalDataScope,
} from '../database/local-data-version';
import { type LocalDatabase } from '../database/local-database';
import { readerOf, type LocalReader } from '../database/local-reader';
import { getLocalDatabase, getLocalReader } from '../database/open-local-database';

import type { QueryClient } from '@tanstack/react-query';

interface LocalData {
  database: LocalDatabase;
  reader: LocalReader;
}

const LocalDatabaseContext = createContext<LocalData | null>(null);

/**
 * Gives screens the device database, its read connection and the query cache (TanStack Query) that holds both
 * local reads and server reads. Tests pass an in-memory database and get a fresh cache.
 */
export function LocalDatabaseProvider({
  children,
  database,
  queryClient,
}: Readonly<{ children: ReactNode; database?: LocalDatabase; queryClient?: QueryClient }>) {
  const [ownClient] = useState(() => createAppQueryClient(database ? Infinity : undefined));
  const value = useMemo<LocalData>(
    () =>
      database
        ? { database, reader: readerOf(database) }
        : { database: getLocalDatabase(), reader: getLocalReader() },
    [database],
  );
  return (
    <QueryClientProvider client={queryClient ?? ownClient}>
      <LocalDatabaseContext.Provider value={value}>{children}</LocalDatabaseContext.Provider>
    </QueryClientProvider>
  );
}

function useLocalData(): LocalData {
  const data = use(LocalDatabaseContext);
  if (!data) throw new Error('The local database needs a LocalDatabaseProvider.');
  return data;
}

/** The connection for writes and small reads that a write needs at once. */
export function useLocalDatabase(): LocalDatabase {
  return useLocalData().database;
}

/** The read connection, for a large read outside render (photo downloads). */
export function useLocalReader(): LocalReader {
  return useLocalData().reader;
}

/** Changes after a write of that kind of data, so a query hook re-reads its rows and only those. */
export function useLocalDataVersion(scope: LocalDataScope): number {
  const read = () => getLocalDataVersion(scope);
  return useSyncExternalStore(subscribeLocalData, read, read);
}

function useScopesVersion(scopes: readonly LocalDataScope[]): string {
  const snapshot = () => scopes.map(getLocalDataVersion).join(':');
  return useSyncExternalStore(subscribeLocalData, snapshot, snapshot);
}

/**
 * A small read (a few rows by key) done during render. It runs again only when one of its scopes changes or the
 * read itself changes (React Compiler keeps an inline read stable until the values it uses change). Large reads
 * use `useLocalAsyncQuery`.
 */
export function useLocalQuery<T>(
  scopes: readonly LocalDataScope[],
  read: (database: LocalDatabase) => T,
): T {
  const { database } = useLocalData();
  const version = useScopesVersion(scopes);
  return useMemo(() => readAt(version, database, read), [database, read, version]);
}

/** Takes the version as an input so the compiler keeps it as a dependency of the memo. */
function readAt<T>(
  _version: string,
  database: LocalDatabase,
  read: (database: LocalDatabase) => T,
): T {
  return read(database);
}

/**
 * A large read (a whole list) off the screen's thread, cached by TanStack Query under `key`. It is undefined only
 * until the first read; after a write in its scopes the old rows stay on screen until the new ones arrive. A new
 * `key` (another customer) never shows the old key's rows.
 */
export function useLocalAsyncQuery<T>(
  scopes: readonly LocalDataScope[],
  key: readonly unknown[],
  read: (reader: LocalReader) => Promise<T>,
): T | undefined {
  const { reader } = useLocalData();
  const version = useScopesVersion(scopes);
  const query = useQuery({
    placeholderData: (previous, previousQuery) =>
      previousQuery && sameKey(previousQuery.queryKey[1], key)
        ? keepPreviousData(previous)
        : undefined,
    queryFn: () => read(reader),
    queryKey: ['local', key, version],
  });
  return query.data;
}

function sameKey(previous: unknown, next: readonly unknown[]): boolean {
  return JSON.stringify(previous) === JSON.stringify(next);
}
