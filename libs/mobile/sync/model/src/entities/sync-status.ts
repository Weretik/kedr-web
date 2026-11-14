/** The snapshots the device keeps, each with its own ETag. */
export const syncResources = ['catalog', 'customers'] as const;
export type SyncResource = (typeof syncResources)[number];

/** Automatic sync runs once a day: on start or network return when the data is a day old (R-015). */
export const syncIntervalMs = 24 * 60 * 60 * 1000;

/** How often an open app checks whether the daily sync is due. */
export const syncCheckMs = 60 * 60 * 1000;

/** Data older than this is shown as stale in the shell strip: the daily sync was missed. */
export const staleAfterMs = 2 * syncIntervalMs;

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

/** Whether the daily automatic sync should run: some resource was never stored or is a day old. */
export function isSyncDue(syncedAt: number | null, now: number): boolean {
  return syncedAt === null || now - syncedAt >= syncIntervalMs;
}

export function isStale(syncedAt: number | null, now: number): boolean {
  return syncedAt === null || now - syncedAt > staleAfterMs;
}
