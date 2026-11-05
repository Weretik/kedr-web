# Kedr Manager — frontend design

## Applicable rules

| Rule | Source |
| --- | --- |
| Domain libraries `model / data-access / ui / feature`, thin route files | [Mobile code rules](../../../../../standards/mobile/mobile-code-organization.md) |
| Look, tokens, patterns | [Design system «Офіс»](../../../../../standards/mobile/design-system.md) |
| States, accessibility, Ukrainian strings | [Mobile UI rules](../../../../../standards/mobile/mobile-ui.md) |
| Offline-first, local database, send queue, 7-day offline session | [ADR-0005](../../../../../architecture/mobile/adr/0005-offline-first-local-database.md) |
| Own UI on Unistyles instead of Paper | [ADR-0006](../../../../../architecture/mobile/adr/0006-own-ui-on-unistyles.md) |
| Expo Router, file routes | [ADR-0001](../../../../../architecture/mobile/adr/0001-expo-router.md) |
| Staged structure check after every stage, closing checklist | [Delivery rules](../../../../../standards/shared/delivery-rules.md) |
| Scaffold with Nx generators, then trim to repo conventions | root `AGENTS.md` |

## Starting state (2026-11-05, commit 402c348)

`apps/mobile` is an Expo Router app with tabs Головна (placeholder), Каталог, Кошик, Замовлення, Профіль (products without photos). It uses React Native Paper with «Пагін» tokens, RTK Query on Axios with bearer refresh, the customer is chosen at checkout, prices are retail, orders go to `POST /api/admin/orders`, nothing is stored except the cart. Details in the [audit](https://claude.ai/artifact/JPTXQXg99JwL5GDx3DXS8T).

What stays: Nx project `mobile`, EAS project and `com.classkedr.mobile`, `@mobile/core/auth` session and token storage (extended), `@mobile/core/connectivity`, `@mobile/shared/api-client` Axios client and bearer interceptor (RTK Query parts removed), `@mobile/shared/config`, Golos Text font, zod at the boundary, Jest + Testing Library.

What goes: React Native Paper, `react-native-actions-sheet`, «Пагін» theme files, Unbounded font, RTK Query `baseApi`, Redux store, `libs/mobile/cart/*` (replaced by `calculation`), the products-without-photos screen, the Home placeholder. Each is removed in the stage that replaces it; the app is not run in two versions.

## Navigation

```text
apps/mobile/src/app/
├── _layout.tsx                 # fonts, providers, session guard (signed in / not / no access)
├── login.tsx
├── (work)/_layout.tsx          # TabBar on phone, NavRail on tablet; customer gate
├── (work)/customer/index.tsx   # choose customer (start screen)
├── (work)/customer/[counterpartyId].tsx   # customer card
├── (work)/customers.tsx        # customer list (tablet: list + card)
├── (work)/products/index.tsx   # guarded
├── (work)/products/[productSlug].tsx      # guarded
├── (work)/calculation.tsx      # guarded
├── (work)/orders/index.tsx     # guarded
├── (work)/orders/[orderId].tsx            # guarded
├── (work)/drafts/[draftId].tsx            # guarded
├── (work)/cabinet.tsx
└── viewer/[productSlug].tsx    # full-screen photos and scheme (modal)
```

The gate uses `Stack.Protected guard={hasCustomer}` around the guarded routes and disabled tab items with a lock; a deep link into a guarded route without a customer lands on customer choice. On `wide`, `calculation` is rendered as a side panel of `products` instead of a separate tab.

## Libraries (planned map)

New libraries are created with `npx nx g @nx/react:library` (React Native preset as in existing mobile libs) and trimmed to repo conventions; tags `scope:mobile`, `domain:<name>`, `type:<layer>`.

| Library | Status | Responsibility |
| --- | --- | --- |
| `@mobile/shared/ui` | rewrite | «Офіс» tokens on Unistyles, breakpoints, base components (Button, TextField, SegmentedControl, Chip, StatusPill, QuantityStepper, Card, ListRow, Avatar, Sheet, StateView, ZoomViewer) |
| `@mobile/shared/api-client` | keep, trim | Axios client, bearer refresh, `ApiError`; RTK Query files removed |
| `@mobile/shared/model` | keep | Money formatting, order sync status kinds |
| `@mobile/core/auth` | extend | Session, token storage, 7-day offline window, quick unlock adapter (`expo-local-authentication`), login screen in «Офіс» |
| `@mobile/core/connectivity` | keep | NetInfo adapter |
| `@mobile/core/local-db` | new | SQLite connection, Drizzle schema per table, migrations, wipe on sign-out |
| `@mobile/core/shell` | rewrite | Providers, `TabBar`, `NavRail`, customer gate, `CustomerBar`, stale-data strip |
| `@mobile/sync/{model,data-access,feature}` | new | Snapshot download with ETag, table replace in a transaction, schedule, send queue (outbox) runner, sync status |
| `@mobile/customers/{model,data-access,ui,feature}` | rewrite | Selected customer store (Zustand, persisted id), search over local table, list, card with debt placeholder |
| `@mobile/catalog/{model,data-access,ui,feature}` | rewrite | Product queries on local tables (in-memory search), category tree, client price resolver, product list and detail, photo prefetch |
| `@mobile/calculation/{model,data-access,ui,feature}` | new (replaces `cart`) | Per-customer calculation, adjustment rules (≥ 1 ₴), totals, quote call, draft save and send through the queue, conflict view |
| `@mobile/orders/{model,data-access,ui,feature}` | rewrite | Customer orders and drafts from local tables refreshed from `order-workspace`, order and draft detail |
| `@mobile/profile/{data-access,ui,feature}` | new | Cabinet: photo, name, Admin email/password, sync and queue info, theme, quick unlock, sign-out |

Dependency direction is unchanged: `feature → ui, data-access, model`; `data-access → model, core/local-db, shared/api-client`; `ui → model, shared/ui`. `calculation/model` uses `catalog/model` for the price resolver input types only.

## Local data model (Drizzle tables)

| Table | Filled by | Key fields |
| --- | --- | --- |
| `categories` | catalog snapshot | id, parentId, name, sortOrder |
| `products` | catalog snapshot | id (the 1C code), slug, name, categoryId, stock, inStock, quantityInPack, photos (json), scheme, isSale, isNew |
| `product_prices` | catalog snapshot | productId, priceTypeId, amountKopecks |
| `price_types` | catalog snapshot | id, name |
| `customers` | customers snapshot | counterpartyId, name, phone, email, defaultPriceTypeId, debt (null), balance (null) |
| `customer_category_price_types` | customers snapshot | counterpartyId, categoryId, priceTypeId |
| `calculations` / `calculation_lines` | the app | counterpartyId, productId, quantity, priceAdjustment, comment, sourceDraftId |
| `customer_activity` | order-workspace reads | counterpartyId, orders (json), drafts (json), fetchedAt; last 50 of each per customer |
| `outbox` | the app | id, kind (draft-create, draft-update, draft-delete, order-create), payload, idempotencyKey, state, attempts, lastError |
| `sync_state` | sync service | resource, etag, syncedAt |

Product search filters the priced list in memory (about 2.5 thousand rows): the code from its start or every typed word in the name. An FTS5 table was planned, but at this size it adds a migration and a second copy of the names without a visible gain; it stays an option if the catalog grows past about 20 thousand products. All amounts are stored as integer kopecks to avoid rounding drift; the server remains the authority.

## Client price resolver

Pure function in `catalog/model`: input = product category id, category parent map, customer default price type, customer rules, product prices; output = unit price or null. It mirrors KedrStore `CustomerPriceResolver` (rule on the category, nearest parent rule, default; depth guard 32). Unit tests use the same cases as KedrStore `WorkspacePricingTests` SC-001/SC-005.

## Send queue

The outbox runner starts on network return, after each enqueue when online, and on app start. Entries run one at a time in creation order. Order creation calls `POST /api/admin/order-workspace/quote` then `POST /api/admin/order-workspace/orders` with the entry's `Idempotency-Key`; drafts use the drafts endpoints with their key. Network errors and 5xx retry with backoff (5 s, 30 s, 2 min, then every 5 min); 4xx business errors (`quote_changed`, stock, `price_below_minimum`, unknown customer) stop the entry, set `state = needs-review`, and reopen the calculation with the reason. 401 triggers refresh; an expired session pauses the queue until sign-in.

## Photos

`expo-image` with `cachePolicy="disk"`. KedrStore has no thumbnails, so after each new catalog version on Wi‑Fi (`isUnmetered` of the connectivity adapter) the main photo of every product and every scheme are prefetched in batches of 20; «Завантажити всі фото» prefetches large photos with a progress indicator and a stop button. The viewer uses Gesture Handler (pinch, double tap, pan) and Reanimated on the UI thread; stage 4 kept the hand-written gesture (no new native package). Jest cannot start Reanimated, so the viewer tests replace `ZoomableImage`; the gestures are checked on a device.

## Packages to add (checked against Expo 58 in the stage that needs them)

| Package | Why | Stage |
| --- | --- | --- |
| `react-native-unistyles` 3.x | themes and breakpoints (ADR-0006) | 1 |
| `@gorhom/bottom-sheet` 5.x | single sheet implementation | 1 |
| `expo-local-authentication` | quick unlock | 1 |
| `zustand` 5.x | small UI state | 1 |
| `expo-sqlite`, `drizzle-orm`, `drizzle-kit` | local database and migrations | 2 |
| `react-native-zoom-toolkit` (optional) | zoom viewer | 4 |
| `expo-updates` | over-the-air updates for distribution | 8 |

Removed: `react-native-paper`, `react-native-actions-sheet`, `@reduxjs/toolkit`, `react-redux`, `@expo-google-fonts/unbounded`, `react-native-reanimated-carousel`, `react-native-tree-multi-select`, `@react-native-assets/slider` once nothing uses them.

## Responsive layouts

Breakpoints `phone` < 600, `tablet` 600–1023, `wide` ≥ 1024 dp (Unistyles `rt.breakpoint`). `app.json` allows all orientations on tablets and keeps portrait on phones (`expo-screen-orientation` lock by breakpoint at start). Each feature screen has one controller hook and a `components/*-layout.tsx` per breakpoint where the layout differs (catalog: list vs table + calculation panel; customers: list vs list + card; product: stacked vs side by side).

## Testing

- Unit (Jest): price resolver, adjustment rules, totals, outbox state machine, snapshot mappers, offline session window.
- Component (Testing Library): gate, customer search, product row states (out of stock, no price), calculation line and footer, conflict view, cabinet by role, layouts per breakpoint with a mocked Unistyles runtime.
- Local database tests run the same Drizzle tables on `better-sqlite3` in memory (`@mobile/core/local-db/testing`); both are synchronous SQLite drivers with one Drizzle API (decided in stage 2).
- Device checks (Android phone, iPhone, tablet; airplane mode) only with the owner's permission, in stage 8.

## Contract

See [API contract](../contracts/api-contract.md). The OpenAPI snapshot in `docs/contracts/openapi` is refreshed with `npm run contracts:check` after KedrStore stage 2 is merged.
