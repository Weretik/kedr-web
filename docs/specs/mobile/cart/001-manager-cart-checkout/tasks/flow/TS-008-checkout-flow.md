# TS-008 — Checkout submit and success lifecycle

- **Task ID:** TS-008
- **Status:** complete
- **Covers:** SC-009–SC-013
- **Depends on:** TS-002, TS-004, TS-006
- **Exact paths:** `libs/mobile/cart/feature/src/`; checkout controller/screen specs;
  `libs/mobile/cart/feature/src/index.ts`
- **Test level:** focused integration and component

## Work

- [x] Orchestrate local validation, immutable attempt creation, one pending
      mutation and disabled duplicate submit while preserving form/cart on failure.
- [x] Map normalized field/business errors, reuse the same attempt after an
      ambiguous unchanged failure and invalidate it after any payload change.
- [x] On `200`/`201`, prevent further submit, present order number plus
      `Pending`, clear memory/storage and close checkout; treat cleanup failure as a
      local warning without retrying the confirmed order.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md#behavioral-evidence).

- Test/path and observable assertion: controller/screen specs prove exact once,
  safe retry, preserved errors, success receipt and cleanup failure behavior.
- Red command and expected behavioral failure: `npx nx test mobile-cart-feature --runInBand`; checkout flow is absent.
- Green command and result: `mobile-cart-feature:test`; 6 tests passed, including success and same-key retry.
- Refactor note and focused rerun: form, attempt and transport concerns remain separated; passed.
- Regression command and result: `npm run test:mobile`; passed all 13 projects.
- Manual/visual evidence, if required: TS-009.
- Deviation or blocker: no sync polling or auth behavior is included.

## Checkpoint

Every user submit has an unambiguous attempt/key lifecycle, and a confirmed
order can never be recreated because local cleanup failed.
