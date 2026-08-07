# Вибір категорії у mobile catalog — модель даних

## Контекст

`GET /api/categories` повертає unpaged administration rows. `data-access`
мапить їх у domain tree, який використовують existing `CatalogCategorySelector`
і filter draft. Product API отримує тільки selected `categoryId`.

## Domain / view model

```text
CatalogCategoryOption
├── id: number (> 0)
├── label: string (localized short name)
└── children: readonly CatalogCategoryOption[]

CatalogFilterSelection
└── categoryId?: number
```

## Межа DTO

- `AdminCategoryDto` приватний у `libs/mobile/catalog/data-access/src/contracts/` і відображає `id`, names, `slug`, `productTypeIdOneC`, `parentId`, `sortOrder`, `level`.
- `catalog-categories.mapper.ts` показує `shortNameUk`; за відсутності української short name використовує `shortNameRu`, будує tree за `parentId` і повертає `CatalogCategoryOption[]`.
- UI, feature та reducer не отримують DTO, `slug`, `productTypeIdOneC` або raw HTTP errors.

## Інваріанти та нормалізація

- `id` додатний integer; лише такий id може бути збережений у `filters.categoryId`.
- `parentId: null` означає root; sibling ordering: `sortOrder`, потім `id`.
- Рівні 0–2 доступні selector; nodes глибше не рендеряться як selectable options у цій feature.
- Duplicate IDs, missing parent, cycle або `level` mismatch є malformed response: mapper виключає такі nodes із результату без infinite recursion.
- `shortNameUk`/`shortNameRu` обов'язкові за contract; українська short name є основною, російська — fallback. UI не використовує raw `name`.
