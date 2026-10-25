# Traceability

| Rules        | Scenarios | Tasks          | Evidence                                                                                                                                    |
| ------------ | --------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| R-003, R-004 | SC-001    | TS-002         | `libs/admin/core/shell/src/components/layout/admin-sidebar.spec.tsx`: collapse, accessible names, `aria-current`, persistence after remount |
| R-005        | SC-002    | TS-002         | `admin-sidebar.spec.tsx` (count and «Оформити» link), `admin-top-bar.spec.tsx` (count and checkout link)                                    |
| R-001, R-002 | SC-003    | TS-001         | Theme code review against the [design system](../../../../standards/admin/design-system.md); app tests 4/4 still pass                       |
| R-006        | SC-004    | TS-002         | Code review: temporary drawer below `lg` without `onToggleCollapsed`, closes on navigation                                                  |
| R-007, R-008 | SC-005    | TS-001, TS-003 | Code review: `MuiCssBaseline` reduced-motion override; `index.html` meta and `robots.txt`                                                   |

## Evidence 2026-10-25

- `npx vitest run --config libs/admin/core/shell/vite.config.mts`: 2 files, 3 tests passed.
- `npx vitest run --config apps/admin/vite.config.mts`: 3 files, 4 tests passed.
- `npx tsc --noEmit` for `libs/admin/core/shell/tsconfig.lib.json`, `tsconfig.spec.json`, and `apps/admin/tsconfig.app.json`: passed.
- `npx nx run-many -t lint -p admin admin-core-shell`: passed.

Not run: browser or visual review of themes and breakpoints (needs separate permission), full test suite, production build, E2E.
