# Implemented frontend feature catalog

This catalog describes the current implementation, not plans from SDDs. Each card has routes, behavior code, data sources, a **Structure diagram**, a **Code structure** tree of key files, **Tests** with focused run commands, and related specifications. [SDDs](../specs/README.md) hold requirements and history; [architecture](../architecture/frontend-inventory.md) describes shared boundaries.

## Admin React

[AppRouter](../../apps/admin/src/app/router/app-router.tsx) assembles routes inside `AdminLayout`. Admin has no separate login screen. See [Admin architecture](../architecture/admin/README.md).

| Feature                               | Route or entry                               | Status                                             |
| ------------------------------------- | -------------------------------------------- | -------------------------------------------------- |
| [Session and shell](admin/session.md) | All routes                                   | Shared layout, navigation, and session             |
| [Dashboard](admin/dashboard.md)       | `/dashboard`                                 | Visual metrics are currently static                |
| [Products](admin/products.md)         | `/catalog`, `/catalog/:productSlug`          | List, details, and adding products to an order set |
| [Customers](admin/clients.md)         | `/customers`, `/customers/:counterpartyId`   | List, details, and order tables                    |
| [Orders and drafts](admin/orders.md)  | `/orders`, `/orders/new`, details and drafts | Lists, checkout, and draft editing                 |

## Mobile React Native

[Expo Router](../../apps/mobile/src/app/_layout.tsx) connects screens from `libs/mobile/*/feature`. `index` currently displays a placeholder; the `profile` tab opens the products-without-photos screen rather than a user profile. See [Mobile architecture](../architecture/mobile/README.md).

| Feature                                                     | Route or entry                              |
| ----------------------------------------------------------- | ------------------------------------------- |
| [Shell and navigation](mobile/shell.md)                     | `_layout.tsx`, `(tabs)/_layout.tsx`         |
| [Browse, search, and filter](mobile/catalog/catalog.md)     | `(tabs)/catalog.tsx`                        |
| [Category selection](mobile/catalog/category-filter.md)     | Part of the catalog screen                  |
| [Discovery UI](mobile/catalog/catalog-discovery.md)         | Part of the catalog screen                  |
| [Product details](mobile/catalog/product-details.md)        | `product/[productSlug].tsx`                 |
| [Products without photos](mobile/catalog/missing-photos.md) | `(tabs)/profile.tsx`                        |
| [Cart and checkout](mobile/sales/cart.md)                   | `(tabs)/cart.tsx`                           |
| [Order history](mobile/sales/orders.md)                     | `(tabs)/orders.tsx`, `orders/[orderId].tsx` |
| [Customer selection](mobile/sales/customers.md)             | Cart and order history                      |

## Storefront Angular

Routes come from [app.routes.ts](../../apps/storefront/src/app/app.routes.ts) and have the `/uk` or `/ru` prefix. See [Storefront architecture](../architecture/storefront/README.md).

| Feature                                                   | Route or entry                                                                          |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Categories](storefront/catalog/categories.md)            | `/`, `/categories`                                                                      |
| [Product list and details](storefront/catalog/catalog.md) | `/catalog/products`, `/catalog/:categorySlug/products`, `/catalog/product/:productSlug` |
| [Cart](storefront/catalog/cart.md)                        | Component in the header                                                                 |
| [Checkout](storefront/catalog/checkout.md)                | `/checkout`                                                                             |
| [Sign in](storefront/account/auth.md)                     | `/login`                                                                                |
| [Cabinet](storefront/account/cabinet.md)                  | `/cabinet/dashboard`                                                                    |
| [Articles](storefront/content/articles.md)                | `/articles`, `/articles/:id`                                                            |
| [About and legal pages](storefront/content/about-us.md)   | Seven `about-us` routes                                                                 |
| [Contacts](storefront/content/contacts.md)                | `/contacts`                                                                             |
| [Regions](storefront/content/regions.md)                  | `/region/:city`                                                                         |
| [Wholesale](storefront/content/wholesale.md)              | `/wholesale`                                                                            |
| [404 page](storefront/not-found.md)                       | Shell                                                                                   |
| [Home](storefront/home.md)                                | Library exists, not routed: `categoriesRoutes` handles `/`                              |
| [In-stock widget](storefront/widgets.md)                  | Library exists, component not imported                                                  |

After behavior changes, compare the card and this catalog with the code.
