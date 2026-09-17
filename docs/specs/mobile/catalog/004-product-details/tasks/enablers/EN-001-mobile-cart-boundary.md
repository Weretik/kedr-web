# EN-001 — Minimal persistent Mobile cart boundary

- **Task ID:** EN-001
- **Enables:** SC-010, SC-011
- **Depends on:** none
- **Exact paths:** `libs/mobile/cart/model/`; `libs/mobile/cart/data-access/`; corresponding project/test configs and public `src/index.ts`
- **Test level:** generated verification and focused integration

## Work

- [x] Use matching Nx CLI generators to create `mobile-cart-model` and
      `mobile-cart-data-access`; do not hand-build project scaffolding.
- [x] Define the minimum local cart port: add one line, increment same product
      ID, reject missing price/unavailable stock and persist through AsyncStorage.
- [x] Keep cart UI, checkout and server sync outside these libraries and this
      feature.

## Evidence

- Why behavioral Red is not meaningful: dependent product-detail code cannot
  import a Mobile cart boundary that does not yet exist.
- Replacement command/check: generator dry-run/output review, project graph,
  `npx nx test mobile-cart-model --runInBand` and cart data-access focused test.
- Result: Nx generated model/data-access/feature boundaries; model and storage
  tests pass in `npm run test:mobile` (12 projects).
- Enabled task IDs: TS-006
- Deviation or blocker: added a thin `mobile-cart-feature` export boundary so
  the app obeys the existing `type:app → type:feature` Nx constraint.

## Checkpoint

Public cart add command has tested increment/persistence semantics and depends
on no catalog feature or UI code.
