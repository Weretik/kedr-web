# Products — rules and scenarios

## Rules

### R-001/R-002 update, 2026-10-19

The list switch has three tabs in this order: «Усі товари», «Без фото», «На сайті». The third tab calls `GET /api/admin/products` with `exportToSite=true` on the server before pagination; «Усі товари» adds no `exportToSite` condition. Each tab preserves its own search, sort, and page in the URL. The «На сайті» column displays the value without a «Так»/«Ні» filter. The table itself shows the record count and pagination, without duplicate text beneath it.

### SC-011 — View products on site

Given the product list is open
When the user selects «На сайті»
Then the API receives `exportToSite=true` and the first page, and the table shows the server result set of published products
And search, sort, and pagination do not change the state of other tabs
And returning from details restores the tab and its conditions.

### R-001 — List and navigation

The «Товари» item opens the list in MUI Data Grid without the old separate filter panel. Search, column filters, sort, and pagination are applied by the server across the full result set in this order: conditions → ordering → page. Each product has a view icon with a tooltip; there are no edit or delete actions. Availability, sale, new, and «На сайті» are separate columns with a checkmark only for `true`; the first three have a «Так»/«Ні»/no-condition filter, while the tab sets the last flag. The total count reflects the filtered result set.

### R-002 — No-photo mode

The switch clearly shows the active mode. «Без фото» contains only products assigned to this result set by the server; the client does not infer membership from a photo URL. In this mode, search, filters, sort, and pagination apply to the full server result set without photos. Changing mode starts on the first page; changing search, a filter, or sort also returns to the first page.

### R-003 — Details and return navigation

The detail page shows the product name once, in Ukrainian and Russian; the page heading does not repeat the card title. Basic information (ID, price, stock, category, package) appears in a compact “field — value” table in the same section as the names and flags, without category slug. Only true flags—«Наявність», «Акція», «Новинка», and «На сайті»—are shown as colored Chips, without «Так»/«Ні» text. The product photo and an available scheme are separate sections to the left of the main section on wide screens. An unavailable or failed scheme does not create an empty section. Clicking the photo or scheme itself opens it enlarged in a dialog. If «На сайті» is `true` and the slug is non-empty, the main section has a prominent button to the public product page. A «Сховище фото» button appears there for every product; there is no separate JPG button. Returning through the arrow text link restores the list mode, search, filters, sort, and page.

### R-004 — Safe states

An empty result set, error, unavailable images, invalid link, and missing product each have a distinct, clear state in Ukrainian.

### R-005 — Responsive layout and Admin color schemes

The list, mode switch, and product card are usable on phones and tablets: content is not clipped, and horizontal table scrolling keeps row actions and pagination accessible when needed. Both light and dark schemes use the current Admin theme; text, states, focus, images, and image fallbacks remain readable.

### R-006 — Ukrainian table localization

All MUI Data Grids in Kedr Admin show built-in labels, sort menus, pagination, and accessible button names in Ukrainian. The three product tabs have the inset spacing shown in the Devias Kit Pro reference, with the table directly below them.

## Acceptance scenarios

### SC-001 — View all products

**Covers:** R-001

Given the user opened the «Товари» item
When the list loads
Then the user sees the product page and can open details for each row
And there are no edit or delete actions.

### SC-002 — Switch to products without photos

**Covers:** R-002

Given the product list is open
When the user selects «Без фото»
Then the table shows the first page of the server result set of products without an available photo
And the switch shows the active mode.

### SC-003 — Return to all products

**Covers:** R-002

Given «Без фото» mode is open
When the user selects «Усі товари»
Then the table shows all products with server-side search, filters, sort, and pagination, without the old separate filter panel.

### SC-004 — Open and close a product card

**Covers:** R-001, R-003

Given a product row is visible in any mode
When the user opens its details
Then Ukrainian and Russian names, tabular basic data, flags, and a separate scheme section when available are shown without editing controls
And returning restores the list mode, search, filters, sort, and page.

### SC-005 — Handle missing data

**Covers:** R-004

Given a photo or scheme failed to load, or product details are unavailable
When the page finishes the request
Then the photo has a neutral fallback and a failed scheme is not displayed
And an accessible action returns to the list.

### SC-006 — Show an empty list or error

**Covers:** R-004

Given the active mode has no results or the request failed
When the page displays the result
Then the corresponding Ukrainian message is shown
And the current request can be retried after an error without losing the mode.

### SC-007 — Use on phones and tablets in both themes

**Covers:** R-005

Given the product list or card is open on a phone or tablet screen in the Admin light or dark scheme
When the user switches between «Усі товари» and «Без фото» and views a row, table page, and details
Then primary actions and data remain accessible without clipping or overlap, even when the table scrolls horizontally
And text, borders, loading/error states, focus, and image fallbacks are readable in the active scheme.

### SC-008 — Show a localized table without the old filters

**Covers:** R-001, R-006

Given a product or customer list is open
When the user views the tabs and Data Grid
Then the table and its pagination have Ukrainian labels and accessible names
And the product tabs are inset in the Card, with a Data Grid below them that has built-in search and filtering instead of the old separate panel.

### SC-009 — Filter the full list in every mode

**Covers:** R-001, R-002

Given any of the three modes has multiple server pages
When the user sets search, a price range, or a column filter
Then the API applies conditions before pagination and returns the first page and total matching-product count
And «Наявність», «Акція», and «Новинка» each allow «Так» and «Ні»; the tab sets the «На сайті» flag.

### SC-010 — Open media and the public page

**Covers:** R-003, R-004

Given the product card contains an available photo or scheme
When the user activates the relevant image
Then a keyboard-accessible dialog opens with the enlarged image
And a public product link is available only when «На сайті» is enabled and the slug is non-empty
And the storage-folder button is in the main section for every product regardless of the «На сайті» flag; there is no separate JPG button.
