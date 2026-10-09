# RM-003 — Establish one owner for order sync status

- **Findings:** AF-003
- **Requirements:** AR-001, AR-002
- **Depends on:** RM-001
- **Owner:** Mobile sales domains
- **Exact paths:** `libs/mobile/cart/model/src/lib/order-sync-status.ts`;
  `libs/mobile/orders/model/src/lib/order-sync-status.ts`; consumers, aliases,
  project config and tests; optional `libs/mobile/shared/model` only if justified

## Work

- [x] Choose canonical owner from actual consumers and contract meaning.
- [x] Move shared type/formatter without a compatibility cycle.
- [x] Remove cart-model→orders-model edge and duplicate exports.

## Verification

Model tests, TypeScript, alias/import search and Nx graph.

## Checkpoint

AF-003 verified when the concept has one owner and models do not cross domains.
