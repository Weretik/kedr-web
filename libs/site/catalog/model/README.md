# site-catalog-model

Framework-neutral catalog types and locale-free URL builders for the Next.js site. See the [site modules](../../../../docs/architecture/site/structure/modules.md).

- `CatalogSection`, `CatalogCategory`, `ProductSummary` — mapped API data used by catalog and home UI.
- `categoryPath`, `productPath`, `ALL_PRODUCTS_PATH` — current storefront URLs without the locale prefix.

Tests: `npx nx run site-catalog-model:vite:test -- --run`.
