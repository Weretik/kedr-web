# TS-002 — Implement the dedicated query and cache lifecycle

- **Task ID:** TS-002
- **Covers:** SC-001, SC-002, SC-003, SC-004, SC-005, SC-006, SC-007
- **Depends on:** TS-001
- **Exact paths:** `libs/mobile/catalog/data-access/src/api/catalog.api.ts`;
  `libs/mobile/catalog/data-access/src/api/missing-photo-products.requests.ts`;
  `libs/mobile/catalog/data-access/src/api/missing-photo-products.requests.spec.ts`;
  shared `pagination/catalog-pages.ts` and its existing spec;
  `libs/mobile/catalog/data-access/src/index.ts`
- **Test level:** focused integration + unit when paginated
- **Architecture baseline:** dedicated RTK Query endpoint injected into shared
  Mobile `baseApi`; normalized Axios errors/cancellation; private transport

## Work

- [x] Add exactly one GET endpoint for
      `/api/admin/products/missing-photos`, exporting its typed hook through the
      catalog data-access public entry point.
- [x] Send only request parameters declared by the synchronized generated
      operation and transform through TS-001 mapping.
- [x] Give the endpoint a cache identity distinct from ordinary catalog
      products and provide stable list/item tags supported by confirmed IDs.
- [x] If paginated, implement contract-defined query args, serialization,
      force-refetch and ID-based merge/reset behavior; otherwise add none of these.
- [x] Add focused tests for method/path, params/no-params, transform,
      cancellation-compatible base query behavior, refresh replacement and
      paginated merge/deduplication only when applicable.
- [x] Update the code audit and rerun forbidden direct transport/generated DTO
      export searches.
- [x] Verify changed implementation files each retain one cohesive
      responsibility; extract pagination from the endpoint file when it is an
      independent rule.

## Evidence

- Test/path and observable assertion: `missing-photo-products.requests.spec.ts`
  proves exact method/path/page parameters; `catalog-pages.spec.ts` proves
  page-one replacement and ID-based append/deduplication;
  `catalog.api.spec.ts` directly proves endpoint request, runtime transform and
  isolated list/item tags.
- Red command and expected behavioral failure:
  focused request spec against the initial stub; assertions failed on the wrong
  method/path/params.
- Green command and result: focused request spec; 2 tests passed.
- Refactor note and focused rerun: reused `mergeCatalogPages` instead of adding
  a parallel paginator; focused request and pagination tests passed.
- Regression command and result:
  `npx nx test mobile-catalog-data-access --runInBand`; 9 suites / 20 tests
  passed.
- Manual/visual evidence, if required: n/a.
- Code-audit finding: AF-003 verified. This was a missing-evidence gap; after an
  invalid harness attempt was corrected, the endpoint replacement test passed
  and is not claimed as behavioral Red.
- Deviation or blocker: the confirmed paginated response fits the existing
  catalog page merge primitive, so no feature-specific pagination file exists.

## Checkpoint

Focused tests prove an isolated endpoint uses only canonical request/response
types and applies exactly the confirmed cache/pagination lifecycle.
