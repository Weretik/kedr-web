# site-catalog-feature

Catalog pages of the Next.js site. See the [category page specification](../../../../docs/specs/site/catalog/001-category-page/README.md).

- `category/` — `CategoryPage`: loads the category before streaming (308 for a moved slug, 404 for a missing one, an error with status 500 when the API is down), then breadcrumbs, tree, header, the listing in `<Suspense>`, admin text, and `BreadcrumbList`.
- `listing/` — `ProductListing` (reads `searchParams`, loads one cached page, renders toolbar, products, «Показати ще», pages, and `ItemList`) and the `loadMoreProducts` Server Function, which validates its arguments.
- `hub/` — `CatalogHubPage` for `/{locale}/catalog`; `search/` — `SearchPage` and `generateSearchMetadata` for `/{locale}/search?q=`.
- `navigation/` — `getCatalogNavigation(locale)`: mega menu and top-level sections that the app layout passes to `SiteShell`.
- `routing/` — `getCategoryStaticParams`, `generateCategoryMetadata`, `getCatalogSitemapPages`.

Tests: `npx nx run site-catalog-feature:vite:test -- --run`.
