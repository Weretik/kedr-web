# Mobile order history — business rules and scenarios

## Business rules

### R-001 — Dedicated order navigation

History is available from a separate “Замовлення” tab between “Кошик” and “Профіль”; details open over the tab shell and return the manager to the unchanged history.

### R-002 — Authoritative order summary

The card uses one list item from the Sales orders API and shows the number, snapshot customer name, status, number of product lines, total amount, and date/time. Do not make an extra customer request for the card.

### R-003 — Ukrainian order presentation

Status always has the agreed Ukrainian label and a compact chip; amount is shown as UAH in `uk-UA`, date in `Europe/Kyiv`, and item count uses the correct Ukrainian form. Color is not the only status cue.

### R-004 — One customer filter

The manager selects one active customer from the complete searchable list or “Усі клієнти”. The name is the visible value; `counterpartyId` is the exact API filter. “Усі клієнти” removes the parameter.

### R-005 — Session-only filter memory

The selected customer persists while moving between tabs and details within one running session, but is not written to persistent storage and resets to “Усі клієнти” after a cold start.

### R-006 — Explicit page accumulation

The first page replaces the list; “Показати ще” appends the next page without duplicate `orderId` values; the action disappears after the last page. Changing/clearing the customer and refreshing start from the first page.

### R-007 — Recoverable server states

Initial loading, empty, first-page error/offline, next-page error, and refresh have stable visible states. A next-page error does not remove orders already shown; retry occurs only after an explicit user action.

### R-008 — Read-only authoritative detail

Details show the API-returned number, date, customer, lines, total, sync status, and optional comment, 1C document number, and accepted time. No field is editable, and absent optional sections do not create empty blocks.

### R-009 — Established mobile visual language

Screens use the centralized React Native Paper theme, standard app typography, FlashList for long lists, safe area, accessible touch targets, and light/dark themes. The screenshot defines card composition only.

## Status vocabulary

| API value      | Ukrainian label             | Semantic treatment |
| -------------- | --------------------------- | ------------------ |
| Pending        | Очікує на відправлення в 1С | warning            |
| Sent           | Надіслано до 1С             | informational      |
| Accepted       | Прийнято в 1С               | success            |
| BusinessError  | Помилка обробки             | error              |
| TransportError | Помилка з’єднання           | error              |
| RetryScheduled | Повторну спробу заплановано | warning            |
| DeadLetter     | Не вдалося синхронізувати   | error              |

## Acceptance scenarios

### SC-001 — Open order history from its tab

**Covers:** R-001, R-002, R-009

Given the app is open in the tab shell\
When the manager taps the “Замовлення” tab between “Кошик” and “Профіль”\
Then the “Історія замовлень” screen opens\
And the first newest-first page shows cards with all summary fields.

### SC-002 — Read localized order summary

**Covers:** R-002, R-003

Given the API returned an order with a UTC date, `lineCount`, `totalAmount`, and sync status\
When the card is rendered\
Then the manager sees the Kyiv date and time, an amount such as `25 000,00 грн.`, and the Ukrainian item-count form\
And the compact status chip contains the agreed Ukrainian label.

### SC-003 — Search and select one customer

**Covers:** R-004, R-009

Given the manager opened customer selection\
And the complete list of active customers has loaded\
When the manager enters part of a name regardless of case and selects a result\
Then the bottom sheet closes, the button shows the selected name\
And history starts from the first page with the exact `counterpartyId`.

### SC-004 — Clear the customer filter

**Covers:** R-004, R-006

Given history is limited to one customer\
When the manager selects “Усі клієнти” or the “Очистити фільтр” action\
Then the button shows “Усі клієнти”\
And history starts from the first page without a customer filter.

### SC-005 — Preserve and reset the session filter

**Covers:** R-005

Given the manager selected a customer\
When they navigate to details or another tab and return within the same session\
Then the selected customer remains active\
But after a cold start, “Усі клієнти” is shown.

### SC-006 — Load another order page

**Covers:** R-006

Given the current page is below `totalPages` and no load is in progress\
When the manager taps “Показати ще”\
Then the next page is appended after existing cards without duplicate `orderId` values\
And the “Показати ще” action disappears after the last page.

### SC-007 — Retry a failed next page

**Covers:** R-006, R-007

Given history already contains orders\
When the next page ends with a network or server error\
Then existing cards remain visible and the footer offers retry\
And a successful retry adds the required page without duplicates.

### SC-008 — Refresh the active result set

**Covers:** R-004, R-006, R-007

Given history is open with or without a selected customer\
When the manager pulls to refresh\
Then the first page loads with the same customer filter\
And the accumulated list is replaced by the fresh first page.

### SC-009 — Show an empty history

**Covers:** R-004, R-007

Given the first page contains no orders\
When there is no customer filter\
Then “Замовлень ще немає” is visible\
But with an active customer, “Для цього клієнта замовлень не знайдено” and the “Очистити фільтр” action are visible.

### SC-010 — Recover from initial loading failure

**Covers:** R-007

Given the first page could not be loaded or the device is offline\
When the manager views history\
Then a safe Ukrainian error/offline state with a retry action is visible\
And raw transport details or customer data are not shown.

### SC-011 — Recover customer selection

**Covers:** R-004, R-007

Given the customer list is loading, empty, or failed\
When the manager opens customer selection\
Then the bottom sheet shows the corresponding loading, empty, or safe error state\
And the error can be retried without changing the current order filter.

### SC-012 — Open one order detail

**Covers:** R-001, R-008

Given an order card is visible\
When the manager taps the card\
Then the read-only screen for that `orderId` opens over the tab shell\
And the system “Назад” action returns to history with the filter state preserved.

### SC-013 — Read complete and sparse order details

**Covers:** R-003, R-008, R-009

Given the API returned order details\
When the detail screen is rendered\
Then it shows number, Kyiv date/time, customer, Ukrainian status chip, each line with quantity and line amount, and the total\
And non-empty comment, 1C document number, and accepted time are shown; absent optional values do not create empty sections.

### SC-014 — Keep detail read-only

**Covers:** R-008

Given the manager is viewing details\
When they interact with lines and summary\
Then there are no actions to change quantity, remove, edit, cancel, or retry sync\
And server data remains unchanged.

### SC-015 — Handle unavailable order details

**Covers:** R-007, R-008

Given the detail request is loading, ends with a network/server error, or returns not-found\
When the screen shows the result\
Then loading has a stable state, retry is available for recoverable errors\
And not-found shows “Замовлення не знайдено або воно більше недоступне” with an action to return to history.

## Examples

| Input/state                               | Expected observable result                  |
| ----------------------------------------- | ------------------------------------------- |
| `totalAmount=25000`                       | `25 000,00 грн.`                            |
| `createdAtUtc=2026-09-17T11:35:00Z`       | `17.09.2026, 14:35` in `Europe/Kyiv`        |
| `lineCount=1`                             | `1 позиція`                                 |
| `lineCount=2`                             | `2 позиції`                                 |
| `lineCount=5`                             | `5 позицій`                                 |
| selected `counterpartyId=cp-1`            | first-page request contains exact `cp-1`    |
| “Усі клієнти”                             | request omits `counterpartyId`              |
| `comment=null`, `oneCDocumentNumber=null` | comment and 1C document sections are absent |

## Deferred scenarios

- Status/date/number/amount filters and custom sorting.
- Order editing, cancellation, duplication, and sync retry.
- Automatic sync-status polling.
- Persistent customer filter across cold starts.
- Automated Mobile E2E until a separate runner/build/device enabler is approved.
