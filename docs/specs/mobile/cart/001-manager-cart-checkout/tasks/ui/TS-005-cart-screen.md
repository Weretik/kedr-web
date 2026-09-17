# TS-005 — Cart screen and item interactions

- **Task ID:** TS-005
- **Status:** complete
- **Covers:** SC-002–SC-005
- **Depends on:** EN-002, TS-001, TS-002
- **Exact paths:** `libs/mobile/cart/ui/src/`; component specs;
  `libs/mobile/cart/feature/src/screens/cart-screen.tsx`; focused screen spec
- **Test level:** component

## Work

- [x] Build restoring, empty, populated and storage-error presentations with a
      FlashList, corporate Paper theme and goods-only total.
- [x] Build accessible product rows using existing image/Paper primitives,
      quantity controls with stock-disabled state and an explicit delete action.
- [x] Keep the checkout action visible/reachable and disabled when cart is empty
      or not ready; presentational UI accepts only domain data and callbacks.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md#behavioral-evidence).

- Test/path and observable assertion: UI/screen specs cover SC-002–SC-005,
  labels, disabled states and recalculated totals.
- Red command and expected behavioral failure: `npx nx test mobile-cart-ui --runInBand`; missing screen components fail.
- Green command and result: `mobile-cart-ui:test`; 6 tests passed.
- Refactor note and focused rerun: UI consumes only domain data/callbacks; passed.
- Regression command and result: `npm run test:mobile`; passed all 13 projects.
- Manual/visual evidence, if required: TS-009.
- Deviation or blocker: none.

## Checkpoint

A manager can review and edit every cart row within stock limits and always see
the matching goods total without API, storage or router imports in cart UI.
