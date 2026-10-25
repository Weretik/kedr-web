# Requirements and scenarios

- **R-001.** Every detail and edit page starts with one header: a back link to its list (the existing text and target), one `h1`, and the page actions. Product and customer pages still move focus to the heading after navigation.
- **R-002.** Detail content is grouped in labelled cards. The main entity card carries an «Основна інформація» label and the entity name; other cards are named regions such as «Контактні дані», «Типи цін», «Товари». Values are shown as label and value pairs.
- **R-003.** Product details show statuses as text pills («Наявність», «Акція», «Новинка», «На сайті»), the price large, and ID, stock, category, and pack size in two columns from `sm`. One contained action per area: «Додати до замовлення»; «Відкрити на сайті» and «Сховище фото» are secondary. Photo and scheme sit in rounded frames; a missing photo shows an icon and «Фото товару недоступне».
- **R-004.** Order and draft details show customer and document cards, the 1C status as `OrderStatusChip`, the note when present, and the line table with a large total.
- **R-005.** Loading on a detail page is a centered indicator announced by its existing label. A load error is an alert with «Повторити».
- **R-006.** Dialogs and alerts take spacing, title weight, and tone colors from the theme; all existing texts, buttons, and validation stay.

## Acceptance scenarios

### SC-001 — Product details

**Covers:** R-001, R-003

- Given a product in stock, exported to the site, with a photo and a scheme
- When the manager opens its details
- Then the header links back to the catalog, the cards follow photo → information → scheme, the pills read «Наявність» and «На сайті», and the site and storage links work.

### SC-002 — Customer details

**Covers:** R-001, R-002, R-005

- Given a customer with contacts and price types
- When the details load, or fail to load
- Then three named cards show the data, or an alert offers «Повторити».

### SC-003 — Order document

**Covers:** R-004

- Given an order with a known 1C status, a note, and lines
- When the manager opens it
- Then the customer and document cards, the Ukrainian status, the note, and the total are shown.

### SC-004 — Forms and dialogs

**Covers:** R-006

- Given the manager checks out or saves a draft
- When the forms and dialogs open in either theme
- Then fields, validation, and actions behave as before with the new spacing and colors.
