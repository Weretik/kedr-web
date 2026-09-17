# EN-002 — Generate the cart UI library boundary

- **Task ID:** EN-002
- **Status:** complete
- **Enables:** SC-002–SC-013
- **Depends on:** none
- **Exact paths:** `libs/mobile/cart/ui/`; `tsconfig.base.json`;
  `apps/mobile/metro.config.js`; affected Jest alias configuration
- **Test level:** generated verification

## Work

- [x] Use the matching Nx React Native library generator to create
      `mobile-cart-ui` with `scope:mobile`, `domain:cart`, `type:ui` tags and a root
      public API.
- [x] Configure existing test aliases/mocks needed for Paper, ActionSheet and
      FlashList; do not install a replacement UI package.
- [x] Verify the project graph permits feature → ui and ui → model while ui has
      no API, storage or router dependency.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md#automated-verification).

- Why behavioral Red is not meaningful: the library boundary must exist before
  component behavior can be tested.
- Replacement command/check: generator dry-run/output review,
  `npx nx show project mobile-cart-ui --json`, project graph and initial test target.
- Result: Nx-generated `mobile-cart-ui` has working lint/test targets, public
  exports and permitted UI → model dependencies.
- Enabled task IDs: TS-005, TS-006.
- Deviation or blocker: none; all runtime packages are already installed.

## Checkpoint

The generated UI project has a working Jest target, public root export and
passes dependency constraints without new packages.
