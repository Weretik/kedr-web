# TS-005 — history filter, pagination and refresh state

- **Task ID:** TS-005
- **Covers:** SC-003–SC-010, SC-012
- **Depends on:** TS-002, TS-004
- **Exact paths:** `libs/mobile/orders/feature/src/state/order-customer-picker-reducer.ts`;
  `libs/mobile/orders/feature/src/state/order-history-page-reducer.ts`;
  `libs/mobile/orders/feature/src/state/order-history-pagination.ts`;
  `libs/mobile/orders/model/src/lib/order-filter-session.ts`;
  `libs/mobile/orders/feature/src/hooks/use-order-customer-filter.ts`;
  `libs/mobile/orders/feature/src/hooks/use-order-history-pages.ts`;
  `libs/mobile/orders/feature/src/hooks/use-order-history-controller.ts`;
  adjacent `*.spec.ts(x)` files; `libs/mobile/core/shell/src/providers/app-providers.tsx`
- **Test level:** unit/focused integration

## Work

- [x] Model page 1/filter change/clear/next-page/refresh transitions and merge
      summaries by `orderId`, keeping the latest returned value.
- [x] Store only selected customer identity/display name in the existing root
      Redux runtime so tab/detail navigation retains it without persistence.
- [x] Coordinate RTK Query args and accumulated view items without copying
      server loading/error/cache state into Redux.
- [x] Block duplicate next-page actions while fetching; retain items and expose
      retry after later-page failure; stop at `totalPages`.
- [x] Reset accumulated pages on filter change/clear/refresh, preserve filter on
      refresh, and ensure cold store creation defaults to all clients.
- [x] Review changed implementation files for cohesive responsibility; split
      reducer, merge and controller concerns when independently testable.

## Evidence

- Test/path and observable assertion: reducer/merge/session/controller specs
  assert every transition, filter lifecycle, request args, dedupe and retry.
- Red command and expected behavioral failure: orders feature focused tests fail
  because state/controller behavior is absent.
- Green command and result: `npx nx test mobile-orders-feature --runInBand` —
  4 suites/6 tests pass for picker/page transitions, request args, search and
  page merge.
- Refactor note and focused rerun: customer selection and local picker state,
  order-page accumulation and their thin composition now live in separate
  hooks/reducers. The runtime-only filter reducer remains in orders model so the
  core shell registers state without depending on a feature; focused tests pass.
- Regression command and result: orders feature/shell tests,
  `npm run test:mobile`, Mobile test typecheck; all pass.
- Manual/visual evidence, if required: cold-start/runtime navigation in TS-010.
- Deviation or blocker: none; the root store registers the reducer and no storage
  adapter or persistence path references it.

## Checkpoint

Tests prove filter session scope and all page/refresh/error transitions while
RTK Query remains the sole server-state owner.
