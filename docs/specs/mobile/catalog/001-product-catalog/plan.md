# Implementation plan: Mobile product catalog

**Spec:** [spec.md](spec.md)  
**Date:** 2026-07-28

**API contract:** [GET /api/admin/products](contracts/api-contract.md)
is confirmed for this feature. It uses page-based pagination and replaces
the previous contract gate.

## Summary

Create a domain-first catalog feature. `CatalogScreen` orchestrates the server query and
local UI state; `FlatList` renders the cards; search, filters, sorting, and next page
update one typed domain query. Start delivery only after the API contract is agreed.

## Technical context

- **Stack:** Expo SDK 56, React Native `FlatList`, React Native Paper, RTK Query, Redux Toolkit, Nx.
- **Testing:** Jest + React Native Testing Library; Samsung Galaxy A12 Expo Go; web export.
- **Target platforms:** Android and web; manual iOS check when a device is available.
- **Constraints:** server-side data operations, safe area, online-first, image performance, no new dependency in P1.

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

- The route imports only `CatalogScreen` from `@mobile/catalog/feature`.
- `model` contains pure TS entities, query, and invariants; it does not import React or API code.
- `data-access` owns the private DTO, mapper, and RTK Query endpoint; the API contract does not reach `ui`.
- `ui` receives domain data and callbacks through props; it does not know about the router, storage, or RTK Query.
- `feature` holds the search debounce, filters modal state, and query composition; it does not create a provider.

## Constitution check

- [x] Thin Expo Router route, Nx boundaries, and public `src/index.ts` are respected.
- [x] DTOs, API errors, and pagination transport semantics are isolated in `data-access`.
- [x] `FlatList` and Paper controls cover P1–P3 without a new list/UI dependency.

## Complexity tracking

| Deviation | Why needed                            | Why a simpler option does not work |
| --------- | ------------------------------------- | ---------------------------------- |
| n/a       | `FlatList` is already in React Native | n/a                                |
