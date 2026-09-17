# Mobile manager cart checkout — delivery evidence

- **Date:** 2026-09-17
- **Implementation checkpoint:** complete
- **Runtime device checkpoint:** pending on Mobile team hardware

## Behavioral evidence

| Scope         | Red evidence                                                                                          | Green/refactor evidence                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| TS-001        | Focused model run reported 3 missing cart mutation/total behaviors.                                   | `mobile-cart-model:test`: 20 tests passed, including all seven Ukrainian synchronization-status labels.     |
| TS-002        | Storage result and clear lifecycle assertions failed before the provider/storage changes.             | `mobile-cart-data-access:test`: 10 tests passed.                                                            |
| TS-003        | Customer mapping, paging and search tests failed before their implementations existed.                | Model/data suites pass complete paging, deduplication and normalized local search.                          |
| TS-004        | Create-order endpoint and attempt-state tests failed before transport/idempotency behavior existed.   | Model/data suites pass generated request mapping, receipt parsing and key reuse/change behavior.            |
| TS-005        | The initial `CartView` stub produced 3 component failures.                                            | `mobile-cart-ui:test`: 8 tests passed, including the square white image frame with contained image scaling. |
| TS-006–TS-008 | No separate behavioral Red run was retained before the sheet, route and orchestration implementation. | UI, feature and app integration suites pass. This missing Red capture is the recorded workflow deviation.   |

Refactoring kept calculations in model, transport/storage in data-access,
presentational controls in UI, checkout orchestration in a feature hook and
routing in the app. `CartView` now delegates line rendering and the total action
area to focused components. Focused suites were rerun after formatting and
boundary fixes.

## Customer API runtime evidence

The Mobile integration uses the generated `getAdminCustomers` contract and
requests `GET /api/admin/customers?page=1&pageSize=100`. On 2026-09-17 the
first deployed API check returned HTTP 200 with an empty `value`; a later check
returned 688 records across 7 pages. All 688 records were checked against the
frontend limits for `counterpartyId`, `name` and nullable `phone`; all were
valid and all IDs were unique. The client loads every page, deduplicates by
`counterpartyId`, and searches the completed list locally. The checkout flow
also refetches this endpoint whenever the form is opened and provides an
explicit retry action, so a transient empty response does not remain hidden in
the RTK Query cache for later checkout attempts.

The generated `createAdminOrder` request contains two manager-entered fields:
required `counterpartyId` and optional `comment`. Order lines, quantities and
amounts are derived from the cart and are displayed as an automatic order
summary in the form.

## Automated verification

| Command                                           | Result                                                                                                         |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm run contracts:check`                         | Passed; 4 known Redocly warnings remain (one ambiguous catalog path and three planned-auth security warnings). |
| `npm run test:mobile`                             | Passed all 13 Mobile projects.                                                                                 |
| `npm run typecheck:tests:mobile`                  | Passed every Mobile test tsconfig.                                                                             |
| `npx nx typecheck mobile`                         | Passed.                                                                                                        |
| Affected `nx lint` targets                        | Passed for model, data-access, UI, feature, app, API client and shared config.                                 |
| Focused Prettier check                            | Passed for all changed cart/app/config files.                                                                  |
| `npx nx export mobile`                            | Passed; web, iOS and Android bundles exported to `dist`.                                                       |
| `npm run docs:check` and cart docs Prettier check | Passed after the final documentation update.                                                                   |

## Runtime and visual verification

No Android emulator/device, iOS simulator/device or interactive Expo web
browser was available in this execution environment. Bundle generation passed
for all three platforms, but it is not presented as touch, keyboard, safe-area,
screen-reader, process-restart or visual evidence. The Mobile team owns those
manual checks before release.

The remaining product risk is stale client-side stock: the UI blocks quantity
above the last known catalog stock, while the current backend contract does not
authoritatively reject a changed stock level during order creation.
