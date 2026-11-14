import { apiClient } from '@mobile/shared/api-client';
import axios from 'axios';

import type { SyncFailureReason, SyncResource } from '@mobile/sync/model';

export const snapshotRoutes: Record<SyncResource, string> = {
  catalog: '/api/mobile/sync/catalog',
  customers: '/api/mobile/sync/customers',
};

/** A whole snapshot can take a while on a slow mobile network. */
const snapshotTimeoutMs = 120_000;

export type SnapshotResponse =
  | { kind: 'not-modified' }
  | { kind: 'updated'; etag: string; body: unknown }
  | { kind: 'failed'; reason: SyncFailureReason };

export type SnapshotFetcher = (
  resource: SyncResource,
  etag: string | null,
) => Promise<SnapshotResponse>;

/** Asks for a snapshot with the stored ETag; `304` means the device already holds it. */
export const fetchSnapshot: SnapshotFetcher = async (resource, etag) => {
  try {
    const response = await apiClient.get<unknown>(snapshotRoutes[resource], {
      headers: etag ? { 'If-None-Match': etag } : undefined,
      timeout: snapshotTimeoutMs,
      validateStatus: (status) => status === 200 || status === 304,
    });

    if (response.status === 304) return { kind: 'not-modified' };

    const responseEtag = response.headers['etag'];
    return {
      kind: 'updated',
      etag: typeof responseEtag === 'string' ? responseEtag : '',
      body: response.data,
    };
  } catch (error) {
    return { kind: 'failed', reason: toFailureReason(error) };
  }
};

function toFailureReason(error: unknown): SyncFailureReason {
  if (!axios.isAxiosError(error) || !error.response) return 'offline';
  if (error.response.status === 401 || error.response.status === 403) return 'unauthorized';
  return 'server';
}
