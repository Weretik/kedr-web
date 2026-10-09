# RM-008 — Narrow public entry points

- **Findings:** AF-008
- **Requirements:** AR-006
- **Depends on:** RM-002, RM-003, RM-004, RM-005, RM-006, RM-007
- **Owner:** affected library owners
- **Exact paths:** `libs/mobile/shared/api-client/src/index.ts`; Mobile domain
  data-access indexes; `libs/mobile/core/shell/src/index.ts`;
  `libs/admin/products/data-access/src/index.ts`; consumers/docs

## Work

- [x] Export only stable hooks/facades/providers/domain contracts.
- [x] Remove raw clients, interceptors, base-query implementation, DTO/mappers,
      storage and re-exported foreign model symbols.
- [x] Keep all consumers on exact root aliases; remove temporary compatibility.

## Verification

Export/import inventory, deep-import search, lint, source/test typecheck and builds.

## Checkpoint

AF-008 verified when private implementation is unreachable cross-library.
