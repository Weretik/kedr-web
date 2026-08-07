# Фаза 03 — User story P2: Search catalog

**Goal:** користувач знаходить товар через server-side search.  
**Independent test:** ввести й очистити query, перевірити debounce, reset pagination та empty search result.

- [x] T013 [P] [US2] Додати search field та query invariants у `libs/mobile/catalog/model/src/`.
- [x] T014 [P] [US2] Додати Paper `Searchbar` presentation у `libs/mobile/catalog/ui/src/catalog-toolbar.tsx`.
- [x] T015 [US2] Додати debounce, cancellation/stale-result protection і reset pagination у `libs/mobile/catalog/feature/src/screens/catalog-screen.tsx`.
- [x] T016 [US2] Додати search, empty-result і accessibility tests у `libs/mobile/catalog/feature/src/**/*.spec.tsx`.

## Checkpoint

Search query використовує `currentData`, тому не змінює UI застарілою відповіддю та не фільтрує повний каталог на клієнті. Потрібна окрема ручна перевірка Expo Go і web; попередній web export не завершився в межах 60-секундного ліміту.
