# site-home-seo

Metadata of the Next.js site home page. See the [home page SEO design](../../../../docs/specs/site/home/001-home-page/design/seo.md).

- `buildHomeMetadata(locale)` — title, description, self canonical, `hreflang` alternates, and Open Graph from `@site/core/seo`, with the `uk` and `ru` title and description.

Tests: `npx nx run site-home-seo:vite:test -- --run`.
