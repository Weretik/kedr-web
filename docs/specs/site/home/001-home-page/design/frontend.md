# 001 — Home page: frontend and Next.js design

Sources: [site modules](../../../../../architecture/site/structure/modules.md), [rendering and caching](../../../../../architecture/site/platform/rendering-and-caching.md), [design system](../../../../../standards/site/design-system.md), Next.js 16.4 docs in `node_modules/next/dist/docs/01-app` (caching, `use cache`, `cacheLife`, `next/root-params`, migrating to Cache Components, proxy).

## Decisions

- **Cache Components on** (`cacheComponents: true`, `partialPrefetching: true`). Data functions are cached with `'use cache'` + `cacheTag` + `cacheLife`; `siteApiGet` loses its `next: { tags, revalidate }` options and stays a plain typed fetch with a timeout. `dynamicParams` is not allowed under Cache Components, so it is removed from the locale layout.
- **Unknown first segments** no longer fail in the root layout: `src/proxy.ts` matches only paths that do not start with a locale, a file, or `_next/`, and rewrites them to an unmatched path, which serves `global-not-found.tsx` with 404 (R-009).
- **Localized 404 inside the frame** reads the locale with `next/root-params` in a Server Component, replacing the client `usePathname` workaround.
- **The footer year** is a small cached component (`cacheLife('days')`), because `new Date()` is not allowed in a prerender.
- **Domains.** The category tree and product list belong to the catalog domain, which step 3 extends; this step creates its `model`, `data-access`, and `ui` libraries. Home owns only its own blocks and SEO. Home feature → catalog `data-access`, `model`, `ui` are documented cross-domain flows in `tools/architecture/project-boundary-rules.mjs`.
- **API failure** never fails the build or the page: the cached loader returns `null` with a one-minute lifetime (`revalidate: 60`, `expire: 3600`, still part of the prerender), and the UI shows a notice (R-006). Success uses `cacheLife('hours')`.
- **Images** use `next/image` with `remotePatterns` for `images-kedr.cdn.express`; the mapper keeps only `https` URLs on that host and otherwise returns `null` (placeholder). `[NEEDS CLARIFICATION: image optimization on Cloudflare (OpenNext with Cloudflare Images or a custom loader) — step 0]`.
- **OpenNext risk.** OpenNext Cloudflare lists `'use cache'` as supported, but an open issue (opennextjs-cloudflare#1464) reports hangs from cross-request cache dedupe on Next 16.4 Workers. Step 0 verifies it on the preview before cutover.

## Routes and rendering

| Route                  | Type          | Indexed             | Rendering                                             | Freshness                                                                                   | Status codes  |
| ---------------------- | ------------- | ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------- |
| `/uk`, `/ru`           | home          | yes (after cutover) | prerendered from `generateStaticParams` of the layout | catalog data `cacheLife('hours')`, tags `catalog`, `catalog:categories`, `catalog:products` | 200           |
| `/{locale}/categories` | old duplicate | no                  | `redirects()` in `next.config.ts`                     | —                                                                                           | 308 permanent |
| `/xx`, `/foo/...`      | unknown       | no                  | proxy rewrite → `global-not-found.tsx`                | —                                                                                           | 404           |

No request-time APIs (`cookies`, `headers`, `searchParams`) on the home page. No Suspense fallbacks are needed: every async part is cached and lands in the static shell.

## Server and client boundary

Everything on the page is a Server Component. The hero search is a plain `<form method="get">`; the only client leaves stay the shell controls. Client components never import `data-access`.

## Data and API

| Operation                                                                                               | Use            | Mapping                                                                                               |
| ------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------- |
| `getCategoryTree` `GET /api/catalog/{lang}/categories`                                                  | catalog index  | `CategoryTreeNode[]` → `CatalogSection[]` sorted by `sortOrder`, children sorted, empty slugs dropped |
| `getPublicProducts` `GET /api/catalog/{lang}/products` with `inStock=true`, `sort=IdDesc`, `pageSize=8` | in-stock block | `ProductListItem` → `ProductSummary { id, slug, name, price, photoUrl, isNew, isSale }`               |

Contract: `docs/contracts/openapi/openapi.yaml` snapshot through `@shared/api-contracts`; no contract change. Retail price uses the API default price type.

## Planned file-role map

| Path                                                     | Role                                                                                                | Status |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------ |
| `apps/site/next.config.ts`                               | Cache Components, image host, `/categories` redirect                                                | change |
| `apps/site/src/proxy.ts`                                 | 404 for paths without a locale                                                                      | new    |
| `apps/site/src/app/[locale]/layout.tsx`                  | drop `dynamicParams`                                                                                | change |
| `apps/site/src/app/[locale]/not-found.tsx`               | server 404 with `next/root-params`                                                                  | change |
| `apps/site/src/app/[locale]/page.tsx`                    | thin route: `generateMetadata` from home seo, renders `HomePage`                                    | change |
| `libs/site/core/shell/src/lib/footer/copyright-year.tsx` | cached current year                                                                                 | new    |
| `libs/site/shared/api-client/src/lib/site-api.ts`        | typed fetch without fetch-cache options                                                             | change |
| `libs/site/catalog/model`                                | `CatalogSection`, `ProductSummary`, `categoryPath`, `productPath`, `allProductsPath`                | new    |
| `libs/site/catalog/data-access`                          | `getCatalogSections`, `getInStockProducts` (`'use cache'`), DTO mappers, cache tags                 | new    |
| `libs/site/catalog/ui`                                   | `CatalogIndex`, `ProductCard`, `ProductGrid`, price formatting                                      | new    |
| `libs/site/home/ui`                                      | `HomeHero` (H1, lead, search), `WholesalePanel`, `HomeFacts`, `CatalogUnavailable`, home dictionary | new    |
| `libs/site/home/seo`                                     | `buildHomeMetadata` (title, description, canonical, alternates, Open Graph)                         | new    |
| `libs/site/home/feature`                                 | `HomePage`: loads data, composes blocks, WebSite JSON-LD                                            | new    |

All new libraries are created with `npx nx g @nx/react:library` and trimmed like the step 1 libraries. Tags: `scope:site`, `domain:<home|catalog>`, `type:<model|data-access|ui|util|feature>` (domain `seo` libraries use `type:util`).

## UI and states

- Tokens and primitives from `global.css` and `@site/shared/ui`; lucide icons with stroke 1.75; the wholesale panel is the only dark block (ink surface).
- States: catalog loaded, catalog unavailable (notice + link to all products), no in-stock products (block hidden), product without price («Ціна за запитом»), product without photo (neutral panel with a package icon).
- Images: `next/image`, `sizes` for 2/3/4 columns, lazy (the LCP element is the H1 text, so no image is `priority`).
- Accessibility: one H1, section headings H2, search input with a visible label for screen readers, links with clear text.

## Verification

- Unit and component tests (Vitest, jsdom) for mappers, path builders, metadata, and UI blocks; async server components are tested by awaiting the function and rendering its result.
- Lint, typecheck, and tests for every new and changed site project; `npm run architecture:boundaries`, `npm run docs:check`.
- `npx nx build site` route table, then `curl` against `next start` for the scenarios in [SEO design](seo.md). The API is not reachable from the cloud environment, so the unavailable state is verified there; the loaded state is covered by component tests.
- No browser or E2E checks without the owner's separate permission.
