# Mobile product catalog — модель даних

## Контекст

Screen отримує тільки domain models із `@mobile/catalog/data-access`. Точні DTO
та API field names очікують погодженого контракту.

## Domain / view model

```text
CatalogProduct
├── id: string
├── name: string
├── imageUrl: string | null
├── price: Money | null
├── availability: in_stock | out_of_stock | unknown
└── article: string | null

CatalogQuery
├── search: string
├── filters: CatalogFilterSelection
├── sort: CatalogSort
└── pagination: cursor | page (залежить від API contract)

CatalogPage
├── items: CatalogProduct[]
├── nextCursor: string | null | undefined
└── total: number | null | undefined
```

## Межа DTO

- Private DTO залишається у `@mobile/catalog/data-access`; його структура не визначена до API contract.
- `catalog-products.mapper.ts` перетворює DTO в `CatalogProduct` і normalizes absent image, availability та money fields.
- `catalog-query.mapper.ts` перетворює `CatalogQuery` у transport query params.

## Інваріанти та нормалізація

- `CatalogProduct.id` обов'язковий і використовується як `FlatList.keyExtractor` та deduplication key.
- Порожній search нормалізується до відсутнього query parameter.
- Будь-яка зміна search/filter/sort скидає continuation cursor/page.
- `nextCursor` і `total` не вигадуються на клієнті: якщо API їх не повертає, UI не показує відповідну інформацію.
- `[NEEDS CLARIFICATION]` Money format, availability enum, filter facets, sort enum і pagination envelope.
