# TS-002 — Delivery metadata

- **Covers:** R-012; SC-008 (metadata).
- **Depends on:** EN-001.
- **Paths:** `libs/site/content/seo/src/index.ts`, `src/lib/delivery-payment-metadata.ts`, `src/lib/delivery-payment-metadata.spec.ts` (relative to SEO project).
- **Owner:** SEO agent; do not edit route, sitemap or shared docs.
- **Test level:** unit.

## Work

Build unique UK/RU metadata through core/seo using the preserved URL. Cover title, description, locale self canonical, UK/RU/x-default alternates, Open Graph and existing indexing gate. Read relevant installed Next metadata docs. No independent env access, invented shipping facts or new structured data. Check changed files retain one responsibility before handoff.

## Evidence

- Completed R-012 / SC-008 metadata, 2026-11-03. Public API buildDeliveryPaymentMetadata(locale, config?: SiteConfig) delegates to core/seo; normal callers inherit shared siteConfig.
- Red: npx vitest run --config libs/site/content/seo/vite.config.mts — exit 1, 9 expected behavioral failures against an empty metadata object.
- Green/final regression after implementation/public export/formatting: same command — exit 0, 9 tests, 1 delivery metadata file.
- Tests cover both localized titles/descriptions, self canonical, UK/RU/x-default alternates, Open Graph, five indexing gate states, root title suffix once and snippet limits. No direct environment read or separate robots policy.
- Scoped formatting, structure/import review and git diff --check passed. Concurrent returns metadata exports retained. No browser/build.

## Checkpoint

`buildDeliveryPaymentMetadata` publicly exported; locale/metadata/robots tests pass; no confirmed in-scope finding remains.
