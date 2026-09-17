# TS-004 — Admin order transport and idempotency

- **Task ID:** TS-004
- **Status:** complete
- **Covers:** SC-009–SC-013
- **Depends on:** EN-001, TS-001
- **Exact paths:** `libs/mobile/cart/data-access/src/`; order mapper/schema/API tests;
  `libs/mobile/cart/model/src/`; attempt-state unit tests
- **Test level:** unit and focused integration

## Work

- [x] Map domain cart/customer/comment to the generated `createAdminOrder`
      request and required UUID header, with amount equal to the complete line total.
- [x] Runtime-validate `200`/`201`, normalize `400`/`404`/`409` and preserve
      ambiguous network/5xx outcomes for explicit same-key retry.
- [x] Model an immutable create attempt whose key is reused only for unchanged
      canonical data and invalidated by any cart/form change.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md#behavioral-evidence).

- Test/path and observable assertion: mapper, attempt state and endpoint tests
  assert exact payload, headers, responses and error categories.
- Red command and expected behavioral failure: `npx nx test mobile-cart-data-access --runInBand`; missing create endpoint fails.
- Green command and result: model/data-access suites passed request, receipt and attempt assertions.
- Refactor note and focused rerun: generated DTO mapping and attempt state remain isolated; passed.
- Regression command and result: `npm run contracts:check && npm run test:mobile`; passed.
- Manual/visual evidence, if required: none.
- Deviation or blocker: production auth and backend stock enforcement are deferred.

## Checkpoint

One canonical create action produces one exact contract request and retains its
key only across a safe retry of unchanged data.
