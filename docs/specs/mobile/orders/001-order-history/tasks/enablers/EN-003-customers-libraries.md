# EN-003 — generate reusable customers library boundaries

- **Task ID:** EN-003
- **Enables:** SC-003–SC-005, SC-011
- **Depends on:** none
- **Exact paths:** `libs/mobile/customers/model/`;
  `libs/mobile/customers/data-access/`; `libs/mobile/customers/ui/`;
  `tsconfig.base.json`; `eslint.config.cjs`; root `package.json`
- **Test level:** integration

## Work

- [x] Generate customer model/data-access/ui libraries with Nx using aliases
      `@mobile/customers/{model,data-access,ui}` and matching scope/domain/type
      tags.
- [x] Add public `src/index.ts` and existing Jest/jest-expo/RNTL harness patterns
      without copying cart behavior yet.
- [x] Verify customers libraries do not depend on cart or orders feature/UI;
      cart and orders consume their root public APIs.
- [x] Inspect actual inferred targets with `npx nx show project <name> --json`
      and run harness smoke before behavioral migration.
- [x] Review changed implementation/configuration files for cohesive
      responsibility; split only when an architectural boundary requires it.

## Evidence

- Why behavioral Red is not meaningful: this task establishes reusable library
  infrastructure; `TS-004` owns behavior-preserving migration tests.
- Replacement command/check: Nx project inspection, affected lint and empty
  harness smoke.
- Result: generated and registered `mobile-customers-{model,data-access,ui}`;
  focused Jest targets and affected module-boundary lint pass.
- Enabled task IDs: TS-004.
- Deviation or blocker: do not create a broad `shared` customer bucket; these
  are business-domain libraries.

## Checkpoint

Customer projects expose correct public boundaries/targets and can be consumed
by both cart and orders without a cross-feature dependency.
