# Admin application and routing

## `apps/admin` application

The application is the composition point. It contains React startup, root providers, routing, global styles, and connections to feature libraries. Business rules, API calls, and domain components do not belong here.

`AppRouter` remains the composition root: it connects the layout, combines domain routes, sets the global fallback, and does not import page implementations. Each domain exports a named route configuration through its public entry point. The actual routes in `apps/admin/src/app/router/app-router.tsx` currently connect dashboard, products, and clients; see the [map of existing modules](../structure/modules.md).

```text
dashboardRoutes ─┐
productsRoutes  ─┼→ AppRouter
clientsRoutes   ─┘
```

Example of an allowed connection:

```ts
import { productsRoutes } from '@admin/products/feature';
import { dashboardRoutes } from '@admin/dashboard/feature';
import { clientsRoutes } from '@admin/clients/feature';
```

`AdminLayout` remains a route element with `Outlet`. The router file location may change without changing this rule.

`AdminLayout` shows the side menu and top bar without breadcrumbs on pages. Local navigation back from a product card is implemented as a link in the feature itself.

## Lazy loading route features

- Feature pages that are route entries export a default page component and load through the short form `lazy(() => import('./pages/<page>'))` from their `<domain>.routes.tsx` module. Named-export adapters with `.then(...)` are not used for route pages.
- `AdminLayout` owns the single `Suspense` fallback around `Outlet`; pages and features do not duplicate route-loading spinners. The fallback shows only the route chunk loading state; it does not make a server request or duplicate the page's loading state.
- Shell, route configuration, and minimal route metadata may remain in the initial chunk. Page implementation, heavy domain UI, and optional MUI X packages must stay behind the relevant route boundary.
- Introduce manual chunk configuration only after bundle analysis shows a cross-route dependency that route-level lazy loading cannot split.
- Check a route-boundary change with lint for the shell and changed features, as well as `npx nx build admin`; build output must contain separate page chunks.
