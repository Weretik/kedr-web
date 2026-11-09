export { catalogSnapshotSchema, type CatalogSnapshot } from './snapshots/catalog-snapshot';
export { customersSnapshotSchema, type CustomersSnapshot } from './snapshots/customers-snapshot';
export { toKopecks, toNullableKopecks } from './snapshots/money';
export {
  isStale,
  isSyncDue,
  oldestSyncedAt,
  staleAfterMs,
  syncCheckMs,
  syncIntervalMs,
  syncResources,
  type ResourceSyncOutcome,
  type SyncFailureReason,
  type SyncResource,
} from './status/sync-status';
