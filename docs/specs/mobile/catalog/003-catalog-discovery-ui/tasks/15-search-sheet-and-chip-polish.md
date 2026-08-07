# Phase 15 — Search sheet and query-chip polish

## Goal

Remove duplicated search-field copy, make the Android search sheet keyboard-safe, and give active Paper chips correct vertical typography and a visible semantic surface.

- [x] C086. Complete the Android blur architecture from C080: the blur target contains tab screen content only, while the floating tab bar/`BlurView` is its sibling above it. Never include `BlurView` inside its own `BlurTargetView`; this is the native startup-crash condition observed in Expo Go.
- [x] C087. Remove the visible `label="Пошук товарів"` from the search `TextInput`. The Action Sheet title already identifies the task; retain `accessibilityLabel="Пошук товарів"`, the leading magnifier, and the trailing clear/submit controls. Do not replace the removed label with duplicate visual text.
- [x] C088. On Android, focusing or typing in search must not render a white rectangular overlay above history or controls. The Action Sheet owns keyboard handling; the competing `KeyboardAvoidingView` and fixed-height frame are removed.
- [x] C089. Keep `react-native-paper/Chip`; do not replace it with another package or a hand-made pressable. Use the documented `mode`, `style`, and `textStyle` props. The Android label style sets `includeFontPadding: false`, `textAlignVertical: 'center'`, a single-line line height, and zero vertical margins.
- [x] C090. Give every applied-filter chip a semantic, non-white themed surface: `primaryContainer` background, `onPrimaryContainer` text, and primary-toned outline/close affordance. Preserve `compact`, truncation, horizontal scrolling, and close semantics.
- [x] C092. Selecting a recent search immediately applies it and closes the search sheet; it must not merely copy the phrase into the draft field.
- [x] C093. Render `BlurView` only after its sibling tab-content `BlurTargetView` completes layout, use transparent Paper bar surface with explicit active/inactive colors, and set Expo Router tab bar positioning to `absolute`. This follows the Expo blur/tab-bar guidance and prevents two competing visual backgrounds.
- [x] C094. Use ActionSheet's exported `ScrollView` for searchable sheet content so the library's keyboard handling manages history rather than a competing React Native scroll/avoidance layer.
- [x] C095. Render the floating navigation as separate layers: one oval `BlurView` only, and three independent transparent tab buttons positioned above it. Do not use `BottomNavigation.Bar`, whose internal surface creates a competing second background.
- [ ] C091. Add or update UI tests for the label-free search input, keyboard-safe content structure, and themed compact Paper chip props. Perform Android device validation for C086, C088, and C089.

## Acceptance

1. Search sheet shows one visual title only; its input has no second “Пошук товарів” label.
2. Typing on Android leaves history and submit controls usable and unobscured.
3. Chip text appears optically centered; chips are compact, light-green/semantic rather than white, and removable.
4. Startup remains stable in Expo Go after blur is reintroduced with a sibling target.

## References

- React Native Paper Chip API: `https://oss.callstack.com/react-native-paper/3.0/chip.html`
- React Native Android text alignment (`includeFontPadding` and `textAlignVertical`): `https://reactnative.dev/docs/0.75/text-style-props`
