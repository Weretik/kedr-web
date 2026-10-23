# Feature specification: Mobile app shell and navigation

**Created:** 2026-07-28\
**Status:** completed\
**Domain:** `shell`\
**Dependency:** completed Mobile foundation

## User scenarios and testing

### User story 1 — Tab navigation (Priority: P1)

As a user, I want to open Головна, Каталог, and Профіль through the bottom
navigation so I can quickly move between the app's root sections.

**Independent test:** In Expo Go, open the root route, visit each tab,
and verify that the active state and safe area work correctly.

**Acceptance scenarios:**

1. Given the app is open, when the root route loads, then Головна appears inside the tab shell.
2. Given the tab shell is open, when the user taps Каталог or Профіль, then the corresponding placeholder and active tab appear.

### User story 2 — Theme preference (Priority: P2)

As a user, I want to choose the System, Light, or Dark theme so the interface
matches my system or personal preferences.

**Independent test:** Change the theme preference, restart the app, and
verify that the choice was saved.

**Acceptance scenarios:**

1. Given the root tab screen, when the user selects Light or Dark, then the Paper theme changes immediately.
2. Given a saved preference, when the app restarts, then bootstrap restores it without flashing the wrong theme.

### User story 3 — Resilient shell states (Priority: P3)

As a user, I want clear shell states so offline, loading, or
empty placeholders do not cover navigation.

**Independent test:** Disable the network or simulate a bootstrap state and
check the header, content, and tab bar in Expo Go and web.

## Edge cases

- If AsyncStorage is unavailable or returns an error, the app falls back to `system` and navigation remains unblocked.
- While restoring the preference, the shell displays a stable loading state.
- Future detail, auth, and modal routes do not show the root tab bar.

## Requirements

- **FR-001**: Root navigation must use the Expo Router group `(tabs)` with Головна, Каталог, and Профіль.
- **FR-002**: Tabs must have Ukrainian labels, an active state, icons, and accessible names.
- **FR-003**: The theme preference must support `system | light | dark` and be persisted through a shell-owned adapter.
- **FR-004**: The header and tab bar must account for the safe area and avoid conflicting with the offline indicator.
- **FR-005**: Route files must not contain API, storage, or domain business logic.

## Success criteria

- [x] **SC-001**: The user can open each root tab and return to Головна without navigation errors.
- [x] **SC-002**: The theme preference is restored after restart without a noticeable flash of the wrong theme.
- [x] **SC-003**: The agreed Android Expo Go and web checks show no console errors or obscured touch targets.

## Assumptions and dependencies

- `@mobile/core/shell` already owns `AppProviders`, the Paper theme, Redux store, and connectivity indicator.
- The actual catalog, profile, cart, auth, analytics, and deep links belong to separate feature specifications.

## Change history

- **2026-07-28 — implemented:** Added the Expo Router group `(tabs)` with Головна, Каталог, and Профіль; a shell-owned AsyncStorage adapter and bootstrap for the `system | light | dark` theme preference; placeholder screens and accessible names for tab controls. TypeScript and `shell` unit tests passed; manual Expo Go/web checks have not yet been performed.
- **2026-07-28 — in progress:** Added shell states for loading, empty, and error, a retry action for errors, and integration with the existing Snackbar. Manual checks of the offline indicator in Android Expo Go and web remain.
- **2026-07-28 — completed:** The user confirmed manual Android Expo Go and web verification; `nx test shell`, `nx test mobile`, and web export succeeded. `expo-doctor` found a duplicate `react-native-safe-area-context` dependency, recorded as a residual risk before a native production build.
