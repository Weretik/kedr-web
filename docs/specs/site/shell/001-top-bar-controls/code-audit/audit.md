# Top bar and theme switch — post-implementation audit

Date: 2026-11-03. Scope: TS-001/TS-002, SC-001–SC-003, existing site-core-shell. Status: verified, no open findings within scope.

Sources: root AGENTS.md, apps/site/AGENTS.md, docs/features/site/shell.md, docs/architecture/site/structure/modules.md, docs/standards/site/design-system.md, docs/standards/shared/testing-rules.md and the approved uncaptioned switch concept.

## Architecture and responsibility review

- TopBar remains a Server Component owning only responsive composition and localized links. It imports core/i18n and existing shell leaves through their current boundaries. It adds no state or transport.
- ThemeToggle remains the existing client leaf and calls next-themes through useTheme; no parallel theme storage, document mutation or provider was introduced. Three small module-level hydration snapshot helpers share the same narrow responsibility and stay in the component file.
- Its CSS Module owns only the thumb transition. Tailwind v4 emits the individual translate property, so that property is animated. Local important priority intentionally preserves thumb feedback while next-themes suppresses page-wide theme transitions; reduced-motion disables it with the same priority.
- No Nx project, tag, public API, alias, API, routing, SEO or cache boundary changed. No new dependency, private cross-library import, raw HTML, secret or unbounded state was added. Existing component/state ownership remains appropriate.
- Physical structure: one theme leaf with adjacent style and test files in controls; one layout in header/bars; localized names in i18n. Keep existing folders; no mixed lifecycle or independent feature warrants another layer or folder.

## Findings

### AF-001 — effect-based hydration marker

- Severity: low. Status: verified.
- Original location: libs/site/core/shell/src/lib/controls/theme-toggle.tsx:15 in the initial implementation, useEffect calling setMounted directly.
- Rule/source: active project ESLint react-hooks/set-state-in-effect; project testing/delivery gates require changed code to pass scoped lint.
- Evidence: initial scoped lint failed at setMounted(true). It could introduce an unnecessary effect update.
- Owner/target: site-core-shell, TS-001. Fix: useSyncExternalStore with stable subscribe/client/server snapshot functions; server and hydration begin disabled/unchecked, and client state then reflects resolvedTheme.
- Verification: final scoped lint and TypeScript passed; all 14 shell tests passed, including saved dark-theme hydration with no recoverable hydration errors and correct checked/enabled state.

## Correctness and presentation review

- Full-header centering uses equal outer grid tracks and the navigation's auto-sized central track from xl. Below xl, all six localized links center in a second, wrapping row. Address/control groups stay separate. Existing ResizeObserver measures changed header height, preserving collapse behavior.
- Ukrainian and Russian labels remain in the shell dictionary. The switch has no visible caption; a constant dark-mode name and aria-checked expose its meaning to assistive technology. Native button keyboard behavior, focus ring, both decorative icons, type=button and enlarged coarse-pointer target remain explicit.
- Light/dark colors follow existing tokens and the document dark class. The knob position and icon contrast do not depend on a client-only initial render. Shared mobile use was checked at mobile-menu.tsx: the wrapping control row accommodates the wider switch.
- Tests cover light/dark values and opposite actions, a system preference update, stable SSR markup and actual saved dark-mode hydration. Existing shell/navigation/collapsing tests all passed.

## Fresh verification on final code

- node node_modules/vitest/vitest.mjs run --config libs/site/core/shell/vite.config.mts — 5 files, 14 tests passed, exit 0.
- node node_modules/typescript/bin/tsc -p libs/site/core/shell/tsconfig.spec.json --noEmit — exit 0.
- node node_modules/eslint/bin/eslint.js libs/site/core/shell/src/lib/controls/theme-toggle.tsx libs/site/core/shell/src/lib/controls/theme-toggle.spec.tsx libs/site/core/shell/src/lib/header/bars/top-bar.tsx libs/site/core/shell/src/lib/i18n/shell-dictionary.ts — exit 0.
- Current PostCSS/Tailwind processed global.css and emitted the expected translate property and equal-side grid — exit 0.
- git -c core.safecrlf=false diff --check — exit 0.

Limits: no browser/visual check, production build or full-workspace audit was run. Responsive geometry, theme wiring and motion were reviewed in code and compiled CSS; runtime tests cover behavior and hydration. Earlier home-page changes were preserved. Hook configuration was not changed or manually invoked; no commit/PR was created.
