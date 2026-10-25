# Requirements and scenarios

- **R-001.** All Admin Data Grids take their look from the theme: paper surface, no outer border, uppercase 12 px column titles, divider row lines, hover highlight, brand focus outline, wrapping footer, and a compact pagination label on phones. Lists do not repeat these styles locally.
- **R-002.** Empty and error states inside a list use one overlay: an icon tile and the message. An error is announced (`role="alert"`) and offers «Повторити». The existing messages stay: «Товарів немає.» (or the caller's message), «Клієнтів немає.», «Не вдалося завантажити клієнтів.», «Не вдалося завантажити записи.». Orders and drafts get «Замовлень немає.» and «Чернеток немає.».
- **R-003.** Product boolean columns show a text status pill: availability «Є» (success) or «Немає» (neutral), «Акція» (warning), «Новинка» (info). An unset sale or novelty shows a muted «—» named «Ні» for assistive technology.
- **R-004.** The order list and order details show the 1C sync status as the Ukrainian label and tone from [orders R-021](../../../orders/001-order-workspace/revision-2026-10-22-order-detail-and-draft-picker.md); an unknown code shows «Невідомий стан» and never the raw code.
- **R-005.** Product photos sit in a fixed rounded tile; a product without a photo shows a «Без фото» icon. Product names are semibold. The «add to current set» action is a filled soft-green button; accessible names of row actions do not change.
- **R-006.** Products, customers, and orders pages use one list header: a single `h1` and the page's primary actions, stacked on phones. The customers heading still receives focus after navigation.

## Acceptance scenarios

### SC-001 — Product statuses at a glance

**Covers:** R-003, R-005

- Given a product is in stock, not on sale, and new
- When the manager opens the catalog
- Then its row shows «Є», a muted «—» for sale, and «Новинка», each readable without color.

### SC-002 — Empty or failed list

**Covers:** R-002

- Given a list has no rows, or loading failed
- When the page renders
- Then the table shows the empty message, or announces the error with «Повторити», which reloads the list.

### SC-003 — 1C status in orders

**Covers:** R-004

- Given orders have known 1C codes and one unknown code
- When the manager opens the order list or an order
- Then each code shows its Ukrainian label and tone, and the unknown one shows «Невідомий стан».

### SC-004 — Consistent list pages

**Covers:** R-001, R-006

- Given the manager moves between products, customers, and orders in either theme
- When each list renders on desktop or phone
- Then the heading, actions, table header, rows, and footer look and behave the same way.
