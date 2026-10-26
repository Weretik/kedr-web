# Tasks

Implementation has not started. Stage numbers match the [rollout table](../README.md#rollout-stages); each task names its stage.

1. **TS-001 — Documentation (this PR).** Add the [design system standard](../../../../../standards/mobile/design-system.md) and this SDD; link them from the Mobile UI rules, standards index, and specs index. Covers: all rules as documentation. Depends on: none. Test level: n/a (links and diff). Status: done.
2. **TS-002 — Theme and fonts (stage 1).** Split `libs/mobile/core/shell/src/theme/` into palette, typography, shape, motion; extend `MD3Theme` with `kedr` tokens and `useKedrTheme`; load Unbounded and Golos Text with `expo-font` (`npx expo install @expo-google-fonts/unbounded @expo-google-fonts/golos-text`) in the root layout. Covers R-001–R-003; SC-001. Test level: unit for theme roles and contrast pairs, existing shell tests.
3. **TS-003 — Shared UI base (stage 1).** Create `libs/mobile/shared/ui` (`@mobile/shared/ui`, tags `scope:mobile`, `type:ui`): `StatusPill`, `QuantityStepper`, `StateView`, `Skeleton`, `KedrSheet`, `FilterChip`, `SearchField`, `ActionBar`, `MetricTile`, `HeroHeader`, `ScreenHeader`. Covers R-006–R-008. Test level: component.
4. **TS-004 — Shell (stage 2).** `PillTabBar` in `@mobile/core/shell`, used by `(tabs)/_layout.tsx`; headers; move theme choice to the profile screen. Covers R-004; SC-002. Test level: component.
5. **TS-005 — Catalog (stage 3).** `CategoryRail`, `ProductTile`, two-column FlashList, filters and sort in `KedrSheet`, chips via `FilterChip`. Covers R-005, R-006; SC-003. Test level: component, existing catalog tests updated.
6. **TS-006 — Product detail (stage 4).** Stage with gallery, variant chips, `ActionBar` with stepper. Covers R-006; SC-004. Test level: component.
7. **TS-007 — Cart and checkout (stage 5).** `TotalCard`, line items with vertical stepper, customer and checkout sheets on `KedrSheet`. Covers R-006, R-007; SC-004. Test level: component.
8. **TS-008 — Orders (stage 6).** Bento summary from loaded orders, `OrderRow`, order detail restyle, states. Covers R-002, R-006, R-008; SC-005. Test level: component.
9. **TS-009 — Motion and polish (stage 7).** Motion moments with Reanimated, reduced motion, states pass, feature map and catalog sync. Covers R-009, R-010; SC-006. Test level: component for reduced-motion branches; manual device check only with the owner's permission.
