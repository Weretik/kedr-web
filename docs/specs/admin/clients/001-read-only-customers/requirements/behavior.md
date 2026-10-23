# Customers — rules and scenarios

## Rules

### R-001 — Active customer list

The user sees active customers with one search field in the MUI Data Grid toolbar, server-side sorting, and server-side pagination. Search covers ID, name, and phone across the full server result set before pagination; the server returns the number of matching rows. The name, phone, and ID headers toggle ascending and descending order. Changing sort returns to page 1, and the URL preserves it for return from details. The table has no column filters or filter menu. The «Дії» column contains view only; there are no edit or delete actions.

### R-002 — Customer details

Opening a row shows that customer. The card displays only available contact and pricing data; a missing phone uses a neutral representation.

### R-003 — Accessible recovery

Returning from the card restores the list page, search, and sort. An empty list, invalid link, 404, and request error each have distinct states and relevant actions.

### R-004 — Responsive layout and Admin color schemes

The list and customer card are usable on phones and tablets: content is not clipped, and horizontal table scrolling keeps row actions and pagination accessible when needed. Both light and dark schemes use the current Admin theme; text, states, and focus remain readable.

Built-in MUI Data Grid labels, pagination, and accessible table button names are localized in Ukrainian through the shared Admin theme.

### R-005 — Clear names for pricing settings

Customer details show the default price type and category price types by their API names instead of numeric price-type IDs. A category is shown by name together with its numeric ID. If a name is `null`, the card shows the neutral «Назва недоступна» state rather than presenting an ID as a name. Backend `getAdminCustomerById` defines the required nullable names; frontend snapshot/generated types are synchronized.

### R-006 — Consistent compact customer detail layout

The page heading is «Деталі клієнта»; it does not repeat the customer name. The arrow link «Назад до клієнтів» matches the appearance and list-URL restoration behavior used when returning from product details. Three compact MUI Cards without tables show: basic information with the name once and the ID below it, contact details, and price types. Each value has a clear label; cards use current Admin theme colors and spacing and do not clip long values on phones or tablets.

## Acceptance scenarios

### SC-001 — Open the list

**Covers:** R-001

Given the user is in Admin
When they select «Клієнти» from the menu
Then they see the active customer page with name, phone when available, and ID
And they see no edit or delete actions.

### SC-002 — Paginate the list

**Covers:** R-001

Given there are multiple pages of customers
When the user changes page or page size
Then the corresponding server page and correct matching-customer count are displayed
And active search is applied to all customers before the page is selected.

### SC-003 — View a customer

**Covers:** R-002, R-003

Given a customer is visible in the list
When the user opens their card
Then verified contact data and price types for that customer are shown
And returning restores the previous list page.

### SC-004 — Handle an unknown customer

**Covers:** R-003

Given the link has an invalid or nonexistent ID
When the detail page opens
Then a message says the customer is unavailable, without technical details
And a way to return to the list is available.

### SC-005 — Empty result set or error

**Covers:** R-003

Given the server returned an empty page or an error
When the list finishes loading
Then the corresponding Ukrainian state is shown
And the same request can be retried after an error.

### SC-006 — Use on phones and tablets in both themes

**Covers:** R-004

Given the customer list or card is open on a phone or tablet screen in the Admin light or dark scheme
When the user views a row, changes the table page, and opens details
Then primary actions and data remain accessible without clipping or overlap, even when the table scrolls horizontally
And text, borders, loading/error states, and focus are readable in the active scheme.

### SC-007 — Search across all customers

**Covers:** R-001

Given a customer is outside the current page
When the user enters an ID, name, or phone in the table search field
Then the server returns matching rows and the matching customer count starting from page one
And pagination preserves the current search query
And no extra caption below the table shows the matching count or explains server behavior.

### SC-008 — Read pricing settings by name

**Covers:** R-002, R-005

Given the detail API returned the default price-type name, category names, and their price-type names
When the user opens the customer card
Then the user sees price-type names without separate numeric price-type IDs
And each category is shown by name and ID
And a missing name has a neutral state without an invented value.

### SC-009 — View the compact customer card

**Covers:** R-002, R-004, R-006

Given customer details are open
When the page loads the customer
Then the page heading reads «Деталі клієнта», while the name and ID appear only in the basic information card
And separate compact “Contact details” and “Price types” cards show labeled values without tables or numeric price-type IDs
And the arrow link returns to the previous customer search and page.
