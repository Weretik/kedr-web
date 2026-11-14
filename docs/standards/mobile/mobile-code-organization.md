# Mobile code rules

**Applies to:** `apps/mobile` and `libs/mobile/**`.

The shared [frontend code organization rules](../shared/code-organization.md) apply in full: [role folders](../shared/code-organization.md#role-folders) (with the mobile `data-access` roles `local/`, `store/`, `sync/`), [one responsibility per file](../shared/code-organization.md#one-responsibility-per-file), [tests](../shared/code-organization.md#tests), and forbidden names. This file adds what is specific to Mobile.

## Libraries and routing

- Place domain code in `libs/mobile/<domain>/{model,data-access,ui,feature}`.
- A route file in `apps/mobile/src/app` is a thin Expo Router adapter: it connects a public screen from `feature` and contains no HTTP, storage, or domain logic.
- Root providers, theme, store, connectivity, and shell belong to `@mobile/core/shell`; features must not duplicate them.
- `model` does not depend on React, HTTP, Expo Router, or platform APIs.
- `data-access` owns private DTOs, mappers, local database queries (Drizzle) and server calls; DTOs and transport errors do not leave the library. Reads follow [ADR-0008](../../architecture/mobile/adr/0008-tanstack-query-reads.md): a whole list through `useLocalAsyncQuery` (off the JavaScript thread), a few rows by key through `useLocalQuery`, an online-only read through TanStack Query `useQuery`; never Redux or RTK Query, never a hand-written loading/caching hook.
- `ui` receives domain data and callbacks through props; it does not import API hooks, router, or storage.
- The one server error parser is `libs/mobile/shared/api-client/src/errors/api-error.ts`; it reads the current KedrStore Ardalis array and ProblemDetails `errors` into the same field errors ([validation and server errors](../shared/code-organization.md#validation-and-server-errors)).

## Structure and platform APIs

- Give each file, screen, and component one cohesive responsibility.
- A screen orchestrates the feature; split lists, cards, toolbars, and complex `renderItem` implementations by independent responsibility.
- For screens with queries, separate a thin `screens/*` adapter, `hooks/use-*-controller.ts` for the local query/debounce/selection, pure logic in `model` or `state/`, `components/*-query-controls.tsx` for controls, and `components/*-results.tsx` for empty/stale/list states. A screen must not contain effects, reducers, database or transport calls, or state conditionals.
- A phone and a tablet layout of the same screen share one controller; only the `components/*-layout.tsx` differ.
- Do not create `common`, `misc`, `helpers`, `utils`, or `types` without a domain purpose.
- The local database owns server data; the sync service in `@mobile/sync` is the only code that writes synced tables, and the send queue is the only path that sends drafts and orders. Small UI state (selected customer, filters) lives in a Zustand store of its domain.
- Isolate platform APIs: NetInfo belongs in the connectivity adapter, SecureStore and local authentication in the auth adapter, SQLite in `@mobile/core/local-db`.
- Add `*.ios.tsx`, `*.android.tsx`, or `*.native.tsx` only for real platform differences; do not duplicate shared logic.

## React Compiler

- React Compiler is on for the app (`experiments.reactCompiler` in `apps/mobile/app.json`), and the mobile library tests run the same compiler output (`.babelrc.js` test env), so a test catches what the compiler changes.
- Do not add `useMemo`, `useCallback`, or `memo` for speed in new code; the compiler memoizes components and hooks. Keep one only when a value must stay the same object for a reason other than speed.
- A memo must use every input it depends on: the compiler drops a dependency that the memo body does not read (`void version` does not count). Read local data through `useLocalQuery` or `useLocalAsyncQuery` from `@mobile/core/local-db`, which re-read when one of their scopes changes.
- Do not write a `try … finally` in a component or hook: the compiler skips such a function. End both branches with the same statement instead.
- `'use no memo'` is allowed only with a comment saying why; today only `useStyles`, which writes the shared style cache on purpose.

## Speed

- Judge speed only in release mode: `--no-dev --minify` while developing and an EAS `preview` build before a merge, by the [speed checks](../../architecture/mobile/workflow/testing.md#speed-checks).

## Known deviations

None: the structure check has no Mobile entries in [the baseline](../../../tools/architecture/structure-baseline.json). A new violation fails `npm run architecture:structure`.
