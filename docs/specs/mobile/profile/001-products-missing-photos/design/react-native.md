# Products without photos in Profile — React Native design

## Architecture placement

- Expo Router route: `apps/mobile/src/app/(tabs)/profile.tsx`; it imports the
  public catalog feature screen and owns optional `router.push` to details.
- `libs/mobile/catalog/model`: reuse `CatalogProduct`/`CatalogPage` only if the
  synchronized response supports their required semantics; otherwise add the
  smallest missing-photo product/page projection without transport fields.
- `libs/mobile/catalog/data-access`: generated operation aliases, runtime
  schema, mapper, dedicated RTK Query endpoint, cache/pagination logic.
- `libs/mobile/catalog/ui`: reuse `ProductCard`, `CatalogList` and
  `CatalogListFooter` when their props are valid; add context-specific profile
  section/state copy instead of reusing catalog-specific empty/error wording.
- `libs/mobile/catalog/feature`: a thin screen, controller hook and results
  composition for missing-photo products.
- `libs/mobile/core/shell`: no catalog dependency and no product query. Existing
  tab header/theme control and safe-area primitives remain unchanged.
- Public exports: one screen from `@mobile/catalog/feature`; expose only domain
  elements genuinely reused across library boundaries.

## Device behavior

- Target platforms: Android and iOS phones; Expo web remains supported.
- Portrait is primary. Landscape/tablet/web constrain readable content without
  changing the single-column product hierarchy.
- The tab Appbar owns the top inset and bottom navigation owns the lower area;
  list content keeps enough bottom padding to avoid navigation overlap.
- No keyboard is required. The list is the only vertical scroll owner; avoid a
  parent `ScrollView` around `FlashList`.
- Pull-to-refresh is available on successful list content. Load-more is an
  explicit 48dp action only when the contract is paginated.
- TalkBack/VoiceOver reads the section heading before its state/list. Cards are
  buttons only when navigation is supported; state changes use `alert` or
  loading semantics already established by Mobile UI.

## Navigation and platform adapters

- The existing Profile tab path remains stable; no parameters or new deep link
  are introduced.
- The route passes `onProductPress` only when the confirmed domain projection
  contains a non-empty `productSlug`; feature/UI do not import Expo Router.
- Native Back from `/product/[productSlug]` returns to Profile. RTK Query cache
  preserves data; a custom storage adapter is unnecessary.
- Permissions: n/a. Storage: n/a. New native adapter: n/a.
- Expo Go is sufficient. No package, config plugin or native configuration
  change is planned, so no binary rebuild trigger exists.

## State and API

- Server state is RTK Query-owned. Local feature state is limited to a
  contract-required current page cursor/number if the RTK Query query argument
  needs it; rows are never copied into local state.
- A dedicated hook reads `currentData`, `isLoading`, `isFetching`, `isError`
  and `refetch`, and derives refresh/load-more callbacks.
- Cache identity is unique to missing-photo products. It must not merge with
  the ordinary `/api/admin/products` catalog cache.
- The endpoint is exactly `GET /api/admin/products/missing-photos`; request
  parameters, generated response and mapping remain blocked until `EN-001`.
- The endpoint's membership semantics are trusted. Validation checks response
  shape, not whether photo fields are empty.
- Existing shared cancellation and normalized error handling are retained;
  retry remains user initiated.

## Verification

- Affected projects: `mobile`, `mobile-catalog-model`,
  `mobile-catalog-data-access`, `mobile-catalog-ui`, `mobile-catalog-feature`.
- Existing Jest targets and tests: mapper/pagination specs in data-access,
  `product-card.spec.tsx`, `catalog-state.spec.tsx`,
  `catalog-screen.spec.tsx`, and app route specs under
  `apps/mobile/src/__tests__`.
- Planned unit/focused integration/component paths are recorded in each
  `TS-*`; tests use Jest 29, jest-expo 57 and RNTL 13 already installed.
- Device checks cover Android/iOS/web, safe area, refresh/scroll, text scaling,
  screen readers and Back preservation.
- No Mobile E2E target exists; no E2E pass may be claimed.
- Required enabler: `EN-001` for the absent versioned API operation, not for
  test tooling.
