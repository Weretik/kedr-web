# Existing Admin modules

This is a map of Nx projects currently in the repository, not a list of planned libraries. The source is `project.json` in the listed directories; before a change, check the current code and [frontend inventory](../../frontend-inventory.md). Target boundaries and potential future domains are described in [domains.md](domains.md).

| Area         | Existing Nx projects                                 | Responsibility                                      |
| ------------ | ---------------------------------------------------- | --------------------------------------------------- |
| Application  | `apps/admin`, `apps/admin-e2e`                       | React Admin composition and browser checks          |
| Core         | `libs/admin/core/auth`, `libs/admin/core/shell`      | Session and application shell                       |
| Dashboard    | `libs/admin/dashboard/feature`                       | Dashboard route and screen                          |
| Products     | `libs/admin/products/{model,data-access,ui,feature}` | Product model, API, presentation, and scenarios     |
| Clients      | `libs/admin/clients/{model,data-access,ui,feature}`  | Customer list/card, API, and models                 |
| Admin shared | `libs/admin/shared/{api-client,config,ui}`           | API transport, Admin configuration, shared UI parts |

The current router connects dashboard, products, and clients routes in `apps/admin/src/app/router/app-router.tsx`. `orders` and `core/permissions` in the [target structure](domains.md) do not mean the corresponding Nx projects already exist. Libraries shared by clients, `libs/shared/*`, are listed in the [frontend inventory](../../frontend-inventory.md).
