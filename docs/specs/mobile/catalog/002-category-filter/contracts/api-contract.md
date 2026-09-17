# Вибір категорії у mobile catalog — API і навігація

**Frontend-контракт:** [Admin categories](../../../../../contracts/catalog/admin-categories.md)
**Машиночитане джерело:** `KedrStore/docs/sdd/contracts/catalog/category-read.openapi.yaml` (`getAdminCategories`)

## API

| Операція                        | Endpoint                  | Request                                | Response                  | Errors                                                                    |
| ------------------------------- | ------------------------- | -------------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| Завантажити category options    | `GET /api/categories`     | немає                                  | `CatalogCategoryOption[]` | normalized `ApiError`; OpenAPI формально визначає лише `200`              |
| Застосувати category до catalog | `GET /api/admin/products` | `categoryId` + існуючий products query | `CatalogPage`             | як у [Admin products](../../../../../contracts/catalog/admin-products.md) |

Канонічні request/response наведено у frontend-контракті [Admin
categories](../../../../../contracts/catalog/admin-categories.md); private DTO і mapper
залишаються в `data-access`. Categories operation unpaged. Зміна selection
виконується only через Apply reducer action, скидає products `page` до `1` і не
серіалізує порожній/невалідний id. Access policy endpoint — production blocker,
який належить backend-власнику.

## Навігація

| Route             | Route file                               | Feature public API                          | Параметри | Back/deep-link behavior                                         |
| ----------------- | ---------------------------------------- | ------------------------------------------- | --------- | --------------------------------------------------------------- |
| `/(tabs)/catalog` | `apps/mobile/src/app/(tabs)/catalog.tsx` | `@mobile/catalog/feature` → `CatalogScreen` | Немає     | Existing root tab; modal closes without changing applied query. |

Нова route, deep link, permissions, persisted category filter та category details
не застосовуються.
