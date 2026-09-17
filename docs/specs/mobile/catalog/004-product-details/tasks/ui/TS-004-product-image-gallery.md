# TS-004 — Remote image gallery and fallback

- **Task ID:** TS-004
- **Covers:** SC-004, SC-005
- **Depends on:** EN-002, TS-001
- **Exact paths:** `libs/mobile/catalog/ui/src/components/product-details/product-image-gallery.tsx`; component spec; required Jest mocks only
- **Test level:** component

## Work

- [x] Compose `react-native-reanimated-carousel` and `expo-image` for one/two
      candidates using `contain`, cache, subtle transition and package pagination.
- [x] Track per-URL success/error so failed frames disappear, one frame has no
      indicator and total failure shows the Ukrainian fallback with accessible
      image kind/index.

## Evidence

- Test/path and observable assertion: zero/one/two valid candidates, partial
  failure, total failure, swipe/index announcement and reduced motion.
- Red command and expected behavioral failure: gallery tests initially failed
  because the component and native-safe Jest adapters did not exist.
- Green command and result: `product-image-gallery.spec.tsx` passes carousel
  selection and failed-URL fallback assertions.
- Refactor note and focused rerun: only package APIs own paging/gestures; local
  state tracks failed URLs and resets by stable candidate key.
- Regression command and result: UI suite and web/Android Metro exports pass.
- Manual/visual evidence, if required: gallery screenshots/video in TS-008.
- Deviation or blocker: swipe and reduced-motion observation remain manual in TS-008.

## Checkpoint

All image combinations from SC-004/SC-005 render without broken images or
handwritten paging/gesture logic.
