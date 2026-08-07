# Implementation plan: Вибір категорії у mobile catalog

**Spec:** [spec.md](spec.md)  
**Дата:** 2026-07-31

## Summary

Розширити наявний catalog domain без нової route або library: `data-access`
отримує і мапить category rows, `feature` підключає RTK Query result до filter
controls, а `ui` відображає existing selector і його states. Apply flow reducer
лишається єдиним місцем, яке передає valid `categoryId` в products query та
скидає page.

## Technical context

- **Stack:** Expo SDK 56, React Native, React Native Paper, RTK Query, Redux Toolkit, Nx.
- **Testing:** Jest + React Native Testing Library: mapper, API hook/controller, modal/selector states; Android Expo Go і web manual checks.
- **Target platforms:** Android і web; iOS manual check після появи пристрою.
- **Constraints:** server-side filtering, online-first, no new dependency, max three displayed category levels.

## Architecture and source paths

```text
apps/mobile/src/app/(tabs)/catalog.tsx                         # unchanged thin route
libs/mobile/catalog/
├── model/src/entities/catalog-category.ts                      # domain tree and invariants
├── data-access/src/contracts/admin-categories.dto.ts           # private DTO
├── data-access/src/mappers/catalog-categories.mapper.ts        # DTO → category tree
├── data-access/src/api/catalog.api.ts                          # getCatalogCategories RTK endpoint
├── ui/src/components/catalog-category-selector.tsx             # recursive collapsible presentation
├── ui/src/components/catalog-filters-modal.tsx                 # scrollable category and filters modal
└── feature/src/
    ├── hooks/use-catalog-controller.ts                         # categories query + retry wiring
    └── components/catalog-query-controls.tsx                   # pass domain state and callbacks
```

- Route і `CatalogScreen` не містять HTTP або transport DTO.
- `data-access` володіє `AdminCategoryDto`, locale mapping і tree construction.
- `ui` отримує only domain categories, query status та callbacks; RTK hooks не імпортуються.
- `feature` не дублює server state в reducer і не створює providers.

## Constitution check

- [x] Thin Expo Router route, Nx boundaries і public `src/index.ts` збережено.
- [x] DTO, mapper, API errors і cache semantics ізольовано в `data-access`.
- [x] Existing Paper modal/selector покривають scope без нової dependency.

## Complexity tracking

| Відхилення              | Чому потрібне                                                  | Чому простіший варіант не підходить                         |
| ----------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| Flat rows → tree mapper | API повертає depth-first rows, UI потрібна recursive структура | UI не повинен знати `parentId`, DTO або transport ordering. |
