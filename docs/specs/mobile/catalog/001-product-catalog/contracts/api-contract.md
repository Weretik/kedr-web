# Mobile product catalog — API і навігація

**Frontend-контракт:** [Admin products](../../../../../contracts/admin/products.md)
**Машиночитане джерело:** `KedrStore/docs/sdd/contracts/catalog/products.openapi.yaml` (`getAdminProducts`)

## API

| Операція | Endpoint | Запит | Відповідь | Помилки |
| --- | --- | --- | --- | --- |
| Перша/наступна сторінка каталогу | `GET /api/admin/products` | `searchTerm`, `categorySlug`/`categoryId`, `inStock`, `isSale`, `isNew`, `priceFrom`, `priceTo`, `sort`, `page`, `pageSize` | `AdminProductPage` (`pagedInfo`, `value`) | Нормалізований `ApiError`; backend `400` validation errors |

`page` починається з `1`; `pageSize` обмежений `1..100` і за замовчуванням
дорівнює `20`. Наступна сторінка існує, коли
`pagedInfo.pageNumber < pagedInfo.totalPages`; contract є page-based, а не
cursor-based. Зміна search, filters або sort скидає `page` до `1`.

Поточний contract не має filter-facets endpoint. P3 може показувати лише
documented parameters; category choices потребують чинного окремого data source.
Contract також не визначає поля пошуку `searchTerm` і не надає currency або
price unit, тому UI не повинен обіцяти ці деталі.

Controller зараз anonymous, але source contract позначає його як internal/admin
surface. Mobile client не повинен вважати це гарантією public access або додавати
authorization bypass.

DTO, mappers і transport details залишаються у `data-access`.

## Навігація

| Route | Route file | Feature public API | Parameters | Back/deep-link behavior |
| --- | --- | --- | --- | --- |
| `/(tabs)/catalog` | `apps/mobile/src/app/(tabs)/catalog.tsx` | `@mobile/catalog/feature` → `CatalogScreen` | Немає у P1 | Root tab; tab bar visible |

Product detail route, cart, favorites, route-persisted filters, deep links і
guards не застосовуються в цій feature.
