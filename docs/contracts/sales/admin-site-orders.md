# Admin site orders consumer contract

## Machine-readable contract

- OpenAPI: [OpenAPI snapshot](../openapi/openapi.json)
- Operations: `getAdminQuickOrders`, `getAdminQuickOrderById`, `resendAdminQuickOrderToTelegram` (tag `AdminQuickOrders`, policy `CanManageOrders`)
- Generated transport types: `operations['getAdminQuickOrders']`, `operations['getAdminQuickOrderById']`, `operations['resendAdminQuickOrderToTelegram']`
- Consumer: Admin «Замовлення з сайту» ([feature card](../../features/admin/site-orders.md))
- Provider: KedrStore spec `sales/009-site-orders-in-admin`; snapshot provenance in [`SOURCE.md`](../openapi/SOURCE.md)

## Request projection

- List: `page >= 1`, `pageSize` 1–100, optional `search` (every word matches name or phone; a word that is an order number such as `52992220`, with or without `№`, or a whole id also matches the id, KedrStore spec 009 R-012), optional `delivery=problem` (orders not delivered with an error, or given up). The server orders rows newest first; there is no sort parameter. The Admin sends `search` and `delivery` only when set and checks the parameters against `SiteOrderPageParams` with `satisfies`.
- Detail and resend: `orderId` is a UUID in the path. The Admin rejects any other value before a request.
- Resend has no body and no `Idempotency-Key`: it is a state transition the server checks (only a `failed` order), so a repeat answers 409 and sends nothing twice.

## Response projection and UI

- List rows: `orderId`, `placedAtUtc`, `firstName`, `phone`, `lineCount`, `total`, `telegramStatus` (`sent`, `pending`, `failed`), nullable `telegramLastError`, and the order made for 1C (spec sales/009, R-015): nullable `oneCOrderId`, `oneCOrderNumber`, `oneCDocumentNumber`. `value` may be `null`; the mapper treats it as an empty page.
- Detail: the same buyer fields, `telegramSentAtUtc`, `telegramLastAttemptAtUtc`, `telegramLastError` (nullable), `items[{productId,title,unitPrice,quantity,amount}]`, and the same three `oneC*` fields.
- Resend: 202 with `{orderId, telegramStatus}`; the Admin only refreshes the order and the list. 409 carries a Ukrainian `detail` the Admin shows as is; 404 is «Замовлення не знайдено».
- `@admin/site-orders/data-access` validates responses with zod (an unknown `telegramStatus` fails the request) and maps them to the domain model; feature and UI do not import DTOs. Name and phone are personal data and are never logged.
