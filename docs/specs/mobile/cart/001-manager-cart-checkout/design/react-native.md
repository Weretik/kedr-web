# Mobile manager cart checkout — React Native design

## Architecture placement

- Expo Router: `apps/mobile/src/app/(tabs)/cart.tsx` and tab registration in
  `(tabs)/_layout.tsx` remain thin adapters.
- `libs/mobile/cart/model`: line mutations, quantity/stock invariants, money
  totals, search normalization and create-attempt identity rules.
- `libs/mobile/cart/data-access`: AsyncStorage adapter, generated transport
  types, runtime schemas, RTK Query endpoints and DTO mappers.
- `libs/mobile/cart/ui`: cart list/row/summary, quantity control, checkout sheet,
  searchable customer selector and visible states.
- `libs/mobile/cart/feature`: `CartScreen`, controller, form orchestration and
  success/error transitions.
- Public exports use each library root `src/index.ts`; no deep imports.

## Device behavior

- Target platforms: Android and iOS; web remains a supported smoke surface.
- Safe area: bottom navigation owns bottom inset; screen and sheets preserve
  readable content above system bars.
- Keyboard: comment/search fields remain visible, support dismissal and do not
  hide the primary action.
- Scrolling: one FlashList owns the cart screen; customer FlashList owns its
  sheet. Nested scroll is limited to the active sheet.
- Touch: icon-only quantity/delete controls have Ukrainian labels and at least
  48×48 effective targets.
- TalkBack/VoiceOver: announces product, quantity, disabled stock boundary,
  selected customer, validation, pending and success.
- Loading, empty, error and offline states follow the visual contract.

## Navigation and platform adapters

- Route has no parameters and falls back to the existing tab shell.
- Storage boundary is the existing AsyncStorage cart adapter; schema remains
  versioned by `mobile.cart.v1` unless a shape change requires migration.
- Permissions: n/a; the feature requests none.
- No platform-specific adapter difference is required.
- All chosen packages run in Expo Go; no binary rebuild trigger exists.

## State and API

- Cart client state is persistent; checkout form is transient; customers and
  create result are server state owned through RTK Query.
- Controllers expose domain models and callbacks to presentational UI.
- Customer pages are cancelled when the selector flow becomes irrelevant;
  4xx is not retried automatically. User-triggered retry handles network/5xx.
- External responses are runtime-validated before mapping.
- Current APIs are temporarily anonymous; no token or role state is invented.

## Verification

- Affected Nx projects: `mobile`, `mobile-cart-model`,
  `mobile-cart-data-access`, `mobile-cart-feature`, new `mobile-cart-ui`,
  `api-client`, `shell`.
- Existing Jest/RNTL tests: cart model/storage specs, feature smoke and mobile
  tab layout spec.
- Coverage: unit, focused integration, component and route integration.
- Device checks: safe area, keyboard, long cart/customer lists, offline/retry,
  screen reader labels and success cleanup.
- Critical E2E decision: no automated Mobile E2E; no `EN-*` is justified for
  this release because lower levels plus device QA cover the risks.
