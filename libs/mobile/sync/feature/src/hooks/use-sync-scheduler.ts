import { readSyncState, syncAll, type SnapshotFetcher } from '@mobile/sync/data-access';
import { isSyncDue, oldestSyncedAt, syncCheckMs, type SyncResource } from '@mobile/sync/model';
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

function storedSyncedAt(db: LocalDatabase): Partial<Record<SyncResource, number>> {
  const syncedAt: Partial<Record<SyncResource, number>> = {};
  for (const [resource, state] of Object.entries(readSyncState(db))) {
    if (state) syncedAt[resource as SyncResource] = state.syncedAt;
  }
  return syncedAt;
}

/**
 * Runs the snapshot sync once a day while online (checked on start, on network return and every hour) and at once
 * on request, «Оновити дані» (R-015). Only one run at a time.
 */
export function useSyncScheduler({
  db,
  fetchSnapshot,
  isOnline,
  now = Date.now,
}: SyncSchedulerOptions): void {
  const requestedAt = useSyncStatus((state) => state.requestedAt);
  const runningRef = useRef(false);
  const handledRequestRef = useRef(requestedAt);

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

  const runIfDue = useEffectEvent((database: LocalDatabase) => {
    if (isSyncDue(oldestSyncedAt(storedSyncedAt(database)), now())) void run(database);
  });

  useEffect(() => {
    if (!db) return;
    syncStatusActions.loaded(storedSyncedAt(db));
    return () => syncStatusActions.reset();
  }, [db]);

  useEffect(() => {
    if (!db || isOnline !== true) return;

    if (requestedAt !== handledRequestRef.current) {
      handledRequestRef.current = requestedAt;
      void run(db);
    } else {
      runIfDue(db);
    }
    const timer = setInterval(() => runIfDue(db), syncCheckMs);
    return () => clearInterval(timer);
  }, [db, isOnline, requestedAt]);
}
