# TS-005 — Route and SEO integration

- **Status:** verified.
- **Covers:** SC-001, SC-008, SC-014, SC-015, SC-016.
- **Depends on:** TS-001; TS-002 before feature/route composition.
- **Test level:** SEO unit and sitemap integration unit; thin-route source review.
- **Architecture baseline:** [frontend design](../design/frontend.md), [delivery rules](../../../../../standards/shared/delivery-rules.md) and [testing rules](../../../../../standards/shared/testing-rules.md); no AF/EN prerequisite.

## Exact paths

- `apps/site/src/app/[locale]/(content)/public-offer/page.tsx`
- `libs/site/content/feature/src/lib/public-offer-page.tsx`
- `libs/site/content/feature/src/index.ts`
- `libs/site/content/feature/src/lib/content-sitemap.ts`
- `libs/site/content/feature/src/lib/content-sitemap.spec.ts`
- `libs/site/content/seo/src/lib/public-offer-metadata.ts`
- `libs/site/content/seo/src/lib/public-offer-json-ld.ts`
- `libs/site/content/seo/src/lib/public-offer-metadata.spec.ts`
- `libs/site/content/seo/src/lib/public-offer-json-ld.spec.ts`
- `libs/site/content/seo/src/index.ts`

## Work

- [x] Build metadata and visible-breadcrumb JSON-LD through existing core APIs, respecting content SEO's core-only dependency allowlist. Use localized metadata in design/seo.md.
- [x] Add a thin localized route that awaits params, applies the existing locale guard and calls PublicOfferPage. Feature composes the localized server document and safe JsonLd.
- [x] Preserve the /public-offer address, shell locale-switch behavior and inherited Organization. Do not add a redirect, another layout or another privacy/requisites route.
- [x] Append the public-offer descriptor to the current content sitemap and add assertions for both localized URLs, reciprocal alternates, no dates and preservation of every existing content entry.
- [x] Test metadata in production and preview configurations, self canonicals, title template once, localized Open Graph fields and breadcrumb URLs/labels. Review unsupported-locale handling and existing locale-switch path coverage.
- [x] Check the changed implementation files for cohesive responsibility; split independent copy/mapping/rendering/browser lifecycle where needed within existing boundaries. Do not split a cohesive file just for its line count. Record the local keep/split decision.

## Evidence

PO-SEO plus coordinator route/sitemap integration completed.

- Metadata/BreadcrumbList valid Red: `node node_modules/vitest/vitest.mjs run --config libs/site/content/seo/vite.config.mts src/lib/public-offer-metadata.spec.ts src/lib/public-offer-json-ld.spec.ts`, exit 1, 5 expected assertion failures / 3 passed, 8 tests.
- SEO Green: actual executed command `node node_modules/nx/dist/bin/nx.js run site-content-seo:vite:test -- --run`, exit 0, 12 files / 61 tests including 8 new offer tests. This ran the content SEO library, not the whole app; it was not repeated by the coordinator.
- Sitemap Red: `node node_modules/nx/dist/bin/nx.js run site-content-feature:vite:test --output-style=static -- --run src/lib/content-sitemap.spec.ts`, 1 failure / 5 passed: missing two offer URLs.
- Same sitemap command Green: exit 0, 1 file / 6 tests; existing delivery, returns, contacts, requisites, wholesale and article entries preserved.
- Thin route awaits params, validates locale and calls public feature/SEO entries. Existing language-switch path behavior and root Organization are reused.
- Structure: route, feature, domain metadata and BreadcrumbList have distinct roles; domain SEO imports only allowed core APIs. No date or cross-language canonical introduced.
- Boundary typecheck: `node node_modules/nx/dist/bin/nx.js run site-content-feature:typecheck --output-style=static`, exit 0, 1 task, 0/1 cache hit.
- Actual HTTP status/head output and production build remain unrun; unsupported-locale behavior is supported by the existing guard and source review.

## Checkpoint

Both localized route entries are composed and advertised through existing metadata/sitemap mechanisms without changing preview indexing or removing another page.
