# Mobile product catalog — модель даних

## Контекст

Screen отримує лише domain models із `@mobile/catalog/data-access`. Private DTO
маплять `AdminProductPage` contract, описаний у
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

## Межа DTO

- Private DTO залишаються у `@mobile/catalog/data-access`.
- `catalog-products.mapper.ts` мапить `AdminProduct` у `CatalogProduct` і
  normalizes відсутнє image та availability.
- `catalog-query.mapper.ts` серіалізує `CatalogQuery` у documented query
  parameters `GET /api/admin/products`.

## Локальний query state

`CatalogScreen` зберігає локальний user/query state в окремому
`feature/src/state/catalog-query-reducer.ts`. Reducer володіє лише чернеткою
пошуку та `CatalogQuery`; RTK Query лишається джерелом server data, loading і
error states. Дії search, filters і sort атомарно оновлюють query та скидають
`page` до `1`, щоб не дублювати цю логіку між UI handlers.

## Інваріанти й нормалізація

- `CatalogProduct.id` обов'язковий; це `FlatList.keyExtractor` і deduplication
  key.
- Порожній search не передається у request.
- Зміна search, filters або sort скидає `page` до `1`.
- Наступна page існує лише коли `pageNumber < totalPages`; client не вигадує
  cursor або total.
- Operation не надає currency, price unit, category options або search-field
  semantics. Mapper зберігає nullable price, а UI не має натякати на ці
  відсутні деталі.
- `CatalogCategoryOption` — recursive UI/domain shape для майбутнього mapper;
  він не є припущенням про backend DTO. До появи source selector показує лише
  empty preparation state.
