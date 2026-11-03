# Centered top navigation and theme switch

Date: 2026-11-03. Status: implemented and verified. Owner-approved concept: center all six information links relative to the full header; city on the left; language and a sun/moon sliding switch on the right, with no visible theme caption.

## Requirements and acceptance

- R-001 / SC-001: Given a desktop header in uk or ru, then city, six localized information links and language/theme controls form left/center/right groups. Navigation centers relative to the whole max-width header. At narrower desktop/tablet widths, links occupy a centered second row and can wrap, without colliding with the edge groups. Phones keep the existing mobile menu.
- R-002 / SC-002: Given light or dark mode (including a resolved system preference), the switch exposes an accessible localized name, the correct checked state and both sun/moon symbols. Activating it selects the opposite theme through next-themes. No visible theme caption is added. Component tests cover both states and a system-theme update.
- R-003 / SC-003: Given a server render before the saved theme is known, then the switch renders a stable shape and disabled unchecked state until mounted. The knob/icons follow the document dark class. The knob transition is 180ms and is disabled for reduced motion. Component SSR test and code/CSS review.

## Design and architecture

Sources: root AGENTS.md, apps/site/AGENTS.md, docs/architecture/site/structure/modules.md, docs/standards/site/design-system.md and docs/standards/shared/testing-rules.md. Existing Nx owner: site-core-shell, scope:site/scope:site-shared/type:shell. No project, alias, dependency or API change.

| File under libs/site/core/shell/src/lib | Role                                                                              | Action |
| --------------------------------------- | --------------------------------------------------------------------------------- | ------ |
| header/bars/top-bar.tsx                 | Server-rendered responsive three-group layout                                     | change |
| controls/theme-toggle.tsx               | Existing client leaf, theme library and hydration-safe switch                     | change |
| controls/theme-toggle.module.css        | Knob translate transition, scoped exception to next-themes transition suppression | new    |
| controls/theme-toggle.spec.tsx          | State, action, system preference and SSR tests                                    | new    |
| i18n/shell-dictionary.ts                | Stable localized switch name                                                      | change |

Layout: equal outer grid columns and an auto-sized center column from xl; below xl, controls/city remain on the first row with centered links below. Existing max-width, gutters, tokens, Onest and lucide remain the source of truth. The shared switch also appears in the mobile sheet. Header scroll measurement already uses ResizeObserver, so the extra row requires no duplicated height state.

Rendering, routes, metadata and SEO stay with their existing owners; no URL, index policy, structured-data or caching change. Both locales use the existing language switch and links.

## Tasks and traceability

| Task   | Covers         | Depends on | Paths / work                                                                              | Level                   | Checkpoint                                    |
| ------ | -------------- | ---------- | ----------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------- |
| TS-001 | SC-002, SC-003 | —          | controls/theme-toggle*, i18n/shell-dictionary.ts: switch state, hydration and icons       | component               | switch tests and source/test types            |
| TS-002 | SC-001         | TS-001     | header/bars/top-bar.tsx: equal side columns and responsive center menu; update shell card | component + code review | shell regression and local architecture audit |

Evidence:

- Red: all four initial theme switch tests failed against the old icon button (missing switch semantics and stable disabled SSR state).
- Green: shell runner passed 13 tests after the initial implementation.
- Refactor: lint rejected effect-based hydration state. Replaced it with useSyncExternalStore and stable client/server snapshots, then added a real hydrateRoot regression test.
- Final regression: node node_modules/vitest/vitest.mjs run --config libs/site/core/shell/vite.config.mts — 14/14 passed, exit 0.
- node node_modules/typescript/bin/tsc -p libs/site/core/shell/tsconfig.spec.json --noEmit — exit 0, including affected source and tests.
- node node_modules/eslint/bin/eslint.js for theme-toggle.tsx, theme-toggle.spec.tsx, top-bar.tsx and shell-dictionary.ts — exit 0.
- Existing Tailwind/PostCSS processed apps/site/src/app/global.css and confirmed generated translate and equal-side grid declarations.
- git -c core.safecrlf=false diff --check — passed.
- [Post-implementation audit](code-audit/audit.md): AF-001 verified; no open in-scope findings.
  Browser/visual checks require separate user authorization under project rules and are not part of these automated checks.
