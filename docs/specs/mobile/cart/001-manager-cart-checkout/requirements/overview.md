# Mobile manager cart checkout — scope and outcome

## Goal

As a manager, I want to review products, select a customer, and submit a Sales order so the backend can reliably store it and queue it for transfer to 1C.

## In scope

- A separate “Кошик” tab in bottom navigation.
- Restore products after app restart.
- View, increase, decrease, and remove product lines.
- Limit quantity to the last known product stock.
- Product-only total.
- Select one active customer from a list and search locally by name.
- Optional manager comment.
- Create a complete Sales order once, with safe retries.
- Successful result includes order number and `Pending` status.
- Clear the cart after confirmed creation.
- Clear empty, loading, offline, validation, and transport error states.

## Out of scope

- Manager editing of a product price or line amount.
- Prices that depend on the selected customer.
- Delivery, address, taxes, shipping fee, or payment methods.
- Mobile authentication and role-based access in the first version.
- History, details, cancellation, or editing of created orders.
- Polling 1C status and manual sync retry.
- Offline queue for order creation.
- Server-side customer search.

## Actors and external systems

- Manager: manages the cart, selects a customer, adds a comment, and creates an order.
- Sales customers API: returns active customers for selection.
- Sales admin order API: idempotently stores an order with `Pending` status.
- 1C: receives the stored order asynchronously after the HTTP request completes.

## Constraints

- There are expected to be 30–50 active customers; local search runs after all available pages are loaded with `pageSize=100`.
- Unit price comes from the existing cart line and cannot be edited.
- `amount` is the total for the line: `unitPrice × quantity`, not the unit price.
- The frontend limits quantity to the last known `stock`; the backend create API does not currently guarantee validation against the latest warehouse stock.
- Visible text and accessibility labels are Ukrainian.
- Standard UI, form, list, storage, and data fetching needs are covered by installed packages; do not add a package without a separate `EN-*` task.

## Open product questions

- None. Customer-specific pricing, production authorization, and authoritative stock validation are deliberately deferred.
