# TS-005 — Architecture audit fixes

- Covers: AF-001; preserve SC-001–SC-008.
- Depends on: completed TS-004; this audit was explicitly requested after delivery.
- Scope/owner: coordinator; content/ui, content/seo and content/feature project.json lint overrides, audit evidence and affected feature docs. Preserve concurrent returns and all prior uncommitted work.
- Rule/source: site module boundaries and actual installed Nx ESLint inference; frontend-code-audit phases01/05.

## Work

Review delivery architecture/public imports/responsibilities against Site rules. Remove invalid manual lint.inputs and retain Nx plugin inference of root eslint.config.cjs, dependency/config chains and custom rules. Keep cohesive UI components; no confirmed mixed runtime responsibility requires splitting. Verify actual resolved targets and source/test checks before marking AF-001 verified.

## Evidence

- Status: completed / AF-001 verified, 2026-11-03. Removed only redundant lint overrides in three project.json files; retained identities, tags and inference. No runtime component, route, text, public export or concurrent returns change.
- Baseline: project.json lines9–16 for all three libraries and effective cached graph omitted the active root CJS config. Inferred plugin inputs were replaced with nonexistent legacy filenames.
- Refreshed graph after repair and [saved inputs](../code-audit/lint-targets.json) verify root/local eslint.config.cjs, ^default, tools/eslint-rules and ESLint dependency; no stale .mjs override. Actual validator permits feature→UI and rejects UI→feature and core→domain.
- Scoped lint (exit 0):

```text
node node_modules/eslint/bin/eslint.js --no-cache 'libs/site/content/ui/src/lib/delivery-payment/**/*.{ts,tsx}' 'libs/site/content/ui/src/lib/i18n/delivery-payment-dictionary.ts' 'libs/site/content/seo/src/lib/delivery-payment-metadata*.ts' 'libs/site/content/feature/src/lib/delivery-payment-page*.tsx' 'libs/site/content/feature/src/lib/content-sitemap.ts' 'apps/site/src/app/[locale]/delivery-and-payment/page.tsx'
```

- Test/source typechecks (all exit 0; unlike app tsc, these include the test files):

```text
node node_modules/typescript/bin/tsc --noEmit -p libs/site/content/ui/tsconfig.spec.json
node node_modules/typescript/bin/tsc --noEmit -p libs/site/content/seo/tsconfig.spec.json
node node_modules/typescript/bin/tsc --noEmit -p libs/site/content/feature/tsconfig.spec.json
```

- Minimal behavior regression: node node_modules/vitest/vitest.mjs run --config libs/site/content/feature/vite.config.mts src/lib/delivery-payment-page.spec.tsx — exit 0, 3 tests in 1 file (both languages in server HTML and sitemap preservation).
- Configuration-only repair: behavioral Red is not applicable. Baseline effective-input evidence replaces it; source lint, test typing, inferred graph and existing SSR tests provide final verification.
- Initial extra audit-check expectation for explicit root tsconfig input was corrected after reading installed Nx plugin lines187–191: root tsconfig is selectively hashed natively. No change to project tsconfig was required.
- Independent responsibility audit: keep the five cohesive UI components; no confirmed mixed lifecycle, transport or navigation-state concern required splitting. Independent closure review confirms AF-001 verified. [Audit](../code-audit/audit.md).
- Browser/manual/visual/E2E, production build and broader SEO audit were outside this architecture-check scope. Final npm run docs:check passed (533 Markdown files, exit 0); git diff --check passed (exit 0).

## Checkpoint

AF-001 verified; refreshed target inputs include the actual root ESLint config; delivery lint, source/test types and focused behavior checks pass; audit findings/status/traceability current.
