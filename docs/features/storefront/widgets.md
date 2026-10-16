# In-stock widget Storefront — наявний, не підключений

**Стан:** [InStockProducts](../../../libs/storefront/feature/widgets/src/lib/in-stock-products/in-stock-products.ts) і [InStockFacade](../../../libs/storefront/feature/widgets/src/lib/in-stock-products/in-stock.facade.ts) існують, але застосунок не імпортує цей віджет.

Facade читає товари через [ProductListRepository](../../../libs/storefront/data-access/src/lib/catalog/repositories/product-list.repository.ts). Перед підключенням до сторінки перевір її стан завантаження й повторне використання [каталогу](catalog/catalog.md).

## Схема будови

```mermaid
flowchart LR
Widget["InStockProducts — не підключено"] --> Facade["InStockFacade"]
Facade --> Repository["ProductListRepository"]
```

## Структура в коді

Фактичні точки входу й основні файли фічі (інші файли цих каталогів тут не перелічено):

```text
libs/storefront/data-access/
└── src/lib/catalog/repositories/product-list.repository.ts  # реалізація фічі

libs/storefront/feature/widgets/
└── src/lib/in-stock-products/
    ├── in-stock-products.ts  # реалізація фічі
    └── in-stock.facade.ts  # стан і взаємодія з даними
```
