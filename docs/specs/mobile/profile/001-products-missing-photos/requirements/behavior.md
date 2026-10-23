# Products without photos in Profile — business rules and scenarios

## Business rules

### R-001 — Authoritative list

The section shows all and only products returned by the specialized operation. The client does not check or recompute whether photos are missing.

### R-002 — Explicit initial loading

Until the first response arrives, the section shows a stable loading state and does not show an empty or erroneous list.

### R-003 — Clear successful list

Each result appears once using the current mobile product hierarchy.

### R-004 — Positive empty state

A successful response with no products says that there are no products without photos and does not look like an error.

### R-005 — Recoverable error

A network or server failure shows a safe Ukrainian message and retry action. Raw transport/backend errors are not shown to the user.

### R-006 — Manual refresh

Pull-to-refresh requests the current list again, shows a refresh indicator, and does not replace already visible results with the initial loading state.

### R-007 — Contractual pagination

If the service divides the list into pages and reports more results, the user can load them without duplicates. If the service returns the entire list at once, no load-more action is shown.

### R-008 — Safe navigation to details

If current product details are available for a result, tapping it opens that exact product. If current details do not support the result, the product does not promise a navigation action.

### R-009 — Accessible mobile interaction

The section, states, cards, and actions have a logical reading order and Ukrainian accessible names, do not rely on color alone, and have touch targets of at least 48dp.

### R-010 — Confirmed data only

The list shows only data provided by the current contract; missing values are not replaced with invented content.

## Acceptance scenarios

### SC-001 — See the section while loading

**Covers:** R-002, R-009

Given the user opened the “Профіль” tab\
And the first list response has not arrived\
When the section is rendered\
Then the “Товари без фотографій” heading and a loading state are visible\
And assistive technology receives a clear loading announcement.

### SC-002 — See products without photos

**Covers:** R-001, R-003, R-009, R-010

Given the service successfully returned one or more products\
When the list is rendered\
Then each returned product appears once using the current mobile card hierarchy\
And missing contract data is not replaced with invented values\
And the client does not discard results by checking photos itself.

### SC-003 — See that the list is empty

**Covers:** R-004, R-009

Given the service successfully returned an empty list\
When the response is rendered\
Then “Усі товари мають фотографії” is visible\
And there is no error or retry state.

### SC-004 — Retry a failed load

**Covers:** R-005, R-009

Given the initial load ended with a network or server failure\
When the user sees the error\
Then a safe Ukrainian message and “Повторити” action are shown\
And tapping “Повторити” repeats the same request without duplicating the section.

### SC-005 — Refresh a successful list

**Covers:** R-006

Given the section already shows successfully loaded products\
When the user pulls to refresh\
Then current products remain visible with a refresh indicator\
And after success the list matches the service’s new complete response.

### SC-006 — Load subsequent results

**Covers:** R-007

Given a successfully loaded list has subsequent results\
When the user activates load more\
Then subsequent products are added to the visible list without duplicates\
And a repeated load-more error retains visible products and offers retry.

### SC-007 — Do not invent pagination

**Covers:** R-007

Given the service returned a complete list with no subsequent results\
When the successful list is rendered\
Then there is no load-more action\
And no request is made for a nonexistent next page.

### SC-008 — Open current product details

**Covers:** R-008, R-009

Given a current detail route is available for the product\
When the user activates the card\
Then details for that exact product open\
And Back returns to the “Профіль” tab with the list preserved.

### SC-009 — Do not promise unavailable navigation

**Covers:** R-008, R-009

Given there is no supported route to current details for the product\
When the card is rendered\
Then it has no button/link semantics\
And no new detail screen or synthetic identifier is created.

## Examples

| Input/state                                 | Expected observable result                    |
| ------------------------------------------- | --------------------------------------------- |
| initial request pending                     | section heading and loading state             |
| successful response with no items           | “Усі товари мають фотографії”                 |
| refresh while rows are visible              | rows remain, refresh indicator active         |
| next-page failure in paginated contract     | rows remain, footer offers retry              |
| response without supported route identifier | card is read as content, not as a button/link |

## Deferred scenarios

- Adding, uploading, or editing photos.
- New detail route or fallback navigation by another identifier.
- Search, filters, sort, bulk actions, and changes to other tabs.
