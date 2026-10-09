# EN-001 — Characterization baseline before structural moves

- **Enables:** RM-002, RM-005, RM-006, RM-007, RM-008
- **Depends on:** RM-000
- **Owner:** affected client owners
- **Exact paths:** existing Admin/Mobile specs; new focused tests beside affected
  store, pagination, mapping/cache code; package test scripts if coverage expands

## Work

- [x] Record current route/state/query/error behavior for each affected flow.
- [x] Add missing focused tests for Mobile store composition, pagination merge/
      reset/refetch, invalid payload and cache freshness.
- [x] Add Admin characterization where an RM moves code currently lacking tests.

## Evidence

- Behavioral Red is not applicable to characterization of existing behavior.
- Replacement: focused Mobile store, pagination, mapping and cache tests pass;
  Admin regression tests also pass.

## Checkpoint

Every RM move has an executable before/after regression test.
