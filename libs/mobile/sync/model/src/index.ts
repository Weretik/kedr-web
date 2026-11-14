export { catalogSnapshotSchema, type CatalogSnapshot } from './entities/catalog-snapshot';
export { customersSnapshotSchema, type CustomersSnapshot } from './entities/customers-snapshot';
export { toKopecks, toNullableKopecks } from './mappers/money';
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
} from './entities/sync-status';
