# site-home-feature

Composition of the Next.js site home page. See the [home page specification](../../../../docs/specs/site/home/001-home-page/README.md).

- `HomePage({ locale })` — async Server Component: loads the cached category tree from `@site/catalog/data-access`, composes `@site/home/ui` and `@site/catalog/ui` blocks, and adds WebSite JSON-LD. When the API is unavailable it shows a notice instead of the catalog index. It shows no products (owner decision 2026-11-01).

Tests: `npx nx run site-home-feature:vite:test -- --run`.
