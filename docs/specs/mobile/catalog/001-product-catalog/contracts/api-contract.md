# Mobile product catalog — API and navigation

**Frontend contract:** [Admin products](../../../../../contracts/catalog/admin-products.md)
**Backend reference (when available):** `KedrStore/docs/sdd/contracts/catalog/products.openapi.yaml` (`getAdminProducts`)

This frontend contract is the source of truth for mobile. Availability, lookup, and updates to the backend/OpenAPI reference belong to backend owners and do not block mobile implementation.

## API

| Operation               | Endpoint                  | Request                                                                                                                     | Response                                  | Errors                                                 |
| ----------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| First/next catalog page | `GET /api/admin/products` | `searchTerm`, `categorySlug`/`categoryId`, `inStock`, `isSale`, `isNew`, `priceFrom`, `priceTo`, `sort`, `page`, `pageSize` | `AdminProductPage` (`pagedInfo`, `value`) | Normalized `ApiError`; backend `400` validation errors |

`page` starts at `1`; `pageSize` is limited to `1..100` and defaults to
`20`. A next page exists when
`pagedInfo.pageNumber < pagedInfo.totalPages`; the contract is page-based, not
cursor-based. Changing search, filters, or sort resets `page` to `1`.

The current contract has no filter-facets endpoint. P3 shows only documented
parameters; category choices come from the separate
[Admin categories contract](../../../../../contracts/catalog/admin-categories.md) and
`002-category-filter` implementation. The contract also does not define the fields searched by
`searchTerm` or provide currency or price unit, so the UI must not promise those
details.

The controller is currently anonymous, but the source contract marks it as an internal/admin
surface. The mobile client must not treat this as a guarantee of public access or add an
authorization bypass.

DTOs, mappers, and transport details remain in `data-access`.

## Navigation

| Route             | Route file                               | Feature public API                          | Parameters | Back/deep-link behavior   |
| ----------------- | ---------------------------------------- | ------------------------------------------- | ---------- | ------------------------- |
| `/(tabs)/catalog` | `apps/mobile/src/app/(tabs)/catalog.tsx` | `@mobile/catalog/feature` → `CatalogScreen` | None in P1 | Root tab; tab bar visible |

Product detail route, cart, favorites, route-persisted filters, deep links, and
guards are outside this feature.
