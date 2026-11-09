# ADR-0007: Plain React Native styles with a theme context instead of Unistyles

**Status:** Accepted\
**Date:** 2026-11-09\
**Replaces:** the styling part of [ADR-0006](0006-own-ui-on-unistyles.md)

## Context

ADR-0006 styled the own «Офіс» components with `react-native-unistyles` 3, which repaints native views on a theme change without re-rendering React. On the owner's Android device (Expo SDK 58, React Native 0.88, Unistyles 3.8) a theme change repainted only views that re-rendered, left the background, cards and hidden tabs dark, and later froze the app for minutes when the screens were mounted again. Unistyles also needs Nitro Modules and a Babel plugin, so the app could not run in Expo Go.

## Decision

- Styles are plain React Native style objects built by `createStyles((theme, rt) => …)` in `@mobile/shared/ui` and read in a component with `useStyles(sheet)`. `rt` holds the width class (`phone` < 600, `tablet` 600–1023, `wide` ≥ 1024 dp), the safe-area insets and the theme name.
- The theme is React state: `AppThemeProvider` in the shell gives the chosen theme to every screen and bottom sheet; `useAppTheme()` reads it. A theme change re-renders through React, so every view gets the new colors.
- A sheet is built once per theme, width class and insets and shared by every component that reads it, so long lists do not rebuild styles per row.
- The theme choice is stored with `expo-sqlite/kv-store` and read synchronously, so the first frame already has it.
- `react-native-unistyles`, `react-native-nitro-modules` and the Unistyles Babel plugin are removed.

## Consequences

- No native styling code: a theme change is an ordinary React update, testable in Jest without mocks.
- Components that read styles re-render on a theme change; that is one update per change, not per frame.
- Removing the native packages needs no new build for the JavaScript to work; the next EAS build simply no longer contains them.
