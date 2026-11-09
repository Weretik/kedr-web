# Mobile UI rules

## Components and theme

- Write visible strings, accessible names, and feature specs in Ukrainian.
- Build screens from `@mobile/shared/ui` components (`AppText`, `Button`, `TextField`, …) and standard React Native views; React Native Paper was removed on 2026-11-05 ([ADR-0006](../../architecture/mobile/adr/0006-own-ui-on-unistyles.md)).
- Theme, colors, typography, spacing and breakpoints belong to the theme in `@mobile/shared/ui` (`createStyles` / `useStyles`, `useAppTheme`; [ADR-0007](../../architecture/mobile/adr/0007-plain-react-native-styles.md)); features must not create local design tokens or providers.
- Visual style, tokens, layout patterns, components, and motion follow the [design system «Офіс»](design-system.md).
- Every screen works at the three widths `phone`, `tablet` and `wide` and in both orientations on tablets.
- Before choosing a built-in UI component, list, gesture, or device API, check the [UI and platform capabilities catalog](../../architecture/mobile/platform/ui-capabilities.md). Do not bring desktop Admin tables into mobile screens.
- A bottom sheet is an Expo Router route with `presentation: 'formSheet'` (`sheetAllowedDetents`, `sheetGrabberVisible`), drawn natively by the platform; do not add a JavaScript sheet library (`@gorhom/bottom-sheet` was removed on 2026-11-09). A confirmation inside a screen stays inline, as in the calculation.

## Lists

- A data list without a fixed small limit (products, customers) uses `FlashList` from `@shopify/flash-list`, not `FlatList`, `SectionList`, or `ScrollView` with `map`. Today: the catalogue product list and the customer list.
- Grouped lists flatten sections into one array with header items and pass `getItemType`; FlashList has no `SectionList`.
- FlashList ignores `gap` in `contentContainerStyle`: space rows with `ItemSeparatorComponent` or row padding.
- Rows are memoized components that take ids and stable callbacks; selection state goes through `extraData`.
- Keep `FlatList` only where recycling is unsafe or pointless: rows that hold their own input state (the calculation lines) short horizontal pagers (the photo viewer), and sections capped at 50 rows inside a scrolling page (a customer's last orders and drafts) may stay a `ScrollView` with `map`. Say why in a comment.
- Jest configs of a project that renders FlashList add `@shopify/flash-list` to `transformIgnorePatterns` and `@shopify/flash-list/jestSetup` to `setupFilesAfterEnv`.

## States and accessibility

- A screen reading local data defines `first-sync`, `success`, `empty`, and `stale` («Без мережі · дані від HH:MM») states; an action that needs the server now also defines `error` with a retry.
- Offline is a normal state: show the data time calmly, never a red banner.
- Account for safe areas, keyboard, touch targets, TalkBack/VoiceOver, and accessibility labels for icon-only controls.
- Check the agreed Android, iOS, and web differences; do not assume platforms behave identically.
