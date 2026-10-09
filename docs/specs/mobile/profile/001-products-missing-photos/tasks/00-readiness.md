# Phase 00 — readiness

**Purpose:** establish an executable API and architecture baseline before
behavioral implementation.

## Planned work

- [EN-001 — synchronize missing-photo API contract](enablers/EN-001-sync-missing-photo-contract.md).
- Reconfirm Nx graph/tags, public barrels, target list and absence of Mobile E2E.
- Resolve response, access, pagination and route identifier without handwritten
  transport fields.

## Exit checkpoint

The provider snapshot, generated operation and consumer projection are stable;
every dependent task has exact types, paths and test target. The standalone
lint/generate gates pass; the aggregate `contracts:check` reports only the
expected uncommitted generated diff created by the synchronization.
