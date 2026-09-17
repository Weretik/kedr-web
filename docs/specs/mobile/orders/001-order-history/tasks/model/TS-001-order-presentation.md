# TS-001 — localized order presentation rules

- **Task ID:** TS-001
- **Covers:** SC-002, SC-013
- **Depends on:** EN-002
- **Exact paths:** `libs/mobile/orders/model/src/lib/order-sync-status.ts`;
  `libs/mobile/orders/model/src/lib/order-formatters.ts`;
  `libs/mobile/orders/model/src/lib/order-sync-status.spec.ts`;
  `libs/mobile/orders/model/src/lib/order-formatters.spec.ts`;
  `libs/mobile/cart/model/src/lib/order-sync-status.ts`;
  `libs/mobile/cart/model/src/lib/order-sync-status.spec.ts`
- **Test level:** unit

## Work

- [x] Establish one orders-owned status vocabulary/semantic kind for all seven
      API values and migrate cart to consume it without duplicating labels.
- [x] Format finite amounts as `uk-UA` UAH with `грн.` and two decimals.
- [x] Format valid UTC timestamps in `Europe/Kyiv` as `dd.MM.yyyy, HH:mm`.
- [x] Implement Ukrainian position pluralization for values such as 1, 2 and 5.
- [x] Define safe behavior for invalid mapped input without leaking raw values.
- [x] Review changed implementation files for cohesive responsibility; split
      independent status/format concerns as planned and avoid arbitrary splitting.

## Evidence

- Test/path and observable assertion: exact specs above assert every status,
  semantic kind, money/date examples, DST-safe Kyiv output and plural forms.
- Red command and expected behavioral failure: run the focused orders model
  target; formatters/status owner do not yet exist.
- Green command and result: `npx nx test mobile-orders-model --runInBand` —
  3 suites/16 tests pass.
- Refactor note and focused rerun: cart now re-exports the orders-owned status
  vocabulary; orders and cart model suites pass after the ownership move.
- Regression command and result: orders/cart model tests and
  `npm run typecheck:tests:mobile`; all pass.
- Manual/visual evidence, if required: n/a.
- Deviation or blocker: none after `EN-002`.

## Checkpoint

One tested public vocabulary/formatter API produces all agreed Ukrainian values
and cart no longer owns a parallel status dictionary.
