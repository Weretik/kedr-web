# Mobile UI rules

## Components and theme

- Write visible strings, accessible names, and feature specs in Ukrainian.
- Build screens from `@mobile/shared/ui` components and standard React Native views; React Native Paper is being removed ([ADR-0006](../../architecture/mobile/adr/0006-own-ui-on-unistyles.md)) and is not used in new code.
- Theme, colors, typography, spacing and breakpoints belong to the Unistyles theme in `@mobile/shared/ui`; features must not create local design tokens or providers.
- Visual style, tokens, layout patterns, components, and motion follow the [design system «Офіс»](design-system.md).
- Every screen works at the three widths `phone`, `tablet` and `wide` and in both orientations on tablets.
- Before choosing a built-in UI component, list, gesture, or device API, check the [UI and platform capabilities catalog](../../architecture/mobile/platform/ui-capabilities.md). Use `@shopify/flash-list` for new long lists; do not bring desktop Admin tables into mobile screens.

## States and accessibility

- A screen reading local data defines `first-sync`, `success`, `empty`, and `stale` («Без мережі · дані від HH:MM») states; an action that needs the server now also defines `error` with a retry.
- Offline is a normal state: show the data time calmly, never a red banner.
- Account for safe areas, keyboard, touch targets, TalkBack/VoiceOver, and accessibility labels for icon-only controls.
- Check the agreed Android, iOS, and web differences; do not assume platforms behave identically.
