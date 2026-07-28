# Mobile product catalog — API і навігація

## API

| Операція | Endpoint | Request | Response | Errors |
| --- | --- | --- | --- | --- |
| Перша/наступна сторінка каталогу | `[NEEDS CLARIFICATION]` | search, filters, sort, cursor/page, limit | `CatalogPage` DTO | normalized API error |
| Filter facets | `[NEEDS CLARIFICATION]` | catalog context за потреби | filter groups/options | normalized API error |

Потрібний backend/OpenAPI contract до реалізації:

1. endpoint і HTTP method;
2. cursor або offset/page pagination semantics, `limit` та total/hasNext fields;
3. доступні search fields і мінімальна довжина запиту;
4. filter facets, multiple selection і allowed sort values;
5. product id, image URL, price, currency, article та availability DTO fields;
6. authorization/region/price-group rules і standard error shape.

DTO, mapper і transport details лишаються в `data-access`.

## Навігація

| Route | Route file | Feature public API | Параметри | Back/deep-link behavior |
| --- | --- | --- | --- | --- |
| `/(tabs)/catalog` | `apps/mobile/src/app/(tabs)/catalog.tsx` | `@mobile/catalog/feature` → `CatalogScreen` | немає в P1 | root tab; tab bar visible |

Product detail route, cart, favorites, route-persisted filters, deep links і guards не застосовуються в цій feature.
