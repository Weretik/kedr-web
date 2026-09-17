# TS-007 — read-only order detail screen

- **Task ID:** TS-007
- **Covers:** SC-012–SC-015
- **Depends on:** TS-001, TS-003
- **Exact paths:** `libs/mobile/orders/ui/src/components/order-detail-view.tsx`;
  `libs/mobile/orders/ui/src/components/order-detail-summary.tsx`;
  `libs/mobile/orders/ui/src/components/order-detail-products.tsx`;
  `libs/mobile/orders/ui/src/components/order-detail-metadata.tsx`;
  `libs/mobile/orders/ui/src/components/order-detail-line.tsx`;
  `libs/mobile/orders/ui/src/states/order-detail-state.tsx`;
  `libs/mobile/orders/feature/src/hooks/use-order-detail-controller.ts`;
  `libs/mobile/orders/feature/src/screens/order-detail-screen.tsx`;
  adjacent `*.spec.tsx` files
- **Test level:** component

## Work

- [x] Render read-only number/date/client/status, each product name/quantity/line
      amount and UAH total in a cart-like hierarchy without edit controls.
- [x] Render comment, 1С document number and accepted Kyiv time only when their
      mapped optional values exist.
- [x] Implement stable loading, recoverable error/retry, invalid/not-found copy
      and return action.
- [x] Provide accessible Ukrainian headings/row summaries, one scroll owner,
      central theme/typography and safe large-text wrapping.
- [x] Keep UI free of API/router/DTO dependencies; controller owns query result
      adaptation only.
- [x] Review changed implementation files for cohesive responsibility; separate
      row, state and screen orchestration responsibilities as planned.

## Evidence

- Test/path and observable assertion: detail UI/feature specs assert full/sparse
  details, no edit actions, loading/error/404/retry and accessibility semantics.
- Red command and expected behavioral failure: focused orders UI/feature tests
  fail because detail components/controller/screen are absent.
- Green command and result: `npx nx test mobile-orders-ui --runInBand` — detail
  full/sparse presentation is included in the passing 4-test suite.
- Refactor note and focused rerun: the view only composes summary, products and
  optional metadata sections; line rendering, unavailable state, controller and
  feature screen remain separate read-only responsibilities. Focused reruns pass.
- Regression command and result: orders UI/feature and all 20 Mobile suites pass.
- Manual/visual evidence, if required: long lines/comment and large text in
  `TS-010`.
- Deviation or blocker: physical long-content/large-text checks remain in TS-010.

## Checkpoint

The detail screen presents full/sparse authoritative data and all failure states
without any mutation or sync-retry affordance.
