# TS-003 — Customer list and local name search

- **Task ID:** TS-003
- **Status:** complete
- **Covers:** SC-006, SC-007
- **Depends on:** EN-001
- **Exact paths:** `libs/mobile/cart/data-access/src/`; focused endpoint/schema tests;
  `libs/mobile/cart/model/src/`; local search unit tests
- **Test level:** unit and focused integration

## Work

- [x] Inject the generated `getAdminCustomers` endpoint into the shared RTK
      Query base API, runtime-validate responses and map private DTOs to cart models.
- [x] Request `pageSize=100`, load any unexpected additional pages, deduplicate
      by counterparty ID and expose loading/error/retry/completeness state.
- [x] Implement trimmed case-insensitive local name matching over the complete
      in-memory list; do not persist customer PII.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md#behavioral-evidence).

- Test/path and observable assertion: mapper/schema/search tests and endpoint
  integration prove complete local results and safe failures.
- Red command and expected behavioral failure: affected cart data/model tests fail before the endpoint/search exists.
- Green command and result: cart model/data-access suites passed search, paging and deduplication.
- Refactor note and focused rerun: runtime contract and paging orchestration remain separate; passed.
- Regression command and result: `npm run test:mobile`; passed all 13 projects.
- Manual/visual evidence, if required: selector behavior in TS-009.
- Deviation or blocker: server-side search is deliberately out of scope.

## Checkpoint

The selector receives one deduplicated complete customer collection and a pure
local search that cannot silently search only the first partial page.
