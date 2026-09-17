# TS-006 — history list, cards and visible states

- **Task ID:** TS-006
- **Covers:** SC-001–SC-011
- **Depends on:** TS-001, TS-005
- **Exact paths:** `libs/mobile/orders/ui/src/components/order-card.tsx`;
  `libs/mobile/orders/ui/src/components/order-history-list.tsx`;
  `libs/mobile/orders/ui/src/components/order-history-footer.tsx`;
  `libs/mobile/orders/ui/src/components/order-status-chip.tsx`;
  `libs/mobile/orders/ui/src/states/order-history-loading.tsx`;
  `libs/mobile/orders/ui/src/states/order-history-error.tsx`;
  `libs/mobile/orders/ui/src/states/order-history-empty.tsx`;
  `libs/mobile/orders/feature/src/components/order-history-filter.tsx`;
  `libs/mobile/orders/feature/src/components/order-history-results.tsx`;
  `libs/mobile/orders/feature/src/screens/order-history-screen.tsx`;
  adjacent `*.spec.tsx` files
- **Test level:** component

## Work

- [x] Render top all/selected-customer control, reusable selector and contextual
      clear-filter action through controller callbacks.
- [x] Render FlashList cards with number, customer, localized chip, positions,
      UAH total and Kyiv date/time; make the entire card the detail action.
- [x] Implement initial loading, all/filtered empty, first-page error/offline,
      refreshing, load-more and retry footer states matching the contract.
- [x] Use only central Paper theme/typography and semantic theme-derived chip
      colors; support light/dark, text scaling and Ukrainian accessible names.
- [x] Keep UI presentational: no API hooks, router, DTOs, persistence or feature
      state ownership in orders UI.
- [x] Review changed implementation files for cohesive responsibility; keep
      controls, result-state orchestration and list/card rendering separated.

## Evidence

- Test/path and observable assertion: order card/list/UI state and history screen
  specs assert fields, chip text, all/selected customer, empty/error/footer,
  refresh/load/open callbacks and accessible names.
- Red command and expected behavioral failure: focused orders UI/feature tests
  fail because components/screen do not exist.
- Green command and result: `npx nx test mobile-orders-ui --runInBand` — 3
  suites/4 tests pass; feature controller/state tests pass 4 suites/6 tests.
- Refactor note and focused rerun: cards, status, list/footer, each full-screen
  async state, filter and result orchestration now have separate modules. The status badge is a
  non-interactive `View`/`Text`, avoiding a nested web `<button>` inside the
  pressable order card; focused UI tests pass after the responsibility split.
- Regression command and result: orders UI/feature tests and
  `npm run test:mobile`; all 20 project targets pass.
- Manual/visual evidence, if required: themes, large text and device layout in
  `TS-010`.
- Deviation or blocker: physical theme/large-text checks remain assigned to TS-010.

## Checkpoint

RNTL proves every agreed history/filter/pagination state and card interaction
with no reference-only controls or feature-local visual tokens.
