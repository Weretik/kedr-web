# Tasks

Stage numbers match the [rollout table](../README.md#rollout-stages); each task names its stage.

1. **TS-001 — Documentation.** Design system standard and this SDD, linked from the Mobile UI rules, standards index, and specs index. Covers: all rules as documentation. Test level: n/a. Status: done (#10).
2. **TS-002 — Theme and fonts (stage 1).** Tokens in `libs/mobile/shared/ui/src/theme/` (palette, typography, shape, motion, `kedr-theme`); shell `app-theme.ts` maps every MD3 role to Kedr roles and adds `kedr` tokens; Unbounded and Golos Text loaded with `expo-font` behind the splash screen. Covers R-001–R-003; SC-001. Test level: component, existing shell tests. Status: done.
3. **TS-003 — Shared UI base (stage 1).** `libs/mobile/shared/ui` (`@mobile/shared/ui`, tags `scope:mobile-shared`, `type:ui`): `StatusPill`, `QuantityStepper`, `StateView`, `KedrSheet`, `FilterChip`, `SearchField`, `ActionBar`, `ActionPillButton`, `MetricTile`, `KedrCard`, `HeroHeader`, `ScreenHeader`, `RoundIconButton`, `PressableScale`. Covers R-006–R-008. Test level: component. Status: done; `Skeleton` deferred.
4. **TS-004 — Shell (stage 2).** `PillTabBar` in `@mobile/core/shell` with cart badge, `ScreenHeader` as tab header, theme choice in the profile header as a sheet. Covers R-004; SC-002. Test level: component. Status: done.
5. **TS-005 — Catalog (stage 3).** Hero search, labeled query chips, two-column tiles, removable filter chips, sheets on `KedrSheet`. Covers R-005, R-006; SC-003. Test level: component. Status: done; `CategoryRail` and tile quick add deferred.
6. **TS-006 — Product detail (stage 4).** Green stage gallery, stock `StatusPill`, info cards, `ActionBar` with price and add button. Covers R-006; SC-004. Test level: component. Status: done.
7. **TS-007 — Cart and checkout (stage 5).** Total card, line items with vertical stepper, customer and checkout sheets. Covers R-006, R-007; SC-004. Test level: component. Status: done.
8. **TS-008 — Orders (stage 6).** Bento summary from loaded orders, order rows with status pill and icon, detail cards with `ScreenHeader`, `StateView` states, customer filter chip. Covers R-002, R-006, R-008; SC-005. Test level: component. Status: done.
9. **TS-009 — Motion and polish (stage 7).** Press scale, nav pill spring, badge bump, reduced motion; docs and feature map sync. Covers R-009, R-010; SC-006. Test level: component. Status: done for these moments; list stagger and stage halo deferred. Manual device check only with the owner's permission.
