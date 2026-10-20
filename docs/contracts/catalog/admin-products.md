# Admin products consumer contract

## Machine contract

- OpenAPI: [`products.openapi.yaml`](../openapi/catalog/products.openapi.yaml)
- Operations: `getAdminProducts`, `getAdminProductBySlug`
- Generated response: `operations['getAdminProducts']['responses'][200]['content']['application/json']`
- Generated query: `NonNullable<operations['getAdminProducts']['parameters']['query']>`
- Consumers: Admin products list, Mobile product catalog

`GET /api/admin/products` є тимчасово anonymous internal/admin surface. Це не
дозвіл на public rollout. Mobile не додає authorization bypass; production
access лишається backend blocker до явного рішення власника API.

## Request projection

Frontend передає лише визначені generated query type параметри:
`searchTerm`, `categorySlug`, `categoryId`, `inStock`, `isSale`, `isNew`,
`priceFrom`, `priceTo`, `exportToSite`, `sort`, `page`, `pageSize`. Значення `sort` є рядковими
OpenAPI enum (`IdAsc`, `IdDesc`, `NameAsc`, `NameDesc`, `PriceAsc`,
`PriceDesc`, `CategoryAsc`, `CategoryDesc`). Зміна search/filter/sort скидає `page` до `1`. `categoryId` відбирає вибрану категорію та всіх нащадків; рядок повертає `categoryName` з українського `shortNameUk`.

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

У таблиці Admin відображається тільки `nameUk`. Колонка категорії складає шлях
від батьківської до дочірньої за `categoryId` і довідником `getAdminCategories`;
до завантаження довідника показує `categoryName` зі списку. Якщо ID відсутній у
довіднику й `categoryName` порожній, UI показує ID категорії замість вигаданої
назви. Це не змінює transport contract або серверне сортування.

Admin відкриває картку через `GET /api/admin/products/by-slug/{productSlug}` і
перевіряє відповідь runtime mapper. Ця операція повертає обидві назви, ознаки
наявності, акції, новинки й публікації, категорію, фото та схему. Посилання на
конкретний JPG береться лише з поля `photo`; папка сховища доступна окремо.
Frontend snapshot і generated types синхронізовано з backend commit `8fc8729`
2026-10-19. Query mapper перевіряє параметри за generated type, а runtime
mapper перевіряє відповідь перед передачею в UI.

## Behavior and limitations

- Pagination page-based; `pageSize` має бути від 1 до 100.
- `price` і `categoryId` можуть бути `null`; OpenAPI не визначає currency або
  price unit.
- Contract не має filter-facets operation і не визначає search-field semantics.
- Transport errors нормалізуються за [integration rules](../integration.md).
- Зміна path, query name, enum або response field потребує нового snapshot,
  regeneration і compatibility review обох consumers.
