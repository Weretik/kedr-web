# Storefront Angular features

**Route source:** [app.routes.ts](../../../apps/storefront/src/app/app.routes.ts). Paths below have the `/uk` or `/ru` prefix. The cart opens in the shell rather than at a separate route.

| Module                                      | Features                                              |
| ------------------------------------------- | ----------------------------------------------------- |
| [Catalog and shopping](catalog/README.md)   | Categories, products, cart, checkout                  |
| [Account](account/README.md)                | Sign-in, account area                                 |
| [Content and navigation](content/README.md) | Articles, company pages, contacts, regions, wholesale |
| Shell                                       | [404 page](not-found.md)                              |

## Existing code without an active route

- [Home](home.md): the library and its own `homeRoutes` exist, but `app.routes.ts` does not import them; `categoriesRoutes` currently handles the root route.
- [In-stock widget](widgets.md): the library exists, but its component is not imported into the application.
