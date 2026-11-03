# TS-009 — Home as the company page

- Covers: R-013, SC-013, SC-014.
- Depends on: TS-008 (company blocks implemented).
- Scope: shared shell navigation, existing home overview anchor, Next.js redirect map; home/shell feature cards and SEO policy.
- Test level: component integration for localized navigation/anchor; redirect configuration assertions; existing canonical and sitemap unit tests.
- Work: use one company destination on the localized home, retain the public old URLs through 308 redirects, keep home canonical and sitemap ownership.
- Checkpoint: targeted tests and scoped independent diff audit; preserve earlier uncommitted changes.

## Evidence

- Red: shell tests in both languages returned the former /about-company links; both home tests failed because the company region had no id. Redirect helper against the previous rule list returned 200 instead of 308.
- Green / regression (all exit 0):
  - node node_modules/vitest/vitest.mjs run --config libs/site/core/shell/vite.config.mts — 16 tests, 5 files; company links in top bar, open mobile menu and footer for uk/ru.
  - node node_modules/vitest/vitest.mjs run --config libs/site/home/feature/vite.config.mts — 4 tests, 1 file; localized company region and all existing home blocks.
  - node node_modules/vitest/vitest.mjs run --config libs/site/home/seo/vite.config.mts — 2 tests; home metadata/canonical/alternates.
  - node node_modules/vitest/vitest.mjs run --config libs/site/core/seo/vite.config.mts — 12 tests; sitemap/robots, metadata and JSON-LD.
  - node (stdin assertions): transpile actual apps/site/next.config.ts with installed TypeScript and call installed next/experimental/testing/server unstable_getResponseFromNextConfig/getRedirectUrl. Four old-company requests (uk/ru, with/without ref query) return 308 to the locale home and preserve the query; both former categories redirects still work; en/about-company is not redirected. Bootstrap globalThis.AsyncLocalStorage from node:async_hooks before importing the Next helper.
- Runner limitation: Nx targets stalled without output and were stopped; the same existing library configurations passed directly through Vitest. First standalone redirect-helper attempt failed due to unavailable global AsyncLocalStorage; bootstrapped the Node primitive and reran successfully. This was a harness failure, not a behavioral Red.
- Refactor: formatting only; no domain/module boundary changes. Theme tokens, breakpoints and locale handling checked in code. Anchor scroll margin covers the desktop category row and full phone header.
- SEO inspection: no company route or metadata exists in apps/site; sitemap composes home plus catalog only; home metadata remains self canonical without a fragment. Existing search/catalog behavior retained.
- Scope: no build, browser/manual or E2E checks; Next helper validates configuration, not a running deployment.
- Independent final diff audit: passed; no implementation findings. Reviewed localized links/anchor, sticky offsets, redirect restriction, canonical/sitemap, search/catalog preservation, baseline uncommitted paths and whitespace.
