# Фаза 01 — Foundation

- [x] T004 [P] Додати private `AdminCategoryDto` у `libs/mobile/catalog/data-access/src/contracts/admin-categories.dto.ts`.
- [x] T005 [P] Додати tree/locale mapper і malformed-response tests у `libs/mobile/catalog/data-access/src/mappers/catalog-categories.mapper.ts` та `.spec.ts`.
- [x] T006 Додати `getCatalogCategories` RTK Query endpoint і public hook export у `libs/mobile/catalog/data-access/src/api/catalog.api.ts` та `src/index.ts`.
- [x] T007 За потреби уточнити pure category invariants у `libs/mobile/catalog/model/src/entities/catalog-category.ts` і unit tests без DTO imports.

## Checkpoint

`data-access` повертає typed, sorted і safe category tree; UI/feature не бачать
transport DTO або raw errors.
