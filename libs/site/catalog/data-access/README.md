# site-catalog-data-access

Server-only catalog reads for the Next.js site, cached with `'use cache'`, `cacheTag`, and `cacheLife`. See [rendering and caching](../../../../docs/architecture/site/platform/rendering-and-caching.md).

- `getCatalogSections(locale)` — category tree mapped to `CatalogSection[]`, or `null` when the API is unavailable.
- `getInStockProducts(locale)` — up to eight newest products in stock, or `null`.

Cache tags: `catalog` (every entry, for the import webhook), `catalog:categories`, `catalog:products`.

Success is cached with `cacheLife('hours')`; a failed read is cached for a minute and retried in the background.

Tests: `npx nx run site-catalog-data-access:vite:test -- --run`.
