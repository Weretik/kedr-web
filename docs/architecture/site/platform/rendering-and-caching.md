# Rendering and caching — site

**Checked:** 2026-10-30
**Sources:** `apps/site/next.config.ts`, `apps/site/src/app/**`, `libs/site/shared/api-client/src/lib/site-api.ts`, `libs/site/catalog/data-access/src/lib/loaders/catalog-loaders.ts`

## Framework and mode

- Next.js 16 App Router (version from `package-lock.json`), Turbopack build, `@nx/next` plugin targets `site:dev|build|start`.
- Cache model: **Cache Components** (`cacheComponents: true`, `partialPrefetching: true`, owner decision 2026-10-30). Caching is explicit: data functions in domain `data-access` start with `'use cache'` and call `cacheTag` and `cacheLife`. Do not use the previous model (`export const revalidate`, `fetch(..., { next })`, `unstable_cache`, `dynamic`, `dynamicParams`).
- Code that must stay in the prerendered shell may not read the clock or other request data outside a cached scope (the footer year is a cached component).
- Hosting: Cloudflare through OpenNext (owner decision 2026-10-30). OpenNext lists `'use cache'` as supported, but opennextjs-cloudflare issue #1464 reports hangs from cross-request cache dedupe on Next 16.4 Workers; step 0 verifies caching on the preview before cutover.
- Agent docs: `node_modules/next/dist/docs/` and `apps/site/AGENTS.md` (the `nextjs-agent-rules` block is written by `next dev`; keep it).

## Route types

| Route type                     | Paths                                      | Indexed                             | Rendering                                                                                  | Freshness                                                                                         | Invalidation            | Status codes                         | Source                            |
| ------------------------------ | ------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------ | --------------------------------- |
| Home                           | `/uk`, `/ru`                               | yes (after cutover)                 | prerendered; cached catalog data                                                           | `cacheLife('hours')`, tags `catalog`, `catalog:categories`, `catalog:products`; failed read 1 min | backend event (planned) | 200                                  | `app/[locale]/page.tsx`           |
| Content pages                  | `/{locale}/about-company`, …               | yes                                 | static                                                                                     | rebuild                                                                                           | —                       | 200                                  | planned, step 6                   |
| Category listing               | `/{locale}/catalog/{slug}/products`        | yes, page 1 and single-value facets | `generateStaticParams` for top-level sections, others rendered on first request and cached | tag `category:{slug}`, `catalog`; `cacheLife('hours')`                                            | backend event           | 404 unknown slug                     | planned, step 3                   |
| Search and filter combinations | `?search=`, multi-facet, sort              | no (`noindex, follow`)              | dynamic, normalized query                                                                  | short                                                                                             | —                       | 200                                  | planned, step 3                   |
| Product page                   | `/{locale}/catalog/product/{slug}`         | yes                                 | prerender on first request, cached per slug                                                | tag `product:{id}`; `cacheLife('hours')`                                                          | backend event           | 404 unknown, 410 removed (needs API) | planned, step 4                   |
| Cart, checkout, cabinet, login | `/{locale}/checkout`, `/cabinet`, `/login` | no                                  | dynamic, per user, client state                                                            | none                                                                                              | —                       | 200 / redirect to login              | planned, steps 5, 7               |
| `robots.txt`, `sitemap.xml`    | root                                       | n/a                                 | static now; cached handlers later                                                          | with catalog                                                                                      | backend event           | 200                                  | `app/robots.ts`, `app/sitemap.ts` |

## Server and client boundary

Pages and layouts are Server Components. `'use client'` is allowed only on the smallest interactive leaf (theme and language controls, phone copy, mobile menu, later add-to-cart, filters UI, gallery). Client components receive mapped `model` props and never import `data-access` or `site-shared-api-client` (the latter imports `server-only`, so such an import fails the build). Personal data (session, cart) lives only in client islands and private routes, never in shared HTML cache. Indexable pages do not read `cookies()` or `headers()`.

## Data access

- `site-shared-api-client` exposes `siteApiGet(path, { path, query, timeoutMs })`, a plain typed fetch with no cache options, typed from `@shared/api-contracts` (the same OpenAPI snapshot as Admin and Mobile, synced with `npm run contracts:sync`). The path type allows only `/api/catalog/*`.
- The base URL is `siteConfig.apiUrl` (`KEDR_API_URL`, default `https://api.classkedr.com.ua`). Queries are sorted so equal filters share a cache entry.
- Results are typed outcomes: `ok`, `not-found`, `gone`, `unavailable`. Domain `data-access` maps them to models; features call `notFound()` for `not-found`.
- Domain loaders wrap reads in `'use cache'` with `cacheTag` and `cacheLife('hours')`; a failed read returns `null` with `{ stale: 60, revalidate: 60, expire: 3600 }`, so the page stays 200, remains in the prerender, and retries within a minute (example: `getCatalogSections`).
- Cache tags: `catalog` (on every catalog entry), `catalog:categories`, `catalog:products`, later `category:{slug}`, `product:{id}`. `generateMetadata` and the page share one cached entry when they call the same loader with the same arguments.
- Writes (quick order) go through a Server Action or a client call to `POST /api/orders`, never through a cached function.

## Invalidation from the backend

| Event                           | Tags              | Sender        | Handler                                 | Protection           |
| ------------------------------- | ----------------- | ------------- | --------------------------------------- | -------------------- |
| Catalog import from 1C finished | `catalog`         | KedrStore job | `app/api/revalidate/route.ts` (planned) | shared secret header |
| Product changed or removed      | `product:{id}`    | KedrStore     | same                                    | same                 |
| Category changed                | `category:{slug}` | KedrStore     | same                                    | same                 |

`[NEEDS CLARIFICATION: KedrStore has no revalidation webhook yet; until then pages use time-based revalidation]`.

## Performance budgets

| Route type | LCP element             | LCP     | INP      | CLS   | Measured with                                  |
| ---------- | ----------------------- | ------- | -------- | ----- | ---------------------------------------------- |
| Home       | H1 / hero text          | ≤ 2.5 s | ≤ 200 ms | ≤ 0.1 | Lighthouse on preview, then CrUX after cutover |
| Category   | first product photo     | ≤ 2.5 s | ≤ 200 ms | ≤ 0.1 | same                                           |
| Product    | main photo (`priority`) | ≤ 2.5 s | ≤ 200 ms | ≤ 0.1 | same                                           |

Images go through `next/image` with explicit sizes; only the LCP image is `priority`. Fonts are self-hosted by `next/font` (`display: swap`). No third-party icon CDNs (the Angular header loads Telegram and Viber icons from `cdn.simpleicons.org`; the site uses lucide icons).

## Verification

`npx nx run site:build` prints the route table (○ static, ● SSG, ƒ dynamic). Rendered HTML is checked with `curl` against `next start` (see [application](../runtime/application.md#verification)).
