# Rendering and caching — site

**Checked:** 2026-11-01
**Sources:** `apps/site/next.config.ts`, `apps/site/src/app/**`, `libs/site/shared/api-client/src/lib/site-api.ts`, `libs/site/catalog/data-access/src/lib/loaders/catalog-loaders.ts`

**Cart source update:** 2026-11-04, additionally checked against `cart/feature` runtime/private checkout, `cart/ui` container CSS and `shared/api-client/src/lib/site-order-api.ts`. Focused automated/source evidence is in the [cart feature](../../../features/site/cart.md); no build, HTTP, browser or live-order verification is claimed here.

## Framework and mode

- Next.js 16 App Router (version from `package-lock.json`), Turbopack build, `@nx/next` plugin targets `site:dev|build|start`.
- Cache model: **Cache Components** (`cacheComponents: true`, `partialPrefetching: true`, owner decision 2026-10-30). Caching is explicit: data functions in domain `data-access` start with `'use cache'` and call `cacheTag` and `cacheLife`. Do not use the previous model (`export const revalidate`, `fetch(..., { next })`, `unstable_cache`, `dynamic`, `dynamicParams`).
- Code that must stay in the prerendered shell may not read the clock or other request data outside a cached scope (the footer year is a cached component).
- Hosting: Cloudflare through OpenNext (owner decision 2026-10-30). OpenNext lists `'use cache'` as supported, but opennextjs-cloudflare issue #1464 reports hangs from cross-request cache dedupe on Next 16.4 Workers; step 0 verifies caching on the preview before cutover.
- Agent docs: `node_modules/next/dist/docs/` and `apps/site/AGENTS.md` (the `nextjs-agent-rules` block is written by `next dev`; keep it).

## Route types

| Route type                  | Paths                                     | Indexed                | Rendering                                                                                                                                                                                                                                                          | Freshness                                                                                         | Invalidation            | Status codes                                 | Source                                             |
| --------------------------- | ----------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------- | -------------------------------------------------- |
| Home                        | `/uk`, `/ru`                              | yes (after cutover)    | prerendered; cached catalog data                                                                                                                                                                                                                                   | `cacheLife('hours')`, tags `catalog`, `catalog:categories`, `catalog:products`; failed read 1 min | backend event (planned) | 200                                          | `app/[locale]/page.tsx`                            |
| Content pages               | `/{locale}/about-company`, …              | yes                    | static                                                                                                                                                                                                                                                             | rebuild                                                                                           | —                       | 200                                          | planned, step 6                                    |
| Catalog hub                 | `/{locale}/catalog`                       | yes                    | prerendered; cached tree                                                                                                                                                                                                                                           | `cacheLife('hours')`, tags `catalog`, `catalog:categories`                                        | backend event (planned) | 200                                          | `app/[locale]/catalog/page.tsx`                    |
| Category                    | `/{locale}/catalog/{slug}`                | page 1 and `?page=N`   | `generateStaticParams` for top-level sections, others on first request; category loaded before streaming, listing streamed in `<Suspense>` (reads `searchParams`); `instant = false`, because the category lookup blocks navigation on purpose to keep 308 and 404 | tags `catalog`, `catalog:categories`, `category:{slug}`, `catalog:products`; `cacheLife('hours')` | backend event (planned) | 308 moved slug, 404 unknown, 500 API down    | `app/[locale]/catalog/[slug]/page.tsx`             |
| Search, filters, sort, view | `/{locale}/search?q=`, `?inStock=true`, … | no (`noindex, follow`) | static frame, results streamed; products cached per normalized query                                                                                                                                                                                               | `cacheLife('hours')`                                                                              | —                       | 200                                          | `app/[locale]/search/page.tsx`                     |
| Product page                | `/{locale}/product/{slug}`                | production gate        | real verified seed, other slugs on first request; lookup before streaming, instant=false                                                                                                                                                                           | hours; catalog/catalog:products/product SKU+slug tags; failures short                             | webhook planned         | 200/308/404/500                              | implemented stage4A; cart bridge connected locally |
| Checkout                    | `/{locale}/checkout`                      | no                     | neutral server heading/loading frame; Suspense request leaf awaits connection(); cart/contact state remains browser-owned                                                                                                                                          | no personal shared cache                                                                          | —                       | anonymous page; mutation outcome is separate | implemented locally: checkout route + cart feature |
| Cabinet, login              | `/cabinet`, `/login`                      | no                     | private, per user                                                                                                                                                                                                                                                  | none                                                                                              | —                       | 200 / redirect to login                      | planned, step 7                                    |
| `robots.txt`, `sitemap.xml` | root                                      | n/a                    | static now; cached handlers later                                                                                                                                                                                                                                  | with catalog                                                                                      | backend event           | 200                                          | `app/robots.ts`, `app/sitemap.ts`                  |

## Server and client boundary

