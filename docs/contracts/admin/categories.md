# Контракт admin categories

**Споживач:** Mobile product catalog (`002-category-filter`)
**Backend-довідка (за наявності):** `KedrStore/docs/sdd/contracts/catalog/category-read.openapi.yaml`
**Операція:** `getAdminCategories`

## Операція

| Метод і шлях          | Поточний доступ                                                                                 | Відповідь         |
| --------------------- | ----------------------------------------------------------------------------------------------- | ----------------- |
| `GET /api/categories` | Поточний OpenAPI явно задає `security: []`; backend позначає операцію як catalog administration | `AdminCategory[]` |

Перед використанням поза internal/admin surface backend-власник має підтвердити
політику доступу. Mobile не додає authorization bypass і не трактує відсутність
`security: []` у поточній довідці як гарантію публічного доступу.

## Request

Операція не має path, query або body parameters. Вона повертає весь список без
pagination у depth-first порядку; порожній масив є коректною відповіддю до
імпорту категорій.

### Канонічний HTTP-запит

`data-access` виконує запит відносно base URL, який надає
`@mobile/shared/config`:

```http
GET /api/categories
Accept: application/json
```

## Відповідь для frontend

| Поле `AdminCategory`         | Тип і обмеження        | Frontend-мапінг                                                                   |
| ---------------------------- | ---------------------- | --------------------------------------------------------------------------------- |
| `id`                         | integer, ≥ 1           | Стабільний key і значення `filters.categoryId`.                                   |
| `name`                       | string, 1–100          | Не показувати як локалізовану назву, якщо доступне відповідне short-name поле.    |
| `shortNameUk`, `shortNameRu` | string, 1–100          | Обрати `label` за поточною mobile locale.                                         |
| `slug`                       | string, 1–100          | Optional future navigation key; поточний product query використовує `categoryId`. |
| `productTypeIdOneC`          | non-empty string       | Private transport field; не потрібен selector UI.                                 |
| `parentId`                   | integer ≥ 1 або `null` | Побудувати вкладені `CatalogCategoryOption.children`; `null` — root.              |
| `sortOrder`                  | integer, ≥ 0           | Порядок siblings; як tie-breaker застосувати `id`.                                |
| `level`                      | integer, ≥ 0           | Перевірка узгодженості глибини; selector відображає щонайбільше три рівні.        |

### Канонічна форма JSON-відповіді

Значення нижче ілюстративні. Операція повертає масив, а не об'єкт-обгортку.

```json
[
  {
    "id": 5513,
    "name": "Фурнітура",
    "shortNameUk": "Фурнітура",
    "shortNameRu": "Фурнитура",
    "slug": "furnitura-5513",
    "productTypeIdOneC": "5513",
    "parentId": null,
    "sortOrder": 0,
    "level": 0
  },
  {
    "id": 900001,
    "name": "Завіси",
    "shortNameUk": "Завіси",
    "shortNameRu": "Петли",
    "slug": "zavisy-900001",
    "productTypeIdOneC": "900001",
    "parentId": 5513,
    "sortOrder": 0,
    "level": 1
  }
]
```

Private `AdminCategoryDto` і mapper лишаються в
`@mobile/catalog/data-access`. Mapper будує `CatalogCategoryOption[]` за
`parentId`, впорядковує siblings за `sortOrder`, потім `id`, і не передає DTO
у feature або UI.

## Frontend implementation

Mobile споживає operation через public `useGetCatalogCategoriesQuery` з
`@mobile/catalog/data-access`. Hook повертає лише mapped
`CatalogCategoryOption[]`; transport DTO, HTTP response і raw error не
виходять за межі `data-access`.

## Errors і compatibility

- У доступному OpenAPI визначено лише `200`; окремі success/error responses
  для цього endpoint не описані. Нормалізуйте runtime transport errors у
  `ApiError` за [правилами інтеграції](../integration.md#нормалізація-та-обробка-помилок).
- `400` і `404` документовані лише для `GET /api/categories/{id}`, а не для
  списку; selector не має вигадувати field errors для list operation.
- Відповідь unpaged. Не додавайте client-side pagination, query filters або
  cache invalidation semantics без нової версії контракту.
- Якщо `parentId` посилається на відсутній node, є цикл, `level` не відповідає
  дереву або глибина перевищує три, mapper не повинен створювати некоректну
  вкладеність: зберігає доступні root/valid nodes, повідомляє feature про
  деградований error state і не відправляє невалідний `categoryId` у products
  query. Остаточна policy має бути покрита unit test.
