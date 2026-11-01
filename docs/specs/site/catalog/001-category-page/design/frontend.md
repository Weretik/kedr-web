# 001 — Category page: frontend and Next.js design

Sources: [site modules](../../../../../architecture/site/structure/modules.md), [rendering and caching](../../../../../architecture/site/platform/rendering-and-caching.md), Next.js 16.4 docs in `node_modules/next/dist/docs/01-app` (caching, dynamic routes with Cache Components, ISR with Cache Components, `notFound`, `permanentRedirect`, Server Functions).

## Decisions

- **Blocking category render, streamed listing.** `[slug]` has `generateStaticParams` (top-level sections, or a placeholder when the API is unavailable at build). The page awaits `params` and the cached category outside any Suspense boundary, so `permanentRedirect()` and `notFound()` run before streaming and keep their status codes (R-002). Unknown slugs render on the first request and are stored. The listing reads `searchParams`, which is request data, inside `<Suspense>`; its products come from a cached loader keyed by category ID and the normalized query.
- **Former slugs.** `getCategoryBySlug` returns 200 with the current `slug` for a former slug and 404 with `redirectSlug` for a deleted category with an active ancestor; data access maps both to `{ kind: 'moved', slug }`. `site-shared-api-client` keeps the JSON body of a 404 for this.
- **URL model.** `@site/catalog/model` owns parsing, normalization, and serialization of `page`, `sort`, `inStock`, `isSale`, `isNew`, `priceFrom`, `priceTo`, and `view`. Defaults are omitted, unknown values fall back to defaults, so equal choices share one URL and one cache entry. Only `page` keeps a page indexable.
- **Filters UI** is the only client part of the listing: it builds the next URL with the model and navigates with `router.push`. Pagination is server links.
- **«Показати ще»** calls a Server Function in `@site/catalog/feature` that validates its arguments and returns the next page through the same cached loader; the client appends it and updates the summary. Without JavaScript the page links still work.
- **No tree panel** (removed 2026-11-01): the page shows category chips and a filter column; the tree feeds the sibling chips.
- **Mega menu** is a client leaf in `@site/catalog/ui` that receives the tree and renders every section's links in the HTML; only the visible section switches. The site-shared shell cannot import a domain, so `SiteShell` takes a `catalogNavigation` prop (`menu` node and `links`) that the app layout fills from `@site/catalog/feature`.
- **Search** gets its own route `/{locale}/search?q=` (`noindex`), reusing the listing with `searchTerm`.
- **No cart buttons** yet: «У кошик» comes with the cart in step 5, so cards and rows show stock state only.

## Routes and rendering

| Route                      | Indexed              | Rendering                                                                            | Freshness                                                                                                               | Status codes        |
| -------------------------- | -------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `/{locale}/catalog/{slug}` | page 1 and `?page=N` | static shell per slug (sections at build, others on first request); listing streamed | category and products `cacheLife('hours')`, tags `catalog`, `catalog:categories`, `category:{slug}`, `catalog:products` | 200, 308 moved, 404 |
| `/{locale}/catalog`        | yes                  | prerendered                                                                          | tree `cacheLife('hours')`                                                                                               | 200                 |
| `/{locale}/search?q=`      | no                   | static frame, results streamed                                                       | products `cacheLife('hours')`                                                                                           | 200                 |
| old catalog addresses      | —                    | `redirects()` in `next.config.ts`                                                    | —                                                                                                                       | 308                 |

## Data and API

| Operation                                                                                                                                                                          | Use                                                                          | Mapping                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `getCategoryTree` `GET /api/catalog/{lang}/categories`                                                                                                                             | sibling chips, mega menu, header links, hub, sitemap, `generateStaticParams` | `CategoryTreeNode[]` → `CatalogTreeNode[]` (sorted, nodes without slug or name dropped) |
| `getCategoryBySlug` `GET /api/catalog/{lang}/categories/by-slug/{slug}`                                                                                                            | category header, content, metadata, breadcrumbs                              | → `CategoryDetails`, or `moved` / `not-found` / `unavailable`                           |
| `getPublicProducts` `GET /api/catalog/{lang}/products` with `categoryId` or `searchTerm`, `availability`, `isSale`, `isNew`, `priceFrom`, `priceTo`, `sort`, `page`, `pageSize=24` | listing, «Показати ще»                                                       | → `ProductListPage { items: ProductSummary[], page, totalPages, totalRecords }`         |

