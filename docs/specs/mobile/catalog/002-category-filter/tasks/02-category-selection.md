# Фаза 02 — User story P1: Вибрати категорію

**Goal:** користувач обирає category option і отримує server-filtered catalog.

**Independent test:** у mock-backed screen обрати nested category, Apply і
перевірити `categoryId`, page `1` та active filter chip.

- [x] T008 [US1] Доповнити `CatalogFiltersModal` category selector props і Apply draft flow у `libs/mobile/catalog/ui/src/components/catalog-filters-modal.tsx`.
- [x] T009 [US1] Підключити categories query result і selection/retry callbacks у `libs/mobile/catalog/feature/src/hooks/use-catalog-controller.ts`.
- [x] T010 [US1] Передати domain category state через `libs/mobile/catalog/feature/src/components/catalog-query-controls.tsx`, не додаючи API hook у UI.
- [x] T011 [US1] Додати UI/feature tests у `libs/mobile/catalog/ui/src/components/catalog-filters-modal.spec.tsx` та `libs/mobile/catalog/feature/src/screens/catalog-screen.spec.tsx`.

## Checkpoint

Apply selection формує один products query з valid `categoryId` і `page=1`; reset
видаляє category parameter, а route лишається незмінним.
