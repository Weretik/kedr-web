# Контракт admin products

**Споживач:** Mobile product catalog (`001-product-catalog`)  
**Джерело OpenAPI:** `KedrStore/docs/sdd/contracts/catalog/products.openapi.yaml`  
**Операція:** `getAdminProducts`

## Операція

| Метод і шлях | Поточний доступ | Відповідь |
| --- | --- | --- |
| `GET /api/admin/products` | Поточний controller anonymous; лише internal/admin surface | `AdminProductPage` |

Backend contract явно вимагає обмежити цей route перед використанням поза
internal frontend. Mobile feature не додає authorization bypass і не вважає
поточне налаштування гарантією public access.

## Request

Усі parameters optional. Не серіалізуйте порожнє значення filter.

| Параметр запиту | Тип і обмеження | Використання у frontend |
| --- | --- | --- |
| `searchTerm` | string, max 100 | Server-side search. Contract не визначає поля, за якими виконується пошук. |
| `categorySlug` | string, max 100 | Category filter, коли slug уже доступний. |
| `categoryId` | integer, minimum 1 | Category filter, коли ID уже доступний. |
| `inStock` | boolean, default `true` | Availability filter. |
| `isSale`, `isNew` | boolean | Boolean catalog filters. |
| `priceFrom`, `priceTo` | number, minimum 0 | Price range за backend semantics. |
| `sort` | `IdAsc`, `IdDesc`, `NameAsc`, `NameDesc`, `PriceAsc`, `PriceDesc`; default `IdAsc` | Значення sort menu. |
| `page` | integer, minimum 1, default `1` | Поточна сторінка. |
| `pageSize` | integer, 1–100, default `20` | Розмір сторінки; mobile використовує `20`, якщо feature-рішення не зміниться. |

Контракт не надає filter-facets operation. UI може показувати лише parameters
вище; category choices потребують чинного окремого data source і не можуть
вигадуватися на основі products response.

### Канонічний HTTP-запит

`data-access` виконує `GET` відносно base URL, який надає
`@mobile/shared/config`. Наприклад, перша сторінка пошуку з доступними товарами
та сортуванням за назвою:

```http
GET /api/admin/products?searchTerm=кабель&inStock=true&sort=NameAsc&page=1&pageSize=20
Accept: application/json
```

Параметри без значення не передаються. Для наступної сторінки змінюється лише
`page`. При зміні `searchTerm`, filters або `sort` `data-access` надсилає
`page=1`.

## Відповідь для frontend

`AdminProductPage` містить `pagedInfo` і `value`.

| Поле | Тип | Frontend-мапінг |
| --- | --- | --- |
| `pagedInfo.pageNumber`, `pageSize`, `totalPages`, `totalRecords` | numbers | Визначають наступну сторінку й стан list footer. |
| `value[].id` | integer | Перетворити на domain ID/string key; використовувати для deduplication. |
| `value[].nameUk`, `nameRu` | strings | Вибрати display name за mobile locale. |
| `value[].photo` | string | Product image URL; відсутнє/некоректне значення мапити в чинний fallback. |
| `value[].price` | number або `null` | Ціна для відображення; currency і unit operation не надає. |
| `value[].inStock`, `isSale`, `isNew` | booleans | Availability і catalog badges. |
| `value[].productSlug`, `categoryId`, `stock`, `quantityInPack`, `exportToSite` | Як визначено в OpenAPI | Залишати private у `data-access`, доки domain/UI потреба не буде явно погоджена. |

### Канонічна форма JSON-відповіді

Значення нижче ілюстративні; names і structure відповідають OpenAPI contract.

```json
{
  "pagedInfo": {
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 3,
    "totalRecords": 42
  },
  "value": [
    {
      "id": 123,
      "nameUk": "Кабель",
      "nameRu": "Кабель",
      "productSlug": "kabel-123",
      "photo": "https://cdn.example.test/products/kabel-123.jpg",
      "categoryId": 5,
      "inStock": true,
      "isSale": false,
      "isNew": true,
      "exportToSite": true,
      "price": 120.5,
      "stock": 17,
      "quantityInPack": 1
    }
  ]
}
```

`catalog.api.ts` отримує цю private DTO, а mapper повертає `CatalogPage` і
`CatalogProduct`. `feature` та UI не звертаються до JSON-відповіді напряму.

## Errors і compatibility

- `200` повертає page; `400` повертає shared validation-error shape.
- Нормалізуйте errors через `shared/api-client` у `ApiError`; див.
  [нормалізацію та обробку помилок](../integration.md#нормалізація-та-обробка-помилок).
- Pagination page-based, не cursor-based. Зміна search, filters або sort скидає
  `page` до `1`.
- Відсутні currency, price unit, source category options і search-field
  semantics — відомі обмеження operation. UI не повинен заявляти деталі, яких
  contract не надає.
