# Rules and acceptance scenarios

## Rules

- **R-001.** The main menu contains “Замовлення”. The page has “Замовлення” and “Чернетки” tabs in one Card; each tab has its own server table, search state, customer filter, sorting, and pagination, all restored from the URL.
- **R-002.** The orders list searches by part of the number/customer name or by multiple words; drafts search by name/customer. Both support an exact customer filter through customer search/selection. Changing criteria returns to page 1; results and count come from the server. Order actions allow viewing only; draft actions allow viewing, editing, and deletion.
- **R-003.** Order and draft details share the Admin visual composition: back-arrow link, neutral title, customer and document-data cards, product table, and summary. Orders can be viewed; drafts can be edited, deleted, or used with “Оформити на основі”.
- **R-004.** React Admin has **one current local set** of products. Pressing “Додати” in the product list or detail view adds an ID/quantity; the set persists after closing a tab or restarting the browser in the same browser profile until successful checkout or explicit clearing. This is not a server draft. If browser storage is unavailable, show a safe warning; do not store tokens, prices, or customer data.
- **R-005.** The checkout page shows added products, quantity/removal controls, customer search and selection, server calculation of current prices and total, and a name and note for saving as a draft. An empty set or missing customer blocks saving/checkout; frontend validation alone is insufficient.
- **R-006.** “Зберегти чернетку” creates a separate record for the selected customer; no order number is shown. On success, the local set is cleared and the UI opens the saved draft. On failure, the set is retained.
- **R-007.** “Оформити замовлення” shows the current server quote before confirmation; the server recalculates the total. If the price changes, show the new total and ask for confirmation again. Show the order number/1C status and clear the local set only after success; retain data on failure.
- **R-008.** “Оформити на основі чернетки” adds its products to the current local set (matching IDs have their quantities summed) and selects the draft’s customer. If the current set has a different customer, ask the user to choose a customer before checkout; the server recalculates prices for the final selected customer. The source draft remains unchanged and available for reuse.
- **R-009.** Draft editing allows changing the customer, name, note, products, and quantities, and shows the new server total. Deletion from the table or details always opens a confirmation dialog. A `409` for a concurrent change prompts a reload without silently overwriting data.
- **R-010.** Empty, loading, error, and 404 states, accessible icon names, theme, Ukrainian locale, and narrow screens follow the current Admin standard.

## Acceptance scenarios

### SC-001 — View both lists

**Covers:** R-001, R-002, R-010

- Given the system has orders and saved drafts for multiple customers
- When a manager opens “Замовлення”, switches tabs, searches, filters by customer, sorts, and paginates
- Then each tab shows the corresponding server result set and record count
- And returning from details restores the previous tab and its criteria.

### SC-002 — Restore the temporary set

**Covers:** R-004

- Given a manager added products to the current set from the product list and detail view
- When they close the tab and reopen Admin in the same browser profile
- Then they see the same products and quantities
- And no new record appears in the saved drafts tab.

### SC-003 — Recalculate the total

**Covers:** R-005, R-010

- Given the set contains products and a customer is selected
- When the manager changes the customer or a quantity
- Then they see the current server price and total for the updated set
- And an invalid product or missing price produces a clear error and prevents checkout.

### SC-004 — Save a draft

**Covers:** R-005, R-006

- Given the current set has products, a customer, and a draft name
- When the manager presses “Зберегти чернетку”
- Then the saved record is available under the customer without an order number
- And the local set is cleared only after a successful response.

### SC-005 — Submit an order

**Covers:** R-005, R-007

- Given the customer, products, and server calculation are displayed before confirmation
- When the manager submits the order
- Then on success they see the number and transfer status, and the local set is cleared
- And if the price changed, they see the new total and confirm it again
- And if submission fails, the local set remains available.

### SC-006 — Manage a draft

**Covers:** R-003, R-009, R-010

- Given a saved draft is open
- When the manager changes the customer, name, note, products, or quantities
- Then they see the updated data and server total
- And a concurrent editing conflict prompts them to reload the current data
- And deletion occurs only after explicit confirmation.

### SC-007 — Reuse a draft

**Covers:** R-008

- Given the temporary set already contains products and a saved draft contains the same and other products
- When the manager selects “Оформити на основі чернетки”
- Then matching products have their quantities summed and the others are added to the set
- And the manager sees or selects the final customer before recalculation
- And after checkout, the source draft remains available for reuse.

### SC-008 — View a submitted order

**Covers:** R-003, R-010

- Given a submitted order appears in the list
- When the manager opens its details
- Then they see the customer, products, total, and transfer status, without edit or delete actions
- And an unknown ID and a network error have separate safe states.
