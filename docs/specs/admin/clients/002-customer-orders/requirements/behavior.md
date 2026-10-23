# Requirements and scenarios

- **R-001.** A Card with the «Замовлення» and «Чернетки» tabs appears below the customer detail cards. Both tables show only records for the current `counterpartyId`; the server filters before pagination. The customer name may be omitted from each row as redundant.
- **R-002.** Each tab has independent page/pageSize/sort/search state in the URL; switching tabs and returning from a detail page preserves context. Pagination, sorting, and search are server-side, and the count includes only the customer's records.
- **R-003.** Order actions are view-only; draft actions are view, edit, and delete with confirmation. Links lead to orders routes; returning restores this customer's card and the selected tab.
- **R-004.** Empty tables, customer 404, loading/error states, and narrow screens use existing Admin patterns; an error in one table does not hide the customer cards.

## Acceptance scenarios

### SC-001 — View customer records

**Covers:** R-001

- Given the customer has orders and drafts, and other customers also have records
- When the manager opens this customer's details
- Then the two tabs show only this customer's records and their respective counts.

### SC-002 — Work with customer tables

**Covers:** R-002

- Given the customer has enough records for several pages
- When the manager searches, sorts, pages through results, and switches tabs
- Then all results remain limited to this customer
- And each tab's criteria are restored on return.

### SC-003 — Open a record and return

**Covers:** R-003

- Given the manager opened an order or draft from customer details
- When they return from the record page
- Then they see the same customer and selected tab
- And a draft is deleted only after confirmation.

### SC-004 — Handle an empty tab and an error

**Covers:** R-004

- Given one tab is empty or its request fails
- When the manager views customer details
- Then the customer information cards and the other tab remain available
- And the affected tab shows its own empty state or a retry option.
