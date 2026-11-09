# ADR-0008: TanStack Query for large local reads and server reads

**Status:** Accepted\
**Date:** 2026-11-09\
**Refines:** point 7 of [ADR-0005](0005-offline-first-local-database.md)

## Context

Screens read the local database synchronously during render. The catalog with a customer's prices (about 2.5 thousand products) and the customer list are read again after every sync and every customer change, and each read held the screen until it finished. The few online reads (a customer's orders and drafts, an order with its lines) used hand-written hooks for loading, caching and offline fallback.

## Decision

- **TanStack Query** (`@tanstack/react-query`) is the one cache for reads that do not have to be synchronous. One `QueryClient` lives in `LocalDatabaseProvider` (`@mobile/core/local-db`), so every screen that reads data has it.
- **Large local reads** (whole lists: catalog, customers, categories, one product page) use `useLocalAsyncQuery(scopes, key, read)`. On the device they run on a second, read-only connection to the same database file (`getLocalReader`, Drizzle `sqlite-proxy` over the `expo-sqlite` async API), so SQLite works off the JavaScript thread; WAL keeps the reads consistent while the sync writes. The key holds the read's inputs and the data versions of its scopes: a sync bumps the version, the old rows stay on screen until the new ones arrive, and a different key (another customer) never shows the old rows.
- **Small local reads** (a few rows by key that a write needs at once: the open calculation, its line products, the chosen customer, the send queue) stay synchronous through `useLocalQuery(scopes, read)`.
- **Server reads** that are not synced (a customer's orders and drafts, an order with its lines) use `useQuery` in their domain `data-access` with the saved local copy as the fallback offline. Writes still go only through the send queue; TanStack Query does not send orders.
- Local reads never go stale on a timer (`staleTime: Infinity`); they change only through a version bump. Queries do not retry: offline is a normal state.

## Consequences

- Screens that read a large list have a short `loading` state before the first read.
- Tests use the synchronous in-memory database as the reader; `@mobile/core/local-db/testing` delivers query results at once so they land inside `act()`.
- Redux Toolkit and RTK Query stay out of the mobile app; Admin keeps RTK Query.
