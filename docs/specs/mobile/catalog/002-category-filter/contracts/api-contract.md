# Mobile catalog category selection — API and navigation

**Frontend contract:** [Admin categories](../../../../../contracts/catalog/admin-categories.md)
**Machine-readable source:** `KedrStore/docs/sdd/contracts/catalog/category-read.openapi.yaml` (`getAdminCategories`)

## API

| Operation                 | Endpoint                  | Request                                | Response                  | Errors                                                                     |
| ------------------------- | ------------------------- | -------------------------------------- | ------------------------- | -------------------------------------------------------------------------- |
| Load category options     | `GET /api/categories`     | none                                   | `CatalogCategoryOption[]` | normalized `ApiError`; OpenAPI formally defines only `200`                 |
| Apply category to catalog | `GET /api/admin/products` | `categoryId` + existing products query | `CatalogPage`             | as in [Admin products](../../../../../contracts/catalog/admin-products.md) |

Canonical requests/responses are defined in the frontend contract [Admin
categories](../../../../../contracts/catalog/admin-categories.md); the private DTO and mapper
remain in `data-access`. The categories operation is unpaged. Selection changes
occur only through the Apply reducer action, reset the products `page` to `1`, and do not
serialize an empty/invalid ID. The endpoint access policy is a production blocker
for the backend owner to resolve.

## Navigation

| Route             | Route file                               | Feature public API                          | Parameters | Back/deep-link behavior                                             |
| ----------------- | ---------------------------------------- | ------------------------------------------- | ---------- | ------------------------------------------------------------------- |
| `/(tabs)/catalog` | `apps/mobile/src/app/(tabs)/catalog.tsx` | `@mobile/catalog/feature` → `CatalogScreen` | None       | Existing root tab; modal closes without changing the applied query. |

No new route, deep link, permissions, persisted category filter, or category details
are included.
