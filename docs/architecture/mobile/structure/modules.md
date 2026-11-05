# Existing Mobile modules

This is a map of Nx projects currently in the repository, not a plan for future modules. Sources are `project.json` in the listed directories and the actual Expo Router files; check current targets in Nx and the [frontend inventory](../../frontend-inventory.md). Target boundaries are described in [domains.md](domains.md); the libraries still to come for Kedr Manager are in its [frontend design](../../../specs/mobile/manager/001-manager-app/design/frontend.md#libraries-planned-map).

| Area          | Existing Nx projects                              | Responsibility                                                                                                                                |
| ------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Application   | `apps/mobile`                                     | Entry, Expo Router routes and layouts, composition                                                                                            |
| Core          | `libs/mobile/core/{shell,auth,connectivity}`      | Providers, work area with tab bar/rail and customer gate; session; network state                                                              |
| Local data    | `libs/mobile/core/local-db`                       | SQLite connection, Drizzle tables, migrations, wipe (tags `scope:mobile`, `type:data-access`, no domain: every domain's data-access reads it) |
| Sync          | `libs/mobile/sync/{model,data-access,feature}`    | Snapshot schemas, download with ETag and table replace, scheduler, first-sync gate, status strip                                              |
| Mobile shared | `libs/mobile/shared/{ui,api-client,config,model}` | «Офіс» themes and components; Axios client; configuration; shared models                                                                      |

Routes in `apps/mobile/src/app`: `login`, `index` (→ `/customer`) and the `(work)` group with `customer/`, `products/`, `calculation`, `orders/` and `cabinet`. Customer choice, products, calculation, orders and the cabinet are built by the stages of the [Kedr Manager rebuild](../../../specs/mobile/manager/001-manager-app/tasks/README.md); the old catalog, cart, orders and customers libraries were removed on 2026-11-05. The [frontend inventory](../../frontend-inventory.md) tracks `libs/shared/*`, which is shared across clients.
