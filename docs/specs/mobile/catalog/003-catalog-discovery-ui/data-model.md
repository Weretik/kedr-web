# Data model: catalog discovery UI

## Current data

`CatalogProduct`, `CatalogQuery`, `CatalogFilterSelection`, and `CatalogSort` remain the current model types. The API DTO and mapper do not change.

## New local view/state model

```text
CatalogDiscoveryState
├── query: CatalogQuery                    # current applied API query
├── searchSheet
│   └── draft: string                      # does not affect API until Apply
├── filtersSheet
│   └── draft: CatalogFilterSelection      # does not affect API until Apply
├── categorySheet
│   └── draftCategoryId?: number           # does not affect API until Apply
├── activeSheet: 'search' | 'sort' | 'filters' | 'categories' | null
└── searchHistory: readonly string[]       # 0..10 locally stored normalized phrases
```

## Persistent storage boundary

```text
AsyncStorage key: mobile.catalog.search-history.v1
value: JSON string[]
```

- The storage adapter lives in `libs/mobile/catalog/feature/src/storage/` and is exported only through `feature/src/index.ts` if needed outside internal feature code.
- Only normalized, non-empty phrases are stored; no user ID, tokens, products, or API results are included.
- Normalization: `trim`, collapse repeated whitespace; deduplication compares case-insensitively while preserving the latest entered display text.
- A newly applied search moves to the beginning; the list is capped at 10. A corrupt or non-array value is read as an empty history and overwritten only on the next successful Apply.

## Invariants

- `searchHistory.length <= 10`.
- An empty phrase is never added to history.
- Only an applied query invokes `useGetCatalogProductsQuery`; the sheet draft does not.
- Removing a chip resets `query.page` to `1` and does not change unrelated query fields.
- The default `IdAsc` sort does not create a chip.
- The category chip uses the already mapped Ukrainian `CatalogCategoryOption.label`, not the transport DTO.
