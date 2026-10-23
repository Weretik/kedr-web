# Mobile catalog category selection — data model

## Context

`GET /api/categories` returns unpaged administration rows. `data-access`
maps them to a domain tree used by the existing `CatalogCategorySelector`
and filter draft. The Product API receives only the selected `categoryId`.

## Domain / view model

```text
CatalogCategoryOption
├── id: number (> 0)
├── label: string (localized short name)
└── children: readonly CatalogCategoryOption[]

CatalogFilterSelection
└── categoryId?: number
```

## DTO boundary

- `AdminCategoryDto` is private to `libs/mobile/catalog/data-access/src/contracts/` and represents `id`, names, `slug`, `productTypeIdOneC`, `parentId`, `sortOrder`, and `level`.
- `catalog-categories.mapper.ts` uses `shortNameUk`; if the Ukrainian short name is missing, it uses `shortNameRu`, builds the tree from `parentId`, and returns `CatalogCategoryOption[]`.
- UI, feature, and reducer do not receive the DTO, `slug`, `productTypeIdOneC`, or raw HTTP errors.

## Invariants and normalization

- `id` is a positive integer; only such an ID can be stored in `filters.categoryId`.
- `parentId: null` means root; sibling ordering is by `sortOrder`, then `id`.
- Levels 0–2 are available to the selector; deeper nodes are not rendered as selectable options in this feature.
- Duplicate IDs, a missing parent, a cycle, or a `level` mismatch make the response malformed; the mapper excludes those nodes without infinite recursion.
- `shortNameUk`/`shortNameRu` are required by the contract; the Ukrainian short name is primary, and Russian is the fallback. The UI does not use raw `name`.
