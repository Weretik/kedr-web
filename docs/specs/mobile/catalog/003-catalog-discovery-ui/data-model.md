# Модель даних: catalog discovery UI

## Чинні дані

`CatalogProduct`, `CatalogQuery`, `CatalogFilterSelection` і `CatalogSort` лишаються чинними model-типами. API DTO та mapper не змінюються.

## Новий локальний view/state model

```text
CatalogDiscoveryState
├── query: CatalogQuery                    # чинний applied API query
├── searchSheet
│   └── draft: string                      # не впливає на API до Apply
├── filtersSheet
│   └── draft: CatalogFilterSelection      # не впливає на API до Apply
├── categorySheet
│   └── draftCategoryId?: number           # не впливає на API до Apply
├── activeSheet: 'search' | 'sort' | 'filters' | 'categories' | null
└── searchHistory: readonly string[]       # 0..10 локальних normalized phrases
```

## Persistent storage boundary

```text
AsyncStorage key: mobile.catalog.search-history.v1
value: JSON string[]
```

- Storage adapter живе в `libs/mobile/catalog/feature/src/storage/` і експортується лише через `feature/src/index.ts`, якщо потрібен поза internal feature code.
- У storage записуються лише нормалізовані непорожні фрази, без user ID, токенів, товарів або результатів API.
- Нормалізація: `trim`, collapse repeated whitespace; deduplication порівнює case-insensitive, але зберігає останній введений display text.
- Новий applied search переноситься на початок; список обрізається до 10. Corrupt/не-масивне значення читається як порожня історія й перезаписується тільки під час наступного успішного Apply.

## Інваріанти

- `searchHistory.length <= 10`.
- Порожня фраза ніколи не потрапляє до history.
- Лише застосований query викликає `useGetCatalogProductsQuery`; draft у sheet — ні.
- Видалення chip скидає `query.page` до `1` та не змінює нецільові query fields.
- Default sort `IdAsc` не створює chip.
- Для category chip використовується уже замаплений український `CatalogCategoryOption.label`, не transport DTO.
