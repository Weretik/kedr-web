import { getLocalDatabase, type LocalDatabase } from '@mobile/core/local-db';
import { fetchSnapshot, type SnapshotFetcher } from '@mobile/sync/data-access';
import { useMemo, type ReactNode } from 'react';

import { SyncGate } from './sync-gate';
import { useSyncScheduler } from '../hooks/use-sync-scheduler';

export interface SyncProviderProps {
  children: ReactNode;
  isOnline: boolean | null;
  /** Tests pass an in-memory database and a fake server. */
  database?: LocalDatabase;
  fetcher?: SnapshotFetcher;
}

/** Keeps the device copy of the catalog and customers fresh and shows the first sync. Mount after sign-in. */
export function SyncProvider({
  children,
  database,
  fetcher,
  isOnline,
}: Readonly<SyncProviderProps>) {
  const db = useMemo(() => database ?? getLocalDatabase(), [database]);
  useSyncScheduler({ db, fetchSnapshot: fetcher ?? fetchSnapshot, isOnline });

  return <SyncGate isOnline={isOnline}>{children}</SyncGate>;
}
