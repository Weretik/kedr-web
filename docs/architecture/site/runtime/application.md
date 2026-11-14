# Site application and routing

**Baseline checked:** 2026-10-30. **Sources:** `apps/site/src/app/**`, `apps/site/src/proxy.ts`, `apps/site/next.config.ts`, `libs/site/core/shell/src/lib/layout/site-shell.tsx`.
**Cart update:** source and focused automated verification on 2026-11-04; build, HTTP, browser and live-order checks were not run for this change.

## Composition point

`app/[locale]/layout.tsx` is the root layout. It validates the locale, sets `<html lang="uk-UA|ru-UA">`, loads Onest and JetBrains Mono through `next/font`, and wraps SiteShell/page children in `ThemeProvider` and `CartRuntime`. It supplies main and compact `CartHeaderAction` nodes through generic SiteShell slots and renders Organization JSON-LD. Core shell imports no cart domain. Metadata defaults come from `buildRootMetadata`; routes remain thin feature composition points.

## Routes

| Path                          | Entry                                  | Owner                                                 | Locale and indexing                                | Status                         |
| ----------------------------- | -------------------------------------- | ----------------------------------------------------- | -------------------------------------------------- | ------------------------------ |
| `/`                           | `next.config.ts` redirect              | app                                                   | 308 to `/uk`                                       | exists                         |
| `/uk`, `/ru`                  | `app/[locale]/page.tsx`                | `home/feature`                                        | prerendered, `generateStaticParams`                | exists                         |
| `/{locale}/categories`        | `next.config.ts` redirect              | app                                                   | 308 to `/{locale}`                                 | exists                         |
| path without a locale         | `src/proxy.ts` rewrite                 | app                                                   | 404 from `global-not-found`                        | exists                         |
| unmatched URL                 | `app/global-not-found.tsx`             | app                                                   | 404, `noindex`, both languages                     | exists                         |
| `notFound()` inside a page    | `app/[locale]/not-found.tsx`           | app                                                   | 404, `noindex`, inside the shell                   | exists                         |
| root layout failure           | `app/global-error.tsx`                 | app                                                   | 500, both languages, retry button                  | exists                         |
| `/{locale}/product/{slug}`    | `app/[locale]/product/[slug]/page.tsx` | `product/feature` + injected server purchase callback | existing production gate                           | exists; cart connected locally |
| `/{locale}/checkout`          | `app/[locale]/checkout/page.tsx`       | `cart/feature`, `cart/seo`                            | private/noindex; neutral frame + request-time leaf | exists locally                 |
| `/robots.txt`, `/sitemap.xml` | `app/robots.ts`, `app/sitemap.ts`      | `core/seo`                                            | static                                             | exists                         |

`generateStaticParams` prerenders `uk` and `ru`; any other first segment never reaches the layout: `src/proxy.ts` matches only paths that do not start with a locale, `_next/`, or a file name, and rewrites them to an unmatched path, which serves `global-not-found.tsx` with 404 and keeps the requested URL. The proxy matcher repeats the locale list as a static literal; keep it in sync with `LOCALES`. Paths have no trailing slash; `/uk/` redirects to `/uk` (Next.js default).

`app/[locale]/not-found.tsx` is a Server Component that reads the locale with `next/root-params`. All 404 responses carry `noindex`.

## Client islands

Server Components by default. The main client entry points include:

- `core/shell/controls/` — `ThemeProvider`, `ThemeToggle`, `LocaleSwitch` (needs `usePathname`), `CopyPhoneButton`;
- `core/shell/header/mobile-menu.tsx` — Radix Sheet;
- `core/shell/error/error-view.tsx` — retry on the 500 page;
- `shared/ui/{sheet,dialog}.tsx` — domain-neutral Radix overlay primitives;
- `catalog/ui` — `ListingToolbar`, `FilterForm`, `ResultsAnchor`, `MegaMenu`;
- `cart/feature` — `CartProvider` plus header/drawer/checkout/purchase controllers, all subscribed to one browser/document store; `cart/ui` receives presentation props and callbacks, never transport;
- `content/ui/src/lib/gallery/gallery-browser.tsx` — the local filter/portion/selection session;
- `content/ui/src/lib/gallery/media-image.tsx` — isolated image loading/error/retry. `MediaViewer` and `VideoFrame` are imported by the gallery client entry point; the page, source, heading, and SEO stay server-owned. See the [gallery feature](../../../features/site/gallery.md).

The regions list uses `<details>` and the mega menu keeps every section's links in the server HTML (hidden until opened), so crawlers see all navigation links. The layout passes the mega menu and section links to `SiteShell` from `@site/catalog/feature`; without the API the shell uses its fixed sections. The search box is a plain GET form to `/{locale}/search?q=`.

## Cart and checkout flow

`CartRuntime` is server composition: it passes `submitQuickOrder` as `submitOrderAction` to the client provider and mounts one drawer next to Server Component children. The browser factory checks `window` before creating an owner. `useSyncExternalStore` has a deterministic neutral server snapshot; an effect sets the action and initializes storage once. No order is submitted from render or initialization.

The owner survives provider remount within the same document, preserving a contact draft and the immutable pending attempt. Only accepted basket rows persist as `cart_v1`; contacts and receipt stay in memory, outside URLs and shared caches. A new document restores the basket with empty contacts. Partial recovery requires explicit acknowledgement before sending or replacing the damaged source.

`/{locale}/checkout` delegates to cart feature and SEO. CheckoutPage renders a neutral heading and Suspense loading fallback; its request-time leaf awaits `connection()` before rendering the client controller. Personal cart/contact state never enters a shared cached server frame. The checkout grid switches at a **720 px checkout-container width**, independently of shell viewport breakpoints.

The product route injects `renderCartPurchaseAction` as a server callback into ProductPage. Product feature builds its own normalized, serializable purchase descriptor and calls the callback on the server; the cart adapter returns the client purchase node with that descriptor. There is no product-feature to cart-feature import, nor a product-domain import in the adapter. The mutation proceeds through the Server Function, server-only cart data-access and the fixed anonymous order POST. See the [cart feature](../../../features/site/cart.md).

## Verification

The commands below describe available verification levels and the earlier routing baseline, not a new build or HTTP verification of cart. Current cart evidence is focused automated/source evidence linked from its feature card; browser/build/HTTP/live-order checks remain unrun for this change.

- `npx nx run site:typecheck`, `npx nx run site:lint`, `npx nx run site:build` (route table shows `/uk` and `/ru` as static and `Proxy`).
- `npm run test:site` — unit and component tests of all site libraries.
- Rendered-output check after `npx nx run site:build && (cd apps/site && npx next start)`: `curl` for status codes, `<title>`, canonical, `hreflang`, robots meta, and JSON-LD on `/uk`, `/ru`, `/uk/categories`, `/xx`, `/uk/foo`, `/robots.txt`, `/sitemap.xml`.
