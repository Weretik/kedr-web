# TS-008 — orders tab registration and route

- **Task ID:** TS-008
- **Covers:** SC-001, SC-005
- **Depends on:** TS-006
- **Exact paths:** `apps/mobile/src/app/(tabs)/orders.tsx`;
  `apps/mobile/src/app/(tabs)/_layout.tsx`;
  `apps/mobile/src/__tests__/tabs-layout.spec.tsx`;
  `apps/mobile/src/__tests__/orders-route.spec.tsx`
- **Test level:** integration

## Work

- [x] Add thin `orders.tsx` adapter that renders the public history screen and
      supplies detail-navigation callback without HTTP/domain logic.
- [x] Register label/accessibility label «Замовлення» and order it after cart,
      before profile, using established shell icons/theme.
- [x] Preserve Home, Catalog, Cart and Profile routes and existing header/theme
      behavior.
- [x] Test tab order/labels and that the route delegates to the feature public API.
- [x] Review changed implementation files for cohesive responsibility; keep tab
      metadata/navigation in shell and history behavior in feature.

## Evidence

- Test/path and observable assertion: exact app specs assert five labels/order,
  thin render and detail callback navigation.
- Red command and expected behavioral failure: `npx nx test mobile --runInBand`
  fails because the orders route/tab is missing.
- Green command and result: `npx nx test mobile --runInBand` — 3 suites/8 tests
  pass, including the five-tab order and orders route navigation.
- Refactor note and focused rerun: route remains a one-purpose adapter; rerun passes.
- Regression command and result: `npx nx test mobile --runInBand`,
  `npx nx lint mobile`, `npx nx typecheck mobile`; all pass.
- Manual/visual evidence, if required: tab spacing/safe area in TS-010.
- Deviation or blocker: physical tab spacing/safe-area check remains in TS-010.

## Checkpoint

App integration tests prove «Замовлення» is the fourth of five tabs and its file
is a thin adapter to the public history screen.
