/** The snapshots the device keeps, each with its own ETag. */
export const syncResources = ['catalog', 'customers'] as const;
export type SyncResource = (typeof syncResources)[number];

/** Sync runs on start, on network return and every 15 minutes while online (R-015). */
export const syncIntervalMs = 15 * 60 * 1000;

/** Data older than this is shown as stale in the shell strip. */
export const staleAfterMs = 60 * 60 * 1000;

/** What one resource sync did. */
export type ResourceSyncOutcome =
  | { resource: SyncResource; kind: 'updated'; syncedAt: number }
  | { resource: SyncResource; kind: 'not-modified'; syncedAt: number }
  | { resource: SyncResource; kind: 'failed'; reason: SyncFailureReason };

export type SyncFailureReason = 'offline' | 'unauthorized' | 'invalid-data' | 'server';

/** The oldest sync time over all resources, or null until every resource has been stored once. */
export function oldestSyncedAt(syncedAt: Partial<Record<SyncResource, number>>): number | null {
  const times = syncResources.map((resource) => syncedAt[resource]);
  if (times.some((time) => time === undefined)) return null;
  return Math.min(...(times as number[]));
}

export function isStale(syncedAt: number | null, now: number): boolean {
  return syncedAt === null || now - syncedAt > staleAfterMs;
}
