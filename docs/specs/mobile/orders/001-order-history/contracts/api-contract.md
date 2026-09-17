# Mobile order history — API integration contract

## Source

- OpenAPI snapshot:
  `docs/contracts/openapi/sales/manager-order-read.openapi.yaml` and
  `docs/contracts/openapi/sales/customer-read.openapi.yaml`.
- Stable operations: `getAdminOrders`, `getAdminOrderById`,
  `getAdminCustomers`.
- Generated references: `operations['getAdminOrders']`,
  `operations['getAdminOrderById']`, `operations['getAdminCustomers']` and
  their referenced `components[...]` schemas.
- Consumer projection: `docs/contracts/sales/manager-order.md`.
- Snapshot source: KedrStore `docs/sdd/contracts/openapi.yaml`, synchronized at
  commit `364b5f12d18cddb6efc800263581b23d25b6e484` by `EN-001`.

## Operations

| User intent              | Method/path                       | Request                                  | Success                                      | Expected errors           |
| ------------------------ | --------------------------------- | ---------------------------------------- | -------------------------------------------- | ------------------------- |
| Browse all orders        | `GET /api/admin/orders`           | `page`, `pageSize=20`                    | generated `ManagerOrderPage`                 | `400`, network/5xx        |
| Browse one client's      | `GET /api/admin/orders`           | exact `counterpartyId`, page, pageSize   | generated `ManagerOrderPage`, possibly empty | `400`, network/5xx        |
| Read one order           | `GET /api/admin/orders/{orderId}` | positive integer path ID                 | generated `ManagerOrderDetail`               | `400`, `404`, network/5xx |
| Populate customer filter | `GET /api/admin/customers`        | pages of 100 until `totalPages` complete | generated `CustomerPage`                     | `400`, network/5xx        |

The synchronized snapshot describes both order-read operations as anonymous and
omits `401`/`403`, matching provider `AllowAnonymous`.

## Client projection

- Runtime validation accepts only the generated response fields and rejects an
  invalid envelope/required value before mapping.
- List mapping returns `{orderId, orderNumber, counterpartyName, createdAtUtc,
lineCount, totalAmount, syncStatus}`. `oneCDocumentNumber` is not required by
  the history card.
- Detail mapping returns order identity/date, counterparty snapshot, optional
  comment, read-only lines, total, status and optional 1С/accepted values.
- Presentation maps UTC to `Europe/Kyiv`, amounts to UAH `uk-UA`, and statuses
  through the single owned orders status vocabulary. Transport models do not
  expose formatted strings.
- Pagination starts at 1 with size 20. Page 1 replaces; later pages merge by
  `orderId`; `pageNumber < totalPages` controls «Показати ще».
- Filter change omits or supplies exact `counterpartyId` and resets page to 1.
  Unknown counterparties are a successful empty page.
- RTK Query owns cache/loading/error state and passes cancellation signals.
  `400` is not automatically retried; explicit user retry handles network/5xx.
- `404` detail maps to the agreed unavailable message. Raw response bodies,
  headers, IDs beyond visible order data, customer PII and 1С diagnostics are
  not logged.

## Contract verification

- `npm run contracts:sync -- <clean-path-to-KedrStore>` refreshes the provider
  snapshot and `SOURCE.md` from the backend commit containing `AllowAnonymous`.
- `npm run contracts:lint` must pass with only recorded unrelated warnings.
- `npm run contracts:generate` updates generated transport types; no handwritten
  DTO mirror is introduced.
- `npm run contracts:check` must pass before order data-access tasks begin.
- Focused contract/mapping tests are planned under
  `libs/mobile/orders/data-access/src/` and customer regression remains under
  the extracted customers data-access boundary.
- Compatibility: provider commit
  `364b5f12d18cddb6efc800263581b23d25b6e484` and generated types are the
  implementation baseline.
