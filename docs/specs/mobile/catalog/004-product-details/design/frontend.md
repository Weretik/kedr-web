# Mobile product details — frontend design

## Affected clients and boundaries

- Client/project: `mobile` (`apps/mobile`).
- Variant: [React Native design](react-native.md) і
  [visual interaction](visual-interaction.md).
- Nx libraries: `mobile-catalog-model`, `mobile-catalog-data-access`,
  `mobile-catalog-ui`, `mobile-catalog-feature`; new cart libraries are created
  only through Nx generators during `EN-001`.
- `apps/mobile` owns route parsing/navigation; `feature` owns orchestration;
  `ui` is presentational; API DTO stays private in `data-access`.

## State and data fetching

- RTK Query owns server state keyed by `productSlug`; the detail feature owns
  gallery index, per-URL load status and Snackbar visibility.
- Generated response is runtime-validated and mapped to Mobile model in
  catalog `data-access`.
- Catalog query/results already remain mounted beneath the root Stack. Before
  navigation, the list records the selected item anchor/offset; Back restores
  it after layout if native preservation alone is insufficient.
- 404, offline and retryable transport errors have distinct domain states.

## Navigation and deep links

- Public URL: `/product/{productSlug}`.
- Physical route: `apps/mobile/src/app/product/[productSlug].tsx`.
- The route reads one string param and passes it to exported
  `ProductDetailsScreen`; it does not call HTTP.
- Invalid/missing slug renders the invalid-link state without a request.
- Catalog route performs Stack push. Native Back/pop returns to the mounted tab
  screen and its prior query/list state.

## Platform adapters and permissions

- No permissions are required.
- Image loading uses Expo-supported `expo-image`; paging and indicator use
  `react-native-reanimated-carousel`, whose required Reanimated, Worklets and
  Gesture Handler peers are already installed. New packages are installed
  through `npx expo install`.
- Existing `react-native-actions-sheet` is reused if a future quantity/options
  sheet is approved. Current one-tap add and Paper Snackbar need no sheet.
- Both selected packages are supported in Expo Go; no custom native code or
  development build is required by the documented feature.

## API integration

- Contract: [API integration](../contracts/api-contract.md).
- Exact backend fields become a Mobile model through a mapper; feature/UI do
  not import `@shared/api-contracts`.
- Existing normalized `ApiError` and NetInfo connectivity state drive safe
  Ukrainian messages. Image load errors never become global API errors.

## Test design

- Unit: runtime schema, DTO mapper, image-candidate normalization, cart reducer.
- Focused integration: RTK Query request/cache/errors and persisted cart adapter.
- Component: card press, detail states, pager/fallback, cart action/a11y.
- Route integration: slug parsing, Stack push/pop and catalog state preservation.
- Existing targets: `mobile-catalog-model:test`,
  `mobile-catalog-data-access:test`, `mobile-catalog-ui:test`,
  `mobile-catalog-feature:test`, `mobile:test`.
- Mobile E2E remains unavailable; Jest plus Android/iOS/web manual QA covers the
  current risk without adding a runner.
