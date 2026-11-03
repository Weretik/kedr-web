# TS-003 — SEO and route

- **Covers:** SC-008…SC-010; integrates SC-001.
- **Depends on:** TS-001; route integration after TS-002.
- **Paths:** libs/site/content/seo, apps/site/src/app/[locale]/(content)/returns-exchanges/page.tsx, libs/site/content/feature/src/lib/content-sitemap.ts (existing app sitemap consumes the shared list).
- **Test level:** metadata and sitemap unit; thin route type boundary.
- **Work:** build metadata through core SEO; add both localized sitemap URLs; locale guard; reuse layout Organization and preview robots.
- **Evidence:** completed. Red: stub home canonical failed both localized canonical/alternate cases. Green: npx nx run site-content-seo:vite:test --output-style=static -- --run src/lib/returns-metadata.spec.ts — exit 0, 4 tests. Final sitemap integration: npx nx run site-content-feature:vite:test --output-style=static -- --run src/lib/content-sitemap.spec.ts — exit 0, 1 test. Feature-owned CONTENT_SITEMAP_PAGES was extended, preserving delivery. No second SEO sitemap provider was added. Thin route uses explicit async params type; title inherits the root brand template once. See verification/seo-verification.md for limits.
- **Checkpoint:** title, descriptions, canonical/alternates and sitemap assertions pass without changing existing policy. Route stays thin.
