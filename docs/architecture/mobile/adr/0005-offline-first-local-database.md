# ADR-0005: Offline-first with a local database and a send queue

**Status:** Accepted (replaces [ADR-0003](0003-online-first.md); narrows [ADR-0002](0002-axios-rtk-query.md))\
**Date:** 2026-11-05

## Context

The owner asked (2026-11-05) to rebuild the manager app so that a manager can work with no network: pick a customer, browse products with photos and schemes at that customer's prices, build a calculation with discount or markup, save a draft and press «Відправити в 1С». ADR-0003 kept data in memory only, so after a restart without network the app is empty. Spec: [Kedr Manager app](../../../specs/mobile/manager/001-manager-app/README.md).

## Decision

1. **Local database.** The device keeps a SQLite database (`expo-sqlite` with Drizzle ORM for schema, typed queries and migrations). Screens read the local database, not the network. Stored: categories, products (stock, photo list, scheme, description), prices for every price type, price types, customers with their default price type and category price rules, the manager's recent orders and drafts, local calculations, and the send queue.
2. **Sync.** A sync service in `@mobile/sync` downloads snapshots from KedrStore `/api/mobile/sync/*` on sign-in, on app start, when the network returns and every 15 minutes while online. A snapshot carries an `ETag`; an unchanged snapshot answers `304` and costs nothing. Each table is replaced inside one transaction, so a screen never sees half a sync. The time of the last successful sync is shown to the manager.
3. **Client price on the device.** The device resolves the customer price with the same rule as the server: the price type of the customer's rule on the product's category, else the nearest rule on a parent category, else the customer's default price type. The server quote stays the authority for the amount sent to 1C.
4. **Send queue (outbox).** «Відправити в 1С» and draft saves write a queue entry with its own idempotency key (the existing `Idempotency-Key` of `order-workspace`). The queue is sent in order when online; a retry never creates a second order or draft. A server rejection (`quote_changed`, stock or price conflict, `price_below_minimum`) does not drop the entry: the calculation returns to the manager with the server's reason and the changed lines.
5. **Session.** Tokens stay in SecureStore. Without network the app opens with the saved session for up to 7 days since the last successful refresh; after that it asks for the password, keeping the queue and drafts. Optional quick unlock by fingerprint or Face ID (`expo-local-authentication`) only unlocks the saved session.
6. **Photos.** Thumbnails of all products and all schemes are downloaded ahead over Wi‑Fi into the `expo-image` disk cache; large photos are cached when first opened, and «Завантажити всі фото» in the cabinet downloads the rest.
7. **Server state in the app.** Server data lives in the database, not in RTK Query. Transport stays on the shared Axios client with bearer refresh; small UI state (selected customer, filters) uses Zustand. RTK Query is removed together with the old screens.

## Data protection

Only staff accounts can sign in (`isStaff`). Sign-out deletes the database, the queue and the image cache after asking the manager to confirm when the queue is not empty. The database holds customer contacts and prices; it lives in the app sandbox and is never exported.

## Consequences

- KedrStore needs read-only snapshot endpoints (`/api/mobile/sync/catalog`, `/api/mobile/sync/customers`); see its spec `platform/004-mobile-offline-sync`.
- Every screen defines a «data from HH:MM» state instead of a network error state; network errors appear only for actions that need the server now (profile changes, first sign-in).
- A schema change of the local database ships with a Drizzle migration; an unknown old database is dropped and fully re-synced.
- Snapshots are full, not deltas. If the catalog snapshot grows above about 5 MB compressed, a delta API needs a new decision.
