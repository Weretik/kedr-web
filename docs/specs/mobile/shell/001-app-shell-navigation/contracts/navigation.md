# Navigation contract: Mobile app shell and navigation

| Route | Entry point | Screen owner | Поведінка |
| --- | --- | --- | --- |
| `/(tabs)` | `apps/mobile/src/app/(tabs)/index.tsx` | `@mobile/core/shell` | initial Home tab |
| `/(tabs)/catalog` | `apps/mobile/src/app/(tabs)/catalog.tsx` | `@mobile/core/shell` | temporary Catalog placeholder |
| `/(tabs)/profile` | `apps/mobile/src/app/(tabs)/profile.tsx` | `@mobile/core/shell` | temporary Profile placeholder |

- Tab bar показується лише на root tab routes.
- Detail, auth, checkout і modal routes додаються поза `(tabs)` у власних feature specs.
- Cart route, deep links, auth guards і route persistence не входять у цю feature.
