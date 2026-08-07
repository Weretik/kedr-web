# Фаза 02 — US1: Appbar, list і cards

- [x] T009 [US1] Замінити inline toolbar на Paper Appbar у `libs/mobile/catalog/ui/src/components/`, підключивши чинний theme preference control та search callback.
- [x] T010 [US1] Замінити `FlatList` на `FlashList` у `catalog-list.tsx`, зберігши key extraction, refresh, footer і pagination semantics.
- [x] T011 [US1] Оновити `product-card.tsx`: elevated Paper surface, image fallback, назва, `… грн.`, `ID: …`, доступність і long-text rules.
- [x] T012 [US1] Оновити `catalog-screen-content.tsx` і targeted UI tests для theme background, Appbar та list/card rendering.

## Checkpoint

Базовий каталог є самостійно перевірюваним у light/dark темі, а чинні loading/error/empty/pagination states не регресували.
