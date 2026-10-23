# Existing Mobile modules

This is a map of Nx projects currently in the repository, not a plan for future modules. Sources are `project.json` in the listed directories and the actual Expo Router files; check current targets in Nx and the [frontend inventory](../../frontend-inventory.md). Target boundaries are described in [domains.md](domains.md).

| Area          | Existing Nx projects                                 | Responsibility                                                |
| ------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| Application   | `apps/mobile`                                        | Expo Router, layouts, and application composition             |
| Core          | `libs/mobile/core/{shell,connectivity}`              | Providers, navigation shell, and network state                |
| Mobile shared | `libs/mobile/shared/{api-client,config,model}`       | Mobile-wide API, configuration, and models                    |
| Catalog       | `libs/mobile/catalog/{feature,data-access,model,ui}` | Catalog and product details                                   |
| Cart          | `libs/mobile/cart/{feature,data-access,model,ui}`    | Cart                                                          |
| Orders        | `libs/mobile/orders/{feature,data-access,model,ui}`  | Orders and their details                                      |
| Customers     | `libs/mobile/customers/{data-access,model,ui}`       | Customer data and presentation; no separate `feature` project |

File-based routes in `apps/mobile/src/app` currently include the `catalog`, `cart`, `orders`, and `profile` tabs, as well as `product/[productSlug]` and `orders/[orderId]`. This is a map of actual files, not confirmation that every business scenario is complete. Create `core/auth` and planned route groups only for an accepted task. The [frontend inventory](../../frontend-inventory.md) tracks `libs/shared/*`, which is shared across clients.
