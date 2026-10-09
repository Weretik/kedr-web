# RM-007 — Define RTK cache and invalidation semantics

- **Findings:** AF-007
- **Requirements:** AR-005
- **Depends on:** EN-001, RM-003
- **Owner:** Admin/Mobile data-access
- **Exact paths:** `libs/{admin,mobile}/shared/api-client/src/rtk-query/base-api.ts`;
  domain endpoint files and focused cache tests

## Work

- [x] Define stable tag types and query cache identities where mutations affect reads.
- [x] Add invalidation/refetch behavior for create/update flows in scope.
- [x] Record intentional no-invalidation cases in consumer contracts.

## Verification

Focused endpoint/cache tests; tag search; Admin/Mobile regression.

## Checkpoint

AF-007 verified when freshness behavior is explicit and executable.
