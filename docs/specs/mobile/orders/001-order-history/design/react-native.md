# Mobile order history — React Native design

## Architecture placement

- Expo Router: `apps/mobile/src/app/(tabs)/orders.tsx`, tab registration in
  `(tabs)/_layout.tsx`, and `apps/mobile/src/app/orders/[orderId].tsx` remain
  thin adapters.
- `libs/mobile/orders/model`: summary/detail models, status label/semantic kind,
  UAH/Kyiv presentation and position pluralization.
- `libs/mobile/orders/data-access`: generated operation references, private DTO
  runtime schemas, mappers and RTK Query list/detail endpoints.
- `libs/mobile/orders/ui`: history list/card/footer/states, status chip and
  read-only detail sections.
- `libs/mobile/orders/feature`: public screens, controllers, query reducer,
  page accumulation and session filter coordination.
- `libs/mobile/customers/{model,data-access,ui}`: active customer model,
  complete page loading/local search and reusable selector sheet consumed by
  cart and orders.
- Public exports use each root `src/index.ts`; DTOs and transport errors remain
  private and cross-domain deep imports are forbidden.

## Device behavior

- Target platforms: Android and iOS; web remains a responsive smoke surface.
- Safe area: existing Appbar/tab shell owns insets; detail/list content stays
  above system bars. Portrait is primary; landscape remains scrollable.
- Keyboard: customer search remains visible, keyboard can be dismissed, and
  closing the sheet restores focus to the filter control.
- Scrolling: one FlashList owns history; the active customer sheet owns its
  FlashList; detail uses one vertical scroll owner.
- Touch: card, filter, retry, clear and load-more controls have at least 48×48
  effective targets.
- TalkBack/VoiceOver: announces order number, client, localized status, date,
  positions, total, selected filter and async state changes.
- Loading, empty, error, offline, refreshing and next-page states follow the
  visual contract without layout-breaking spinners.

## Navigation and platform adapters

- `/orders` is the tab list; `/orders/[orderId]` is a stack detail outside tabs.
- Invalid order IDs and not-found results use a safe unavailable state with a
  return action.
- Storage boundary: n/a; filter is Redux memory only and is excluded from
  AsyncStorage/SecureStore.
- Permissions: n/a. No native/web adapter difference is required.
- Expo Go supports all selected packages; no development build or binary
  rebuild trigger exists.

## State and API

- Session client state contains only customer filter identity/display name.
  Page/query interaction remains feature-local; server state remains RTK Query.
- Controllers expose domain models/callbacks to UI; UI imports no API/router.
- `getAdminOrders` args are `{counterpartyId?, page, pageSize:20}`;
  `getAdminOrderById` takes a positive numeric ID.
- `getAdminCustomers` is shared through the customers domain and still loads all
  pages before complete local search is declared ready.
- Requests use cancellation through existing `baseApi`; network/5xx retry is
  explicit, 4xx is not automatically retried.
- Synchronized provider operations are anonymous. No token behavior is added to
  the Mobile orders client.

## Verification

- Affected existing Nx projects: `mobile`, `mobile-cart-data-access`,
  `mobile-cart-feature`, `mobile-cart-model`, `mobile-cart-ui`, `api-client`,
  `shell`.
- Planned projects: `mobile-orders-model`, `mobile-orders-data-access`,
  `mobile-orders-ui`, `mobile-orders-feature`, `mobile-customers-model`,
  `mobile-customers-data-access`, `mobile-customers-ui`.
- Existing Jest/RNTL evidence includes catalog page merging/controller/screens,
  customer page loading/selector and cart screens. New unit, focused integration,
  component and route tests are listed in task/traceability files.
- Device checks cover safe area, keyboard, long lists/details, theme variants,
  offline/retry, large text and screen-reader labels.
- No automated Mobile E2E target exists and none is claimed or installed.
