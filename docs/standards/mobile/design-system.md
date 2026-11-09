# Mobile design system «Офіс»

This is the visual standard for the Kedr Manager app (`apps/mobile`, `libs/mobile/*`). The product owner chose direction A «Офіс» on 2026-11-05 from the [design canvas](https://claude.ai/artifact/7tcWwjg6KXeDuZLCuYRaks). It replaces «Пагін» (2026-10-26), whose rules stay in git history and in the [old redesign SDD](../../specs/mobile/redesign/001-pagin-design-system/README.md). Language, states and accessibility are in the [Mobile UI rules](mobile-ui.md); the component library decision is [ADR-0006](../../architecture/mobile/adr/0006-own-ui-on-unistyles.md).

**Status:** accepted 2026-11-05; tokens, themes and base components are in code since stage 1 of the [Kedr Manager rebuild](../../specs/mobile/manager/001-manager-app/README.md); screens follow stage by stage.

The character is calm and businesslike, close to the Kedr Admin: light ground, white cards with thin borders, one green accent, the selected customer always visible at the top, and large product photos and schemes on white. Nothing decorative competes with prices, stock and the calculation.

## Where the tokens live

Tokens are code in `@mobile/shared/ui` (`libs/mobile/shared/ui/src/theme/`), given to the app by `AppThemeProvider`. Feature and UI code reads them through `createStyles((theme, rt) => …)` and `useStyles(sheet)`, or `useAppTheme()`; no hex values, font names, radii or durations in components. A new token goes into the theme first and onto this page second.

| File               | Owns                                                                      |
| ------------------ | ------------------------------------------------------------------------- |
| `palette.ts`       | Brand colors and light/dark color roles                                   |
| `typography.ts`    | Font family, type scale, tabular figures                                  |
| `shape.ts`         | Radii, spacing, touch targets, borders                                    |
| `breakpoints.ts`   | `phone`, `tablet`, `wide`                                                 |
| `app-theme.tsx`    | Theme context, `useAppTheme` (theme, width class, insets)                 |
| `create-styles.ts` | `createStyles` / `useStyles`: style sheets built once per theme and width |
| `motion.ts`        | Durations and the press feedback                                          |
| `themes.ts`        | Assembled `light` and `dark` themes                                       |

## Color

Brand colors come from the logo: **green `#3FA435`** and **ink `#0F110F`**. White text on brand green is only 3.2:1, so filled buttons with text use the darker `action` green; brand green is for the logo, selection marks, icons and focus.

| Role                                     | Token             | Light                 | Dark              |
| ---------------------------------------- | ----------------- | --------------------- | ----------------- |
| Screen ground                            | `background`      | `#F5F6F3`             | `#0F110F`         |
| Cards, rows, bars, inputs                | `surface`         | `#FFFFFF`             | `#181B17`         |
| Segmented control track, quiet fills     | `surfaceMuted`    | `#E9EBE6`             | `#20251F`         |
| Text                                     | `text`            | `#0F110F`             | `#EEF1EA`         |
| Secondary text (labels, codes, captions) | `textSecondary`   | `#5B6358`             | `#A3AD9E`         |
| Disabled text and icons                  | `textDisabled`    | `#A3AA9F`             | `#5E665B`         |
| Input and button borders                 | `outline`         | `#D6DAD1`             | `#3A4138`         |
| Card borders, separators                 | `outlineVariant`  | `#E3E6DF`             | `#272C26`         |
| Brand mark, selected tab, focus ring     | `brand`           | `#3FA435`             | `#3FA435`         |
| Filled primary button                    | `action`          | `#2E7D26`             | `#3FA435`         |
| Text on `action`                         | `onAction`        | `#FFFFFF`             | `#0F110F`         |
| Green text, links, active tab label      | `accentText`      | `#2A7323`             | `#7DD06F`         |
| Customer avatar, selected chip fill      | `accentContainer` | `#E3F3E0`             | `#1C3A1A`         |
| Photo and scheme frame (always white)    | `photoFrame`      | `#FFFFFF`             | `#FFFFFF`         |
| Scrim behind sheets                      | `backdrop`        | `rgba(15,17,15,0.45)` | `rgba(0,0,0,0.6)` |

Status colors are text/background pairs; every status also has a word.

| Kind            | Used for                                                             | Text light / dark     | Background light / dark |
| --------------- | -------------------------------------------------------------------- | --------------------- | ----------------------- |
| `success`       | In stock, «Прийнято 1С», markup                                      | `#2A7323` / `#7DD06F` | `#E3F3E0` / `#183019`   |
| `warning`       | «У черзі», «Без мережі · дані від 08:12», low stock                  | `#7A4D00` / `#F0B44A` | `#FBF0D9` / `#33270F`   |
| `error`         | Out of stock, rejected send, discount, sign-out                      | `#B3261E` / `#FF8A7F` | `#FBE5E2` / `#3A1714`   |
| `informational` | Notes («замовлення піде в 1С, коли з’явиться мережа»), scheme labels | `#1F4F86` / `#7FB6F2` | `#E2EDF9` / `#132539`   |

Rules:

- One filled `action` button per screen area; the second action is an outlined button.
- Discount is shown in `error` text, markup in `success` text, zero in `textSecondary`, always with the sign and «₴/шт».
- No «all OK» badges: an online, synced state shows only a small dot with time on tablet headers; problems get a status pill with the reason.
- Photos and schemes always sit on `photoFrame` white, in both themes.

## Typography

One family: [Golos Text](https://fonts.google.com/specimen/Golos+Text) 400/500/600/700 (full Cyrillic, already a dependency), loaded with `expo-font` behind the splash screen.

| Use                                   | Size / weight / line height |
| ------------------------------------- | --------------------------- |
| Screen title                          | 26 / 700 / 32               |
| Login title                           | 30 / 700 / 36               |
| Section title, product name on detail | 20 / 700 / 26               |
| Total amount                          | 24 / 700 / 30               |
| Price in list                         | 16 / 700 / 22               |
| Body, row title                       | 14–15 / 600 / 20            |
| Secondary text                        | 13 / 400 / 18               |
| Caption, code, stock                  | 12 / 400–500 / 16           |
| Tab label                             | 11 / 500 / 14               |

Numbers (prices, quantities, codes, totals) use tabular figures. Text follows system font scaling; layouts are checked at 130% and rows grow, never clip.

## Shape and spacing

| Token         | Value                               | Used for                                  |
| ------------- | ----------------------------------- | ----------------------------------------- |
| `radius.sm`   | 8                                   | Segments inside a segmented control, tags |
| `radius.md`   | 10–12                               | Inputs, buttons, thumbnails, steppers     |
| `radius.lg`   | 14                                  | Cards and list rows                       |
| `radius.xl`   | 18                                  | Photo stage, profile card                 |
| `radius.pill` | 999                                 | Chips, status pills                       |
| `space`       | 4-pt grid: 4, 8, 12, 16, 20, 24, 28 | Side padding 16; gap between rows 8       |
| Touch target  | min 44×44 (buttons 48 high)         | Every pressable                           |
| Border        | 1 px `outlineVariant`               | Cards and rows; no shadows except sheets  |

## Layout patterns

- **Customer bar.** After a customer is chosen, every working screen starts with a white card: avatar with initials, customer name, «Ціни: Опт 2», and a «Змінити» chip. On tablets it is the top header with the price type, debt «—» and draft count.
- **Customer gate.** Until a customer is chosen, «Товари», «Розрахунок» and «Замовлення» show a lock icon in the tab bar and cannot be opened; «Клієнт» and «Кабінет» stay open.
- **Tab bar (phone).** White bar, 5 tabs with icon and label: Клієнт, Товари, Розрахунок · N, Замовлення, Кабінет. Active tab in `accentText`.
- **Rail (tablet, wide).** 76 dp white rail on the left with the logo, the same sections and the avatar at the bottom; on `wide` the calculation is a 360 dp panel on the right that is always visible.
- **Product row.** 64 dp white thumbnail, name (2 lines), «Код · залишок», client price, and a 40 dp «+» button in `action`; out of stock the button is grey and disabled and the stock says «немає в наявності». Tablet `wide` shows the same data as table columns: Фото, Товар, Код, Залишок, Ціна клієнта, action.
- **Product detail.** Segmented «Фото N/M | Схема» over a white photo stage (330 dp high on phone, full height on tablet) with a full-screen button; thumbnails below, the scheme thumbnail labeled «Схема». Full screen supports pinch zoom, double tap and swipe between photos and the scheme. A bottom bar shows «Ціна для <клієнт> · N шт» and «Додати в розрахунок».
- **Calculation line.** Name and line sum, stepper (− qty +), unit price, and the signed adjustment pill or field «± ₴/шт». The footer shows the adjustment total, «Разом» and two buttons: «Чернетка» (outlined) and «Відправити в 1С» (filled).
- **Offline notes.** Under the customer bar a `warning` strip «Без мережі · дані від HH:MM»; in the calculation an `informational` note that the order will queue.
- **Customer card.** Header with avatar, name, phone and price type; two tiles «Заборгованість» and «Взаєморозрахунки» showing «—» and one line why; contact rows; segmented «Замовлення | Чернетки · N»; order rows with number, date, status pill and sum.

## Components

Shared components live in `@mobile/shared/ui`; `CustomerBar`, `TabBar` and `NavRail` live in `@mobile/core/shell`; domain components compose them in their `ui` libraries.

| Component           | Notes                                                                           |
| ------------------- | ------------------------------------------------------------------------------- |
| `AppText`, `Icon`   | Only text component (type scale + tone); icons by tone (MaterialCommunityIcons) |
| `BrandMark`         | Green square with «К»: rail and auth screens                                    |
| `Button`            | `filled`, `outlined`, `text`, `destructive`; 48 high                            |
| `IconButton`        | 40–48, square with `radius.md`; accessible label required                       |
| `TextField`         | Label above, 48 high, optional leading icon and trailing action (show password) |
| `SearchField`       | `TextField` with search icon                                                    |
| `SegmentedControl`  | Two or three segments on `surfaceMuted`                                         |
| `Chip`              | Filter and category chips; selected = ink fill, white text                      |
| `StatusPill`        | Kind + label                                                                    |
| `QuantityStepper`   | − qty +, 36 high                                                                |
| `Card`, `ListRow`   | White, 1 px border, `radius.lg`                                                 |
| `Avatar`            | Photo or initials on a stable color                                             |
| `CustomerBar`       | Customer bar pattern above                                                      |
| `TabBar`, `NavRail` | Phone tabs and tablet rail, both with the customer gate                         |
| `Sheet`             | One bottom sheet wrapper                                                        |
| `StateView`         | Loading, empty, offline-stale, error; text and action                           |
| `ZoomViewer`        | Full-screen photos and scheme with pinch zoom                                   |

## Motion

Short and quiet: press feedback (opacity 0.7 or scale 0.98, 120 ms), sheets and panels 250 ms, the tab badge count changes without bounce. Reduced motion turns transitions into instant changes. Zoom and swipe follow the finger on the UI thread (Reanimated).

## Do and don't

- Do keep the customer visible on every working screen.
- Do show prices only as the selected customer's prices.
- Do keep photos and schemes large and on white; never crop a scheme.
- Don't use more than one filled button per area.
- Don't add colors, fonts, radii or durations in feature code.
- Don't show an «all OK» badge.
