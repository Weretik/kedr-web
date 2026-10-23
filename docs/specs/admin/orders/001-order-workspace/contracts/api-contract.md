# API and state

**Contract state as of 2026-10-21:** KedrStore SDD Sales 004/005 is implemented; the frontend synchronized provider commit `b3797c1` in `docs/contracts/openapi/`, `SOURCE.md`, and generated types. This project does not link to another repository. The operation IDs below already exist in the snapshot; the [consumer projection](../../../../../contracts/sales/admin-order-workspace.md) describes their use.

| Scenario             | operationId                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Orders table/details | `getAdminWorkspaceOrders`, `getAdminWorkspaceOrderById`                                                                    |
| Quote/checkout       | `quoteAdminWorkspaceOrder`, `createAdminWorkspaceOrder`                                                                    |
| Draft table/CRUD     | `getAdminOrderDrafts`, `createAdminOrderDraft`, `getAdminOrderDraftById`, `updateAdminOrderDraft`, `deleteAdminOrderDraft` |
| Customer search      | Existing `getAdminCustomers`                                                                                               |

Lists are server-driven: `pagedInfo`, searchTerm, exact counterpartyId, sort, page/pageSize; do not derive `totalRecords` from the page length. Checkout sends `counterpartyId,lines[{productId,quantity}],quoteFingerprint` and a new UUID `Idempotency-Key`; the request contains neither unitPrice nor amount. Keep the key with the pending operation for retries; do not generate a new one when retrying after a timeout. A draft has `draftId` and version, with no orderNumber; its quote is server-derived. A `409` price change shows the new total; a `409` draft conflict requires reload; 401/403 follows the existing Admin session flow.

`DraftDetail` contains `pricingStatus: Available | Unavailable`. If pricing is unavailable, `totalAmount`, `productName`, `unitPrice`, and `lineAmount` may be `null`; draft details remain available, and the UI explains why and does not present these fields as current prices. `Quote` always requires non-null names and prices. After changing the customer/lines or reusing a draft, checkout is possible only after a new successful `Quote`.

Runtime validation and the mapper convert transport DTOs into the orders model; components do not import generated types. The local set is not an RTK Query cache and contains no server prices. When offline, it remains available for editing, while saving/checkout require a successful server quote.
