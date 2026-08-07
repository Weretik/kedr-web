# Фаза 02 — User story P1: Browse catalog

**Goal:** користувач переглядає швидкий список товарів із фото й safe pagination.  
**Independent test:** відкрити Каталог, прокрутити картки, завантажити наступну порцію та перевірити empty/error/offline states.

- [x] T008 [P] [US1] Додати typed RTK Query endpoint для catalog page у `libs/mobile/catalog/data-access/src/api/catalog.api.ts`.
- [x] T009 [P] [US1] Додати `ProductCard`, `CatalogList` і catalog loading/empty/error states у `libs/mobile/catalog/ui/src/`.
- [x] T010 [US1] Додати `CatalogScreen` з `FlatList`, pull-to-refresh, next-page action і deduplication у `libs/mobile/catalog/feature/src/screens/catalog-screen.tsx`.
- [x] T011 [US1] Замінити placeholder thin route у `apps/mobile/src/app/(tabs)/catalog.tsx` на public `CatalogScreen`.
- [x] T012 [US1] Додати mapper, list state і screen tests у відповідні `*.spec.ts(x)` файли.

## Checkpoint

P1 працює без search/filter API details поза default query; product list залишається responsive на Galaxy A12. UI розділено на `components` і `states`, а feature state із deduplication винесено з `CatalogScreen`. Web export не завершився в межах 60-секундного ліміту; потрібна окрема ручна перевірка Expo Go і web.
