# ADR-0006: Own UI components on Unistyles instead of React Native Paper

**Status:** Accepted\
**Date:** 2026-11-05

## Context

The app mixes React Native Paper (Material 3) controls with its own «Пагін» tokens: two systems, three sheet implementations, and an Android look on iPhone. The rebuild needs one design system, the «Офіс» look chosen by the owner on 2026-11-05, and layouts that change between phone and tablet widths.

## Decision

- UI components are our own, in `@mobile/shared/ui`, styled with `react-native-unistyles` 3: light and dark themes plus breakpoints (`phone` < 600, `tablet` 600–1023, `wide` ≥ 1024 dp) without re-rendering every component on a theme change.
- Tokens and components follow the [design system «Офіс»](../../../standards/mobile/design-system.md).
- Bottom sheets use one implementation (`@gorhom/bottom-sheet`); gestures and zoom use `react-native-gesture-handler` and `react-native-reanimated`.
- React Native Paper, `react-native-actions-sheet` and the «Пагін» tokens are removed with the old screens.

## Consequences

- Every control the app needs (button, input, segmented control, chip, stepper, list row, status pill, sheet, state view) is built and tested once in `@mobile/shared/ui`.
- Exact package versions are checked against Expo SDK 58 in stage 1 and recorded in the [technology stack](../platform/technology-stack.md).
