# Mobile order history — frontend design

## Affected clients and boundaries

- Client/project: `mobile` (`apps/mobile`).
- Variant: [React Native design](react-native.md) and
  [visual interaction](visual-interaction.md).
- Planned Nx libraries: `mobile-orders-model`, `mobile-orders-data-access`,
  `mobile-orders-ui`, `mobile-orders-feature`; shared customer ownership moves
  to planned `mobile-customers-model`, `mobile-customers-data-access` and
  `mobile-customers-ui` rather than creating an orders-to-cart dependency.
- `apps/mobile` owns thin Expo Router routes and tab order. Orders `feature`
  owns orchestration/session filter, `ui` owns presentational screens,
  `model` owns display rules, and `data-access` owns contracts/RTK Query.
- Existing catalog accumulation, footer retry and refresh behavior are patterns,
  not imported catalog domain code. Its separation of query controls from
  results in `catalog-query-controls.tsx` and `catalog-results.tsx` guides the
  equivalent history feature split.

## State and data fetching

- RTK Query owns order/customer responses, request lifecycle, cache and errors.
- An orders-owned Redux slice stores only selected `counterpartyId` and display
  name for the current runtime session; it has no persistence adapter.
- The history controller owns current page and accumulated order summaries.
  Page 1 replaces; later pages merge by `orderId`; filter change and refresh
  reset to page 1. Server responses are not duplicated in Redux.
- Customer data uses the existing complete dataset rule: request
  `page=1&pageSize=100`, load remaining pages, deduplicate by `counterpartyId`,
  then search locally by trimmed case-insensitive name.
- List/detail DTOs are runtime-validated and mapped to orders domain models in
  `data-access`. `counterpartyName` is rendered directly from list results.
- First-page errors replace the result region; later-page errors retain items
  and render footer retry. Manual retry calls `refetch`; no hidden infinite retry.

## Navigation and deep links

- Tab route: `apps/mobile/src/app/(tabs)/orders.tsx`, title/accessibility label
  «Замовлення», registered after `cart` and before `profile`.
- Detail route: `apps/mobile/src/app/orders/[orderId].tsx`; it renders outside
  the tab navigator, hides bottom tabs and supplies back navigation.
- Route adapter parses a positive integer `orderId` and passes it to the public
  feature screen. Invalid/missing IDs show the same safe unavailable state.
- No external deep-link campaign is introduced; direct valid route opening is
  supported by the file route.

## Platform adapters and permissions

- No persistent storage is used for the filter. No new permission or native
  adapter is required.
- Existing `react-native-actions-sheet` pattern is reused for customer choice;
  Paper provides controls/chips/surfaces and FlashList renders long lists.
- All dependencies already support Expo Go; no app config or binary rebuild is
  planned.

## API integration

- Contract: [API integration](../contracts/api-contract.md).
- `EN-001` syncs the provider OpenAPI after `AllowAnonymous`, regenerates
  `@shared/api-contracts`, and aligns the operation registry/projection before
  transport implementation.
- List requests send `page`, `pageSize=20`, and optional exact
  `counterpartyId`; detail sends only path `orderId`.
- Generated operation types stay private in `data-access`. Zod runtime schemas
  validate unknown responses before mappers return order models.
- Safe normalized `400`, `404`, network, 5xx and unexpected-contract errors are
  rendered without raw response content or PII logging.

## Test design

- Unit: status vocabulary/semantic kind, UAH format, Kyiv date, Ukrainian
  pluralization, query transitions and page merge/deduplication.
- Focused integration: order list/detail request parameters, runtime mapping,
  customer page reuse, cache/session filter and error mapping.
- Component: list states, filter sheet, cards/chips, load-more/refresh, read-only
  detail and conditional sections.
- Integration: tab ordering, thin routes, valid/invalid `orderId` navigation.
- Existing verified targets: `mobile:test`, `mobile-cart-data-access:test`,
  `mobile-cart-ui:test`, `mobile-catalog-feature:test`, `api-client:test`,
  `shell:test`; planned order/customer libraries receive inferred `lint` and
  Jest `test` targets and are rechecked with `nx show project` after generation.
- Regression: `npm run test:mobile`, `npm run typecheck:tests:mobile`, affected
  Nx lint/test targets, `npx nx typecheck mobile`, `npx nx export mobile`, and
  `npm run contracts:check`.
- Mobile E2E tooling is absent. Jest/RNTL plus manual Android/iOS/web checks are
  proportionate; this feature does not install an E2E runner.
