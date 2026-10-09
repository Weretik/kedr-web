# RM-004 — Separate Storefront transport DTO from domain contracts

- **Findings:** AF-004
- **Requirements:** AR-004
- **Depends on:** EN-003, RM-001
- **Owner:** Storefront catalog/checkout
- **Exact paths:** `libs/storefront/contracts/src`; `libs/storefront/data-access/src`;
  `libs/storefront/feature/catalog/src`; related barrels/tests/docs

## Work

- [x] Keep generated operation types private in data-access.
- [x] Validate/map to domain-facing contract names without `Dto` leakage.
- [x] Migrate feature signatures and remove compatibility exports.

## Verification

Focused mapper tests, DTO/generated import search, Storefront lint and build.

## Checkpoint

AF-004 verified when feature imports only domain-facing types.
