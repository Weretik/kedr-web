# mobile-catalog-ui

This library was generated with [Nx](https://nx.dev).

## Public UI API

`@mobile/catalog/ui` contains presentational React Native components for the
catalog screen. Import them only through the library entry point:

```ts
import {
  CatalogActiveFilters,
  CatalogCategorySelector,
  CatalogFiltersModal,
  CatalogList,
  CatalogListFooter,
  CatalogPageState,
  CatalogSortMenu,
  CatalogState,
  CatalogToolbar,
  ProductCard,
} from '@mobile/catalog/ui';
```

The public API is grouped by responsibility:

- Query controls: `CatalogToolbar`, `CatalogActiveFilters`,
  `CatalogFiltersModal`, `CatalogSortMenu`, and `CatalogCategorySelector`.
- Results: `CatalogList`, `CatalogListFooter`, and `ProductCard`.
- Whole-page feedback: `CatalogState` and `CatalogPageState`.

All components are controlled through typed props and callbacks. The calling
feature owns query state, server requests, navigation, storage, debouncing,
and pagination; this library must not import API hooks, Expo Router, or storage
adapters. Keep domain orchestration in `@mobile/catalog/feature` and transport
code in `@mobile/catalog/data-access`.

## Running unit tests

Run `nx test mobile-catalog-ui` to execute the unit tests via [Jest](https://jestjs.io).
