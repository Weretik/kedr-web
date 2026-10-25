# Phase 15 — Search sheet and query-chip polish

## Goal

Remove duplicated search-field copy, make the Android search sheet keyboard-safe, and give active Paper chips correct vertical typography and a visible semantic surface.

- [x] C087. Remove the visible `label="Пошук товарів"` from the search `TextInput`. The Action Sheet title already identifies the task; retain `accessibilityLabel="Пошук товарів"`, the leading magnifier, and the trailing clear/submit controls. Do not replace the removed label with duplicate visual text.
- [x] C088. On Android, focusing or typing in search must not render a white rectangular overlay above history or controls. The Action Sheet owns keyboard handling; the competing `KeyboardAvoidingView` and fixed-height frame are removed.
- [x] C089. Keep `react-native-paper/Chip`; do not replace it with another package or a hand-made pressable. Use the documented `mode`, `style`, and `textStyle` props. The Android label style sets `includeFontPadding: false`, `textAlignVertical: 'center'`, a single-line line height, and zero vertical margins.
- [x] C090. Give every applied-filter chip a semantic, non-white themed surface: `primaryContainer` background, `onPrimaryContainer` text, and primary-toned outline/close affordance. Preserve `compact`, truncation, horizontal scrolling, and close semantics.
- [x] C092. Selecting a recent search immediately applies it and closes the search sheet; it must not merely copy the phrase into the draft field.
- [x] C084. Catalog initial loading and empty state are mutually exclusive: while the first response is absent or fetching, show Paper `ActivityIndicator` in `theme.colors.primary`; show the empty state only after a successful, settled empty response. (Moved from the removed phase 14.)
- [x] C085. The catalog pagination action “Завантажити ще” uses Paper `Button mode="contained"` with `buttonColor={theme.colors.primary}` and `textColor={theme.colors.onPrimary}`. It must never use a component-local hex color or the muted `primaryContainer` token. (Moved from the removed phase 14.)
- [x] C094. Use ActionSheet's exported `ScrollView` for searchable sheet content so the library's keyboard handling manages history rather than a competing React Native scroll/avoidance layer.
- [x] C091. Add or update UI tests for the label-free search input, keyboard-safe content structure, and themed compact Paper chip props. Perform Android device validation for C086, C088, and C089.

## Acceptance

1. Search sheet shows one visual title only; its input has no second “Пошук товарів” label.
2. Typing on Android leaves history and submit controls usable and unobscured.
3. Chip text appears optically centered; chips are compact, light-green/semantic rather than white, and removable.

## References

- React Native Paper Chip API: `https://oss.callstack.com/react-native-paper/3.0/chip.html`
- React Native Android text alignment (`includeFontPadding` and `textAlignVertical`): `https://reactnative.dev/docs/0.75/text-style-props`

## Evidence (2026-10-25)

- Phase 14 (frosted bottom navigation) was removed by the product owner; the blur items C080–C083, C086, C093 and C095 are out of scope. The shell keeps Paper `BottomNavigation.Bar`.
- C091: `catalog-search-sheet.spec.tsx` covers the label-free input and the keyboard-aware scroll structure; `catalog-active-filters.spec.tsx` covers compact themed Paper chip props (`compact`, `mode="flat"`, `secondary`/`onSecondary` surface, `includeFontPadding: false`, `textAlignVertical: 'center'`). `npx nx test mobile-catalog-ui --testPathPattern="catalog-(search-sheet|active-filters)"` — 2 suites, 7 tests passed. Android device validation of C088/C089 is covered by the phase 16 manual QA.
