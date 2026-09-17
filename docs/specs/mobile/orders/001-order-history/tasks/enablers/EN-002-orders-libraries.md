# EN-002 — generate Mobile orders library boundaries

- **Task ID:** EN-002
- **Enables:** SC-001–SC-015
- **Depends on:** none
- **Exact paths:** `libs/mobile/orders/model/`;
  `libs/mobile/orders/data-access/`; `libs/mobile/orders/ui/`;
  `libs/mobile/orders/feature/`; `tsconfig.base.json`; `eslint.config.cjs`;
  root `package.json`
- **Test level:** integration

## Work

- [x] Generate orders libraries with Nx using aliases
      `@mobile/orders/{model,data-access,ui,feature}` and tags
      `scope:mobile`, `domain:orders`, and the matching `type:*`.
- [x] Add root public `src/index.ts`, Jest/jest-expo/RNTL setup appropriate to
      each boundary, and no placeholder business implementation.
- [x] Verify module-boundary direction: feature → ui/data-access/model,
      data-access → model/shared API, ui → model; no deep imports.
- [x] Run `npx nx show project <name> --json` for all four projects and record
      actual inferred `lint`/`test` targets before dependent tasks use them.
- [x] Run initial lint/test harness smoke and record any setup blocker separately
      from behavioral Red.
- [x] Review changed implementation/configuration files for cohesive
      responsibility; split only when an architectural boundary requires it.

## Evidence

- Why behavioral Red is not meaningful: this task creates empty library/test
  boundaries before product behavior exists.
- Replacement command/check: Nx project inspection, module-boundary lint and
  one harness smoke per generated test target.
- Result: generated and registered `mobile-orders-{model,data-access,ui,feature}`;
  `nx show project`, affected lint, focused Jest targets, Mobile typecheck and
  Expo export pass.
- Enabled task IDs: TS-001, TS-002, TS-003.
- Deviation or blocker: none; npm 11 and Nx 23.2.0 were used.

## Checkpoint

Four projects have correct aliases/tags/public APIs and verified inferred
targets without cyclic or cart/catalog dependencies.
