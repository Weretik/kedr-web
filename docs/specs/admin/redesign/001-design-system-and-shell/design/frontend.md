# Frontend design

**Verified state on 2026-10-25 (before the change):** the theme in `apps/admin/src/app/theme/` used primary `#18B125`, grey grounds, Inter, and 8 px radius; `libs/admin/core/shell` rendered a permanent dark 280 px drawer on `lg` and a temporary drawer below it, plus a white top bar. There was no collapsed state.

## Decisions

- The design system stays in the app theme (`apps/admin/src/app/theme/`), which [admin-ui.md](../../../../../standards/admin/admin-ui.md) names as the single place for MUI tokens. No new library is created; `core/shell` reads tokens only through the MUI theme (`theme.transitions`, palette paths), because libraries may not import the app.
- `primary.light` and `primary.dark` are used as roles (soft accent surface, accent text) so features can use standard palette paths. Contained primary hover gets an explicit shade in `components.ts`.
- The collapsed state is local UI preference, not shared app state: a hook in `core/shell` with guarded `localStorage`, no Redux.
- Both drawers render the same `AdminSidebar`; only the desktop one receives `onToggleCollapsed`.
- Manrope is loaded from Google Fonts in `index.html`, so no new npm dependency is added.

## File map

| Path                                                                          | Role                                                   | Status  |
| ----------------------------------------------------------------------------- | ------------------------------------------------------ | ------- |
| `apps/admin/src/app/theme/palette.ts`                                         | Brand constants, light and dark palettes               | changed |
| `apps/admin/src/app/theme/typography.ts`                                      | Manrope type scale                                     | changed |
| `apps/admin/src/app/theme/shadows.ts`                                         | Soft shadows                                           | changed |
| `apps/admin/src/app/theme/motion.ts`                                          | Motion tokens                                          | new     |
| `apps/admin/src/app/theme/components.ts`                                      | Component overrides, reduced motion                    | changed |
| `apps/admin/src/app/theme/admin-theme.ts`                                     | Theme assembly, transitions                            | changed |
| `apps/admin/index.html`                                                       | noindex, theme-color, font                             | changed |
| `apps/admin/public/robots.txt`                                                | Disallow all                                           | new     |
| `apps/admin/public/assets/logo/main-logo-on-dark.svg`                         | Logo for dark scheme                                   | new     |
| `libs/admin/core/shell/src/admin-layout.tsx`                                  | Drawers, width transition, content offset              | changed |
| `libs/admin/core/shell/src/components/layout/admin-sidebar.tsx`               | Logo, navigation, current order card, collapse control | new     |
| `libs/admin/core/shell/src/components/navigation/admin-navigation.tsx`        | Section links, collapsed rendering, widths             | changed |
| `libs/admin/core/shell/src/components/navigation/use-navigation-collapsed.ts` | Remembered collapsed state                             | new     |
| `libs/admin/core/shell/src/components/top-bar/admin-top-bar.tsx`              | Top bar layout and style                               | changed |
| `libs/admin/core/shell/src/components/top-bar/profile-menu.tsx`               | Smaller rounded avatar                                 | changed |

No file is overloaded by this change; the sidebar was split out of `admin-layout.tsx` so the layout only arranges drawers and content.

**Architecture baseline:** `admin-core-shell` keeps its tags (`scope:admin`, `domain:core`, `type:core`, `type:shell`) and public API (`AdminLayout`, `AdminShellSessionProvider`); no new dependencies or aliases. `nx run-many -t lint -p admin admin-core-shell` passed, which includes module boundary checks.
