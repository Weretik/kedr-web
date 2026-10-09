# EN-001 — Synchronize the missing-photo products contract

- **Task ID:** EN-001
- **Enables:** SC-001–SC-009
- **Depends on:** none
- **Exact paths:** `docs/contracts/openapi/`; `docs/contracts/openapi/SOURCE.md`;
  `libs/shared/api-contracts/src/generated/kedr-api.ts`;
  `docs/contracts/README.md`; `docs/contracts/catalog/missing-photo-products.md`;
  `docs/specs/mobile/profile/001-products-missing-photos/contracts/api-contract.md`
- **Test level:** generated verification + documentation
- **Architecture baseline:** provider-owned OpenAPI snapshot → generated
  `@shared/api-contracts` → private catalog data-access projection; no AF/RM

## Work

- [x] Obtain a clean KedrStore checkout whose canonical OpenAPI publishes
      `GET /api/admin/products/missing-photos`; backend authoring is outside this
      frontend feature.
- [x] Run `npm run contracts:sync -- <clean-KedrStore-path>` and record the new
      provider commit in `SOURCE.md`.
- [x] Confirm stable `operationId`, access/security, request parameters,
      success schema, expected errors and whether pagination exists; do not infer
      any field from `getAdminProducts`.
- [x] Add the operation registry row and
      `docs/contracts/catalog/missing-photo-products.md` consumer projection.
- [x] Run `npm run contracts:lint`, `npm run contracts:generate` and
      `npm run contracts:check`; update the feature-local API contract with exact
      generated references and record the expected dirty-diff result honestly.
- [x] Update the feature code audit; the absent operation remains a blocking
      prerequisite until all checks pass.
- [x] Verify changed implementation files, if any, each retain one cohesive
      responsibility; split only along current architecture boundaries when a
      file combines independent responsibilities.

## Evidence

- Why behavioral Red is not meaningful: no generated operation exists, so a
  behavioral test could only fail through a fabricated transport contract.
- Replacement command/check: current `rg` over OpenAPI/generated types and
  `npm run contracts:check` after provider sync.
- Result: synchronized clean KedrStore commit `424d65a`; confirmed operation
  `getAdminProductsWithUnavailablePhotos`, page/pageSize pagination,
  `MissingProductPhotoPage`, temporary anonymous access and required
  `productSlug`. Lint passed with six documented upstream warnings; generation
  succeeded and a second generation produced the same hash.
- Enabled task IDs: TS-001, transitively TS-002–TS-007.
- Deviation or blocker: `npm run contracts:check` exits `1` only at its final
  `git diff --exit-code` step because the synchronized generated file is an
  intentional uncommitted delivery change. Frontend YAML changed only through
  `contracts:sync`; lint/generation themselves pass.

## Checkpoint

The synchronized snapshot and generated types expose one stable operation;
pagination/navigation decisions reference its exact generated types. A clean
post-commit checkout must rerun `contracts:check` to close the final diff gate.
