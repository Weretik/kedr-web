# Rendering and caching — site

**Checked:** 2026-10-29
**Sources:** `apps/site/next.config.ts`, `apps/site/src/app/**`, `libs/site/shared/api-client/src/lib/site-api.ts`

## Framework and mode

- Next.js 16 App Router (version from `package-lock.json`), Turbopack build, `@nx/next` plugin targets `site:dev|build|start`.
- Cache model: **fetch cache and route segment config**; Cache Components (`cacheComponents`) is off. `[NEEDS CLARIFICATION: enable Cache Components at step 3 when the catalog brings request-time data]`.
- Agent docs: `node_modules/next/dist/docs/` and `apps/site/AGENTS.md` (the `nextjs-agent-rules` block is written by `next dev`; keep it).

## Route types

| Route type                     | Paths                                      | Indexed                             | Rendering                                                            | Freshness                                      | Invalidation            | Status codes                         | Source                            |
| ------------------------------ | ------------------------------------------ | ----------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------- | ----------------------- | ------------------------------------ | --------------------------------- |
| Home                           | `/uk`, `/ru`                               | yes (after cutover)                 | static (SSG)                                                         | rebuild; later tag `catalog`                   | backend event (planned) | 200                                  | `app/[locale]/page.tsx`           |
| Content pages                  | `/{locale}/about-company`, …               | yes                                 | static                                                               | rebuild                                        | —                       | 200                                  | planned, step 6                   |
| Category listing               | `/{locale}/catalog/{slug}/products`        | yes, page 1 and single-value facets | ISR: `generateStaticParams` for top-level sections, others on demand | tag `category:{slug}`, `catalog`; fallback 1 h | backend event           | 404 unknown slug                     | planned, step 3                   |
| Search and filter combinations | `?search=`, multi-facet, sort              | no (`noindex, follow`)              | dynamic, normalized query                                            | short                                          | —                       | 200                                  | planned, step 3                   |
| Product page                   | `/{locale}/catalog/product/{slug}`         | yes                                 | ISR per slug                                                         | tag `product:{id}`; fallback 1 h               | backend event           | 404 unknown, 410 removed (needs API) | planned, step 4                   |
| Cart, checkout, cabinet, login | `/{locale}/checkout`, `/cabinet`, `/login` | no                                  | dynamic, per user, client state                                      | none                                           | —                       | 200 / redirect to login              | planned, steps 5, 7               |
| `robots.txt`, `sitemap.xml`    | root                                       | n/a                                 | static now; cached handlers later                                    | with catalog                                   | backend event           | 200                                  | `app/robots.ts`, `app/sitemap.ts` |

## Server and client boundary

Pages and layouts are Server Components. `'use client'` is allowed only on the smallest interactive leaf (theme and language controls, phone copy, mobile menu, later add-to-cart, filters UI, gallery). Client components receive mapped `model` props and never import `data-access` or `site-shared-api-client` (the latter imports `server-only`, so such an import fails the build). Personal data (session, cart) lives only in client islands and private routes, never in shared HTML cache. Indexable pages do not read `cookies()` or `headers()`.

## Data access

- `site-shared-api-client` exposes `siteApiGet(path, { path, query, tags, revalidate })`, typed from `@shared/api-contracts` (the same OpenAPI snapshot as Admin and Mobile, synced with `npm run contracts:sync`). The path type allows only `/api/catalog/*`.
- The base URL is `siteConfig.apiUrl` (`KEDR_API_URL`, default `https://api.classkedr.com.ua`). Queries are sorted so equal filters share a cache entry.
- Results are typed outcomes: `ok`, `not-found`, `gone`, `unavailable`. Domain `data-access` maps them to models; features call `notFound()` for `not-found`.
- Cache tags: `catalog`, `category:{slug}`, `product:{id}`, `product-slug:{locale}:{slug}`. `generateMetadata` and the page share one request through fetch memoization or React `cache`.
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
