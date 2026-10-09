# RM-002 — Move Mobile domain store composition to the app

- **Findings:** AF-002, AF-008
- **Requirements:** AR-001, AR-006
- **Depends on:** EN-001, RM-001
- **Owner:** Mobile app/core
- **Exact paths:** `apps/mobile/src`; `libs/mobile/core/shell/src/state/app-store.ts`;
  `libs/mobile/core/shell/src/providers/app-providers.tsx`; related indexes/tests

## Before evidence

`@mobile/core/shell` imports `@mobile/orders/model` to register its reducer.

## Work

- [x] Let app composition assemble domain reducers/middleware.
- [x] Keep shell providers reusable and domain-neutral.
- [x] Remove store internals from shell public API after consumers migrate.

## Verification

Store/provider tests; shell import search; Mobile graph, typecheck, tests and export.

## Checkpoint

AF-002 is verified when shell has no domain edge and observable state persists.
