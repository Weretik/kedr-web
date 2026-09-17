# TS-006 — Add-to-cart action and confirmation

- **Task ID:** TS-006
- **Covers:** SC-010, SC-011
- **Depends on:** EN-001, TS-005
- **Exact paths:** `libs/mobile/catalog/feature/src/screens/product-details-screen.tsx`; focused feature spec; cart public command imported from `@mobile/cart/data-access`
- **Test level:** component

## Work

- [x] Connect one accessible cart action to the cart port, adding/incrementing
      only a product with numeric price and positive stock.
- [x] Show Paper Snackbar success and visible Ukrainian disabled reasons without
      creating a quantity sheet or navigating to a cart screen.

## Evidence

- Test/path and observable assertion: first add, repeated increment, success
  announcement, null-price and zero-stock rejection.
- Red command and expected behavioral failure: no Mobile cart boundary or
  detail action existed.
- Green command and result: cart model proves first add/repeated increment and
  eligibility; feature specs prove one command, Snackbar and null-price/zero-stock rejection.
- Refactor note and focused rerun: persistence is isolated in cart data-access;
  product detail passes a minimal cart input.
- Regression command and result: `npm run test:mobile` passes all 12 projects.
- Manual/visual evidence, if required: action states in TS-008.
- Deviation or blocker: none.

## Checkpoint

One tap causes exactly one cart increment and each ineligible state causes none.
