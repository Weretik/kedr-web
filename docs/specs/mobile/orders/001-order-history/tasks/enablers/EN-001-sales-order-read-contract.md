# EN-001 — refresh anonymous Sales order-read contract

- **Task ID:** EN-001
- **Enables:** SC-001–SC-015
- **Depends on:** none
- **Exact paths:** clean KedrStore `docs/sdd/contracts/openapi.yaml`;
  `docs/contracts/openapi/`; `docs/contracts/openapi/SOURCE.md`;
  `libs/shared/api-contracts/src/generated/kedr-api.ts`;
  `docs/contracts/README.md`; `docs/contracts/sales/manager-order.md`
- **Test level:** generated verification

## Work

- [x] Obtain a clean KedrStore checkout whose canonical OpenAPI reflects
      `AllowAnonymous` on `getAdminOrders` and `getAdminOrderById`.
- [x] Run `npm run contracts:sync -- <clean-path-to-KedrStore>`; do not edit
      frontend YAML manually.
- [x] Verify stable operation IDs, list/detail fields, pagination and anonymous
      security in the refreshed snapshot.
- [x] Run lint/generation/check and update the Sales consumer projection and
      operation registry to the verified provider behavior.
- [x] Verify generated imports remain limited to transport/data-access.
- [x] Review changed implementation/generated files for cohesive responsibility;
      split only when an existing architectural boundary requires it.

## Evidence

- Why behavioral Red is not meaningful: list/detail implementation must not be
  written against a known-stale security contract.
- Replacement command/check: `npm run contracts:sync -- <path>`;
  `npm run contracts:lint`; `npm run contracts:generate`;
  `npm run contracts:check`; inspect `operations['getAdminOrders']` and
  `operations['getAdminOrderById']`.
- Result: passed from clean KedrStore commit
  `364b5f12d18cddb6efc800263581b23d25b6e484`; snapshot exposes anonymous
  order reads, generation is stable, and `contracts:check` exits 0 with six
  recorded provider warnings.
- Enabled task IDs: TS-002, TS-003, TS-004.
- Deviation or blocker: none. Redocly reports one existing ambiguous catalog
  path warning and five anonymous-operation security warnings; none is a schema
  or generation failure.

## Checkpoint

The checked-in snapshot/generated types prove anonymous list/detail operations,
`contracts:check` passes, and projection/registry match the provider commit.
