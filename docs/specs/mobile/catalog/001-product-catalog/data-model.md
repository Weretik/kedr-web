# Mobile product catalog — data model

## Context

The screen receives only domain models from `@mobile/catalog/data-access`. Private DTOs
map the `AdminProductPage` contract described in
[Admin products](../../../../contracts/catalog/admin-products.md).

## Domain / view model

```text
CatalogProduct
├── id: string
├── name: string
├── imageUrl: string | null
├── price: number | null
├── availability: in_stock | out_of_stock | unknown
└── productSlug: string

CatalogQuery
├── search: string
├── filters: CatalogFilterSelection
├── sort: CatalogSort
└── page: number

CatalogPage
├── items: CatalogProduct[]
├── pageNumber: number
├── pageSize: number
├── totalPages: number
└── totalRecords: number

CatalogCategoryOption
├── id: number
├── label: string
└── children: CatalogCategoryOption[]
```

## DTO boundary

- Private DTOs remain in `@mobile/catalog/data-access`.
- `catalog-products.mapper.ts` maps `AdminProduct` to `CatalogProduct` and
  normalizes a missing image and availability.
- `catalog-query.mapper.ts` serializes `CatalogQuery` into documented query
  parameters for `GET /api/admin/products`.

## Local query state

`CatalogScreen` stores local user/query state in a separate
`feature/src/state/catalog-query-reducer.ts`. The reducer owns only the search draft
and `CatalogQuery`; RTK Query remains the source of server data, loading, and
error states. Search, filters, and sort actions atomically update the query and reset
`page` to `1`, avoiding duplicated logic among UI handlers.

## Invariants and normalization

- `CatalogProduct.id` is required; it serves as the `FlatList.keyExtractor` and deduplication
  key.
- An empty search is not sent in the request.
- Changing search, filters, or sort resets `page` to `1`.
- A next page exists only when `pageNumber < totalPages`; the client does not invent
  a cursor or total.
- The operation does not provide currency, price unit, category options, or search-field
  semantics. The mapper preserves a nullable price, and the UI must not imply these
  missing details.
- `CatalogCategoryOption` is a recursive UI/domain shape for a future mapper;
  it is not an assumption about the backend DTO. Until a source is available, the selector shows only
  an empty preparation state.
