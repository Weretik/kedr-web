# Admin design system «Кедровий ліс»

This is the visual standard for Kedr Admin (`apps/admin`). It was chosen by the product owner on 2026-10-25 from the [concept canvas](https://claude.ai/artifact/3zFMpNFF4cNAL56csqFUPY) (option A). Page composition is defined by the [list and detail page standard](list-detail-pages.md); language, states, and accessibility by the [Admin UI rules](admin-ui.md). Mobile and Storefront do not follow this document automatically.

The character is light, warm, and calm: warm neutral grounds, white surfaces with thin borders and soft shadows, brand green as the only accent, bold headings, and short motion that confirms an action.

## Where the tokens live

All tokens are code in `apps/admin/src/app/theme/`; this page describes them, the code is the source of truth.

| File             | Owns                                                                      |
| ---------------- | ------------------------------------------------------------------------- |
| `palette.ts`     | `kedrBrand`, light and dark palettes                                      |
| `typography.ts`  | Manrope and the type scale                                                |
| `shadows.ts`     | Two-layer soft shadows                                                    |
| `motion.ts`      | Durations and easing; mapped onto `theme.transitions` in `admin-theme.ts` |
| `components.ts`  | MUI component overrides (radii, borders, states, reduced motion)          |
| `admin-theme.ts` | Assembles the theme, breakpoints, `shape.borderRadius: 12`, locales       |

Feature code uses theme paths (`primary.main`, `text.secondary`, `divider`, `background.paper`, `theme.shadows[1]`, `theme.transitions.create(...)`) and never hard-coded hex values, font stacks, or durations. A new token is added to the theme first and to this page second.

## Color

Brand colors come from the logo and do not change: **green `#3FA435`** and **ink `#0F110F`**.

| Role                                               | Theme path             | Light     | Dark      |
| -------------------------------------------------- | ---------------------- | --------- | --------- |
| Page ground                                        | `background.default`   | `#F5F4EF` | `#111310` |
| Surface (cards, drawer, menus)                     | `background.paper`     | `#FFFFFF` | `#191C18` |
| Text                                               | `text.primary`         | `#0F110F` | `#EEF0EA` |
| Secondary text                                     | `text.secondary`       | `#5C6159` | `#A2A79D` |
| Borders, separators                                | `divider`              | `#E5E3DB` | `#2A2E28` |
| Accent fill (buttons, badges, chart series)        | `primary.main`         | `#3FA435` | `#3FA435` |
| Text on accent fill                                | `primary.contrastText` | `#0F110F` | `#0F110F` |
| Accent soft surface (active menu item, highlights) | `primary.light`        | `#E8F3E4` | `#1E3020` |
| Accent text and links                              | `primary.dark`         | `#2A7323` | `#7BCB6F` |
| Inverse surface                                    | `secondary.main`       | `#0F110F` | `#EEF0EA` |

Status colors use `success`, `warning`, `error`, and `info`: `.main` is the text and icon color, `.light` is the soft pill background. Values are in `palette.ts`.

Rules:

- `primary.main` is a fill, not a text color: brand green on white is about 3:1, below the 4.5:1 required for normal text. Text on a green fill is ink. Green text uses `primary.dark`.
- In this palette `primary.light` and `primary.dark` are roles (soft surface and accent text), not lighter or darker shades. In dark mode `primary.dark` is therefore lighter than `main`.
- One accent per screen. Status colors mark state only; they are never decoration.
- Colors that must be told apart also differ in lightness. Each status pill carries a text label, never color alone.

## Typography

[Manrope](https://fonts.google.com/specimen/Manrope) (Cyrillic, weights 400–800) is loaded in `apps/admin/index.html`; the fallback is `"Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

| Use                              | Variant               | Size / weight                           |
| -------------------------------- | --------------------- | --------------------------------------- |
| Page title                       | `h4`–`h3`             | 24–28 px / 800, tight tracking          |
| Card and section title           | `h6`                  | 18 px / 800                             |
| Body and table cells             | `body2`               | 14 px / 400                             |
| Labels, buttons, menu items      | `subtitle2`, `button` | 14 px / 700                             |
| Table headers and section labels | `overline`            | 11 px / 700, uppercase, 0.08em tracking |
| Metadata                         | `caption`             | 12 px / 500                             |

Numbers in tables and metrics use tabular figures (`fontVariantNumeric: 'tabular-nums'`). Buttons are sentence case, never uppercase.

## Shape, spacing, and elevation

- Spacing follows the MUI 8 px grid. Page padding: 16 px on phones, 24 px on tablets, 40 px on desktop. Gap between cards: 16–24 px.
- Radii: 12 px for controls (buttons, inputs, icon buttons, menu items: 10 px), 18 px for cards and paper, 20 px for dialogs, 999 px for chips and status pills.
- Cards have a 1 px `divider` border plus `theme.shadows[1]`. Higher shadows are for floating layers only (menus `shadows[4]`, dialogs). Do not stack heavy shadows on flat content.
- Minimum touch target is 44 px (icon buttons in the top bar are 42 px plus their border).

## Motion

Motion is short and purposeful: it confirms an action or shows where something came from. Tokens are in `motion.ts` and available through `theme.transitions`.

| Token        | Value                            | Used for                                   |
| ------------ | -------------------------------- | ------------------------------------------ |
| `fast`       | 150 ms                           | Hover, press, color changes                |
| `base`       | 250 ms                           | Menus, tooltips, entering elements         |
| `slow`       | 350 ms                           | Drawer width, theme switch, layout changes |
| `easing.out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Default                                    |

Rules:

- Animate only `opacity`, `transform`, colors, and, for the navigation drawer, `width` and `margin-left`.
- Press feedback: buttons scale to 0.98, icon buttons to 0.94.
- Entering content may fade up by 8–10 px with a 40–60 ms stagger between cards; never animate every table row.
- `prefers-reduced-motion: reduce` disables animations and transitions globally (`MuiCssBaseline` override). Do not bypass it.

## Shell

- **Navigation drawer** (desktop `lg` and up): permanent, `background.paper` with a right border; 264 px expanded, 84 px collapsed to icons. The «Згорнути меню» control at the bottom toggles it; the choice is remembered in the browser (`kedr-admin:navigation-collapsed`). Collapsed items keep their accessible name and show a right-side tooltip.
- **Navigation item:** 44 px high, 12 px radius, `text.secondary` at rest, `action.hover` on hover; the active item is `primary.light` with `primary.dark` text and `aria-current="page"`.
- **Current order card:** at the bottom of the expanded drawer, `primary.light` surface with the position count and a contained «Оформити» button.
- **Phones and tablets:** the same sidebar opens as a temporary drawer from the menu button; it never collapses.
- **Top bar:** sticky, 72 px, translucent `background.default` with blur and a bottom border; outlined 42 px icon buttons (current order with badge, notifications, theme, profile).
- **Theme:** light, dark, or system through the existing theme menu (`useColorScheme`). The logo switches between `main-logo.svg` and `main-logo-on-dark.svg`.

## Components

Use MUI components with the theme overrides above; do not restyle them locally.

- **Buttons:** one contained primary action per area; secondary actions are `outlined` (paper with a divider border) or `text`.
- **Status pill:** `StatusPill` from `@admin/shared/ui`: a small pill with a dot, status `.light` background and `.main` text (`neutral` uses `action.hover` and secondary text), always with a label.
- **Tables:** MUI X Data Grid styled by the `MuiDataGrid` theme override: 12 px uppercase column titles on `background.paper`, `divider` row lines, hover `action.hover`, brand focus outline, wrapping footer, compact pagination on phones. Do not add grid `sx` for these. Numbers are right aligned with tabular figures. Wide tables scroll inside their card.
- **Table states:** `DataGridMessageOverlay` for empty and error rows; an error passes `onRetry`, is announced, and shows «Повторити».
- **Boolean and status columns:** a `StatusPill` with text for a meaningful value; an empty value is a muted «—» with an accessible name.
- **Detail pages:** `AdminDetailHeader`, then `SectionCard`s. The main entity card has an overline eyebrow and an `h5` name; a key amount such as a price or order total is set large with tabular figures. Statuses in details use `StatusPill`.
- **Dialogs and alerts:** the theme sets dialog title, content, and action padding and an 800-weight title; standard alerts use the tone `.light` surface, primary text, and a tone icon. Destructive confirmations use a contained `error` button.
- **List pages:** `AdminPageHeader` (one `h1` and the primary actions) above a `Card variant="outlined"` holding tabs and the grid. Tabs use the theme indicator (3 px, brand green).
- **Menus and tooltips:** 14 px radius menus with a border; tooltips use the inverse surface.

## Do and don't

- Do use the brand green for one primary action and active state per view.
- Do check both themes and narrow screens against the code.
- Don't add gradients, glassmorphism beyond the top bar, colored left borders on cards, or emoji as icons.
- Don't use green text from `primary.main`, white text on green, or color as the only signal.
- Don't introduce a second typeface or local design tokens in a feature.

## Admin noindex

Admin is never indexed: `apps/admin/index.html` sets `<meta name="robots" content="noindex, nofollow">` and `apps/admin/public/robots.txt` disallows everything. Keep both.
