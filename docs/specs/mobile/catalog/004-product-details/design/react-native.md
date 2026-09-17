# Mobile product details — React Native design

## Architecture placement

- Route: `apps/mobile/src/app/product/[productSlug].tsx`; root Stack config in
  `apps/mobile/src/app/_layout.tsx` supplies a native back header titled «Товар».
- `libs/mobile/catalog/model`: `CatalogProductDetails`, breadcrumb and image
  candidate types plus pure availability/cart eligibility rules.
- `libs/mobile/catalog/data-access`: generated DTO alias, runtime schema, mapper,
  `getCatalogProductBySlug` RTK Query endpoint.
- `libs/mobile/catalog/ui`: product details content, image gallery and page-state
  components receiving models/callbacks only.
- `libs/mobile/catalog/feature`: query orchestration, image load state, Snackbar
  and cart command.
- `libs/mobile/cart/model` and `libs/mobile/cart/data-access`: minimal cart line,
  add/increment rule and AsyncStorage-backed client state created by `EN-001`.
- Public exports: `ProductDetailsScreen` from catalog feature; detail endpoint
  hook from catalog data-access; cart command hook/facade from cart data-access.

## Device behavior

- Android, iOS and Expo web are supported; portrait is primary and landscape
  stays usable through a constrained content width.
- Root header and sticky action respect top/bottom safe areas. Content has one
  vertical `ScrollView`; pager owns only horizontal gestures.
- Touch targets are at least 48dp. Back has Ukrainian accessible label.
- Gallery announces «Зображення 1 з 2» / «Схема 2 з 2»; dots are not the only
  indication of position.
- Loading uses skeleton geometry; reduced-motion disables nonessential image
  transition. Dynamic type may grow without hiding price or action reason.

## Navigation and platform adapters

- Catalog route passes `onProductPress(productSlug)` into feature; feature/UI do
  not import Expo Router.
- `router.push('/product/[productSlug]')` creates a root Stack entry over tabs.
  Back pops it, preserving the catalog instance.
- No storage or permission adapter is needed for product details. Cart
  persistence uses existing AsyncStorage through cart data-access.
- `expo-image` and `react-native-reanimated-carousel` are installed with Expo
  CLI during `EN-002`; `npx expo-doctor` validates SDK 56 compatibility and the
  existing Reanimated/Worklets/Gesture Handler peer set.
- No custom native module is added; Expo Go is expected to remain sufficient,
  subject to the `EN-002` smoke check.

## State and API

- Server state: RTK Query. Local UI state: active page, failed image URLs,
  Snackbar. Cart state: cart data-access.
- Query args are `{ productSlug, lang: 'uk', priceTypeId: 11 }` internally; UI
  provides only slug.
- Cached successful detail may remain visible during refetch with a small
  progress signal. First-load offline without cache uses dedicated offline state.
- Runtime validation/mapping occurs before the model reaches feature.

## Verification

- Affected projects: `mobile`, `mobile-catalog-model`,
  `mobile-catalog-data-access`, `mobile-catalog-ui`, `mobile-catalog-feature`,
  generated cart projects.
- Existing Jest targets and neighboring product-card/catalog-screen tests are
  extended rather than duplicated.
- Unit, focused integration, component and route integration tests provide
  automated evidence; Android/iOS/web checks provide gesture/layout evidence.
- No Mobile E2E target exists. Do not report E2E as passed.
