# TS-003 — Catalog-to-detail navigation and restoration

- **Task ID:** TS-003
- **Covers:** SC-001, SC-002, SC-012
- **Depends on:** none
- **Exact paths:** `apps/mobile/src/app/product/[productSlug].tsx`; `apps/mobile/src/app/_layout.tsx`; `apps/mobile/src/app/(tabs)/catalog.tsx`; `libs/mobile/catalog/feature/src/screens/catalog-screen.tsx`; `libs/mobile/catalog/ui/src/components/products/product-card.tsx`; route/catalog screen specs
- **Test level:** integration

## Work

- [x] Make the full product card an accessible action and pass slug through
      feature callbacks to the thin Expo Router adapter and root Stack route.
- [x] Preserve current catalog query/results/scroll anchor across push/pop and
      guard missing or array-valued slug without issuing HTTP.

## Evidence

- Test/path and observable assertion: card activation routes exact slug, Back
  restores query/anchor, invalid deep link renders guarded state.
- Red command and expected behavioral failure: product cards exposed no press
  callback and no product route existed.
- Green command and result: `product-card.spec.tsx`, `catalog-screen.spec.tsx`
  and `start-route.spec.tsx` prove card activation, exact slug push and
  array-valued route normalization.
- Refactor note and focused rerun: Expo Router remains confined to thin app
  route adapters; the catalog screen stays mounted under the root Stack so its
  reducer, accumulated rows and FlashList anchor survive push/pop.
- Regression command and result: `npm run test:mobile` passes all 12 projects.
- Manual/visual evidence, if required: Android/web Back recording in TS-008.
- Deviation or blocker: physical Back/scroll observation is deferred to TS-008.

## Checkpoint

Search/filter context survives a complete catalog → detail → Back journey.
