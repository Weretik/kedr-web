# site-catalog-ui

Presentational catalog components for the Next.js site; no data fetching. Server Components except the client leaves marked below. See the [site design system](../../../../docs/standards/site/design-system.md).

- `catalog-index/` — `CatalogIndex`: sections with up to eight subcategory links each.
- `category/` — `CategoryHeader` (H1, count, subcategory links), `CategoryContent` (admin HTML and FAQ in `<details>`).
- `product/` — `ProductGrid`, `ProductList` (grid or table), card and table row with SKU, stock, badges, and price.
- `listing/` — `ListingToolbar` (client: flags, price, sort, view; a GET form that also works without JavaScript), `ListingPagination`, `ListingSummary`, `PerPageLinks` (20 / 50 / 100), `ResultsAnchor` (client: scrolls to search results), `ListingEmpty`. `category-cards/` — `CategoryCards` (photo cards for the hub; photos by category ID).
- `tree/` — `CatalogTreePanel` (client: collapsible tree, hide/show, state in `localStorage` key `kedr-site:catalog-tree`).
- `navigation/` — `MegaMenu` (client: section rail, subcategory columns, category search; every link in the HTML), `Breadcrumbs`.
- `i18n/` — `getCatalogDictionary`: interface text in `uk` and `ru` (`locales/`).

Tests: `npx nx run site-catalog-ui:vite:test -- --run`.
