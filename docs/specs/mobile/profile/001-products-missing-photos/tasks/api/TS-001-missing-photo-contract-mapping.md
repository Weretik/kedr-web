# TS-001 — Validate and map the confirmed response

- **Task ID:** TS-001
- **Covers:** SC-002, SC-003, SC-007, SC-008, SC-009
- **Depends on:** EN-001
- **Exact paths:**
  `libs/mobile/catalog/model/src/entities/missing-photo-product.ts` (only if
  `CatalogProduct`/`CatalogPage` cannot represent the contract);
  `libs/mobile/catalog/model/src/index.ts`;
  `libs/mobile/catalog/data-access/src/contracts/missing-photo-products.dto.ts`;
  `libs/mobile/catalog/data-access/src/contracts/missing-photo-products.schema.ts`;
  `libs/mobile/catalog/data-access/src/mappers/missing-photo-products.mapper.ts`;
  `libs/mobile/catalog/data-access/src/mappers/missing-photo-products.mapper.spec.ts`
- **Test level:** unit
- **Architecture baseline:** `mobile-catalog-data-access` owns generated DTO,
  Zod parsing and mapping; `mobile-catalog-model` remains transport-free

## Work

- [x] Add a type-only alias to the exact generated operation response and a
      runtime schema matching only its confirmed success shape.
- [x] Map every returned item once to the existing `CatalogProduct` projection
      when valid; otherwise create the smallest domain projection needed by the
      verified contract and UI.
- [x] Do not inspect photo fields to decide membership; do not fabricate name,
      price, availability, image or slug values absent from the contract.
- [x] Add unit cases for valid response, empty response, invalid response and
      route identifier present/absent as actually permitted by the schema.
- [x] Update the code audit and verify generated imports do not escape
      data-access or leak through a public barrel.
- [x] Verify changed implementation files each retain one cohesive
      responsibility; split schema, mapper and model when responsibilities differ.

## Evidence

- Test/path and observable assertion:
  `missing-photo-products.mapper.spec.ts` validates exact mapping/empty/reject
  behavior without client photo filtering.
- Red command and expected behavioral failure:
  `npx nx test mobile-catalog-data-access --runInBand --testPathPattern=missing-photo-products.mapper.spec.ts`;
  fails because the mapper/schema do not exist.
- Green command and result: same focused mapper command; 5 tests passed after
  AF-002 added exact OpenAPI integer rejection and AF-004 added RFC 3339 offset
  compatibility for the backend `DateTimeOffset` value.
- Refactor note and focused rerun: DTO alias, schema and mapper remain separate;
  focused tests passed after refactor.
- Regression command and result:
  `npx nx test mobile-catalog-data-access --runInBand`; 9 suites / 20 tests
  passed.
- Manual/visual evidence, if required: n/a.
- Code-audit findings: AF-002 and AF-004 verified; fractional integer and
  `DateTimeOffset` `+00:00` fixtures were Red, exact integer validation and
  offset-aware `date-time` validation made them Green; affected regression and
  test typecheck passed.
- Deviation or blocker: none; required `productSlug` selected the supported
  navigation branch.

## Checkpoint

Confirmed successful and invalid responses have unit evidence, and consumers
receive only a transport-free domain projection.