Sort mapping: in stock first → `AvailabilityThenName`, cheaper → `PriceAsc`, more expensive → `PriceDesc`, newest → `IdDesc`, A→Я → `NameAsc`. `availability=All` unless «Тільки в наявності». SKU is the product `id` (1C code).

## File-role map

Compared with the code on 2026-11-01; all paths exist.

| Path                                                                 | Role                                                                                                                           |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `apps/site/src/app/[locale]/catalog/page.tsx`                        | hub route                                                                                                                      |
| `apps/site/src/app/[locale]/catalog/[slug]/page.tsx`                 | category route: static params, metadata, page                                                                                  |
| `apps/site/src/app/[locale]/search/page.tsx`                         | search route                                                                                                                   |
| `apps/site/src/app/[locale]/error.tsx`                               | 500 inside the site frame                                                                                                      |
| `apps/site/src/app/[locale]/layout.tsx`                              | passes catalog navigation to the shell                                                                                         |
| `apps/site/src/app/sitemap.ts`                                       | home, hub, and category entries                                                                                                |
| `apps/site/next.config.ts`                                           | old catalog redirects                                                                                                          |
| `libs/site/catalog/model/src/lib/{entities,paths,listing,tree}/`     | types; flat paths; listing URL model; tree search and ancestors                                                                |
| `libs/site/catalog/data-access/src/lib/loaders/`                     | cached tree, category, and product page loaders                                                                                |
| `libs/site/catalog/data-access/src/lib/{mappers,requests}/`          | DTO mappers; listing query → API query                                                                                         |
| `libs/site/catalog/ui/src/lib/category/`                             | category header with subcategory links; admin text and FAQ                                                                     |
| `libs/site/catalog/ui/src/lib/listing/`                              | filter form (left column, or a panel on phones), sort select, view (client), pagination, page-size links, summary, empty state |
| `libs/site/catalog/ui/src/lib/product/`                              | card, grid, table, list switch, stock label, price                                                                             |
| `libs/site/catalog/ui/src/lib/popover/`                              | icon button with a fading panel, dismiss hook (client)                                                                         |
| `libs/site/catalog/ui/src/lib/navigation/`                           | mega menu (client) with section and search parts, dismiss hook, breadcrumbs                                                    |
| `libs/site/catalog/ui/src/lib/i18n/`                                 | dictionary type and `locales/uk.ts`, `locales/ru.ts`                                                                           |
| `libs/site/catalog/seo/src/lib/{metadata,json-ld}/`                  | category, hub, search metadata and texts; BreadcrumbList and ItemList                                                          |
| `libs/site/catalog/feature/src/lib/category/`                        | category page and breadcrumb trail                                                                                             |
| `libs/site/catalog/feature/src/lib/listing/`                         | streamed listing, skeleton, load-more Server Function                                                                          |
| `libs/site/catalog/feature/src/lib/{hub,search,navigation,routing}/` | hub page; search page, term, metadata; shell navigation; static params, metadata, sitemap pages                                |
| `libs/site/core/shell/src/lib/navigation/catalog-navigation.ts`      | `CatalogNavigation` prop and fallback sections                                                                                 |
| `libs/site/core/shell/src/lib/error/error-view.tsx`                  | 500 message with retry (client)                                                                                                |
| `libs/site/core/seo/src/lib/metadata/`                               | canonical and alternates with an optional page query                                                                           |
| `libs/site/core/i18n/src/lib/plural.ts`                              | count with the right word form                                                                                                 |
| `libs/site/shared/api-client/`                                       | 404 keeps the JSON body                                                                                                        |
