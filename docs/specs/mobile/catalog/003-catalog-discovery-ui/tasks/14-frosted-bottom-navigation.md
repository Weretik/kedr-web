# Phase 14 — Frosted bottom navigation

## Goal

Replace the opacity-only floating bottom navigation with a frosted-glass pill: the page content beneath it is blurred, while the light theme uses the same white-grey surface family as the application background.

- [x] C079. Install the Expo SDK 56 compatible `expo-blur` package with `npx expo install expo-blur`. It is used only by the mobile application shell for the bottom navigation; no permission, app-config change, development build, or EAS build is required because the module is included in Expo Go.
- [ ] C080. Do not attach `BlurTargetView` around Expo Router `Tabs`: it includes the descendant `BlurView` and caused an Android native crash at startup. Redesign the target so it contains only screen content and is a sibling of the blur overlay.
- [ ] C081. Android blur is paused until C080 supplies a valid target. The floating pill retains its rounded clipping wrapper and a 60% themed translucent fallback so Expo Go remains stable.
- [x] C082. In the light theme, use the application background surface token (the white-grey page backdrop), not black. Blur is the visual effect; opacity alone is not its substitute.
- [ ] C083. Android API 31+ uses `dimezisBlurViewSdk31Plus`; older Android falls back safely to the themed translucent surface. Verify Android, iOS, and web; ensure the bar remains clipped to the oval and does not blur itself.
- [x] C084. Catalog initial loading and empty state are mutually exclusive: while the first response is absent or fetching, show Paper `ActivityIndicator` in `theme.colors.primary`; show the empty state only after a successful, settled empty response.
- [x] C085. The catalog pagination action “Завантажити ще” uses Paper `Button mode="contained"` with `buttonColor={theme.colors.primary}` and `textColor={theme.colors.onPrimary}`. It must never use a component-local hex color or the muted `primaryContainer` token.

## Acceptance

1. On a list screen, product cards/content directly under the bottom pill are visibly blurred on supported devices.
2. The light-theme pill remains white-grey and matches the surrounding application surface family.
3. The pill remains interactive, rounded, accessible, and has no opaque rectangular parent frame.
4. Android API 30 and below remain usable with the non-blurred themed fallback.

## References

- Expo BlurView, SDK 56: `https://docs.expo.dev/versions/v56.0.0/sdk/blur-view/`
