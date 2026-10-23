# Storefront application and routing

## Composition point

`apps/storefront/src/app/app.config.ts` assembles Angular providers: router, HTTP, auth initialization, logging, UI providers, and Transloco. Add new global providers only here or to their local provider, not to feature components.

The root `App` component owns the shared `Header` and `Footer` shell, `router-outlet`, toast notifications, and SEO hreflang. It contains no domain logic.

## Rendering

Storefront uses standalone Angular components and client hydration with event replay, incremental hydration, and HTTP transfer cache. Keep changes SSR-safe: do not access browser APIs outside browser-only branches or create side effects during server rendering.

The Cloudflare Pages build uses static output. `_worker.js` handles direct links to dynamic product pages: it serves Angular `index.csr.html` for HTML navigation to a localized product path while preserving the browser URL. This is necessary because Pages may return the generated `404.html` with status `200`; checking only `assetResponse.status === 404` does not work. These pages use `RenderMode.Client` in `app.routes.server.ts`.

## Routes

`app.routes.ts` composes routes exported by feature libraries. Public routes have a locale prefix, `/uk` or `/ru`; the root path redirects to `/uk`, and unknown paths go to a localized `404` through `LocaleNavigationService`.

A new screen belongs in the relevant feature library and exports its `Route[]` array. The root router only connects that array to `localizedRoutes`.
