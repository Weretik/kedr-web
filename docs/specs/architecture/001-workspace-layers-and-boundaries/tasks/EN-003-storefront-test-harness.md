# EN-003 — Storefront focused test harness

- **Enables:** RM-004, RM-006
- **Depends on:** RM-000
- **Owner:** Storefront
- **Exact paths:** Storefront Nx/test config and focused mapper/repository specs;
  `package.json`; `docs/standards/shared/testing-rules.md`

## Work

- [x] Select existing Angular-compatible runner already supported by workspace.
- [x] Add executable target and test typecheck for mapper/runtime validation risk.
- [x] Prove one focused test runs; avoid claiming full Storefront coverage.

## Evidence

- Behavioral Red is not applicable to harness setup.
- Replacement: `npm run test:storefront` runs six focused tests in three files;
  `npm run typecheck:tests:storefront` passes.

## Checkpoint

Storefront structural DTO/validation work has an executable safety net.
