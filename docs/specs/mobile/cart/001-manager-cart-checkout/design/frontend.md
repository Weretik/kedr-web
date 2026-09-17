# Mobile manager cart checkout — frontend design

## Affected clients and boundaries

- Client/project: `mobile` (`apps/mobile`).
- Variant: [React Native design](react-native.md) and
  [visual interaction](visual-interaction.md).
- Nx libraries: `mobile-cart-model`, `mobile-cart-data-access`,
  `mobile-cart-feature`; `mobile-cart-ui` is created through Nx in `EN-002`.
- `apps/mobile` owns the thin cart tab route and tab registration; cart
  `feature` owns orchestration; cart `ui` is presentational; cart `model` owns
  calculations and invariants; cart `data-access` owns storage and HTTP.
- Existing add-to-cart behavior from Mobile product details is reused.

## State and data fetching

- Cart lines and restore/save status belong to the existing cart provider and
  AsyncStorage adapter. Model functions own increment, decrement, remove,
  clear, stock limits and money calculations.
- RTK Query owns customer pages, order mutation state and normalized API errors.
- Customer selector requests `page=1&pageSize=100`; if `totalPages > 1`, it
  loads remaining pages before declaring local search complete, deduplicates by
  `counterpartyId` and caches only in memory.
- React Hook Form owns selected customer, comment, touched errors and submit
  state. Zod performs minimal form validation; backend errors remain authoritative.
- A create-attempt object owns canonical payload and UUID. It survives retry
  while payload is unchanged and is replaced after any payload change.
- Network/5xx keeps cart and form. Confirmed success prevents further submit,
  clears memory then persistent cart and presents the receipt.

## Navigation and deep links

- Physical route: `apps/mobile/src/app/(tabs)/cart.tsx`.
- Public tab name: `cart`; title and accessibility label: «Кошик».
- The route renders one exported `CartScreen` and contains no business, storage
  or HTTP logic.
- No external deep link or route parameter is introduced.

## Platform adapters and permissions

- AsyncStorage remains isolated in cart `data-access`; no permission is needed.
- Existing `react-native-actions-sheet` wrapper pattern is reused for checkout
  and customer selection. Paper provides form controls and feedback;
  FlashList renders product and customer collections.
- No new native package, permission, app config or development build is needed.

## API integration

- Contract: [API integration](../contracts/api-contract.md).
- `EN-001` synchronizes the frontend snapshot from backend commit
  `1a9e2a6864f2c527fb333276bd0346f21be701f0`, regenerates types and creates the
  Sales consumer projection.
- Generated DTO types stay private in cart `data-access`; runtime validation
  and mappers return customer and order-result models.
- The order mapper computes each request `amount` as rounded line total and
  sends the required UUID header. UI never receives raw transport errors.

## Test design

- Unit: cart mutations, stock boundary, totals, local name normalization,
  payload and idempotency transitions.
- Focused integration: AsyncStorage restore/save/clear, customer pagination,
  order request, response/error mapping and retry key reuse.
- Component: empty/populated cart, quantity controls, customer selector,
  validation, pending, success and safe errors.
- Integration: cart tab registration and thin route.
- Existing targets: `mobile-cart-model:test`, `mobile-cart-data-access:test`,
  `mobile-cart-feature:test`, `mobile:test`; `mobile-cart-ui:test` is introduced
  with the generated UI library.
- Regression: `npm run test:mobile`, `npm run typecheck:tests:mobile`, affected
  lint targets, `npx nx typecheck mobile`, `npx nx export mobile`.
- Mobile E2E tooling is absent; Jest/RNTL plus Android/iOS/web device QA is
  proportionate to this feature.
