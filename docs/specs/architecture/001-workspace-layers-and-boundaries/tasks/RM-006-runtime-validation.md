# RM-006 — Complete runtime response validation

- **Findings:** AF-006
- **Requirements:** AR-004
- **Depends on:** EN-001, EN-003
- **Owner:** Mobile catalog and Storefront data-access
- **Exact paths:** `libs/mobile/catalog/data-access/src/{api,contracts,mappers}`;
  `libs/storefront/data-access/src/lib/{catalog,checkout}`; focused tests

## Work

- [x] Accept external responses as unknown at validation boundaries.
- [x] Add schemas/parsers for catalog list/categories and Storefront responses.
- [x] Normalize validation failures through each client's error contract.

## Verification

Invalid-payload tests, validator search, relevant source/test typecheck and builds.

## Checkpoint

AF-006 verified when every consumed response validates before domain mapping.
