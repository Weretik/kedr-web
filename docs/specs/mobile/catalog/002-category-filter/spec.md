# Feature specification: Mobile catalog category selection

**Created:** 2026-07-31\
**Status:** implemented; manual check T017 and backend access-policy confirmation T018 pending\
**Domain:** `catalog`\
**Input:** Connect the categories API to the catalog so users can select a category and filter products server-side.

## User scenarios and testing

### User story 1 — Select a category (Priority: P1)

As a shopper, I want to see the available categories in catalog filters and select
one so I can browse only relevant products.

**Independent test:** In Expo Go, open «Каталог» → «Фільтри», wait for the
category tree, select a category, and apply filters; check the products request
for its `categoryId`, the active chip, and the first results page.

**Acceptance scenarios:**

1. Given the categories API returns valid rows, when the user opens the filters modal, then they see a localized nested selector no deeper than three levels.
2. Given the user selects a category and taps «Застосувати», when the products query runs, then it contains only that `categoryId`, pagination resets to `1`, and the UI shows an active category chip.
3. Given the user changes the selection or resets filters, when the action is confirmed, then the next products query reflects the current category filter or omits the category parameter.

### User story 2 — Clear category-source state (Priority: P2)

As a shopper, I want to know whether categories are still loading, unavailable,
or failed to load so I do not mistake a technical state for a lack of filters.

**Independent test:** Mock loading, empty, and normalized error responses
from the categories API and check the corresponding state and retry in the filters modal.

**Acceptance scenarios:**

1. Given the categories request is pending, when the filters modal is open, then the selector shows a loading state and does not allow category selection until data arrives.
2. Given the API returns `[]`, when loading finishes, then an empty state appears without a static category list; other filters remain available.
3. Given the categories request failed with a network/server error, when the filters modal is open, then a readable error state with retry appears without the raw HTTP body.

## Edge cases

- Closing the modal does not clear the already applied category; an unapplied draft does not change the products query.
- Reopening the modal uses the RTK Query cache, while retry must call `refetch`.
- If the mobile locale is unavailable, use the existing locale fallback; do not present DTO `name` as an assumed translation.
- An invalid tree structure (`parentId`, cycle, `level`) or depth greater than 3 must not cause a crash or an invalid products request.
- A categories error does not remove already loaded product cards; available non-category filters remain usable.

## Requirements

- **FR-001**: The system must fetch category rows only through `GET /api/categories` defined in the [frontend contract](../../../../contracts/catalog/admin-categories.md).
- **FR-002**: `data-access` must map the private DTO to `CatalogCategoryOption[]` and sort sibling categories by `sortOrder`, then `id`.
- **FR-003**: The selector must show localized short names in a collapsible tree up to three levels deep, inside a scrollable filters modal, with loading, empty, and normalized error/retry states; a static category list is forbidden.
- **FR-004**: After Apply, the selected category is passed to the existing `GET /api/admin/products` only as a valid `categoryId`; changing or clearing the category resets the products page to `1`.
- **FR-005**: The feature must preserve the existing `model`, `data-access`, `ui`, and `feature` boundaries, public `src/index.ts`, and thin route `/(tabs)/catalog`.
- **FR-006**: Category controls must have Ukrainian accessible labels and must not block applying other documented filters when the categories list is empty or unavailable.

## Success criteria

- **SC-001**: In Android Expo Go, a user can select, change, and clear the category filter without a manually entered ID or static options.
- **SC-002**: Each applied category change creates one server-side products query with `page=1` and no duplicate product cards.
- **SC-003**: Loading, empty, error, and malformed-tree responses do not cause a crash and have verified UI states.

## Assumptions and dependencies

- The existing `001-product-catalog` feature already has `CatalogQuery`, a category selector stub, a reducer, and products serialization with `categoryId`.
- `GET /api/categories` is an administrative endpoint; the backend owner must confirm its access policy for the mobile consumer before production rollout.
- The product query accepts `categoryId`; a category detail page, deep links, persisted filters, and a public localized category tree are out of scope.

## Change history

- 2026-07-31: Created the SDD with a separate contract projection for the categories API; code has not been implemented.
- 2026-07-31: Updated the category selector to a scrollable accordion tree: parent nodes collapse, while selection remains a separate action.
