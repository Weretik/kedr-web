# Admin products consumer contract

## Machine contract

- OpenAPI: [`products.openapi.yaml`](../openapi/catalog/products.openapi.yaml)
- Operation: `getAdminProducts`
- Generated response: `operations['getAdminProducts']['responses'][200]['content']['application/json']`
- Generated query: `NonNullable<operations['getAdminProducts']['parameters']['query']>`
- Consumers: Admin products list, Mobile product catalog

`GET /api/admin/products` є тимчасово anonymous internal/admin surface. Це не
дозвіл на public rollout. Mobile не додає authorization bypass; production
access лишається backend blocker до явного рішення власника API.

## Request projection

Frontend передає лише непорожні параметри, визначені generated query type:
`searchTerm`, `categorySlug`, `categoryId`, `inStock`, `isSale`, `isNew`,
`priceFrom`, `priceTo`, `sort`, `page`, `pageSize`. Значення `sort` є рядковими
OpenAPI enum (`IdAsc`, `IdDesc`, `NameAsc`, `NameDesc`, `PriceAsc`,
`PriceDesc`). Зміна search/filter/sort скидає `page` до `1`.

```http
GET /api/admin/products?searchTerm=кабель&inStock=true&sort=NameAsc&page=1&pageSize=20
Accept: application/json
```

## Consumer mappings

| Consumer | Transport boundary            | Domain projection                                               |
| -------- | ----------------------------- | --------------------------------------------------------------- |
| Admin    | `@admin/products/data-access` | runtime-validated `ProductsListPage` and `AdminProductListItem` |
| Mobile   | `@mobile/catalog/data-access` | `CatalogPage` and localized `CatalogProduct`                    |

Admin валідовує unknown response перед mapping. Mobile використовує generated
response type як compile-time contract і mapper, що нормалізує optional/null
image, stock та localized name. Generated type не експортується з data-access
public API до feature або UI.

## Behavior and limitations

- Pagination page-based; `pageSize` має бути від 1 до 100.
- `price` і `categoryId` можуть бути `null`; OpenAPI не визначає currency або
  price unit.
- Contract не має filter-facets operation і не визначає search-field semantics.
- Transport errors нормалізуються за [integration rules](../integration.md).
- Зміна path, query name, enum або response field потребує нового snapshot,
  regeneration і compatibility review обох consumers.
