# Home company concept — post-implementation audit

- Date: 2026-11-03.
- Scope: TS-008 / SC-011–SC-012; home UI and feature, locale dictionary, local brand assets, thin locale home route and immediate catalog/config/shared-UI dependencies. No repository-wide audit.
- Sources: root AGENTS.md; apps/site/AGENTS.md; docs/architecture/site/structure/modules.md (dependency rules); docs/standards/site/design-system.md; docs/standards/shared/testing-rules.md; requirements/behavior.md R-010–R-012; design/frontend.md; tasks/TS-008-company-concept.md.
- Delivery status: verified for the scoped architecture audit; no open in-scope findings.

## Architecture and responsibilities

| Owner                          | Actual responsibility                                                  | Dependencies / decision                                                        |
| ------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| apps/site home route           | Validate locale, delegate page and metadata                            | home feature/SEO; keep thin route                                              |
| home/feature                   | Cached catalog read, block composition, WebSite JSON-LD                | catalog data-access/model/UI and core; allowed documented flow                 |
| home/ui company/               | Five components, one per overview, advantages, results, brands and FAQ | config/shared UI, internal dictionary/layout; keep this cohesive content group |
| home/ui i18n/                  | Two files: current home and company copy in uk/ru                      | Locale type only; keep content independent of markup                           |
| catalog/data-access            | Existing server-only cached category transport                         | Unchanged; no transport/DTOs added to UI                                       |
| apps/site/public/assets/brands | Six original local logos                                               | next/image, no remote CDN or runtime Angular imports                           |

Public imports go through each library's index.ts. No state store, new HTTP path, client effect, env reader, raw HTML, credential handling or generated contract changes were added. New content uses Server Components; native details supplies disclosure without a custom client handler. Token colors, responsive grids and configured phone are connected in code. Full visual/browser and SEO audits are outside this scoped architecture audit.

## Findings

### AF-001 — obsolete facts component and public surface

- Severity: low. Status: verified.
- Evidence before fix: home/ui/src/index.ts:1 exported HomeFacts; home/ui/src/lib/i18n/home-dictionary.ts:17 retained factsTitle/facts; home-ui.spec.tsx:3 was the only consumer after HomePage switched to the company concept. Scoped search in apps/site and libs/site confirmed no production consumer.
- Rule: public structure and dead-code checks in frontend-code-audit phase 04; project home UI ownership and delivery structure check.
- Impact: obsolete production component, duplicate copy and misleading test coverage remained after the replacement.
- Owner/target: home UI / TS-008. Fix: delete facts/home-facts.tsx and empty folder; remove export/dictionary entries and obsolete assertions; update library README and module role description. Existing notice coverage remains.
- Verification: home feature 4/4 and UI 3/3 tests passed; source/test type checks and lint passed; scoped rg found no production or test references to HomeFacts/factsTitle/dictionary.facts.

### AF-002 — incomplete coverage of the agreed block contents

- Severity: low. Status: verified.
- Evidence before fix: home/feature/src/lib/home-page.spec.tsx:72 checked section headings, numbers, logos and two disclosure attributes, but omitted the required four support entries, six advantages and the remaining FAQ content/initial closed states.
- Rule: SC-011/SC-012 and docs/standards/shared/testing-rules.md (lowest level proving the risk).
- Impact: missing card/support items or empty closed FAQ answers could pass the original concept tests.
- Owner/target: home feature / TS-008. Fix: assert four support items and six advantage cards using the named sections in both locales; assert all FAQ summaries/answers exist and only the first is initially open.
- Verification: both locale cases passed with all item/content assertions; test TypeScript check passed. No artificial behavioral Red required for removing dead structure; existing behavior is preserved.

## Verification

All checks below completed after the audit corrections (exit 0 unless stated):

- node node_modules/vitest/vitest.mjs run --config libs/site/home/feature/vite.config.mts — 4 tests passed.
- node node_modules/vitest/vitest.mjs run --config libs/site/home/ui/vite.config.mts — 3 tests passed.
- node node_modules/typescript/bin/tsc -p libs/site/home/feature/tsconfig.spec.json --noEmit — passed; includes affected source dependencies and feature tests.
- node node_modules/typescript/bin/tsc -p libs/site/home/ui/tsconfig.spec.json --noEmit — passed; includes UI source dependencies and tests.
- node node_modules/eslint/bin/eslint.js libs/site/home/ui/src libs/site/home/feature/src — passed; scoped import/dependency lint on final source and tests.
- rg -n 'HomeFacts|factsTitle|dictionary.facts' libs/site/home apps/site — no matches (expected rg exit 1).
- git -c core.safecrlf=false diff --check — passed.

No new project or dependency edge was introduced. Existing Nx tags, public exports, documented cross-domain flow and active lint constraints were inspected; no full workspace boundary audit or production build was run. Browser rendering and native disclosure interaction have not been exercised in a running browser; layout/theme conclusions are based on code.

## Hook context

The configured frontend Stop hook detects the frontend root from payload.cwd. This chat uses E:/Development, while implementation lives in E:/RiderProjects/kedr-web. The hook implementation does not follow external edit paths to detect that other repository. This explains why this context cannot be relied on to trigger the repository audit. Hook configuration was inspected, not modified or manually invoked. No audit receipt or commit was fabricated.

## FAQ motion follow-up — 2026-11-03

Scope: home/ui company/home-faq.tsx and home-faq.module.css, R-012/SC-012 and TS-008 documentation. The owner accepted 200ms opening/closing, text fade and plus/minus transitions with reduced-motion support.

Local architecture review: markup remains a Server Component; CSS is scoped beside its owner; no new library, project edge, client state, effect, measurement, timer or dependency. Native details/name grouping, keyboard focus, initial open item, all answers in the HTML and both locale dictionaries remain intact. CSS feature detection preserves native disclosure without content-slot support; the reduced-motion rule explicitly targets the pseudo-element as well as both icons. CSS grid animates intrinsic answer height without fixed maximums. content-visibility uses allow-discrete to retain paint during closing. One overflow-hidden/min-height:0 wrapper is required by the grid transition. No mixed responsibilities or open in-scope findings.

Fresh verification after the final code changes:

- node node_modules/vitest/vitest.mjs run --config libs/site/home/feature/vite.config.mts — 4/4 passed, exit 0.
- node node_modules/typescript/bin/tsc -p libs/site/home/ui/tsconfig.lib.json --noEmit — exit 0.
- node node_modules/eslint/bin/eslint.js libs/site/home/ui/src/lib/company/home-faq.tsx — exit 0.
- Existing postcss + @tailwindcss/postcss processed home-faq.module.css successfully, exit 0.
- git -c core.safecrlf=false diff --check — exit 0.

No additional behavior test was added for CSS declarations. These checks preserve rendering/semantics and validate processing/types, but do not prove visual timing in a running browser. No browser check or production build was run.
