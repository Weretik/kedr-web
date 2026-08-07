# Фаза 04 — US3: Control sheets і chips

- [x] T017 [US3] Створити icon action row і окремий sort action sheet; перенести чинні sort options, selected indicator і immediate apply.
- [x] T018 [US3] Перетворити filters modal на великий filters action sheet без category selector; додати двобігунковий price range `0–20 000`, draft Apply/dismiss/reset rules.
- [x] T019 [US3] Створити category action sheet, повторно використавши `CatalogCategorySelector`, з loading/error/empty/retry, scroll та draft Apply.
- [x] T020 [US3] Переробити `CatalogActiveFilters` на individual closeable Paper Chips для кожного filter/category/sort; додати reducer/controller callbacks точкового видалення.
- [x] T021 [US3] Додати tests для всіх sheet transitions, selected state, category loading/error та single-chip removal.

## Checkpoint

Text searchbar/filter/sort controls прибрані з верхньої частини екрана; усі query controls мають однозначну іконку, sheet і granular chip state.
