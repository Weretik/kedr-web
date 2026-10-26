# Mobile UI rules

## Components and theme

- Write visible strings, accessible names, and feature specs in Ukrainian.
- Use React Native Paper for complex controls and standard React Native components for simple layout.
- Theme, colors, typography, and spacing belong to the centralized Paper theme; features must not create local design tokens or providers.
- Visual style, tokens, layout patterns, components, and motion follow the [design system «Пагін»](design-system.md).
- Before choosing a built-in UI component, list, gesture, or device API, check the [UI and platform capabilities catalog](../../architecture/mobile/platform/ui-capabilities.md). Use `@shopify/flash-list` for new long lists; do not bring desktop Admin tables into mobile screens.

## States and accessibility

- A screen with server data defines the applicable `loading`, `success`, `empty`, `error`, and `offline` states.
- Error/offline states show a clear message and a retry action when possible.
- Account for safe areas, keyboard, touch targets, TalkBack/VoiceOver, and accessibility labels for icon-only controls.
- Check the agreed Android, iOS, and web differences; do not assume platforms behave identically.
