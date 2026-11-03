# SEO verification record — 2026-11-03

- Metadata: `npx nx run site-content-seo:vite:test --output-style=static -- --run src/lib/returns-metadata.spec.ts` — exit 0, 4 tests passed. Both languages: canonical, reciprocal alternates, Open Graph, description length, production/preview indexing and brand title composition.
- Sitemap: `npx nx run site-content-feature:vite:test --output-style=static -- --run src/lib/content-sitemap.spec.ts` — exit 0, 1 test passed. Both localized returns URLs exactly once, reciprocal alternates, delivery descriptor preserved.
- `npx tsc --noEmit -p libs/site/content/feature/tsconfig.lib.json` and the same for `libs/site/content/seo/tsconfig.lib.json` — exit 0. Source integration checked through public aliases.
- `npm run architecture:boundaries` — exit 0, 102 projects validated.

The static route awaits params, guards locale and calls domain feature/SEO. Root layout owns Organization and the indexing gate. [Local review](local-review.md).

Rendered response status, composed document title, canonical/hreflang in running-site HTML and production route-table output are not claimed as verified: production build, curl against a started app, browser, visual/manual and E2E checks were not run. These require separate authorization under current verification rules.
