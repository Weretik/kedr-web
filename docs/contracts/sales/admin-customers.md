# Admin customer consumer contract

## Machine-readable contract

- OpenAPI: [`customer-read.openapi.yaml`](../openapi/sales/customer-read.openapi.yaml)
- Operations: `getAdminCustomers`, `getAdminCustomerById`
- Generated transport types: `operations['getAdminCustomers']` and `operations['getAdminCustomerById']`
- Consumer: Admin customer list and detail card
- Snapshot provenance: [`SOURCE.md`](../openapi/SOURCE.md)

Both operations belong to the provider. The current OpenAPI has `security: []`, and the controller allows anonymous access; enabling production access requires a decision by the backend owner.

## Request projection

The updated provider OpenAPI accepts `page >= 1`, `pageSize` from 1 to 100, optional `searchTerm`, `counterpartyId`, `name`, `phone` (each text value up to 100 characters), and `sort`: `name`, `-name`, `counterpartyId`, `-counterpartyId`, `phone`, `-phone`. Provider defaults are `page=1`, `pageSize=20`, and `sort=name`. `searchTerm` searches ID, name, and phone; the server calculates the count after filters and before pagination. The Admin UI uses `searchTerm`, `sort`, `page`, and `pageSize`: one search field in the table toolbar and sorting by name, phone, or ID, without column filters. Other parameters remain API capabilities. When search or sorting changes, the UI returns to page 1. Details require a non-empty `counterpartyId` in the path; the list URL preserves search, sorting, and pagination for return navigation.

**Synchronization status 2026-10-20:** the frontend snapshot has provenance from backend commit `02429192d02e8e9252d06d6ea984affa0d216aa7` per `SOURCE.md`; it already includes the `sort` parameter. The current server-side sorting implementation was checked against backend commit `8fc8729`. Request parameters are checked against `CustomerPageParams` with TypeScript `satisfies`, without an assertion. The snapshot and generated types were not edited manually.

## Response projection and UI

- List: `pagedInfo` provides server pagination and the total number of matching customers; rows contain `counterpartyId`, `name`, and nullable `phone`.
- Details: the same identity and contact fields, plus `email`, `defaultPriceTypeId`, nullable `defaultPriceTypeName`, and `categoryPriceTypes[{categoryId,categoryName,priceTypeId,priceTypeName}]`; both names in the array item are also nullable. The UI shows the price type name instead of the ID, and the category by name and ID. For `null`, it uses the UI text “Назва недоступна”.
- These operations do not return addresses, orders, payment history, an avatar, or customer status.
- `@admin/clients/data-access` validates unknown responses at runtime and maps generated transport types to UI models. Feature and UI do not import DTOs.
- A detail `404` means “not found”. Network/server errors provide a safe retry action without showing the response body or logging contact details.

A change to provider fields or access rules requires updating the canonical backend OpenAPI first, then the versioned snapshot and generated types according to the [contract workflow](../README.md).
