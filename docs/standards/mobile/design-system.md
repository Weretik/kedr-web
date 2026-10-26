# Mobile design system «Пагін»

This is the visual standard for Kedr Mobile (`apps/mobile`, `libs/mobile/*`). The product owner chose it on 2026-10-26 from the [concept page](https://claude.ai/artifact/Bt5JEczChkmo4dsAJWWzDL) (direction C). Language, states, and accessibility stay in the [Mobile UI rules](mobile-ui.md); library choice stays in the [UI and platform capabilities catalog](../../architecture/mobile/platform/ui-capabilities.md). Admin and Storefront do not follow this document.

**Status:** approved, not implemented yet. The current theme in `libs/mobile/core/shell/src/theme/app-theme.ts` still uses the old palette. The rollout is planned in the [redesign SDD](../../specs/mobile/redesign/001-pagin-design-system/README.md). Until a screen is migrated, new work on it follows this document.

The character is bright, bold, and friendly: a brand-green hero block with a large rounded bottom edge, product tiles in two columns, a dark floating pill navigation, a display face for headings and prices, and short, springy motion that confirms what the manager did.

## Where the tokens live

Tokens are code in `@mobile/core/shell` (`libs/mobile/core/shell/src/theme/`); this page describes them, the code is the source of truth.

| File (planned)  | Owns                                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| `palette.ts`    | `kedrBrand`, light and dark color roles                                           |
| `typography.ts` | Font families and the type scale mapped onto Paper `fonts`                        |
| `shape.ts`      | Radii, spacing, touch targets, elevation                                          |
| `motion.ts`     | Durations, spring configs, press scale                                            |
| `app-theme.ts`  | Assembles the Paper MD3 theme (`roundness`, `colors`, `fonts`) plus `kedr` tokens |

The Paper `MD3Theme` is extended with a typed `kedr` object (`theme.kedr.radius`, `theme.kedr.space`, `theme.kedr.motion`, `theme.kedr.colors`) read through a `useKedrTheme()` hook exported from `@mobile/core/shell`. Feature and UI code uses theme values only: no hex values, font names, durations, or radii in components. A new token goes into the theme first and onto this page second.

## Color

Brand colors come from the logo and do not change: **green `#3FA435`** and **ink `#0F110F`**.

| Role                                              | Token (`theme.colors` / `theme.kedr.colors`) | Light                 | Dark              |
| ------------------------------------------------- | -------------------------------------------- | --------------------- | ----------------- |
| Screen ground                                     | `background`                                 | `#F6F7F2`             | `#0F110F`         |
| Surface (tiles, rows, sheets)                     | `surface`                                    | `#FFFFFF`             | `#181B17`         |
| Soft surface (image wells, chips, stepper groove) | `surfaceVariant`                             | `#EEF1E8`             | `#20251F`         |
| Text                                              | `onSurface`                                  | `#0F110F`             | `#F0F3EC`         |
| Secondary text                                    | `onSurfaceVariant`                           | `#5D665A`             | `#9DA899`         |
| Separators, outlines                              | `outlineVariant`                             | `#E6E9E1`             | `#272C26`         |
| Hero block, accent fill                           | `primary`                                    | `#3FA435`             | `#3FA435`         |
| Text and icons on hero / accent fill              | `onPrimary`                                  | `#FFFFFF`             | `#0F110F`         |
| Accent text and links                             | `kedr.colors.accentText`                     | `#2A7323`             | `#7DD06F`         |
| Inverse surface (pill nav, buy bar, total card)   | `inverseSurface`                             | `#0F110F`             | `#E9F7C9`         |
| Text on inverse surface                           | `inverseOnSurface`                           | `#F2F5EF`             | `#0F110F`         |
| Highlight tile (headline metric)                  | `kedr.colors.highlight`                      | `#E9F7C9`             | `#26331C`         |
| Scrim behind sheets                               | `backdrop`                                   | `rgba(15,17,15,0.45)` | `rgba(0,0,0,0.6)` |

Status colors (order sync, stock) are pairs of text color and soft background:

| Status kind     | Used for                                       | Text light / dark     | Background light / dark |
| --------------- | ---------------------------------------------- | --------------------- | ----------------------- |
| `success`       | In stock, «Прийнято в 1С»                      | `#2E8B2A` / `#6FD164` | `#E3F3E0` / `#183019`   |
| `warning`       | «Очікує на відправлення», retry scheduled      | `#A86A00` / `#F0B44A` | `#FBF0D9` / `#33270F`   |
| `error`         | Out of stock, sync errors, destructive actions | `#C2392F` / `#FF8A7F` | `#FBE5E2` / `#3A1714`   |
| `informational` | «Надіслано до 1С», neutral notices             | `#2D6FB5` / `#7FB6F2` | `#E2EDF9` / `#132539`   |

The kinds map one-to-one onto `OrderSyncStatusKind` in `@mobile/shared/model`. «Наявність уточнюється» uses `warning`, never Paper's default `tertiary`.

Rules:

- `primary` is a fill, not a text color: green on white is about 3:1. Green text on light grounds uses `accentText`.
- One accent per screen area: the hero block, the active nav pill, or the main action. Status colors mark state only.
- Every status pill or icon carries a text label; color is never the only signal.
- No hard-coded white or black: image wells use `surfaceVariant` so product photos sit on a soft tile in both schemes. Product images with white backgrounds go inside a `surface` inner frame with radius `md`.
- Paper's default purple `tertiary` / `secondary` are overwritten with brand roles so no off-brand color can leak in.

## Typography

| Role                                                   | Family                                                     | Weights            |
| ------------------------------------------------------ | ---------------------------------------------------------- | ------------------ |
| Display: screen titles, prices, totals, metric numbers | [Unbounded](https://fonts.google.com/specimen/Unbounded)   | 500, 600           |
| Text: everything else                                  | [Golos Text](https://fonts.google.com/specimen/Golos+Text) | 400, 500, 600, 700 |

Both have full Cyrillic. They are loaded with `expo-font` from `@expo-google-fonts/unbounded` and `@expo-google-fonts/golos-text` in the root layout while the splash screen is shown; no Development Build is needed. Fallback is the platform system font.

| Use                        | Paper variant                | Family / size / weight / line height |
| -------------------------- | ---------------------------- | ------------------------------------ |
| Hero greeting title        | `headlineSmall`              | Unbounded 22 / 600 / 28              |
| Screen title               | `titleLarge`                 | Unbounded 20 / 600 / 26              |
| Product name on detail     | `titleMedium`                | Unbounded 16 / 600 / 22              |
| Big total, metric number   | `displaySmall` (custom size) | Unbounded 30 / 600 / 36              |
| Price in tile and row      | `labelLarge` (display)       | Unbounded 13 / 600 / 18              |
| Body, list text            | `bodyMedium`                 | Golos 14 / 400 / 20                  |
| Tile name, secondary body  | `bodySmall`                  | Golos 12.5 / 400 / 17                |
| Buttons, chips, tab labels | `labelLarge` / `labelMedium` | Golos 13–14 / 600                    |
| Metadata, captions         | `labelSmall`                 | Golos 11.5 / 500 / 16                |

Rules: numbers (prices, quantities, IDs, totals) use tabular figures (`fontVariant: ['tabular-nums']`); Unbounded is never used for running text or for more than one line in a list item; text respects system font scaling, and layouts are checked at 130% scale (no fixed heights on text containers).

## Shape, spacing, and elevation

| Token             | Value                           | Used for                                                          |
| ----------------- | ------------------------------- | ----------------------------------------------------------------- |
| `radius.sm`       | 12                              | Small buttons, image inner frames                                 |
| `radius.md`       | 16                              | Image wells, inputs inside cards                                  |
| `radius.lg`       | 22                              | Product tiles, list rows, cards                                   |
| `radius.xl`       | 30                              | Hero block bottom corners, product stage, total card              |
| `radius.pill`     | 999                             | Search field, chips, nav, buy bar, status pills, steppers         |
| `space`           | 4-pt grid: 4, 8, 12, 16, 20, 24 | Screen side padding 16; gap between tiles 10; between sections 16 |
| Touch target      | min 44×44                       | Every pressable; small visual controls get `hitSlop`              |
| Paper `roundness` | 4 (×4 = 16)                     | Default radius for Paper controls                                 |

Elevation is flat: tiles and rows are separated by color (`surface` on `background`), not shadow. Shadows are used only for floating layers: the pill navigation, the buy bar, and sheets (one soft shadow, `elevation` 6 on Android).

## Layout patterns

- **Hero header.** Root tab screens (Каталог, Головна) open with a `primary` block: status bar area, greeting or screen title, and the pill search field with a filter button. Bottom corners `radius.xl`. Inner screens use a plain header on `background` with round back and action buttons.
- **Pill navigation.** The tab bar is a dark (`inverseSurface`) floating pill, inset 16 from the sides and safe-area bottom, height 58. The active tab is a `primary` pill that shows icon plus label; inactive tabs show the icon only, with accessible names. The cart tab shows a count badge. Screen content gets bottom padding equal to the nav height plus inset so nothing hides under it.
- **Category rail.** Horizontal rail of 54×54 rounded icon tiles with labels; the selected one turns `inverseSurface`. It replaces the unlabeled filter, sort, and category icon buttons. Filters and sort are opened from the filter button in the search field and summarized as removable chips under the rail.
- **Product grid.** Two-column tiles: image well (aspect 1:0.82), up to two lines of name, display price, round dark «+» button. Flags («Хіт», «Немає») sit top-left on the image. Lists use FlashList with `numColumns={2}`.
- **Product stage.** Detail opens with a large `primary` stage (radius `xl`) holding the gallery, round translucent back and favorite buttons, then name, stock pill, ID, variant chips, and characteristics.
- **Action bar.** Primary actions on detail and cart live in a dark floating pill at the bottom: quantity stepper on the left, green action pill with the amount on the right («485 ₴ + кошик», «Оформити»).
- **Total card.** Cart starts with an `inverseSurface` card: amount due in display type, discount note, and the selected customer with a change action.
- **Bento summary.** Orders start with metric tiles: a wide `highlight` tile (today's total and count) and two small tiles (awaiting 1С, with errors). Below, order rows with a status icon tile, number and customer, status label, and amount.
- **Sheets.** All bottom sheets use one shared `KedrSheet` wrapper (built on `react-native-actions-sheet`): `surface` background, top radius `xl`, 36×4 handle, `backdrop` scrim, title row with close button, safe-area bottom padding. Full-screen filter UI is a sheet too, not a Paper `Modal`.

## Component inventory

Shared presentational components live in a new `@mobile/shared/ui` library (alias already reserved in `tsconfig.base.json`); domain components stay in their domain `ui` libraries and compose these.

| Component         | Library              | Replaces / notes                                                             |
| ----------------- | -------------------- | ---------------------------------------------------------------------------- |
| `HeroHeader`      | `@mobile/shared/ui`  | Paper `Appbar` on root tabs                                                  |
| `ScreenHeader`    | `@mobile/shared/ui`  | Paper `Appbar` on inner screens; round icon buttons                          |
| `PillTabBar`      | `@mobile/core/shell` | Paper `BottomNavigation.Bar` in `(tabs)/_layout.tsx`                         |
| `SearchField`     | `@mobile/shared/ui`  | Search entry in catalog and orders; pill, optional trailing action           |
| `CategoryRail`    | `@mobile/catalog/ui` | `CatalogQueryActionRow` icon buttons, breadcrumb strip                       |
| `FilterChip`      | `@mobile/shared/ui`  | Clipped Paper `Chip` in `catalog-active-filters.tsx`; height 32, wraps label |
| `ProductTile`     | `@mobile/catalog/ui` | `ProductCard` (row card)                                                     |
| `QuantityStepper` | `@mobile/shared/ui`  | Icon-button steppers in cart and detail; `horizontal` and `vertical`         |
| `ActionBar`       | `@mobile/shared/ui`  | `ProductDetailsCartAction`, cart summary button                              |
| `TotalCard`       | `@mobile/cart/ui`    | `CartSummary`                                                                |
| `StatusPill`      | `@mobile/shared/ui`  | `OrderStatusChip`, stock labels; takes a status kind and label               |
| `MetricTile`      | `@mobile/shared/ui`  | New, orders bento summary                                                    |
| `OrderRow`        | `@mobile/orders/ui`  | `OrderCard`                                                                  |
| `KedrSheet`       | `@mobile/shared/ui`  | Catalog, cart, and customer action sheets and the filters modal              |
| `StateView`       | `@mobile/shared/ui`  | Loading, empty, error, offline states; illustration tile, text, retry        |
| `Skeleton`        | `@mobile/shared/ui`  | Spinners in list loading states                                              |
| Theme choice      | `@mobile/core/shell` | Moves from every tab header into the profile screen                          |

## Motion

Motion is short and springy and always confirms an action or shows where something came from. It runs on the UI thread with Reanimated; tokens are in `motion.ts`.

| Token           | Value                             | Used for                                          |
| --------------- | --------------------------------- | ------------------------------------------------- |
| `duration.fast` | 150 ms                            | Press feedback, color changes                     |
| `duration.base` | 250 ms                            | Chips, selection, list item entering              |
| `duration.slow` | 350 ms                            | Nav pill expand, sheet, stage                     |
| `spring.snappy` | damping 18, stiffness 260         | Nav pill, selected category lift                  |
| `spring.bouncy` | damping 12, stiffness 300         | Count badge and quantity bump (scale 1 → 1.2 → 1) |
| `press.scale`   | 0.97                              | Tiles, rows, buttons while pressed                |
| `easing.out`    | `Easing.bezier(0.2, 0.8, 0.2, 1)` | Default for timing animations                     |

Moments:

- Pressed tiles and buttons scale to `press.scale`.
- The active nav pill grows to reveal its label (`spring.snappy`).
- «+» on a tile morphs into a check, and the cart badge bumps (`spring.bouncy`); a light haptic is added only once `expo-haptics` is approved through a platform adapter.
- Quantity and totals bump when they change.
- List items enter with a 10 px rise and 40 ms stagger, only on first load of a list, never on scroll recycling.
- The product stage has a slow «breathing» halo behind the photo (4 s loop, scale 1 → 1.08), stopped when the screen is not focused.

Reduced motion (`AccessibilityInfo.isReduceMotionEnabled` / Reanimated `ReduceMotion.System`) turns off the halo, staggers, and bumps, and replaces springs with instant changes.

## Do and don't

- Do use `surface` tiles on `background` instead of shadows; don't put cards inside cards.
- Do label every filter and action with text; icon-only controls are allowed only in the nav and headers and always have an accessibility label.
- Do keep one primary action per screen, in the action bar.
- Don't add new colors, fonts, radii, or durations in feature code.
- Don't fix text heights; let rows grow with font scaling.
- Don't mix sheet libraries or use Paper `Modal` for bottom sheets.
