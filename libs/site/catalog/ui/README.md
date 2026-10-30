# site-catalog-ui

Presentational catalog components for the Next.js site (Server Components, no data fetching). See the [site design system](../../../../docs/standards/site/design-system.md).

- `CatalogIndex` — top-level categories with up to eight subcategory links each and an «all» link.
- `ProductGrid` — product tiles with a `next/image` photo or placeholder, badges, and retail price or «price on request».

Internal: `ProductCard`, `formatPrice` (UAH), and the `uk`/`ru` catalog dictionary.

Tests: `npx nx run site-catalog-ui:vite:test -- --run`.
