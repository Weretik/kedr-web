# TS-002 — order history transport and mapping

- **Task ID:** TS-002
- **Covers:** SC-001, SC-006–SC-010
- **Depends on:** EN-001, EN-002
- **Exact paths:** `libs/mobile/orders/data-access/src/contracts/order-history.schema.ts`;
  `libs/mobile/orders/data-access/src/mappers/order-history.mapper.ts`;
  `libs/mobile/orders/data-access/src/api/orders.api.ts`;
  `libs/mobile/orders/data-access/src/mappers/order-history.mapper.spec.ts`;
  `libs/mobile/orders/data-access/src/api/orders.api.spec.ts`
- **Test level:** focused integration

## Work

- [x] Reference generated `getAdminOrders` types only in data-access and validate
      the unknown page envelope/list items at runtime.
- [x] Map summary fields/pagination to orders domain models; keep
      `counterpartyName` from the order snapshot and avoid N+1 customer lookup.
- [x] Add RTK Query endpoint args `{counterpartyId?, page, pageSize:20}` that
      omit an empty filter, pass cancellation and return normalized errors.
- [x] Prove unknown customer produces a valid empty page and invalid contract
      data produces a safe contract error.
- [x] Review changed implementation files for cohesive responsibility and
      separate endpoint/schema/mapper concerns if they become mixed.

## Evidence

- Test/path and observable assertion: mapper/endpoint specs assert exact query
  params, omission, envelope metadata, newest-first pass-through and safe errors.
- Red command and expected behavioral failure: focused data-access Jest target
  fails because list endpoint/schema/mapper are absent.
- Green command and result: `npx nx test mobile-orders-data-access --runInBand`
  — list request/schema/mapper tests pass (part of 3 suites/10 tests).
- Refactor note and focused rerun: pure request builders were separated from
  RTK Query so transport arguments remain independently testable; rerun passes.
- Regression command and result: `npm run contracts:check`, orders data-access
  tests, `npm run typecheck:tests:mobile`; all pass.
- Manual/visual evidence, if required: n/a.
- Deviation or blocker: none; EN-001 proved anonymous provider security.

## Checkpoint

The typed/validated endpoint returns only mapped order summaries and pagination,
with focused evidence for filtered/unfiltered/empty/error requests.
