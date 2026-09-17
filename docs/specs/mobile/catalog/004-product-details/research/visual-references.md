# Mobile product details — visual and package references

## Decisions

| Question          | Chosen pattern                                                                | Evidence/reference                                                               | Rejected alternative                                 | Reason                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Product hierarchy | Large media, compact details, bottom action                                   | [user reference](product-details-reference.png)                                  | dense admin table/detail form                        | matches touch browsing while keeping manager facts visible                                              |
| Remote images     | `expo-image`                                                                  | [Expo SDK 56 Image](https://docs.expo.dev/versions/v56.0.0/sdk/image/)           | React Native `Image` plus custom cache/preload       | official Expo package provides cache, transitions and `onError`                                         |
| Gallery           | `react-native-reanimated-carousel` v5 selected through Expo CLI               | [project repository](https://github.com/dohooo/react-native-reanimated-carousel) | handwritten paging or another pager plus web adapter | supports Android/iOS/web, built-in pagination, and reuses installed Reanimated/Worklets/Gesture Handler |
| Sliding panels    | existing `react-native-actions-sheet@0.9.8` when a sheet is actually required | [package documentation](https://rnas.vercel.app/)                                | custom animated modal                                | already installed and used by catalog; supports Expo, safe area, scrolling and gestures                 |
| Add confirmation  | Paper `Snackbar`                                                              | existing `react-native-paper@5.15.3`                                             | new bottom sheet/toast package                       | confirmation needs one transient message, not a new interaction surface                                 |
| Colors/type       | current Mobile Paper theme                                                    | `libs/mobile/core/shell/src/theme/app-theme.ts`                                  | reference orange palette                             | preserves corporate green, neutral surfaces and current typography                                      |

## Package policy

- During implementation run
  `npx expo install expo-image react-native-reanimated-carousel`, then
  `npx expo-doctor`; do not hand-pick incompatible versions.
- Before installation verify the selected carousel release still declares
  compatibility with Expo SDK 56, React Native 0.85, Reanimated 4,
  Worklets 0.8 and Gesture Handler 2.
- Use package primitives directly behind one small `ProductImageGallery`
  component. Do not build gesture physics, cache, pager or indicator from
  scratch.
- Reuse `react-native-actions-sheet` only for a real sheet workflow. Current
  product details has no quantity/options sheet, so adding one would create
  unnecessary interaction and code.
- Do not add image zoom, lightbox or skeleton packages for this scope. Paper
  surfaces and simple fixed placeholders cover the required states.

## Reference inventory

| Reference                                                        | Applies to                                      | Authority            | Date/version                               |
| ---------------------------------------------------------------- | ----------------------------------------------- | -------------------- | ------------------------------------------ |
| [`product-details-reference.png`](product-details-reference.png) | hierarchy and media/detail/action proportions   | user-provided        | 2026-09-15                                 |
| Existing catalog product card                                    | product naming, price and availability language | current application  | repository state 2026-09-15                |
| Mobile Paper theme                                               | all colors and typography                       | current architecture | repository state 2026-09-15                |
| Expo Image documentation                                         | remote-image cache/error contract               | Expo                 | SDK 56                                     |
| Reanimated Carousel repository                                   | gallery and pagination                          | package maintainer   | v5 compatibility table reviewed 2026-09-15 |

The screenshot is stored in this directory so future references can be added
beside it without editing generated assets. New reference files must state which
part of the design they control; they do not automatically replace product
rules or current corporate theme.
