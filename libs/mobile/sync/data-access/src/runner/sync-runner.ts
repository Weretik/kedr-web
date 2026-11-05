import {
  catalogSnapshotSchema,
  customersSnapshotSchema,
  syncResources,
  type ResourceSyncOutcome,
  type SyncResource,
} from '@mobile/sync/model';

import {
  readSyncState,
  replaceCatalog,
  replaceCustomers,
  touchSyncState,
} from '../store/snapshot-store';

import type { SnapshotFetcher } from '../client/snapshot-client';
import type { LocalDatabase } from '@mobile/core/local-db';

export interface SyncDependencies {
  db: LocalDatabase;
  fetchSnapshot: SnapshotFetcher;
  now: () => number;
}

/**
 * Syncs every resource in turn. A failed resource keeps its old data and does not stop the others; an
 * `unauthorized` answer stops the run because every later request would fail the same way.
 */
export async function syncAll(deps: SyncDependencies): Promise<ResourceSyncOutcome[]> {
  const outcomes: ResourceSyncOutcome[] = [];
  for (const resource of syncResources) {
    const outcome = await syncResource(deps, resource);
    outcomes.push(outcome);
    if (outcome.kind === 'failed' && outcome.reason === 'unauthorized') break;
  }
  return outcomes;
}

export async function syncResource(
  { db, fetchSnapshot, now }: SyncDependencies,
  resource: SyncResource,
): Promise<ResourceSyncOutcome> {
  const stored = readSyncState(db)[resource];
  const response = await fetchSnapshot(resource, stored?.etag ?? null);

  if (response.kind === 'failed') return { resource, kind: 'failed', reason: response.reason };

  const syncedAt = now();
  if (response.kind === 'not-modified') {
    touchSyncState(db, resource, syncedAt);
    return { resource, kind: 'not-modified', syncedAt };
  }

  if (resource === 'catalog') {
    const parsed = catalogSnapshotSchema.safeParse(response.body);
    if (!parsed.success) return { resource, kind: 'failed', reason: 'invalid-data' };
    replaceCatalog(db, parsed.data, response.etag || `"${parsed.data.version}"`, syncedAt);
  } else {
    const parsed = customersSnapshotSchema.safeParse(response.body);
    if (!parsed.success) return { resource, kind: 'failed', reason: 'invalid-data' };
    replaceCustomers(db, parsed.data, response.etag || `"${parsed.data.version}"`, syncedAt);
  }

  return { resource, kind: 'updated', syncedAt };
}
