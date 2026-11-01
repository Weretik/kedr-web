# site-catalog-data-access

Server-only catalog reads for the Next.js site, cached with `'use cache'`, `cacheTag`, and `cacheLife`. See [rendering and caching](../../../../docs/architecture/site/platform/rendering-and-caching.md).

- `loaders/catalog-loaders.ts` — `getCatalogSections(locale)` (top-level sections for the home and hub index), `getCatalogTree(locale)` (the whole tree with counts for the tree panel, mega menu, header, and sitemap), `getInStockProducts(locale)`; each returns `null` when the API is unavailable.
- `loaders/category-loaders.ts` — `getCategory(locale, slug)`: `ok`, `moved` (a former slug, or a deleted category with an active ancestor), `not-found`, or `unavailable`.
- `loaders/product-loaders.ts` — `getProductListPage(locale, scope, query)`: one listing page of a category subtree or a search term, 24 per page, or `null`.
- `mappers/` — API DTOs to `@site/catalog/model` types; `requests/product-list-request.ts` — listing choices to the `getPublicProducts` query.

Cache tags: `catalog` (every entry, for the import webhook), `catalog:categories`, `category:{slug}`, `catalog:products`.

Success is cached with `cacheLife('hours')`; a failed read is cached for a minute and retried in the background.

Tests: `npx nx run site-catalog-data-access:vite:test -- --run`.
