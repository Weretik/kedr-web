# Mobile manager cart checkout — business rules and scenarios

## Business rules

### R-001 — Persisted cart

Cart lines persist across app restarts until the manager removes them or the backend confirms order creation.

### R-002 — Quantity and stock boundary

Quantity is a positive integer and does not exceed the last known stock; it cannot be decreased below one, and removal is a separate explicit action.

### R-003 — Deterministic totals

Unit price cannot be edited. The line amount equals `unitPrice × quantity`, and the total is the sum of all lines without delivery, taxes, or other charges.

### R-004 — Complete local customer search

Before searching, the app loads the complete set of active customers from all available pages. Name search ignores case and surrounding whitespace.

### R-005 — Minimal checkout input

To submit, the manager selects one customer and may add a comment of up to 1000 characters. Technical line fields are built from the cart and are not edited manually.

### R-006 — Idempotent order creation

One unchanged create action has one UUID idempotency key. Parallel submission is prevented; a safe retry of the same payload uses the same key.

### R-007 — Backend-authoritative errors

The frontend performs only minimal checks. Normalized backend field and business errors are shown without raw transport details or losing entered data.

### R-008 — Confirmed success cleanup

Only a confirmed `200` or `201` shows the order number and `Pending`, clears the cart, and closes the form. A local cleanup failure does not repeat the HTTP create request.

### R-009 — Established mobile interaction

The screen and bottom sheets use the corporate theme, accessible touch targets, safe keyboard behavior, and existing mobile controls. Do not bring delivery, taxes, or payment from the visual reference into scope.

## Acceptance scenarios

### SC-001 — Restore persisted cart

**Covers:** R-001

Given the manager previously added products to the cart\
When the app starts again and local state is restored\
Then the “Кошик” tab shows the same product lines and quantities\
And the total matches the restored data.

### SC-002 — Show an empty cart

**Covers:** R-001, R-009

Given there are no saved product lines\
When the manager opens the “Кошик” tab\
Then a Ukrainian empty state is visible\
And checkout is unavailable.

### SC-003 — Change quantity within stock

**Covers:** R-002, R-003

Given a line quantity is below the last known stock\
When the manager increases or decreases the quantity\
Then the quantity changes by one unit within the allowed range\
And the line amount and total are recalculated and saved immediately.

### SC-004 — Stop at the stock boundary

**Covers:** R-002

Given quantity equals the last known stock\
When the manager views the increase control\
Then increase is unavailable and its reason is available to assistive technology\
And quantity and totals remain unchanged.

### SC-005 — Remove a cart line

**Covers:** R-001, R-003

Given the cart contains multiple products\
When the manager removes one line\
Then that product disappears from the cart\
And the total and persisted cart contain only the remaining lines.

### SC-006 — Find and select a customer

**Covers:** R-004, R-005

Given the complete list of active customers has loaded\
When the manager enters part of a name, ignoring case\
Then the list shows only matching names\
And selecting one result fills the customer field and closes the selector.

### SC-007 — Handle customer loading failure

**Covers:** R-004, R-007

Given the customer list failed to load or the device is offline\
When the manager opens customer selection\
Then a safe error or offline state with retry is visible\
And creating an order without a customer is unavailable.

### SC-008 — Validate checkout locally

**Covers:** R-005, R-007

Given the cart is non-empty but no customer is selected or the comment exceeds 1000 characters\
When the manager attempts to create an order\
Then no request is sent\
And the relevant field shows a clear Ukrainian error.

### SC-009 — Submit one order once

**Covers:** R-003, R-005, R-006

Given the cart is valid, a customer is selected, and the network is available\
When the manager confirms checkout\
Then one request is sent with the customer, comment, cart lines, and one idempotency key\
And submit remains unavailable until the response completes.

### SC-010 — Retry the same failed action safely

**Covers:** R-006, R-007

Given the create result is unknown because of a network or server failure\
And the manager has not changed the customer, comment, or cart\
When the manager resubmits\
Then the same payload is retried with the same idempotency key\
And the form and cart remain populated until success is confirmed.

### SC-011 — Show backend validation or conflict

**Covers:** R-007

Given the backend returns validation, not-found, or idempotency conflict\
When the response is normalized\
Then a field error is attached to a known field or a safe general message is shown\
And the cart, customer, and comment are retained.

### SC-012 — Complete a created order

**Covers:** R-008

Given the backend returned a `200` replay or `201` created\
When the result is handled\
Then the manager sees `orderNumber` and `Pending` status\
And the form closes and both in-memory and persisted carts are cleared without another create request.

### SC-013 — Preserve success when local cleanup fails

**Covers:** R-008

Given the backend has confirmed order creation\
When local storage cleanup fails\
Then the order result remains successful and resubmission is unavailable\
And the manager sees a safe message about local cleanup.

## Examples

| Input/state                          | Expected observable result     |
| ------------------------------------ | ------------------------------ |
| `unitPrice=125`, `quantity=2`        | line amount `250 грн.`         |
| `quantity=stock`                     | increase disabled              |
| search `  кліЄнТ  `                  | names containing `клієнт`      |
| `201`, `SO-20260917-0001`, `Pending` | success, receipt, cart cleared |
| retry unchanged payload              | same idempotency key           |
| payload changed before retry         | new create action and new key  |

## Deferred scenarios

- Recalculate prices for the selected customer.
- Manually edit unit price or line amount.
- Backend-authoritative stock validation.
- Production Mobile authentication and authorization.
- Order history, details, sync polling, and manual 1C retry.
