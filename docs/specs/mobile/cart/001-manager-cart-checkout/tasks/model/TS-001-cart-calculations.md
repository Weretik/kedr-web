# TS-001 — Cart mutations, totals and stock boundary

- **Task ID:** TS-001
- **Status:** complete
- **Covers:** SC-003–SC-005
- **Depends on:** none
- **Exact paths:** `libs/mobile/cart/model/src/lib/cart.ts`;
  `libs/mobile/cart/model/src/lib/cart.spec.ts`; `libs/mobile/cart/model/src/index.ts`
- **Test level:** unit

## Work

- [x] Add pure increment, decrement, remove and clear operations with positive
      integer quantity and last-known stock constraints.
- [x] Add deterministic two-decimal line and order totals; keep unit price
      immutable and preserve one row per product ID.
- [x] Cover maximum stock, quantity one, removal, zero-price and decimal totals.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md#behavioral-evidence).

- Test/path and observable assertion: cart model specs prove SC-003–SC-005 invariants.
- Red command and expected behavioral failure: `npx nx test mobile-cart-model --runInBand`; missing mutation/total behavior fails.
- Green command and result: `mobile-cart-model:test`; 13 tests passed.
- Refactor note and focused rerun: pure money/quantity operations retained in model; passed.
- Regression command and result: `npm run test:mobile`; passed all 13 projects.
- Manual/visual evidence, if required: none.
- Deviation or blocker: last-known stock is not authoritative backend stock.

## Checkpoint

Pure cart operations cannot produce an invalid quantity and return stable line
and order totals for UI and order mapping.
