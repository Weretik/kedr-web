# Tasks

1. **TS-001 — Theme.** Replace palette, typography, shadows, radii, motion, and component overrides in `apps/admin/src/app/theme/`; add reduced-motion override. Covers R-001, R-002, R-007; SC-003, SC-005. Depends on: none. Test level: app component tests (regression) and typecheck. Evidence: `vitest --config apps/admin/vite.config.mts` 4/4, `tsc -p apps/admin/tsconfig.app.json` passed. Checkpoint: no hard-coded legacy colors remain in the theme.
2. **TS-002 — Collapsible shell.** Add `AdminSidebar`, `useNavigationCollapsed`, collapsed navigation, and restyled top bar in `libs/admin/core/shell/src/`. Covers R-003–R-006; SC-001, SC-002, SC-004. Depends on: TS-001. Test level: component. Evidence: `admin-sidebar.spec.tsx` (2 tests), `admin-top-bar.spec.tsx` (1 test). Checkpoint: collapsed links keep names and `aria-current`; choice persists.
3. **TS-003 — Indexing.** `noindex, nofollow` meta and `robots.txt` in `apps/admin`. Covers R-008; SC-005. Depends on: none. Test level: n/a (static files, checked in diff).
4. **TS-004 — Documentation.** Add the [design system standard](../../../../../standards/admin/design-system.md), link it from Admin UI rules and the standards index, update the [session and shell card](../../../../../features/admin/session.md). Depends on: TS-001–TS-003. Test level: n/a (links and diff).

The tests for TS-002 were written after the first implementation pass and then run against it; there was no separate failing run.
