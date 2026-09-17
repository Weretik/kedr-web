# TS-003 — order detail transport and mapping

- **Task ID:** TS-003
- **Covers:** SC-012, SC-013, SC-015
- **Depends on:** EN-001, EN-002
- **Exact paths:** `libs/mobile/orders/data-access/src/contracts/order-detail.schema.ts`;
  `libs/mobile/orders/data-access/src/mappers/order-detail.mapper.ts`;
  `libs/mobile/orders/data-access/src/api/orders.api.ts`;
  `libs/mobile/orders/data-access/src/mappers/order-detail.mapper.spec.ts`;
  `libs/mobile/orders/data-access/src/api/order-detail.api.spec.ts`
- **Test level:** focused integration

## Work

- [x] Reference generated `getAdminOrderById` types in data-access and validate
      identity, counterparty, lines, total, sync and nullable optional fields.
- [x] Map to a read-only domain detail model without edit/create/sync commands.
- [x] Request only a positive integer `orderId`; distinguish normalized `404`
      from recoverable network/5xx and contract failures.
- [x] Preserve absent comment, document number and accepted time as optional
      values for conditional UI sections.
- [x] Review changed implementation files for cohesive responsibility and keep
      endpoint, schema and mapper concerns clear.

## Evidence

- Test/path and observable assertion: exact mapper/API specs prove full/sparse
  payloads, positive ID, 404 mapping and safe recoverable errors.
- Red command and expected behavioral failure: focused data-access Jest target
  fails because detail endpoint/schema/mapper are absent.
- Green command and result: `npx nx test mobile-orders-data-access --runInBand`
  — detail request/schema/mapper tests pass (part of 3 suites/10 tests).
- Refactor note and focused rerun: full/sparse DTO parsing remains private to
  data-access and returns the domain detail model; rerun passes.
- Regression command and result: contracts check, orders data-access tests and
  Mobile test typecheck; all pass.
- Manual/visual evidence, if required: n/a.
- Deviation or blocker: none; EN-001 proved anonymous provider security.

## Checkpoint

Detail data-access returns a validated read-only model and stable not-found/error
classification without exposing generated DTOs.
