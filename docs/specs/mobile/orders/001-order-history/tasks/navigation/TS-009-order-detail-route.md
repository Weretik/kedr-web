# TS-009 — order detail route and back navigation

- **Task ID:** TS-009
- **Covers:** SC-005, SC-012, SC-015
- **Depends on:** TS-007, TS-008
- **Exact paths:** `apps/mobile/src/app/orders/[orderId].tsx`;
  `apps/mobile/src/__tests__/order-detail-route.spec.tsx`;
  `libs/mobile/orders/feature/src/screens/order-history-screen.spec.tsx`
- **Test level:** integration

## Work

- [x] Add thin detail route outside `(tabs)`, parse one positive integer
      `orderId`, and pass valid/invalid state to the public feature screen.
- [x] Navigate from the whole card to `/orders/[orderId]`; hide bottom tabs on
      detail and preserve standard Appbar/system back.
- [x] Prove back returns to the mounted history with session filter intact.
- [x] Test direct valid route, invalid/missing parameter and back/navigation
      callback without adding HTTP logic to the route.
- [x] Review changed implementation files for cohesive responsibility; keep
      parameter/router adaptation out of feature/UI.

## Evidence

- Test/path and observable assertion: route/history specs assert positive ID
  delegation, invalid fallback, hidden tab shell and preserved filter on back.
- Red command and expected behavioral failure: Mobile/feature focused tests fail
  because detail route/navigation does not exist.
- Green command and result: Mobile route specs pass for numeric IDs, invalid IDs,
  push and back behavior (part of 3 suites/8 tests).
- Refactor note and focused rerun: parameter normalization stays in the Expo
  Router adapter and data ownership stays in the feature; rerun passes.
- Regression command and result: Mobile and orders feature tests, app lint,
  typecheck and multi-platform Expo export pass.
- Manual/visual evidence, if required: Android/iOS back gestures in TS-010.
- Deviation or blocker: external marketing deep-link behavior remains out of scope.

## Checkpoint

Valid card/direct navigation opens one read-only detail outside tabs, invalid IDs
fail safely, and back restores history/filter context.
