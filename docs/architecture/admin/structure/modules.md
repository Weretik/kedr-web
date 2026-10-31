# Existing Admin modules

This is a map of Nx projects currently in the repository, not a list of planned libraries. The source is `project.json` in the listed directories; before a change, check the current code and [frontend inventory](../../frontend-inventory.md). Target boundaries and potential future domains are described in [domains.md](domains.md).

| Area         | Existing Nx projects                                   | Responsibility                                        |
| ------------ | ------------------------------------------------------ | ----------------------------------------------------- |
| Application  | `apps/admin`, `apps/admin-e2e`                         | React Admin composition and browser checks            |
| Core         | `libs/admin/core/auth`, `libs/admin/core/shell`        | Session, sign-in, route guards, and application shell |
| Dashboard    | `libs/admin/dashboard/feature`                         | Dashboard route and screen                            |
| Products     | `libs/admin/products/{model,data-access,ui,feature}`   | Product list and details, slug, deleted products      |
| Categories   | `libs/admin/categories/{model,data-access,ui,feature}` | Category tree, slug, SEO text, and FAQ                |
| Orders       | `libs/admin/orders/{model,data-access,ui,feature}`     | Orders, drafts, quotes, and customer prices           |
| Clients      | `libs/admin/clients/{model,data-access,ui,feature}`    | Customer list/card, API, and models                   |
| Users        | `libs/admin/users/{model,data-access,ui,feature}`      | Staff accounts and the signed-in user's profile       |
| Admin shared | `libs/admin/shared/{api-client,config,routing,ui}`     | API transport, configuration, router links, shared UI |

`apps/admin/src/app/router/app-router.tsx` connects the dashboard, products, categories, orders, clients, users, and profile routes. `core/permissions`, `shared/contracts`, `shared/util`, and `shared/testing` in the [target structure](domains.md) do not exist as Nx projects yet. Libraries shared by clients, `libs/shared/*`, are listed in the [frontend inventory](../../frontend-inventory.md).
