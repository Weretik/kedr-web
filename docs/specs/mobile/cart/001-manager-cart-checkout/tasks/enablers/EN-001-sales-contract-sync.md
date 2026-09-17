# EN-001 — Refresh Sales OpenAPI and consumer projection

- **Task ID:** EN-001
- **Status:** complete
- **Enables:** SC-006–SC-013
- **Depends on:** none
- **Exact paths:** `docs/contracts/openapi/`; `docs/contracts/openapi/SOURCE.md`;
  `libs/shared/api-contracts/src/generated/kedr-api.ts`;
  `docs/contracts/sales/manager-order.md`; `docs/contracts/README.md`
- **Test level:** generated verification and documentation

## Work

- [x] Sync the frontend snapshot from a clean `KedrStore` checkout containing
      backend commit `1a9e2a6864f2c527fb333276bd0346f21be701f0` or a reviewed descendant.
- [x] Confirm generated operations `getAdminCustomers` and `createAdminOrder`,
      document request/error/idempotency decisions in the Sales consumer projection
      and link it from the registry.
- [x] Run contract lint, generation and clean-diff verification without editing
      machine-owned YAML or generated TypeScript by hand.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md#automated-verification).

- Why behavioral Red is not meaningful: this task refreshes machine contracts
  and documentation before a transport consumer exists.
- Replacement command/check: `npm run contracts:sync -- <clean KedrStore>`;
  `npm run contracts:lint`; `npm run contracts:generate`;
  `npm run contracts:check`; generated operation inspection.
- Result: synchronized from backend commit `1a9e2a6864f2c527fb333276bd0346f21be701f0`;
  generated operations and Sales projection verified; contract check passed.
- Enabled task IDs: TS-003, TS-004.
- Deviation or blocker: frontend snapshot currently records the prior backend commit.

## Checkpoint

The generated contract exposes both required named operations and the Sales
consumer projection states the agreed mapping without handwritten schemas.
