# Admin order and draft consumer contract

## Source and operations

- Provider snapshots: [`admin-order-workspace.openapi.yaml`](../openapi/sales/admin-order-workspace.openapi.yaml) and [`admin-order-drafts.openapi.yaml`](../openapi/sales/admin-order-drafts.openapi.yaml).
- Provenance: [`SOURCE.md`](../openapi/SOURCE.md), KedrStore commit `b3797c1`.
- Operations: `getAdminWorkspaceOrders`, `getAdminWorkspaceOrderById`, `quoteAdminWorkspaceOrder`, `createAdminWorkspaceOrder`, `getAdminOrderDrafts`, `getAdminOrderDraftById`, `createAdminOrderDraft`, `updateAdminOrderDraft`, `deleteAdminOrderDraft`, `getAdminWorkspaceCustomerPrices`.
- Consumer: `@admin/orders/data-access`; `operations[...]` transport types are used only at this boundary, and responses undergo runtime validation and mapping to domain models.

These are separate Admin APIs that are currently available anonymously. The existing `/api/admin/orders` and `POST /api/admin/orders` operations for Mobile are not switched to these operations. Provider OpenAPI was changed locally; this repository's snapshot needs synchronization after the backend revision is committed.

## Lists and details

Both lists accept `page`, `pageSize`, `searchTerm`, exact `counterpartyId`, and `sort`. The UI keeps independent URL state for each tab and applies filters before server pagination. The record count comes from `pagedInfo.totalRecords`. Order search covers order number/customer; draft search covers title/customer. Available order sort fields are `createdAt`, `orderNumber`, `customerName`, `totalAmount`, and their reverse values; draft sort fields are `updatedAt`, `title`, `customerName`, and their reverse values.

Order details contain its number, customer, products, total, and 1C synchronization status. A draft has a separate `draftId`, title, note, and `version`, without an order number. In draft detail responses, `pricingStatus` is `Available` or `Unavailable`. With `Unavailable`, the total and row names/prices/amounts may be `null`; viewing remains available and the UI does not substitute an old price. The new `quoteAdminWorkspaceOrder` operation requires a complete current calculation, and its mapper rejects nullable prices.

## Writes and errors

For a quote with a quantity above current stock, the backend returns HTTP 400 `code=unavailable_product` and a `message` containing the product name and available/requested quantities. `axiosBaseQuery` preserves this code in `ApiError.reason`; the checkout page displays the message so the user can adjust the quantity. The provider snapshot needs synchronization after the backend commit.

Order creation sends the customer, productId/quantity, `quoteFingerprint`, an optional comment, and a UUID `Idempotency-Key`. The server validates products/customer and recalculates the price. On `409 quote_changed`, the frontend shows the new quote and requires confirmation again. A retry of the same pending payload keeps the same key; changing the payload creates a new key.

Draft creation sends title, note, customer, productId/quantity, and `Idempotency-Key`; editing/deletion uses `If-Match: version`. A version `409` requires loading the current draft before a new action. Mutations invalidate the corresponding RTK Query list and detail tags. The local browser-storage product set is not a server draft and does not store prices or customer data.

Do not change DTOs or endpoints in this frontend without provider OpenAPI. The synchronization order is in the [contract workflow](../README.md).

`getAdminWorkspaceCustomerPrices` (`POST /api/admin/order-workspace/customer-prices`) returns the chosen customer's unit price for each requested product (`null` when it has none), without checking stock; checkout uses it to show «Ціна клієнта» before a full quote. Every input line (quote, order, draft) carries `priceAdjustment`, a per-unit UAH discount (negative) or markup; quote lines return `baseUnitPrice` and `priceAdjustment`, stored lines return `priceAdjustment`, and order list rows return `adjustmentAmount`. Invalid adjustments return `400 invalid_price_adjustment`; a negative final price returns `400 negative_price`.
