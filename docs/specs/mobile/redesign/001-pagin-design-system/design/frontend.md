# Frontend design

## Verified state on 2026-10-26 (before the redesign)

Found by reading the code; not checked on a device.

| Problem                                                                                                        | Where                                                                                                         |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Primary `#18b125` instead of logo green; near-black text on green buttons in dark mode                         | `libs/mobile/core/shell/src/theme/app-theme.ts`                                                               |
| Active filter chips forced to 20 px inside a 28 px strip: label and close icon are clipped                     | `libs/mobile/catalog/ui/src/components/query/catalog-active-filters.tsx`                                      |
| Filters, sort, and categories are three identical unlabeled icon buttons                                       | `catalog-query-action-row.tsx`                                                                                |
| Hard-coded `#ffffff` image frames and theme markers show white patches in dark mode                            | `cart-line-card.tsx`, `product-image-gallery.tsx`, `theme-preference-header-control.tsx`                      |
| «Наявність уточнюється» uses Paper default purple `tertiary`                                                   | `product-card.tsx`                                                                                            |
| Tab bar fixed at 72 px with transparent indicator and manual bottom inset                                      | `apps/mobile/src/app/(tabs)/_layout.tsx`                                                                      |
| Theme switch repeated in every tab header; «Головна» is a placeholder, «Профіль» shows products without photos | `(tabs)/_layout.tsx`, `(tabs)/index.tsx`, `(tabs)/profile.tsx`                                                |
| Three sheet styles: `react-native-actions-sheet`, custom sheets, Paper modal for filters                       | `catalog-action-sheet.tsx`, `cart-action-sheet.tsx`, `customer-action-sheet.tsx`, `catalog-filters-modal.tsx` |
| No custom fonts; sizes and weights set per component                                                           | `apps/mobile/assets/fonts` is empty                                                                           |

## Decisions

- Tokens live in `@mobile/shared/ui` (`src/theme/`): module boundaries let `scope:mobile-shared` depend only on itself, and the shared components need the tokens. `@mobile/core/shell` still owns theme assembly and the provider, as [code organization](../../../../../standards/mobile/mobile-code-organization.md) requires. Paper `MD3Theme` is extended with a typed `kedr` object instead of a second provider; `useKedrTheme()` is exported from `@mobile/shared/ui`. (Changed during stage 1; the first draft placed tokens in the shell.)
- Shared presentational components go into a new `libs/mobile/shared/ui` library; the `@mobile/shared/ui` alias is already reserved in `tsconfig.base.json`. Domain components (`ProductTile`, `OrderRow`, `TotalCard`, `CategoryRail`) stay in their domain `ui` libraries.
- The tab bar stays an Expo Router `Tabs` custom `tabBar`, now rendering `PillTabBar` from the shell; routes do not change.
- One sheet wrapper `KedrSheet` on the already approved `react-native-actions-sheet`; the filters Paper modal moves into it. No new sheet library.
- Fonts come from `@expo-google-fonts/unbounded` and `@expo-google-fonts/golos-text` through `expo-font` (already installed); this is the only new dependency and needs no Development Build. It is recorded here per the [capabilities catalog](../../../../../architecture/mobile/platform/ui-capabilities.md) addition rule.
- Motion uses React Native `Animated` with the native driver for the simple press, bump, and pill moments; `react-native-reanimated` stays for gesture-driven motion. Haptics wait for separate approval of `expo-haptics`.
- `expo-blur` stays unused; the pill bar is opaque `inverseSurface`, which is readable on any content.

## File map

| Path                                                                             | Role                                       | Stage |
| -------------------------------------------------------------------------------- | ------------------------------------------ | ----- |
| `libs/mobile/shared/ui/src/theme/palette.ts`                                     | Brand constants and color roles            | 1     |
| `libs/mobile/shared/ui/src/theme/typography.ts`                                  | Font families, Paper `fonts` config        | 1     |
| `libs/mobile/shared/ui/src/theme/shape.ts`                                       | Radii, spacing, touch targets              | 1     |
| `libs/mobile/shared/ui/src/theme/motion.ts`                                      | Durations, springs, press scale            | 1     |
| `libs/mobile/shared/ui/src/theme/kedr-theme.ts`                                  | `kedr` tokens type and `useKedrTheme` hook | 1     |
| `libs/mobile/core/shell/src/theme/app-theme.ts`                                  | Paper theme assembly with `kedr` tokens    | 1     |
| `apps/mobile/src/app/_layout.tsx`                                                | Font loading behind the splash screen      | 1     |
| `libs/mobile/shared/ui/src/*`                                                    | Shared components listed in the standard   | 1     |
| `libs/mobile/core/shell/src/components/navigation/pill-tab-bar/pill-tab-bar.tsx` | Floating pill tab bar                      | 2     |
| `apps/mobile/src/app/(tabs)/_layout.tsx`                                         | Uses `PillTabBar` and new headers          | 2     |
| `libs/mobile/catalog/ui/src/components/*`                                        | Category rail, tiles, chips, sheets        | 3–4   |
| `libs/mobile/cart/ui/src/lib/*`, `libs/mobile/customers/ui/src/lib/*`            | Total card, lines, sheets                  | 5     |
| `libs/mobile/orders/ui/src/components/*`                                         | Bento summary, order rows, detail          | 6     |

The map was checked against the code after stage 6.