Pages and layouts are Server Components. `'use client'` is allowed only on the smallest interactive leaf (theme and language controls, phone copy, mobile menu, catalog filters and toolbar, collapsing header, mega menu, cart controls and gallery). Client components receive mapped `model` props and never import `data-access` or `site-shared-api-client` (the latter imports `server-only`, so such an import fails the build). Personal data (session, cart) lives only in client islands and private routes, never in shared HTML cache. Indexable pages do not read `cookies()` or `headers()`.

CartRuntime passes Server Component children through its provider and supplies the Server Function as an action prop. The document store is created only in the browser; its server snapshot is deterministic and neutral. Initialization reads `cart_v1` after hydration, without writing it back automatically. Only basket rows persist: contact draft, pending operation and receipt remain in memory. The checkout's neutral heading/loading shell contains no PII; a Suspense request leaf awaits `connection()`, and neither the owner nor the mutation is placed in a cache scope. Its responsive grid uses a 720 px **checkout-container** threshold, not a viewport threshold.

## Data access

- `site-shared-api-client` exposes `siteApiGet(path, { path, query, timeoutMs })`, a plain typed fetch with no cache options, typed from `@shared/api-contracts` (the same OpenAPI snapshot as Admin and Mobile, synced with `npm run contracts:sync`). The path type allows only `/api/catalog/*`.
- The base URL is `siteConfig.apiUrl` (`KEDR_API_URL`, default `https://api.classkedr.com.ua`). Queries are sorted so equal filters share a cache entry.
- Results are typed outcomes: `ok`, `not-found`, `gone`, `unavailable`. Domain `data-access` maps them to models; features call `notFound()` for `not-found`.
- Domain loaders wrap reads in `'use cache'` with `cacheTag` and `cacheLife('hours')`; a failed read returns `null` with `{ stale: 60, revalidate: 60, expire: 3600 }`, so the page stays 200, remains in the prerender, and retries within a minute (example: `getCatalogSections`). A page that cannot exist without its data (the category page) throws instead and `app/[locale]/error.tsx` answers 500 inside the site frame.
- Cache tags: `catalog` (on every catalog entry), `catalog:categories`, `catalog:products`, `category:{slug}`, `product:{sku}` and `product:slug:{slug}`. `generateMetadata` and the page share one cached entry when they call the same loader with the same arguments.
- Quick-order writes use the existing `createQuickOrder` contract through `submitQuickOrder` Server Function → server-only cart data-access → dedicated `siteApiCreateQuickOrder`. Client leaves do not call the backend directly.
- The mutation transport is a narrow exception alongside catalog GET: only anonymous `POST /api/orders`, fixed against `siteConfig.apiUrl`, with `cache: 'no-store'`, `credentials: 'omit'`, redirects rejected, bounded timeout and no automatic retry. It does not widen the catalog GET path type or forward a customer/staff session. Runtime response parsing returns a domain outcome; timeout/network/5xx or a malformed successful response are uncertain, not proof of rejection. There is no reservation or background repricing/cache invalidation added by cart.

## Invalidation from the backend

| Event                           | Tags              | Sender        | Handler                                 | Protection           |
| ------------------------------- | ----------------- | ------------- | --------------------------------------- | -------------------- |
| Catalog import from 1C finished | `catalog`         | KedrStore job | `app/api/revalidate/route.ts` (planned) | shared secret header |
| Product changed or removed      | `product:{id}`    | KedrStore     | same                                    | same                 |
| Category changed                | `category:{slug}` | KedrStore     | same                                    | same                 |

`[NEEDS CLARIFICATION: KedrStore has no revalidation webhook yet; until then pages use time-based revalidation]`.

## Performance budgets

| Route type | LCP element            | LCP     | INP      | CLS   | Measured with                                  |
| ---------- | ---------------------- | ------- | -------- | ----- | ---------------------------------------------- |
| Home       | H1 / hero text         | ≤ 2.5 s | ≤ 200 ms | ≤ 0.1 | Lighthouse on preview, then CrUX after cutover |
| Category   | first product photo    | ≤ 2.5 s | ≤ 200 ms | ≤ 0.1 | same                                           |
| Product    | main photo (`preload`) | ≤ 2.5 s | ≤ 200 ms | ≤ 0.1 | same                                           |

Images go through `next/image` with explicit sizes; only the LCP image uses current Next `preload`. Fonts are self-hosted by `next/font` (`display: swap`). No third-party icon CDNs (the Angular header loads Telegram and Viber icons from `cdn.simpleicons.org`; the site uses lucide icons).

## Verification

`npx nx run site:build` prints the route table (○ static, ● SSG, ƒ dynamic). Rendered HTML is checked with `curl` against `next start` (see [application](../runtime/application.md#verification)).

Product sitemap metadata route is app/product/sitemap.ts; data-access reads a cached bounded best-effort index, product feature maps/shards it. Root sitemap remains, robots advertises product shard URLs only when indexing is enabled. Preview robots does not enumerate the index.
