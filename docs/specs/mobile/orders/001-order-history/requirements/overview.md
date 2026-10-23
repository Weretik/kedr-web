# Mobile order history — scope and outcome

## Goal

As a manager, I want to review order history and details and filter history by customer so I can quickly check the order contents, amount, and transfer status to 1C.

## In scope

- A separate “Замовлення” tab between “Кошик” and “Профіль”.
- Newest-first order list with number, customer, Ukrainian status, line count, total amount, and date/time.
- One active-customer filter through a searchable bottom sheet with an “Усі клієнти” option.
- Keep the selected customer only in the current app session’s memory.
- Paginated “Показати ще” action, pull-to-refresh, and safe retry.
- Read-only order details with customer, lines, comment, status, 1C document, and total when those data exist.
- Ukrainian visible strings and accessibility names, corporate Paper theme, standard app typography, light/dark theme.
- Android and iOS as primary targets; web as a supported smoke surface.

## Out of scope

- Filters by status, date, number, or amount.
- Changing newest-first order or custom sorting.
- Editing, cancelling, deleting, or creating orders from history.
- Changing quantity, contents, customer, comment, or amount in details.
- Manual 1C sync retry or sync-status polling.
- Displaying technical transport/1C diagnostics.
- Persisting the filter after cold start.
- New font family, feature-local colors/tokens, or copying styles from a third-party screenshot.
- Backend implementation and application code while preparing this SDD.

## Actors and external systems

- Manager: reviews history, selects a customer, loads pages, and opens details.
- Sales orders API: returns newest-first pages and an individual persisted order.
- Sales customers API: returns active customers for full local search.
- 1C: an external system whose sync status and document number are displayed only.

## Constraints

- Manager order amounts are treated as UAH and displayed in `uk-UA`, for example `25 000,00 грн.`.
- UTC timestamps are displayed in the `Europe/Kyiv` time zone as `17.09.2026, 14:35`.
- `lineCount` means the number of product lines, not the total number of units.
- `counterpartyName` from the orders list is a snapshot name for the card; a separate customer request for every row is prohibited.
- The frontend OpenAPI snapshot is synchronized with backend commit `364b5f12d18cddb6efc800263581b23d25b6e484`; `getAdminOrders` and `getAdminOrderById` are anonymous under the `AllowAnonymous` provider contract.

## Open product questions

- None. Product behavior and the provider security contract are agreed.
