# SEO rules — site

Stable rules for every feature of the public Next.js site (`apps/site`). Site-wide decisions live in the [SEO architecture](../../architecture/site/platform/seo-architecture.md). Admin is private: all its routes are `noindex`, with no sitemap, structured data, or SEO metadata.

## Required for every public URL change

- The feature SDD uses the `nextjs` variant and includes `design/seo.md` with SEO `R-*`/`SC-*` scenarios.
- Metadata, canonical, alternates, and JSON-LD come from `@site/core/seo` and the domain `seo` library; route files only call them.
- Main content (H1, text, product data) and metadata are in the initial HTML: no client-only fetching of indexable content.
- Every indexable page has a unique title and description in both languages.
- Links are real `<a href>` (Next.js `Link`), including menus, filters that lead to indexable landings, and pagination.
- Current storefront URLs keep working; a changed URL gets a permanent redirect from a maintained map.
- New URL types are added to the policy table in the SEO architecture before release.

## Prohibited

- Canonical across languages or to a page with different content.
- Listing untranslated pages in alternates.
- Status 200 for not found, empty filter, or removed item pages.
- Locale or currency redirects by IP or `Accept-Language` on localized URLs.
- SEO data invented on the frontend when the API should provide it (SKU, prices, availability, dates).
- Indexing on preview or local environments (`SITE_INDEXING` stays unset outside production).
- Third-party render-blocking assets (icon CDNs, font CSS) on indexable pages.

## Verification

- Unit tests for URL models and metadata, alternates, robots, sitemap, and JSON-LD builders (`npm run test:site`).
- Rendered-output checks with `curl` against `next start`, recorded in the feature's `verification/seo-verification.md`: status code, `<title>`, description, canonical, `hreflang`, robots meta, JSON-LD.
- `npx nx run site:build` route table matches the rendering choice in the SDD.
