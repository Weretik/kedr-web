# TS-002 — Persistent cart lifecycle and cleanup

- **Task ID:** TS-002
- **Status:** complete
- **Covers:** SC-001, SC-003, SC-005, SC-012, SC-013
- **Depends on:** TS-001
- **Exact paths:** `libs/mobile/cart/data-access/src/lib/cart-storage.ts`;
  `libs/mobile/cart/data-access/src/lib/cart-storage.spec.ts`;
  `libs/mobile/cart/data-access/src/lib/cart-context.tsx`; focused provider spec
- **Test level:** focused integration

## Work

- [x] Extend the cart provider port with increment, decrement, remove and a
      result-bearing clear operation while preserving existing add/restore behavior.
- [x] Persist every accepted mutation, expose restore/save/clear failure states
      safely and clear memory plus storage only after confirmed order success.
- [x] Prove that a clear failure cannot trigger another HTTP create or erase the
      already confirmed order result.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md#behavioral-evidence).

- Test/path and observable assertion: storage/provider specs cover restore,
  mutations, clear success and clear failure.
- Red command and expected behavioral failure: `npx nx test mobile-cart-data-access --runInBand`; missing lifecycle behavior fails.
- Green command and result: `mobile-cart-data-access:test`; 10 tests passed.
- Refactor note and focused rerun: serialized writes and result-bearing clear remain in data-access; passed.
- Regression command and result: `npm run test:mobile`; passed all 13 projects.
- Manual/visual evidence, if required: process restart in TS-009.
- Deviation or blocker: current storage load silently falls back to an empty cart.

## Checkpoint

Accepted cart changes survive restart, and confirmed order cleanup has an
observable result without any path to duplicate order creation.
