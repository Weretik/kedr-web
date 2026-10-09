# Phase 07 — API integration

**Purpose:** consume the provider-owned operation through generated types,
runtime validation and a Mobile domain mapping.

## Planned work

- [EN-001 — synchronize API contract](enablers/EN-001-sync-missing-photo-contract.md).
- [TS-001 — runtime validation and mapping](api/TS-001-missing-photo-contract-mapping.md).
- [TS-002 — RTK Query endpoint](api/TS-002-missing-photo-query.md).

## Exit checkpoint

`contracts:check` passes; the query sends only generated request fields, trusts
endpoint membership semantics and never exposes DTOs outside data-access.
