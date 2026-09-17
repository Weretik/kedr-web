# TS-001 — Product detail transport validation and mapping

- **Task ID:** TS-001
- **Covers:** SC-003, SC-005, SC-007, SC-008, SC-009
- **Depends on:** none
- **Exact paths:** `libs/mobile/catalog/data-access/src/contracts/public-product-details.dto.ts`; `libs/mobile/catalog/data-access/src/mappers/catalog-product-details.mapper.ts`; corresponding spec; `libs/mobile/catalog/model/src/entities/catalog-product-details.ts`
- **Test level:** unit

## Work

- [x] Derive DTO from `operations['getPublicProductBySlug']`, add compatible
      runtime validation and map every OpenAPI field to a Mobile model.
- [x] Normalize trimmed `photo`/`scheme` candidates without checking remote
      storage or exposing transport DTO through public feature/UI APIs.

## Evidence

- Test/path and observable assertion: mapper/schema specs cover every field,
  nullable price, empty images and malformed response.
- Red command and expected behavioral failure: generated placeholders had no
  product-detail DTO/model/mapper behavior.
- Green command and result: `npx nx test mobile-catalog-data-access -- --runInBand`
  passes 5 suites/8 tests; model tests pass in the full Mobile suite.
- Refactor note and focused rerun: runtime Zod validation stays beside the
  transport mapper; UI receives only `CatalogProductDetails`.
- Regression command and result: `npm run test:mobile` passes all 12 projects.
- Manual/visual evidence, if required: n/a
- Deviation or blocker: schema and mapper share one file to keep this small
  transport boundary cohesive.

## Checkpoint

Compile-time generated type and runtime schema feed one complete
`CatalogProductDetails` model with no invented description.
