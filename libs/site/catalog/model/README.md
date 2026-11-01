# site-catalog-model

Framework-neutral catalog types, URL builders, and listing rules for the Next.js site. See the [site modules](../../../../docs/architecture/site/structure/modules.md).

- `entities/` — `CatalogSection`, `CatalogCategory`, `CatalogTreeNode`, `ProductSummary` (with SKU and stock), `CategoryDetails`, `ProductListPage`.
- `paths/` — `CATALOG_PATH`, `SEARCH_PATH`, `categoryPath`, `productPath`: flat locale-free URLs (`/catalog/{slug}`, `/product/{slug}`).
- `listing/` — `parseListingQuery`, `serializeListingQuery`, `listingHref`, `isIndexableListing`, `hasListingFilters`, `withoutFilters`: listing choices in the URL, defaults omitted so equal choices give one URL; only `page` keeps a page indexable.
- `tree/` — `searchCatalogTree`, `branchIds`, `ancestorIds` for the mega menu search and the tree panel.

Tests: `npx nx run site-catalog-model:vite:test -- --run`.
