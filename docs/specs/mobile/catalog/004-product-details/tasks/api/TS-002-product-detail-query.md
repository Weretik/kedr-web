# TS-002 — Product detail query orchestration and states

- **Task ID:** TS-002
- **Covers:** SC-003, SC-006, SC-007, SC-008, SC-009
- **Depends on:** TS-001
- **Exact paths:** `libs/mobile/catalog/data-access/src/api/catalog.api.ts`; focused endpoint spec; `libs/mobile/catalog/data-access/src/index.ts`
- **Test level:** focused integration

## Work

- [x] Add `getCatalogProductBySlug` to existing `baseApi` with fixed `uk`,
      `priceTypeId=11`, response validation/mapping and slug-based cache key.
- [x] Normalize 404, offline and retryable failures into states consumable by
      the detail feature; skip the query for an invalid slug.

## Evidence

- Test/path and observable assertion: request parameters, mapping, skip, 404,
  offline and retry/refetch behavior.
- Red command and expected behavioral failure: no endpoint or slug request
  mapper existed.
- Green command and result: `product-details-query.mapper.spec.ts` proves the
  encoded `/api/catalog/uk/product/{slug}` URL and `priceTypeId=11`; screen
  specs prove skip/404/offline/retry states.
- Refactor note and focused rerun: request construction was extracted into a
  pure mapper and the endpoint remains in the existing injected `catalogApi`.
- Regression command and result: data-access and feature Jest suites pass.
- Manual/visual evidence, if required: n/a
- Deviation or blocker: none.

## Checkpoint

The public hook returns only the Mobile model/safe error states and never
exposes generated transport details.
