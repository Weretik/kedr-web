# TS-007 — Cart tab route and navigation

- **Task ID:** TS-007
- **Status:** complete
- **Covers:** SC-001, SC-002
- **Depends on:** TS-005
- **Exact paths:** `apps/mobile/src/app/(tabs)/cart.tsx`;
  `apps/mobile/src/app/(tabs)/_layout.tsx`;
  `apps/mobile/src/__tests__/tabs-layout.spec.tsx`; focused route test
- **Test level:** integration

## Work

- [x] Add a thin Expo Router cart route that renders the public CartScreen.
- [x] Register «Кошик» in the existing Paper bottom navigation with suitable
      focused/unfocused icons and Ukrainian accessibility label.
- [x] Extend route/tab tests without moving cart logic into the app layer.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md#automated-verification).

- Test/path and observable assertion: tabs layout and route specs prove the cart
  tab is reachable and renders the feature screen.
- Red command and expected behavioral failure: `npx nx test mobile --runInBand`; cart tab is absent.
- Green command and result: `mobile:test`; route/tab tests passed.
- Refactor note and focused rerun: app route remains a thin `CartScreen` adapter; passed.
- Regression command and result: `npm run test:mobile`; passed all 13 projects.
- Manual/visual evidence, if required: bottom-navigation device check in TS-009.
- Deviation or blocker: none.

## Checkpoint

The bottom navigation opens a cart route whose app file contains no domain,
storage or HTTP behavior.
