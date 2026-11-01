# site-catalog-seo

Metadata and structured data of the Next.js site catalog pages. See the [category page SEO design](../../../../docs/specs/site/catalog/001-category-page/design/seo.md).

- `buildCategoryMetadata({ locale, category, query, pastEnd })` — admin SEO title and description, or the default texts; page 1 and `?page=N` are indexable with a self canonical, filters, sort, view, and pages past the end are `noindex, follow` with the page 1 canonical.
- `buildCatalogHubMetadata(locale)` and `buildSearchMetadata(locale, term)` — the hub is indexed, search never is.
- `buildBreadcrumbListJsonLd(items)` and `buildProductItemListJsonLd(locale, products)` — `BreadcrumbList` and `ItemList` with absolute URLs.

Tests: `npx nx run site-catalog-seo:vite:test -- --run`.
