import { createContext, use, useMemo, useSyncExternalStore, type ReactNode } from 'react';

import {
  getLocalDataVersion,
  subscribeLocalData,
  type LocalDataScope,
} from '../database/local-data-version';
import { type LocalDatabase } from '../database/local-database';
import { getLocalDatabase } from '../database/open-local-database';

const LocalDatabaseContext = createContext<LocalDatabase | null>(null);

/** Gives screens the device database; tests pass an in-memory one. */
export function LocalDatabaseProvider({
  children,
  database,
}: Readonly<{ children: ReactNode; database?: LocalDatabase }>) {
  return (
    <LocalDatabaseContext.Provider value={database ?? getLocalDatabase()}>
      {children}
    </LocalDatabaseContext.Provider>
  );
}

export function useLocalDatabase(): LocalDatabase {
  const database = use(LocalDatabaseContext);
  if (!database) throw new Error('useLocalDatabase needs a LocalDatabaseProvider.');
  return database;
}

/** Changes after a write of that kind of data, so a query hook re-reads its rows and only those. */
export function useLocalDataVersion(scope: LocalDataScope): number {
  const read = () => getLocalDataVersion(scope);
  return useSyncExternalStore(subscribeLocalData, read, read);
}

/**
 * Rows read from the device database for a screen. The read runs again only when one of its scopes changes or the
 * read itself changes (React Compiler keeps an inline read stable until the values it uses change).
 */
export function useLocalQuery<T>(
  scopes: readonly LocalDataScope[],
  read: (database: LocalDatabase) => T,
): T {
  const database = useLocalDatabase();
  const snapshot = () => scopes.map(getLocalDataVersion).join(':');
  const version = useSyncExternalStore(subscribeLocalData, snapshot, snapshot);
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
