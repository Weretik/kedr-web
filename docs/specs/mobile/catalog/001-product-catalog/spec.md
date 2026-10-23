# Feature specification: Mobile product catalog

**Created:** 2026-07-28\
**Status:** draft — API contract confirmed
**Domain:** `catalog`\
**Input:** Mobile product catalog with images, search, filters, sorting, and server-side pagination.

## User scenarios and testing

### User story 1 — Browse the catalog (Priority: P1)

As a shopper, I want to browse products in a fast card list so I can find the item I need on my phone.

**Independent test:** In Expo Go, open «Каталог», scroll through the product list, load the next batch, and verify that cards are not duplicated and the UI remains responsive.

**Acceptance scenarios:**

1. Given the API returns products, when the user opens the «Каталог» tab, then they see a virtualized, single-column `ProductCard` list with image, name, price, and availability status.
2. Given another page is available, when the user taps «Завантажити ще», then the next batch loads without clearing the products already shown.
3. Given the API returns no products, when loading completes, then a clear empty state appears in Ukrainian.

### User story 2 — Search products (Priority: P2)

As a shopper, I want to search products by a query so I can quickly find the item I need.

**Independent test:** Enter a query in the Searchbar, wait for the debounce, and verify that only the server-side results appear; clear the query and check the first list.

**Acceptance scenarios:**

1. Given the catalog is open, when the user enters a search query, then a new query is sent after the debounce and the list starts from the first page.
2. Given the search has no matches, when the request completes, then an empty state appears with the «Очистити пошук» action.

### User story 3 — Filter and sort (Priority: P3)

As a shopper, I want to apply filters and sorting so I can narrow the catalog to relevant products.

**Independent test:** Open the filters modal, apply a category and one available filter, change the sort, and check active chips, the query, and pagination reset.

**Acceptance scenarios:**

1. Given filter parameters are available in the contract, when the user applies values, then the list is updated server-side from the first page and active filters appear as Chip controls.
2. Given filters or search are active, when the user taps «Скинути», then filters, search, and pagination return to the default state.
3. Given the user changes the sort, when the selection is confirmed, then the list reloads from the first page and displays the active sort.

## Edge cases

- Initial loading, next-page loading, empty, error, and offline have distinct readable states; navigation and touch targets are not obscured.
- A next-page error does not remove cards already loaded; the footer shows a retry action.
- A new search/filter/sort query cancels or ignores stale responses and resets pagination.
- Duplicate products across pages are deduplicated by `product.id`.
- A missing image shows the agreed fallback image; API URLs follow React Native image security patterns.
- The feature uses the confirmed [API contract](contracts/api-contract.md): `GET /api/admin/products`, page-based pagination, and documented filter/sort parameters.

## Requirements

- **FR-001**: The catalog uses React Native `FlatList` and `ProductCard`, not a desktop table or Data Grid.
- **FR-002**: The card shows only agreed domain fields: image, name, nullable price, and availability state. Currency and price unit are not shown until provided by the contract.
- **FR-003**: Search, filters, sorting, and pagination run server-side; the client does not load the entire catalog for local filtering.
- **FR-004**: Searchbar, filter modal, active filter chips, and sort menu use React Native Paper; icon-only controls have Ukrainian accessible names.
- **FR-005**: The initial list and every changed query load from the start; the next page is appended to visible cards without duplicates.
- **FR-006**: Route `/(tabs)/catalog` remains a thin Expo Router adapter to `@mobile/catalog/feature`.
- **FR-007**: DTOs, API errors, and pagination transport details remain inside `@mobile/catalog/data-access`.

## Success criteria

- **SC-001**: In Expo Go, users can browse, find, filter, and sort products without desktop-table interactions.
- **SC-002**: On Samsung Galaxy A12, the server-paginated list scrolls without noticeable gaps or blocked touch interactions.
- **SC-003**: Search/filter/sort do not create duplicate product cards or show stale results.
- **SC-004**: Android Expo Go and web checks show no console errors, obscured safe areas, or inaccessible controls.

## Assumptions and dependencies

- `@mobile/core/shell` already provides the theme, store, connectivity, notifications, and tab route `/(tabs)/catalog`.
- Data source: `GET /api/admin/products`; its parameters, DTO boundary, and known limitations are described in the [API contract](contracts/api-contract.md). The current contract has no filter-facets endpoint and provides no currency/price unit or search-field semantics.
- Product details, cart, favorites, customer-group pricing, and analytics are outside this feature.
