import { useLocalDatabase } from '@mobile/core/local-db';
import { fetchSnapshot, type SnapshotFetcher } from '@mobile/sync/data-access';
import { type ReactNode } from 'react';

import { SyncGate } from './sync-gate';
import { useSyncScheduler } from '../hooks/use-sync-scheduler';

export interface SyncProviderProps {
  children: ReactNode;
  isOnline: boolean | null;
  /** Tests pass a fake server. */
  fetcher?: SnapshotFetcher;
}

/**
 * Keeps the device copy of the catalog and customers fresh and shows the first sync. Mount after sign-in, inside
 * `LocalDatabaseProvider`.
 */
export function SyncProvider({ children, fetcher, isOnline }: Readonly<SyncProviderProps>) {
  const db = useLocalDatabase();
  useSyncScheduler({ db, fetchSnapshot: fetcher ?? fetchSnapshot, isOnline });

  return <SyncGate isOnline={isOnline}>{children}</SyncGate>;
}
