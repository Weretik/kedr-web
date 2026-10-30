# site-home-feature

Composition of the Next.js site home page. See the [home page specification](../../../../docs/specs/site/home/001-home-page/README.md).

- `HomePage({ locale })` — async Server Component: loads the cached category tree and in-stock products from `@site/catalog/data-access`, composes `@site/home/ui` and `@site/catalog/ui` blocks, and adds WebSite JSON-LD. When the API is unavailable it shows a notice instead of the catalog index and hides the products block.

Tests: `npx nx run site-home-feature:vite:test -- --run`.
