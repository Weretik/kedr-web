import { readSyncState, syncAll, type SnapshotFetcher } from '@mobile/sync/data-access';
import { syncIntervalMs, type SyncResource } from '@mobile/sync/model';
import { useEffect, useEffectEvent, useRef } from 'react';

import { syncStatusActions, useSyncStatus } from '../state/sync-status-store';

import type { LocalDatabase } from '@mobile/core/local-db';

export interface SyncSchedulerOptions {
  db: LocalDatabase | null;
  fetchSnapshot: SnapshotFetcher;
  /** Null until the first network check answers. */
  isOnline: boolean | null;
  now?: () => number;
}

/**
 * Runs the snapshot sync on start, when the network returns, every 15 minutes while online and on request
 * (R-015). Only one run at a time; a run never blocks the screens because tables are swapped in one transaction.
 */
export function useSyncScheduler({
  db,
  fetchSnapshot,
  isOnline,
  now = Date.now,
}: SyncSchedulerOptions): void {
  const requestedAt = useSyncStatus((state) => state.requestedAt);
  const runningRef = useRef(false);

  const run = useEffectEvent(async (database: LocalDatabase) => {
    if (runningRef.current) return;
    runningRef.current = true;
    syncStatusActions.started();
    try {
      syncStatusActions.finished(await syncAll({ db: database, fetchSnapshot, now }));
    } catch {
      syncStatusActions.finished([]);
    } finally {
      runningRef.current = false;
    }
  });

  useEffect(() => {
    if (!db) return;
    const stored = readSyncState(db);
    const syncedAt: Partial<Record<SyncResource, number>> = {};
    for (const [resource, state] of Object.entries(stored)) {
      if (state) syncedAt[resource as SyncResource] = state.syncedAt;
    }
    syncStatusActions.loaded(syncedAt);
    return () => syncStatusActions.reset();
  }, [db]);

  useEffect(() => {
    if (!db || isOnline !== true) return;

    void run(db);
    const timer = setInterval(() => void run(db), syncIntervalMs);
    return () => clearInterval(timer);
  }, [db, isOnline, requestedAt]);
}
