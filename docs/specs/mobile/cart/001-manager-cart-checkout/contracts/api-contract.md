# Mobile manager cart checkout — API integration contract

## Source

- Backend canonical entry point:
  `C:/Users/Віталій/RiderProjects/KedrStore/docs/sdd/contracts/openapi.yaml`.
- Backend source commit containing stable order operation IDs:
  `1a9e2a6864f2c527fb333276bd0346f21be701f0`.
- Frontend snapshots:
  [`customer-read.openapi.yaml`](../../../../../contracts/openapi/sales/customer-read.openapi.yaml),
  [`admin-order-one-c-sync.openapi.yaml`](../../../../../contracts/openapi/sales/admin-order-one-c-sync.openapi.yaml).
- Stable operations: `getAdminCustomers`, `createAdminOrder`.
- Generated references after `EN-001`:
  `operations['getAdminCustomers']`, `operations['createAdminOrder']`.
- Consumer projection planned by `EN-001`:
  `docs/contracts/sales/manager-order.md`.
- Current frontend provider record:
  [`SOURCE.md`](../../../../../contracts/openapi/SOURCE.md) points to the prior
  backend commit and must be refreshed before transport implementation.

## Operations

| User intent               | Method/path                | Request                                            | Success                       | Expected errors                                    |
| ------------------------- | -------------------------- | -------------------------------------------------- | ----------------------------- | -------------------------------------------------- |
| Завантажити клієнтів      | `GET /api/admin/customers` | query `page`, `pageSize=100`                       | generated customer page       | `400`, network/5xx                                 |
| Створити Sales замовлення | `POST /api/admin/orders`   | required `Idempotency-Key`; generated request body | `200` replay or `201` created | `400`, `404`, `409`, network/5xx; future `401/403` |

Order history, order detail, sync-status and retry operations are available in
the provider contract but are outside this feature.

## Request decisions

- Customer input maps only the selected `counterpartyId`; display name remains
  UI/domain data.
- `comment` is trimmed; an empty value maps to `null`; maximum length is 1000.
- Each cart line maps `productId`, positive integer `quantity` and `amount`.
- `amount` is the total for the complete line and is calculated as
  `unitPrice × quantity`, rounded to two decimal places. It is not editable.
- One canonical payload owns one generated UUID `Idempotency-Key`. An unchanged
  retry reuses it; any customer, comment or cart change invalidates the attempt
  and creates a new key on the next submit.
- Current create/customer operations are temporarily anonymous. This feature
  does not invent Mobile auth; production authorization is deferred.

## Response and error decisions

- `200` and `201` map to `{orderId, orderNumber, syncStatus}`. This flow accepts
  the documented initial `Pending` status and does not poll 1С.
- `400` maps known field errors to customer/comment/lines and otherwise shows a
  safe form error.
- `404` means the selected counterparty is unavailable; the form remains open
  and requires another selection.
- `409` means an idempotency conflict; no automatic retry occurs and a safe
  message asks the manager to review and submit a new action.
- Network/5xx preserves the canonical attempt and key for explicit retry.
- Future `401/403` map to safe unavailable/forbidden states without retry loops.
- Raw backend bodies, headers, PII and internal 1С diagnostics are not logged or
  rendered.

## Client projection

- Runtime schemas validate external customer pages and create responses in
  cart `data-access`; generated types provide compile-time compatibility only.
- Customer mapper returns `{counterpartyId, name, phone}` domain records; local
  search uses a trimmed, case-insensitive normalized `name`.
- Page 1 uses `pageSize=100`. If `pagedInfo.totalPages > 1`, remaining pages are
  loaded and deduplicated before the selector reports search-ready.
- Customer data is cached in RTK Query memory only; it is not persisted.
- User-triggered retry is available for list network/5xx. 4xx is not retried.
- Create mutation supports cancellation before a confirmed server result; an
  ambiguous transport outcome remains retryable with the same key.

## Contract verification

- `EN-001` runs `npm run contracts:sync -- <clean KedrStore path>`,
  `npm run contracts:lint`, `npm run contracts:generate` and
  `npm run contracts:check`.
- Expected backend source after sync:
  `1a9e2a6864f2c527fb333276bd0346f21be701f0` or a reviewed descendant retaining
  the three agreed order operation IDs.
- Mapper/schema and endpoint focused integration tests run in
  `mobile-cart-data-access:test`.
- Compatibility blocker before `EN-001`: frontend snapshot and generated types
  do not yet expose `operations['createAdminOrder']`.
- Residual limitation: create API checks product existence but does not enforce
  current stock; frontend uses the last known cart stock as an explicit UX
  boundary.
