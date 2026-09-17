# TS-005 — Product detail content and page states

- **Task ID:** TS-005
- **Covers:** SC-003, SC-006, SC-007, SC-008, SC-009, SC-011, SC-012
- **Depends on:** TS-002, TS-004
- **Exact paths:** `libs/mobile/catalog/ui/src/components/product-details/product-details-view.tsx`; `libs/mobile/catalog/ui/src/states/product-details-state.tsx`; `libs/mobile/catalog/feature/src/screens/product-details-screen.tsx`; component specs; public indexes
- **Test level:** component

## Work

- [x] Build the quiet themed layout from the visual contract and display every
      mapped API field with Ukrainian labels and correct nullable price/stock state.
- [x] Compose loading, not-found, offline, retryable error and invalid-link
      states with Back/retry actions and no raw error details.

## Evidence

- Test/path and observable assertion: all field labels/values, skeleton, every
  state/action, light/dark tokens and accessible reading order.
- Red command and expected behavioral failure: no detail view/state components
  or feature orchestration existed.
- Green command and result: view specs assert every mapped field; feature specs
  pass loading, offline, 404, retry, invalid-link and disabled-action cases.
- Refactor note and focused rerun: UI is router/transport independent; safe-area
  padding and Paper theme tokens are applied at the sticky action bar.
- Regression command and result: full Mobile Jest, lint, typecheck and Metro
  exports pass.
- Manual/visual evidence, if required: TS-008.
- Deviation or blocker: device theme/text-scale checks remain in TS-008.

## Checkpoint

The exported screen presents the complete API model and every required state in
Ukrainian without importing router or transport types into UI.
