# Phase 02 — state and data fetching

**Purpose:** provide one RTK Query-owned list lifecycle without duplicating
server rows in feature state.

## Planned work

- [TS-002 — dedicated missing-photo query](api/TS-002-missing-photo-query.md).
- [TS-003 — retry, refresh and pagination controller](state/TS-003-missing-photo-controller.md).

## Exit checkpoint

Initial load, success, empty, error, retry, refresh and contract-conditional
pagination have focused evidence; cache ownership remains in RTK Query.
