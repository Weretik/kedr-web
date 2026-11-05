import { createContext, use, useSyncExternalStore, type ReactNode } from 'react';

import { getLocalDataVersion, subscribeLocalData } from '../database/local-data-version';
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

/** Changes after every synced write, so a query hook can re-read its rows. */
export function useLocalDataVersion(): number {
  return useSyncExternalStore(subscribeLocalData, getLocalDataVersion, getLocalDataVersion);
}
