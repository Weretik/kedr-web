# Requirements and scenarios

- **R-001.** The app uses one design system defined in the `@mobile/core/shell` theme: brand green `#3FA435` and ink `#0F110F`, the color roles, Unbounded and Golos Text type scale, radii, spacing, and motion tokens of the [standard](../../../../../standards/mobile/design-system.md), in light and dark schemes. Feature and UI code takes values from the theme only.
- **R-002.** Text meets 4.5:1 contrast: text on green fills uses `onPrimary`, green text uses `accentText`. Status is never shown by color alone.
- **R-003.** No off-brand or scheme-blind colors remain: no Paper default `tertiary`, no hard-coded white or black surfaces.
- **R-004.** The tab bar is a floating pill that marks the active tab with label and color, keeps accessible names for all tabs, shows the cart count, and never covers screen content or the system gesture area.
- **R-005.** Catalog filters, sort, and categories are reachable by labeled controls; active filters are shown as readable, removable chips that are not clipped at 130% font scale.
- **R-006.** Products, cart lines, and orders use the tile, row, and card patterns of the standard; quantity changes use one stepper component with a disabled state at the limits.
- **R-007.** All bottom sheets share one sheet component with the same handle, scrim, title, close action, and safe-area padding.
- **R-008.** Every screen with server data shows designed `loading`, `empty`, `error`, and `offline` states with a retry action where possible.
- **R-009.** Motion follows the standard's tokens and moments; with system reduced motion enabled, decorative motion is off and state changes are instant.
- **R-010.** All existing functionality and routes keep working; the redesign does not change API calls, data, or navigation targets.

## Acceptance scenarios

### SC-001 — Light and dark schemes

**Covers:** R-001, R-002, R-003

- Given the manager selects light, dark, or system theme
- When any screen is shown
- Then grounds, surfaces, text, images wells, and the accent follow the scheme with readable contrast and no white patches in dark mode.

### SC-002 — Tab navigation

**Covers:** R-004

- Given the manager is on any tab
- When they look at or press the tab bar
- Then the active tab is a green pill with its name, others are reachable by name for screen readers, the cart tab shows the position count, and the last list item stays visible above the bar.

### SC-003 — Find a product

**Covers:** R-005, R-006

- Given the manager opens the catalog
- When they search, pick a category, or open filters and sort
- Then every control has a visible label, applied filters appear as chips that can be removed one by one, and results show as two-column tiles with price and stock.

### SC-004 — Add to cart and check out

**Covers:** R-006, R-007

- Given the manager opens a product
- When they set a quantity and add it, then open the cart and check out for a customer
- Then the quantity cannot go below 1 or above stock, the cart badge and totals update, and customer selection and checkout open in the shared sheet.

### SC-005 — Orders and sync status

**Covers:** R-002, R-006, R-008

- Given the manager opens orders
- When orders load, fail to load, or are empty
- Then they see the summary tiles and rows with labeled 1С status, or a clear state with retry.

### SC-006 — Reduced motion

**Covers:** R-009

- Given the system asks for reduced motion
- When the manager navigates and adds products
- Then nothing bounces, staggers, or loops; changes appear instantly.
