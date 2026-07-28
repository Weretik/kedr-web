# Фаза 01 — User story P1: Tab navigation

**Goal:** root Home, Catalog і Profile routes працюють у нижній navigation.  
**Independent test:** в Expo Go відкрити й перемкнути кожну tab без API або storage.

- [x] T004 [US1] Додати `(tabs)` route adapters у `apps/mobile/src/app/(tabs)/`.
- [x] T005 [US1] Додати shell-owned tab presentation і placeholders у `libs/mobile/core/shell/src/components/`.
- [x] T006 [US1] Забезпечити українські labels, icons, active state, accessible names і safe area.
- [x] T007 [US1] Додати route/shell tests у `apps/mobile/src/__tests__/` або `libs/mobile/core/shell/src/`.

## Checkpoint

Root route відкриває Home; кожна tab доступна та не перекриває offline indicator або safe area.
