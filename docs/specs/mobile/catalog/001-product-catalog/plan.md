# Implementation plan: Mobile product catalog

**Spec:** [spec.md](spec.md)  
**Дата:** 2026-07-28

**API-контракт:** [GET /api/admin/products](contracts/api-contract.md)
зафіксований для цієї feature. Він використовує page-based pagination і замінює
попередній contract gate.

## Summary

Створити domain-first catalog feature. `CatalogScreen` оркеструє server query і
локальний UI state; `FlatList` виводить картки; search, filters, sort і next page
оновлюють один typed domain query. Поставку починати лише після погодження API contract.

## Technical context

- **Stack:** Expo SDK 56, React Native `FlatList`, React Native Paper, RTK Query, Redux Toolkit, Nx.
- **Testing:** Jest + React Native Testing Library; Samsung Galaxy A12 Expo Go; web export.
- **Target platforms:** Android і web; iOS ручна перевірка після появи пристрою.
- **Constraints:** server-side data operations, safe area, online-first, image performance, no new dependency в P1.

## Architecture and source paths

```text
apps/mobile/src/app/(tabs)/catalog.tsx             # thin route → CatalogScreen
libs/mobile/catalog/
├── model/src/
│   ├── entities/catalog-product.ts
│   └── queries/catalog-query.ts
├── data-access/src/
│   ├── api/catalog.api.ts
│   ├── mappers/catalog-products.mapper.ts
│   └── queries/catalog-query.mapper.ts
├── ui/src/
│   ├── product-card.tsx
│   ├── catalog-list.tsx
│   ├── catalog-toolbar.tsx
│   ├── catalog-filters-modal.tsx
│   └── catalog-states.tsx
└── feature/src/
    └── screens/catalog-screen.tsx
```

- Route імпортує тільки `CatalogScreen` із `@mobile/catalog/feature`.
- `model` містить pure TS entities, query і invariants; не імпортує React або API.
- `data-access` володіє private DTO, mapper та RTK Query endpoint; API contract не проходить у `ui`.
- `ui` приймає domain data й callbacks через props; не знає router, storage або RTK Query.
- `feature` тримає search debounce, filters modal state та query composition; не створює provider.

## Constitution check

- [x] Thin Expo Router route, Nx boundaries і public `src/index.ts` дотримано.
- [x] DTO, API errors і pagination transport semantics ізольовано в `data-access`.
- [x] `FlatList` і Paper controls покривають P1–P3 без нової list/UI dependency.

## Complexity tracking

| Відхилення | Чому потрібне                          | Чому простіший варіант не підходить |
| ---------- | -------------------------------------- | ----------------------------------- |
| n/a        | `FlatList` уже входить до React Native | n/a                                 |
