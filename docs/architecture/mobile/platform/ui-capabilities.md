# Mobile UI and platform capabilities catalog

**Status:** approved architecture decision.\
**Current state:** only packages needed for approved scenarios in this catalog are installed in `apps/mobile`; do not add dependencies in advance.

This document is the single place to choose ready-made Mobile UI components, gestures, and device capabilities. Before adding a library, an agent or developer checks the scenario against the table below instead of choosing an arbitrary alternative.

## Current package state

Checked on 2026-11-05 (Kedr Manager stage 1) against `apps/mobile/package.json` and usage in `apps/mobile/src` and `libs/mobile`.

| State                                            | Packages                                                                                                                                                                                                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Declared in `apps/mobile/package.json`           | `react-native-unistyles` (+ `react-native-nitro-modules`), `@gorhom/bottom-sheet`, `zustand`, `expo-local-authentication`, `expo-screen-orientation`, `@shopify/flash-list`, `react-native-gesture-handler`, `expo-image`, `@expo-google-fonts/golos-text` |
| Approved for a future scenario, but not declared | `expo-sqlite`, `drizzle-orm` (stage 2), `react-native-zoom-toolkit` (stage 4, optional), `expo-updates` (stage 8), `expo-camera`, `expo-haptics`                                                                                                           |
| Removed 2026-11-05                               | `react-native-paper`, `react-native-actions-sheet`, `react-native-reanimated-carousel`, `react-native-tree-multi-select`, `@react-native-assets/slider`, `@expo-google-fonts/unbounded`, `expo-blur`, `@reduxjs/toolkit` and `react-redux` (mobile only)   |

Declaration in a manifest does not prove a package is used on a screen. Check actual imports and setup before changing the relevant feature; exact versions are in `apps/mobile/package.json` and the root `package.json`; stack decisions are in the [technology overview](../../technology-and-packages.md).

## Addition rule

Add a package only when it is needed for a specific approved task. Record the following in its SDD/plan:

1. the scenario and screen that need it;
2. the package and version compatible with the current Expo SDK (install through `npx expo install` if supported by Expo);
3. where it is used and its responsibility boundary;
4. whether it changes the native runtime, permissions, or app config, and therefore requires a Development Build;
5. checks on Android, iOS, and web if the platform is supported.

Do not install the entire list “just in case” or mass-migrate existing components without a separate task and measurable reason.

## Approved choices

| Package                         | When to use                                                                                     | Code boundary and required conditions                                                                                                                                                                                                                          |
| ------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-native-unistyles`        | Themes, breakpoints and every style sheet ([ADR-0006](../adr/0006-own-ui-on-unistyles.md)).     | Configured once in `@mobile/shared/ui` (`theme/unistyles.ts`), imported first by `apps/mobile/index.ts`. Needs `react-native-nitro-modules` and a Development Build (not Expo Go). The Babel plugin runs in the app; Jest uses `react-native-unistyles/mocks`. |
| `@gorhom/bottom-sheet`          | The one bottom sheet (`Sheet` in `@mobile/shared/ui`): customer choice, filters, confirmations. | `BottomSheetModalProvider` lives in `AppProviders`; features use `Sheet`, never the package directly. Needs explicit dismissal and must not hide the only critical action.                                                                                     |
| `zustand`                       | Small UI state shared by screens: theme choice, selected customer, filters.                     | One store per responsibility next to its owner; persisted with AsyncStorage only for non-sensitive values. Server data lives in the local database, not in stores.                                                                                             |
| `expo-local-authentication`     | Quick unlock of a saved session (fingerprint, face, device code).                               | Only in `@mobile/core/auth` (`session/quick-unlock.ts`). The iOS Face ID text is in `app.json`; needs a new binary.                                                                                                                                            |
| `expo-screen-orientation`       | Portrait on phones, free rotation on tablets.                                                   | Only in the shell orientation policy.                                                                                                                                                                                                                          |
| `@shopify/flash-list`           | Long lists: products, customers, orders.                                                        | Default choice for new long lists instead of `FlatList`.                                                                                                                                                                                                       |
| `react-native-gesture-handler`  | Zoom viewer, sheet gestures, swipe actions.                                                     | `GestureHandlerRootView` is in `AppProviders`. Provide an accessible alternative (visible button) for every gesture.                                                                                                                                           |
| `@expo-google-fonts/golos-text` | The only font of the [«Офіс» design system](../../../standards/mobile/design-system.md).        | Loaded once with `expo-font` `useFonts` behind the splash screen in `apps/mobile/src/app/_layout.tsx`; components read faces from theme tokens only.                                                                                                           |
| `expo-camera`                   | Product photo, QR/barcode scan, attach a photo to an order.                                     | Isolate camera access and permission flow behind a platform adapter/feature boundary, not presentation `ui`. Native config changes require a new binary.                                                                                                       |
| `expo-haptics`                  | Subtle response to confirmation, save, error.                                                   | Call through a platform adapter. Haptics are an additional signal only.                                                                                                                                                                                        |

## Dependency placement

`feature` orchestrates the scenario and owns local state. `ui` contains presentational components built from `@mobile/shared/ui` and FlashList and does not depend on the API. Isolate device access (`expo-camera`, `expo-haptics`) in a platform adapter/core or domain-specific service; `ui` receives only data and callbacks.

The public API of each library remains in its `src/index.ts`. Do not export DTOs or the API client through a UI library.

## Expo Go and Development Build

After adding any dependency, check compatibility with the current Expo SDK using `npx expo-doctor` and the package documentation. FlashList supports Expo Go with SDK 46+, but the installed version still needs checking. `expo-camera` adds camera permission; the iOS permission explanation and app-config changes are included in the native binary, so a new production/development build is needed. Unistyles 3 and Nitro Modules are native, so the app runs in a Development Build, not in Expo Go.

The complete process for switching and rebuilding is in [Expo Go and Development Build](development-build.md). This catalog does not authorize creating `expo-dev-client` or an EAS build without a specific native need.

## Sources

- [Unistyles 3](https://www.unistyl.es/)
- [Gorhom Bottom Sheet](https://gorhom.dev/react-native-bottom-sheet/)
- [FlashList: installation and Expo support](https://shopify.github.io/flash-list/docs/)
- [React Native Gesture Handler: installation](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
