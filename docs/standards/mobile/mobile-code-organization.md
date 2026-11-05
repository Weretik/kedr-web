# Mobile code rules

## Libraries and routing

- Place domain code in `libs/mobile/<domain>/{model,data-access,ui,feature}`.
- A route file in `apps/mobile/src/app` is a thin Expo Router adapter: it connects a public screen from `feature` and contains no HTTP, storage, or domain logic.
- Root providers, theme, store, connectivity, and shell belong to `@mobile/core/shell`; features must not duplicate them.
- `model` does not depend on React, HTTP, Expo Router, or platform APIs.
- `data-access` owns private DTOs, mappers, local database queries (Drizzle) and server calls; DTOs and transport errors do not leave the library. Old libraries still use RTK Query until they are replaced ([ADR-0005](../../architecture/mobile/adr/0005-offline-first-local-database.md)).
- `ui` receives domain data and callbacks through props; it does not import API hooks, router, or storage.

## Structure and platform APIs

- Give each file, screen, and component one cohesive responsibility.
- A screen orchestrates the feature; split lists, cards, toolbars, and complex `renderItem` implementations by independent responsibility.
- For screens with queries, separate a thin `screens/*` adapter, `hooks/use-*-controller.ts` for the local query/debounce/selection, pure logic in `model` or `state/`, `components/*-query-controls.tsx` for controls, and `components/*-results.tsx` for empty/stale/list states. A screen must not contain effects, reducers, database or transport calls, or state conditionals.
- A phone and a tablet layout of the same screen share one controller; only the `components/*-layout.tsx` differ.
- Do not create `common`, `misc`, `helpers`, `utils`, or `types` without a domain purpose.
- The local database owns server data; the sync service in `@mobile/sync` is the only code that writes synced tables, and the send queue is the only path that sends drafts and orders. Small UI state (selected customer, filters) lives in a Zustand store of its domain.
- Isolate platform APIs: NetInfo belongs in the connectivity adapter, SecureStore and local authentication in the auth adapter, SQLite in `@mobile/core/local-db`.
- Add `*.ios.tsx`, `*.android.tsx`, or `*.native.tsx` only for real platform differences; do not duplicate shared logic.
