# Implementation plan: Mobile catalog category selection

**Spec:** [spec.md](spec.md)  
**Date:** 2026-07-31

## Summary

Extend the existing catalog domain without a new route or library: `data-access`
fetches and maps category rows, `feature` connects the RTK Query result to filter
controls, and `ui` renders the existing selector and its states. The Apply flow reducer
remains the only place that passes a valid `categoryId` to the products query and
resets the page.

## Technical context

- **Stack:** Expo SDK 56, React Native, React Native Paper, RTK Query, Redux Toolkit, Nx.
- **Testing:** Jest + React Native Testing Library: mapper, API hook/controller, modal/selector states; manual Android Expo Go and web checks.
- **Target platforms:** Android and web; manual iOS check when a device is available.
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

- The route and `CatalogScreen` contain no HTTP or transport DTO.
- `data-access` owns `AdminCategoryDto`, locale mapping, and tree construction.
- `ui` receives only domain categories, query status, and callbacks; RTK hooks are not imported.
- `feature` does not duplicate server state in the reducer or create providers.

## Constitution check

- [x] The thin Expo Router route, Nx boundaries, and public `src/index.ts` are preserved.
- [x] DTO, mapper, API errors, and cache semantics are isolated in `data-access`.
- [x] The existing Paper modal/selector covers the scope without a new dependency.

## Complexity tracking

| Deviation               | Why it is needed                                                      | Why a simpler option is unsuitable                               |
| ----------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Flat rows → tree mapper | The API returns depth-first rows; the UI needs a recursive structure. | The UI must not know `parentId`, the DTO, or transport ordering. |
