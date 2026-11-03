# TS-008 — Home company concept

Covers: R-010–R-012, SC-011–SC-012. Depends on: existing TS-004 and TS-006 (implemented).

Paths: home/ui company components and dictionary, home/feature page and component tests, apps/site/public/assets/brands, feature card and specification.

Test level: component. Work: add the supplied concept below the current home catalog in uk/ru; source numbers and original logos from Storefront; preserve server rendering, theme tokens and responsive layouts. Checkpoint: focused home feature and UI tests; local structure and responsive/theme code review.

Evidence:

- Red: focused company concept test failed in both locales on the missing company heading.
- Green/regression: `node node_modules/vitest/vitest.mjs run --config libs/site/home/feature/vite.config.mts` — 4/4 passed; `node node_modules/vitest/vitest.mjs run --config libs/site/home/ui/vite.config.mts` — 3/3 passed. `node node_modules/typescript/bin/tsc -p libs/site/home/feature/tsconfig.lib.json --noEmit` — exit 0. Nx graph discovery stalled on a later invocation, so the same configured runner was invoked directly.
- Local structure review: one component per content block; localization in its own dictionary; feature composes the UI public API; no new Nx projects or cross-domain dependencies. Post-implementation audit removed the obsolete HomeFacts component, export and dictionary entries, and expanded acceptance assertions; see [audit](../code-audit/audit.md).
- Code review: existing theme tokens, local dark partner panel, 1/2/3-column advantage grid, 2/4-column results, 2/3/6-column logos, stacked/split company and FAQ layouts; server-rendered content and native FAQ keyboard controls.
- Browser/visual checks and full build are outside the authorized verification scope.

- Audit completion: AF-001 and AF-002 verified after correction; fresh 4+3 tests, TypeScript including both test projects, scoped lint and diff check passed. No open in-scope findings; details in [audit](../code-audit/audit.md).

- Follow-up scope: owner-approved FAQ opening/closing and plus/minus animation, 200ms, CSS Module, reduced-motion support; existing native semantics and locale content retained. Verification: home feature component regression 4/4 passed; UI production TypeScript and FAQ-scoped lint passed (exit 0); current Tailwind/PostCSS processed the CSS successfully; diff check passed. This is a CSS-only presentation refinement with no new logic: no artificial Red test added. Motion timing has not been inspected in a running browser.
