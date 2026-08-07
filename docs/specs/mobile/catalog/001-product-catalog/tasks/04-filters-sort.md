# Фаза 04 — User story P3: Filters and sort

**Goal:** користувач звужує і впорядковує server-side каталог.  
**Independent test:** застосувати facets і sort, побачити active chips, потім скинути всі query controls.

- [x] T017 [P] [US3] Додати filter/sort domain types і validation у `libs/mobile/catalog/model/src/`.
- [x] T018 [P] [US3] Додати serialization і тести documented filter/sort query parameters у `libs/mobile/catalog/data-access/src/`.
- [x] T019 [US3] Додати Paper filters modal із boolean/price controls, active Chips, sort Menu і українські accessible names у `libs/mobile/catalog/ui/src/`.
- [x] T020 [US3] Скомпонувати filters/sort orchestration, reset pagination і tests у `libs/mobile/catalog/feature/src/`.
- [x] T021 [US3] Після появи чинного data source підключити до filters modal заготовлений recursive category selector (до 3 рівнів) із loading, empty та error states; не створювати static category list.

## Checkpoint

`feature/src/state/catalog-query-reducer.ts` є єдиним локальним source of truth для draft search, query, filters, sort і pagination. Paper controls застосовують filter/sort атомарно та скидають `page` до `1`; component і feature tests це покривають. Serialization documented product parameters покрита unit test. Category selector підключено через `GET /api/categories` у feature `002-category-filter`: він використовує recursive domain tree до трьох рівнів, loading, empty та error/retry states без static category list.
