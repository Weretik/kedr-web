import { create } from 'zustand';

import type { ResourceSyncOutcome, SyncFailureReason, SyncResource } from '@mobile/sync/model';

export interface SyncStatusState {
  /** False until the stored sync times are read from the device. */
  loaded: boolean;
  running: boolean;
  syncedAt: Partial<Record<SyncResource, number>>;
  lastFailure: SyncFailureReason | null;
  /** Bumped by «Оновити дані зараз»; the scheduler runs a sync when it changes. */
  requestedAt: number;
}

const initialState: SyncStatusState = {
  lastFailure: null,
  loaded: false,
  requestedAt: 0,
  running: false,
  syncedAt: {},
};

/** Sync status the shell strip, the first-sync screen and the cabinet read. Not persisted. */
export const useSyncStatus = create<SyncStatusState>(() => initialState);

export const syncStatusActions = {
  loaded(syncedAt: Partial<Record<SyncResource, number>>) {
    useSyncStatus.setState({ loaded: true, syncedAt });
  },
  started() {
    useSyncStatus.setState({ running: true });
  },
  finished(outcomes: readonly ResourceSyncOutcome[]) {
    useSyncStatus.setState((state) => {
      const syncedAt = { ...state.syncedAt };
      let lastFailure: SyncFailureReason | null = null;
      for (const outcome of outcomes) {
        if (outcome.kind === 'failed') lastFailure = outcome.reason;
        else syncedAt[outcome.resource] = outcome.syncedAt;
      }
      return { lastFailure, running: false, syncedAt };
    });
  },
  requestNow(now: number = Date.now()) {
    useSyncStatus.setState({ requestedAt: now });
  },
  reset() {
    useSyncStatus.setState(initialState);
  },
};
