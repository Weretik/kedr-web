# Mobile manager order consumer contract

## Machine contracts

- Customers: [`customer-read.openapi.yaml`](../openapi/sales/customer-read.openapi.yaml)
- Order reads:
  [`manager-order-read.openapi.yaml`](../openapi/sales/manager-order-read.openapi.yaml)
- Order creation:
  [`admin-order-one-c-sync.openapi.yaml`](../openapi/sales/admin-order-one-c-sync.openapi.yaml)
- Operations: `getAdminCustomers`, `getAdminOrders`, `getAdminOrderById`,
  `createAdminOrder`
- Generated customer operation: `operations['getAdminCustomers']`
- Generated read operations: `operations['getAdminOrders']`,
  `operations['getAdminOrderById']`
- Generated create operation: `operations['createAdminOrder']`
- Consumers: Mobile manager cart checkout; Mobile order history planned

## Customer selection

Mobile requests `GET /api/admin/customers?page=1&pageSize=100`. The expected
active population is 30–50 records. If `pagedInfo.totalPages` is greater than
one, the client loads all remaining pages before enabling complete local name
search, combines them by `counterpartyId`, and keeps the result only in RTK
Query memory.

The UI displays `name`; `counterpartyId` is the stable selected value sent with
the order. Search trims the query and compares customer names without regard to
case. Customer PII is not persisted in AsyncStorage.

Order history reuses this customer dataset and selector through customer-owned
Mobile libraries rather than depending on cart. It adds «Усі клієнти», which
omits `counterpartyId`; one selected client sends the exact identifier and
resets order pagination to page 1. The selection lives only in runtime memory.

## Order history

Mobile requests `GET /api/admin/orders?page=1&pageSize=20` and adds exact
`counterpartyId` only for a selected customer. Page 1 replaces the visible
result; «Показати ще» appends later pages and deduplicates by `orderId`.
Refresh returns to page 1 while preserving the runtime customer filter. The
client stops when `pageNumber >= totalPages`.

List cards map only the generated summary fields. `counterpartyName` is the
order snapshot and does not trigger a customer request per row. `lineCount` is
the number of order lines. Amounts are displayed as UAH with `uk-UA`; UTC dates
are displayed in `Europe/Kyiv`; `syncStatus` uses the shared Mobile orders
Ukrainian vocabulary.

Mobile requests `GET /api/admin/orders/{orderId}` for a positive numeric ID.
The read-only detail maps counterparty, lines, total and sync data. Empty
`comment`, `oneCDocumentNumber` and `acceptedAtUtc` do not create empty visual
sections. The consumer does not expose edit, cancel, duplicate, polling or sync
retry commands.

The frontend snapshot was synchronized from provider commit
`364b5f12d18cddb6efc800263581b23d25b6e484`. Both read operations are
anonymous and omit `401`/`403`, matching `AllowAnonymous` in the provider.

## Order creation

Mobile sends only contract fields:

- selected customer `counterpartyId`;
- trimmed manager `comment`, or `null` when empty;
- one row per cart product with `productId`, positive integer `quantity`, and
  `amount` equal to the two-decimal total for the complete line.

The unit price and line amount are not editable in the first release. The
current cart price is used; customer-specific pricing is deferred. Frontend
limits quantity by the last known cart stock, while current backend creation
does not authoritatively recheck stock.

Each create action sends a generated UUID in `Idempotency-Key`. An explicit
retry of the same unchanged payload reuses the key. Any customer, comment or
cart change invalidates the attempt and causes the next submit to use a new
key. The UI disables duplicate submission while the request is pending.

Both `200` and `201` are success. Mobile shows `orderNumber` and the initial
`Pending` status, then clears the persisted cart and closes checkout. It does
not poll delivery status in this feature.

## Errors and access

- `400`: map known field errors and otherwise show a safe form error.
- `404`: selected counterparty is unavailable; preserve cart/comment and
  require another selection.
- `409`: idempotency key was reused with different data; do not retry
  automatically.
- Network/5xx: preserve the payload and key for an explicit retry.
- Future `401/403`: show safe unavailable/forbidden states without loops.

The customer, order-read and create operations in the current provider snapshot
are anonymous. Raw response bodies, headers, customer data and internal 1C
diagnostics are not logged or shown.
