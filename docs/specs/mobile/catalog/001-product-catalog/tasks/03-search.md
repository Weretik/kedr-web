# Фаза 03 — User story P2: Search catalog

**Goal:** користувач знаходить товар через server-side search.  
**Independent test:** ввести й очистити query, перевірити debounce, reset pagination та empty search result.

- [ ] T013 [P] [US2] Додати search field та query invariants у `libs/mobile/catalog/model/src/`.
- [ ] T014 [P] [US2] Додати Paper `Searchbar` presentation у `libs/mobile/catalog/ui/src/catalog-toolbar.tsx`.
- [ ] T015 [US2] Додати debounce, cancellation/stale-result protection і reset pagination у `libs/mobile/catalog/feature/src/screens/catalog-screen.tsx`.
- [ ] T016 [US2] Додати search, empty-result і accessibility tests у `libs/mobile/catalog/feature/src/**/*.spec.tsx`.

## Checkpoint

Search query не змінює UI застарілою відповіддю та не фільтрує повний каталог на клієнті.
