# API contract

Use the planned operations `getAdminWorkspaceOrders` and `getAdminOrderDrafts` with the current customer's `counterpartyId`, together with the existing `getAdminCustomerById` operation. Responses are paginated, and the server returns `totalRecords` after filtering by customer. Lists do not fetch all records for local filtering.

The operations are included in the versioned frontend snapshot from KedrStore commit `b3797c1` in `docs/contracts/openapi/`; generated types have been updated. Their provenance is recorded in [`SOURCE.md`](../../../../../contracts/openapi/SOURCE.md). The consumer projection for orders follows this [rule](../../../../../standards/shared/api-data-rules.md). The contract and handling of 401/403, 404, and 409 are described in the [orders SDD](../../../orders/001-order-workspace/contracts/api-contract.md). Do not create a duplicate API for the customer-specific list.
