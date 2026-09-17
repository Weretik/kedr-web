# Mobile product catalog — API і навігація

**Frontend-контракт:** [Admin products](../../../../../contracts/catalog/admin-products.md)
**Backend-довідка (за наявності):** `KedrStore/docs/sdd/contracts/catalog/products.openapi.yaml` (`getAdminProducts`)

Цей frontend-контракт є джерелом істини для mobile. Доступність, пошук і актуалізація backend/OpenAPI довідки належать backend-власникам і не блокують mobile-реалізацію.

## API

| Операція                         | Endpoint                  | Запит                                                                                                                       | Відповідь                                 | Помилки                                                    |
| -------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| Перша/наступна сторінка каталогу | `GET /api/admin/products` | `searchTerm`, `categorySlug`/`categoryId`, `inStock`, `isSale`, `isNew`, `priceFrom`, `priceTo`, `sort`, `page`, `pageSize` | `AdminProductPage` (`pagedInfo`, `value`) | Нормалізований `ApiError`; backend `400` validation errors |

`page` починається з `1`; `pageSize` обмежений `1..100` і за замовчуванням
дорівнює `20`. Наступна сторінка існує, коли
`pagedInfo.pageNumber < pagedInfo.totalPages`; contract є page-based, а не
cursor-based. Зміна search, filters або sort скидає `page` до `1`.

Поточний contract не має filter-facets endpoint. P3 показує лише documented
parameters; category choices надходять через окремий
[Admin categories contract](../../../../../contracts/catalog/admin-categories.md) і
реалізацію `002-category-filter`. Contract також не визначає поля пошуку
`searchTerm` і не надає currency або price unit, тому UI не повинен обіцяти ці
деталі.

Controller зараз anonymous, але source contract позначає його як internal/admin
surface. Mobile client не повинен вважати це гарантією public access або додавати
authorization bypass.

DTO, mappers і transport details залишаються у `data-access`.

## Навігація

| Route             | Route file                               | Feature public API                          | Parameters | Back/deep-link behavior   |
| ----------------- | ---------------------------------------- | ------------------------------------------- | ---------- | ------------------------- |
| `/(tabs)/catalog` | `apps/mobile/src/app/(tabs)/catalog.tsx` | `@mobile/catalog/feature` → `CatalogScreen` | Немає у P1 | Root tab; tab bar visible |

Product detail route, cart, favorites, route-persisted filters, deep links і
guards не застосовуються в цій feature.
