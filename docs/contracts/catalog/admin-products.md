# Admin products consumer contract

## Machine contract

- OpenAPI: [`products.openapi.yaml`](../openapi/catalog/products.openapi.yaml)
- Operations: `getAdminProducts`, `getAdminProductBySlug`
- Generated response: `operations['getAdminProducts']['responses'][200]['content']['application/json']`
- Generated query: `NonNullable<operations['getAdminProducts']['parameters']['query']>`
- Consumers: Admin products list, Mobile product catalog

`GET /api/admin/products` is a temporarily anonymous internal/admin surface. This is not authorization for a public rollout. Mobile does not add an authorization bypass; production access remains a backend blocker until the API owner makes an explicit decision.

## Request projection

The frontend sends only parameters defined by the generated query type: `searchTerm`, `categorySlug`, `categoryId`, `inStock`, `isSale`, `isNew`, `priceFrom`, `priceTo`, `exportToSite`, `sort`, `page`, `pageSize`. `sort` values are string OpenAPI enums (`IdAsc`, `IdDesc`, `NameAsc`, `NameDesc`, `PriceAsc`, `PriceDesc`, `CategoryAsc`, `CategoryDesc`). Changing search/filter/sort resets `page` to `1`. `categoryId` filters the selected category and all descendants; the row returns `categoryName` from Ukrainian `shortNameUk`.

```http
GET /api/admin/products?searchTerm=кабель&inStock=true&sort=NameAsc&page=1&pageSize=20
Accept: application/json
```

## Consumer mappings

| Consumer | Transport boundary            | Domain projection                                               |
| -------- | ----------------------------- | --------------------------------------------------------------- |
| Admin    | `@admin/products/data-access` | runtime-validated `ProductsListPage` and `AdminProductListItem` |
| Mobile   | `@mobile/catalog/data-access` | `CatalogPage` and localized `CatalogProduct`                    |

Admin validates the unknown response before mapping. Mobile uses the generated response type as a compile-time contract and a mapper that normalizes optional/null image, stock, and localized name. The generated type is not exported from the data-access public API to feature or UI.

The Admin table displays only `nameUk`. The category column builds the path from parent to child using `categoryId` and the `getAdminCategories` directory; until the directory is loaded, it shows `categoryName` from the list. If the ID is missing from the directory and `categoryName` is empty, the UI shows the category ID instead of an invented name. This does not change the transport contract or server-side sorting.

Admin opens a product detail through `GET /api/admin/products/by-slug/{productSlug}` and validates the response with a runtime mapper. This operation returns both names, availability, sale, newness and publication flags, category, photo, and diagram. A link to a specific JPG is taken only from the `photo` field; the storage folder is available separately. The frontend snapshot and generated types were synchronized with backend commit `8fc8729` on 2026-10-19. The query mapper checks parameters against the generated type, and the runtime mapper validates the response before passing it to the UI.

## Behavior and limitations

- Pagination is page-based; `pageSize` must be between 1 and 100.
- `price` and `categoryId` may be `null`; OpenAPI does not define currency or price unit.
- The contract has no filter-facets operation and does not define search-field semantics.
- Transport errors are normalized according to the [integration rules](../integration.md).
- A change to the path, query name, enum, or response field requires a new snapshot, regeneration, and compatibility review for both consumers.
