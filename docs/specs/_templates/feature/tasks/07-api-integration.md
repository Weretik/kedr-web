# Phase 07 — API integration

**Purpose:** orchestrate frontend contract, validation, mapping, transport and
error behavior.

## Planned subphases

- Resolve the stable `operationId` in the versioned OpenAPI snapshot and link
  its consumer projection from `docs/contracts/<module>/`.
- Generate transport types through `npm run contracts:generate`; do not create
  parallel handwritten request/response schemas.
- Keep generated imports inside transport/data-access and map responses to the
  application/domain model before returning them to feature code.
- Separate `TS-*` files for contract projection, request behavior, response
  mapping and user-facing failure behavior when their risks differ.
- Shared transport or fixture setup belongs in `EN-*`.

## Exit checkpoint

`npm run contracts:check` passes. Contract assumptions, generated type
references, mapper behavior and focused integration evidence are traceable to
each affected scenario.
