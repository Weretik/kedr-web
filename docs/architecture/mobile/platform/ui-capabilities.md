# Mobile UI and platform capabilities catalog

**Status:** approved architecture decision.\
**Current state:** only packages needed for approved scenarios in this catalog are installed in `apps/mobile`; do not add dependencies in advance.

This document is the single place to choose ready-made Mobile UI components, gestures, and device capabilities. Before adding a library, an agent or developer checks the scenario against the table below instead of choosing an arbitrary alternative.

## Current package state

Checked on 2026-10-15 against `apps/mobile/package.json` and usage in `apps/mobile/src` and `libs/mobile`. The selection rules below do not mean that every package is already integrated into every scenario.

| State                                            | Packages                                                                                                                                                                                                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Declared in `apps/mobile/package.json`           | `react-native-paper`, `@react-native-assets/slider`, `react-native-actions-sheet`, `@shopify/flash-list`, `react-native-gesture-handler`, `react-native-reanimated-carousel`, `expo-blur`, `@expo-google-fonts/unbounded`, `@expo-google-fonts/golos-text` |
| Approved for a future scenario, but not declared | `react-native-paper-dates`, `expo-camera`, `expo-haptics`                                                                                                                                                                                                  |

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

| Package                                                         | When to use                                                                                                                      | Code boundary and required conditions                                                                                                                                                                                                              |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-native-paper`                                            | Primary UI library: buttons, input fields, cards, menus, dialogs, tabs, `Snackbar`, `Searchbar`, `Chip`, theme.                  | Use for ready-made complex controls. Use standard React Native components for simple layout. Theme and tokens are centralized; features do not create their own provider.                                                                          |
| `@react-native-assets/slider`                                   | Two-thumb numeric range: price filter.                                                                                           | Use `RangeSlider` with controlled `range`, limits, and Paper theme colors. Works with React Native and Web; requires no native config or Development Build.                                                                                        |
| `react-native-actions-sheet`                                    | Bottom sheets for sorting, category selection, quick filters, and short action lists.                                            | The sheet component belongs in `ui`; `feature` passes state and handlers. The sheet needs scrollable content and explicit dismissal, and must not hide the only critical action.                                                                   |
| `@shopify/flash-list`                                           | Long or potentially large lists: products, customers, orders, operation history.                                                 | Default choice for **new** lists of this kind instead of `FlatList`. Do not migrate an existing `FlatList` automatically. Check supported props and recycled-cell behavior during migration.                                                       |
| `react-native-gesture-handler`                                  | Row swipe, drag, long press, swipe actions such as “edit/delete”.                                                                | Add only when native `Pressable` is insufficient. Place `GestureHandlerRootView` near the app root; also wrap the content of an RN `Modal` when using gestures there. Provide an accessible gesture alternative (visible button/menu).             |
| `react-native-reanimated-carousel`                              | Product photo, promotional banner, category, or promotion carousel.                                                              | Do not use for primary navigation or critical content without an alternative. Add with compatible `react-native-reanimated`, `react-native-worklets`, and `react-native-gesture-handler`; check installation for the current Expo SDK.             |
| `@expo-google-fonts/unbounded`, `@expo-google-fonts/golos-text` | Brand fonts of the [«Пагін» design system](../../../standards/mobile/design-system.md): display headings, prices, and body text. | Loaded once with `expo-font` `useFonts` behind the splash screen in `apps/mobile/src/app/_layout.tsx`; components read families from theme tokens only. No native config or Development Build.                                                     |
| `react-native-paper-dates`                                      | Choose a date, time, or period: order deadline, report, call date, date filter.                                                  | Use with the Paper theme. Register Ukrainian translation `uk-UA` before first display; feature explicitly defines the format, timezone, and value sent to the API.                                                                                 |
| `expo-camera`                                                   | Product photo, QR/barcode scan, attach a photo to an order.                                                                      | Isolate camera access and permission flow behind a platform adapter/feature boundary, not presentation `ui`. Explain permissions and check on a real device; native config changes require a new binary.                                           |
| `expo-haptics`                                                  | Subtle response to button confirmation, successful save, error, or filter change.                                                | Call through a platform adapter, not directly from every button. Haptics are an additional signal only: success, error, and state always need visible/accessible UI feedback. Vibration may be unavailable because of settings or on some devices. |

## Dependency placement

`feature` orchestrates the scenario and owns local state. `ui` contains presentational components based on Paper, Action Sheet, FlashList, carousel, or date picker and does not depend on the API. Isolate device access (`expo-camera`, `expo-haptics`) in a platform adapter/core or domain-specific service; `ui` receives only data and callbacks.

The public API of each library remains in its `src/index.ts`. Do not export DTOs or the API client through a UI library.

## Expo Go and Development Build

After adding any dependency, check compatibility with the current Expo SDK using `npx expo-doctor` and the package documentation. FlashList supports Expo Go with SDK 46+, but the installed version still needs checking. `expo-camera` adds camera permission; the iOS permission explanation and app-config changes are included in the native binary, so a new production/development build is needed. Follow current native/setup requirements for `react-native-gesture-handler` and carousel.

The complete process for switching and rebuilding is in [Expo Go and Development Build](development-build.md). This catalog does not authorize creating `expo-dev-client` or an EAS build without a specific native need.

## Registered dependency: `expo-blur`

`expo-blur` is declared in `apps/mobile/package.json` and mapped to a Jest mock, but no code uses it.
The frosted bottom navigation it was added for was dropped on 2026-10-25; the shell uses Paper `BottomNavigation.Bar` without blur.
Remove the package in a separate dependency change, or register a new approved use before importing it.

## Sources

- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [react-native-actions-sheet](https://rnas.vercel.app/)
- [FlashList: installation and Expo support](https://shopify.github.io/flash-list/docs/)
- [React Native Gesture Handler: installation](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/)
- [React Native Reanimated Carousel](https://rn-carousel.dev/)
- [React Native Paper Dates](https://web-ridge.github.io/react-native-paper-dates/docs/intro)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
