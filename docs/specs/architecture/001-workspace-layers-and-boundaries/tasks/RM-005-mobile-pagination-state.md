# RM-005 — Give paged server data one owner

- **Findings:** AF-005
- **Requirements:** AR-003
- **Depends on:** EN-001, RM-001
- **Owner:** Mobile catalog/orders
- **Exact paths:** `libs/mobile/catalog/feature/src/hooks/use-catalog-controller.ts`;
  `libs/mobile/orders/feature/src/hooks/use-order-history-pages.ts`; pagination
  state, data-access endpoints and focused tests

## Work

- [x] Move accumulation/merge ownership to approved RTK/data layer strategy.
- [x] Keep query/filter/page intent in feature without duplicating server records.
- [x] Preserve refresh, filter reset, load-more and retry behavior.

## Verification

Focused pagination/controller tests, `useState` server-copy search, Mobile regression.

## Checkpoint

AF-005 verified when no feature-local array duplicates RTK query results.
