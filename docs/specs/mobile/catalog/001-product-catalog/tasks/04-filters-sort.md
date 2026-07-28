# Фаза 04 — User story P3: Filters and sort

**Goal:** користувач звужує і впорядковує server-side каталог.  
**Independent test:** застосувати facets і sort, побачити active chips, потім скинути всі query controls.

- [ ] T017 [P] [US3] Додати filter/sort domain types і validation у `libs/mobile/catalog/model/src/`.
- [ ] T018 [P] [US3] Додати private facets DTO/mapper і query serialization у `libs/mobile/catalog/data-access/src/`.
- [ ] T019 [US3] Додати Paper filters modal, active Chips, sort Menu і accessible names у `libs/mobile/catalog/ui/src/`.
- [ ] T020 [US3] Скомпонувати filters/sort orchestration, reset pagination і tests у `libs/mobile/catalog/feature/src/`.

## Checkpoint

Filters/sort мають один query source of truth; reset повертає default query без duplicate products.
