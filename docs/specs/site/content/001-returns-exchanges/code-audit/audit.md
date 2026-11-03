# Returns architecture audit — 2026-11-03

Scope: returns route and content model/UI/feature/SEO, direct configs, exports and tests. Skill frontend-code-audit; phases 00–06 from E:/Development/Templates/frontend-sdd/code-audit. Rules: root and site AGENTS; site modules architecture; shared delivery/testing rules; SDD design/frontend.md; root ESLint import/order. Owner: coordinator. Task: TS-005.

Baseline: unrelated home/shell/delivery edits preserved. Returns UI baseline: 8 tests passed. Independent read-only boundary review confirms cached graph, tags and public aliases match site architecture.

| Finding | Severity/status | Evidence before fix                                                 | Rule/impact and target                                                                                                                                        | Task/check                        |
| ------- | --------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| AF-001  | low / verified  | model/src/lib/returns-dictionary.ts:5,92,135                        | SDD separate copy/mapping responsibilities; one file mixes literal copy, string-key mapping and assembly. Separate summary copy and typed policy mapping.     | TS-005; policy invariant, tsc, UI |
| AF-002  | low / verified  | ui/src/lib/returns/returns-content.tsx:17; returns-support.tsx:9,28 | Delivery structure rule: header/navigation and contact panel have independent content responsibilities. Extract header/contact while retaining layout owners. | TS-005; existing UI regression    |
| AF-003  | low / verified  | model/eslint.config.cjs:5; model/.babelrc:1                         | Root AGENTS trim generator output. React-only generated configs are unnecessary for pure TS content model.                                                    | TS-005; root lint, tsc            |
| AF-004  | low / verified  | returns-content.tsx:4,9; returns-dictionary.ts:1                    | Root import/order requires group separation and type imports last.                                                                                            | TS-005; focused ESLint            |

Delivery status: verified within the architecture/refactoring scope. Target structure and final phase evidence will be recorded after remediation. No API, client state, Angular runtime dependency or raw HTML exists in this scope.

## 00 — Evidence and approved tooling

Actual targets/config inspected: content/model, ui, seo and feature carry scope:site/domain:content with model/ui/util/feature types respectively; public aliases in tsconfig.base.json point to src/index.ts. Cached Nx graph lists model lint/typecheck/vite:test; root @nx/vitest names the test target vite:test. The site script includes model regression tests. Other feature changes remain untouched.

## 01 — Boundary matrix

| Project         | Responsibility                                     | Actual allowed imports             | Result                           |
| --------------- | -------------------------------------------------- | ---------------------------------- | -------------------------------- |
| site route      | awaited params, locale guard, feature and metadata | content feature/seo, core i18n     | keep; thin server route          |
| content/model   | typed copy, complete policy transform, assembly    | core i18n type                     | separated internal owners        |
| content/ui      | server markup                                      | model, core config/i18n, shared UI | private header/contact extracted |
| content/feature | page composition and shared sitemap descriptors    | own model/UI, core                 | keep                             |
| content/seo     | metadata builder                                   | core seo/config/i18n               | keep                             |

Public barrels do not export mapper/copy internals or extracted private UI. Graph check passed for 102 projects. Root ESLint constraints and boundary validator enforce scope/layer restrictions and prohibit unauthorized cross-domain/feature-to-feature imports; no artificial forbidden import was added to the worktree.

## 02 — State/data/tools

Static dictionary -> typed model -> feature/UI is the entire data path. No transport, API contract, generated DTO, loading/error cache or mutable state is required; these checks are n/a. Native details owns FAQ disclosure. No client hooks, remote reads, parallel fetch/cache stack, raw HTML or Angular runtime import was found. Existing Company config remains the phone source.

## 03–04 — Responsibility and structure decisions

| Area / production file count          | Decision | Target and reason                                                                                                                                                       |
| ------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| model/src/lib: 3 before, 5 after      | split    | summary-copy holds literal translations; policy-sections owns key-checked mapping; dictionary assembles values/FAQ. types and complete source snapshot remain cohesive. |
| ui/src/lib/returns: 6 before, 8 after | split    | header owns breadcrumb/H1/anchors; contact owns telephone aside. content composes blocks; support owns notes/grid.                                                      |
| returns-panels and returns-policy     | keep     | TermsPanel is one local panel renderer; recursive PolicySection is one complete policy renderer. Their helpers belong with their owners, with no separate lifecycle.    |
| feature route/sitemap and SEO         | keep     | Each is a small single-boundary owner. No new layer, generic helper folder or shared abstraction is warranted.                                                          |
| model React generator config          | delete   | Only .babelrc and local eslint.config.cjs removed; pure TS model uses workspace tooling.                                                                                |

No numeric split threshold was used. Returns folder holds one page; existing delivery paths and public exports are preserved. The mapper now accepts only existing policy keys and both language source shapes. The extracted components add no new wrappers and preserve reading order, classes, IDs and contact targets. Independent post-refactor source review found no concrete issue.

## 05–06 — Final verification

- Baseline: direct Vitest UI command passed all 8 existing behavior tests before moves.
- Regression: node node_modules/vitest/vitest.mjs run --config libs/site/content/ui/vite.config.mts src/lib/returns/returns-content.spec.tsx — exit 0, 8 tests passed.
- Policy invariant: same runner with model/vite.config.mts and src/lib/returns-policy-sections.spec.ts — exit 0, 2 tests passed; every source policy heading/sentence retained for both locales, no missing mapped value.
- Targeted lint: node node_modules/eslint/bin/eslint.js 'libs/site/content/model/src/**/_.ts' 'libs/site/content/ui/src/lib/returns/_.tsx' --fix — exit 0. Import grouping corrected; no remaining lint findings.
- Source/test types: node node_modules/typescript/bin/tsc --noEmit -p libs/site/content/{model,ui,seo,feature}/tsconfig.spec.json, each project checked separately — all exit 0. Feature tsconfig.lib.json also exit 0.
- Module graph: node tools/architecture/check-project-boundaries.mjs — exit 0, 102 projects passed; NX_DAEMON=false/NX_ISOLATE_PLUGINS=false used.
- One initial lint invocation with default plugin isolation was interrupted while waiting; the completed command above supplies verification. No source failure was suppressed.
- Structural refactoring has no artificial behavioral Red; baseline/regression and the completeness invariant protect the unchanged behavior.

All four low-severity findings are verified; open/blocked findings: zero. This is architectural completion for the scoped feature, not a browser fidelity or production deployment verdict. Browser, visual/manual, E2E and production build were not run under current repository verification rules.

- Documentation verification: check-markdown validated 512 Markdown files; scoped git diff --check exited 0.
