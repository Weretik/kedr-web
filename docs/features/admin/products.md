# Admin Products

**Status:** implemented. Routes: `/catalog` and `/catalog/:productSlug`. Requirements and checks: [read-only browsing SDD](../../specs/admin/products/001-read-only-product-browsing/README.md); composition rules: [Admin standard](../../standards/admin/list-detail-pages.md).

- The [list](../../../libs/admin/products/feature/src/pages/products-page.tsx) has modes “Усі товари”, “Без фото”, and “На сайті”. [ProductsDataGrid](../../../libs/admin/products/ui/src/tables/products-data-grid.tsx) sends supported search, filters, sorting, and pagination to the server; tab state is stored in the URL.
- [Details](../../../libs/admin/products/feature/src/pages/product-details-page.tsx) show product data and media and return to the previous list state. The list and details can add a product to the [current order set](orders.md) through an AppRouter callback.
- [Products data access](../../../libs/admin/products/data-access/src/api/admin-products.api.ts) handles requests and mapping. Operations are described in the [products contract](../../contracts/catalog/admin-products.md) and [missing-photo products contract](../../contracts/catalog/missing-photo-products.md).

## Architecture

```mermaid
flowchart LR
    App[AppRouter] --> Routes[createProductsRoutes]
    Routes --> List[ProductsPage]
    Routes --> Detail[ProductDetailsPage]
    List --> Api[products data access]
    Detail --> Api
    Api --> Model[products model]
    List --> Grid[ProductsDataGrid]
    Detail --> Content[ProductDetailsContent]
    List -. add callback .-> App
    Detail -. add callback .-> App
    App --> Set[Current order set]
```

## Code structure

```text
libs/admin/products/
├── feature/src/products.routes.tsx               # routes and add callback
├── feature/src/pages/products-page.tsx           # modes and list state
├── feature/src/pages/product-details-page.tsx    # product details
├── data-access/src/api/admin-products.api.ts     # catalog requests
├── data-access/src/mappers/                     # data validation and projection
├── model/src/                                   # product types and parameters
└── ui/src/                                      # table and detail blocks without HTTP

libs/admin/shared/ui/src/                        # status pill, grid overlay, page header
```
