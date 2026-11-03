# TS-003 — Page, route and sitemap integration

- **Covers:** R-001, R-009, R-011, R-012; SC-001, SC-006–SC-008.
- **Depends on:** TS-001, TS-002.
- **Paths:** `libs/site/content/feature/src/index.ts`, `src/lib/delivery-payment-page.tsx`, `delivery-payment-page.spec.tsx`, `content-sitemap.ts`; `apps/site/src/app/[locale]/delivery-and-payment/page.tsx`, `apps/site/src/app/sitemap.ts`.
- **Owner:** coordinator.
- **Test level:** focused integration/unit; source review for thin route.

## Work

Compose exported UI blocks in the accepted order inside existing SiteShell's main area. Add the thin locale route and metadata delegation. Export content sitemap descriptors and include them alongside existing home/catalog pages. Existing header/mobile/footer already link to the preserved route; inspect them rather than rewriting unrelated shell behavior. No duplicate company page, shell, dictionary import from Angular, redirect or API. Review changed files for cohesive roles and reconcile actual map with design/frontend.md.

## Evidence

- Completed SC-001/006/007/008, 2026-11-03. DeliveryPaymentPage composes all five UI blocks without a second main or client state. Thin Next route awaits/validates locale params, delegates domain metadata and renders feature. CONTENT_SITEMAP_PAGES adds delivery beside existing home/catalog and concurrent content entries.
- Red: node node_modules/vitest/vitest.mjs run --config libs/site/content/feature/vite.config.mts — exit 1, 3 expected failures: missing H1 in both server locales and absent delivery sitemap URLs against compilable stubs.
- Green/final regression after implementation/formatting: same command — exit 0, 3 tests, 1 delivery integration file. Tests validate all major headings, localized offer and phone in server HTML, no nested main/scripts, both sitemap URLs/alternates and preservation of home/catalog. Uniqueness checks permit concurrently added other content pages.
- node ../../node_modules/next/dist/bin/next typegen (cwd apps/site): exit 0. node node_modules/typescript/bin/tsc --noEmit -p apps/site/tsconfig.json (cwd repo): final exit 0. First typecheck exposed a missing ReturnsContent public export from parallel returns work; merged the existing component export in the shared UI index and reran successfully, preserving both pages.
- Relevant installed Next page and sitemap guides reviewed. Existing shell navigation already uses /delivery-and-payment in all locations; no link rewrite or redirect needed. Existing shell/home/search/catalog owners preserved.
- npm run architecture:boundaries: exit 0, 102 projects. No production build, live HTML/curl or browser check performed.

## Checkpoint

Both localized URLs are wired, all substantive sections server-render, metadata delegates to domain SEO, both sitemap entries and alternates exist, focused tests and new boundaries pass.
