# Фаза 01 — Foundation

- [x] T005 Додати `@shopify/flash-list` і `react-native-actions-sheet` у `apps/mobile/package.json` сумісним Expo способом; записати resolved versions і `expo-doctor` output у `quickstart.md`.
- [x] T006 Оновити Jest mocks/test setup лише для нових залежностей у відповідних mobile libraries.
- [x] T007 Додати pure search-history normalization/upsert tests і storage adapter в `libs/mobile/catalog/feature/src/{state,storage}/` без UI.
- [x] T008 Розширити `catalog-query-reducer` independent actions для open/dismiss/apply drafts та видалення одного filter/category/sort; додати reducer tests.

## Checkpoint

Нові залежності сумісні: `expo-doctor` пройшов 21/21, state/storage tests проходять, native-build потреба зафіксована як відсутня.
