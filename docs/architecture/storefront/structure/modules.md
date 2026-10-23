# Existing Storefront modules

This is a map of current Nx projects based on their `project.json`. Architectural roles are defined in [domains.md](domains.md); check actual targets and versions in the [frontend inventory](../../frontend-inventory.md) and project configuration.

| Area                  | Existing Nx projects                                                                       | Responsibility                                      |
| --------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| Application           | `apps/storefront`                                                                          | Angular SSR, routes, and global providers           |
| Storefront foundation | `libs/storefront/{contracts,data-access,shell,ui,util}`                                    | Contracts, data, shell, presentation, and utilities |
| Feature               | `libs/storefront/feature/{home,catalog,categories,cart,checkout,auth,cabinet}`             | Main storefront scenarios                           |
| Feature               | `libs/storefront/feature/{articles,about-us,contacts,regions,wholesale,widgets,not-found}` | Content and supporting scenarios                    |

`apps/storefront/src/app/app.routes.ts` composes routes from feature library public entry points. This map shows that libraries exist; use code and the relevant feature specification for the status of particular behavior and checks. General `libs/shared/*` libraries are listed in the [frontend inventory](../../frontend-inventory.md).
