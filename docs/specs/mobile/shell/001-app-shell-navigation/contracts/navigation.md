# Navigation contract: Mobile app shell and navigation

| Route             | Entry point                              | Screen owner         | Behavior                      |
| ----------------- | ---------------------------------------- | -------------------- | ----------------------------- |
| `/(tabs)`         | `apps/mobile/src/app/(tabs)/index.tsx`   | `@mobile/core/shell` | initial Home tab              |
| `/(tabs)/catalog` | `apps/mobile/src/app/(tabs)/catalog.tsx` | `@mobile/core/shell` | temporary Catalog placeholder |
| `/(tabs)/profile` | `apps/mobile/src/app/(tabs)/profile.tsx` | `@mobile/core/shell` | temporary Profile placeholder |

- The tab bar is shown only on root tab routes.
- Detail, auth, checkout, and modal routes are added outside `(tabs)` in their own feature specs.
- Cart route, deep links, auth guards, and route persistence are outside this feature's scope.
