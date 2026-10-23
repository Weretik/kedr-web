# Mobile product details — business rules and scenarios

## Business rules

### R-001 — Open a product

Tapping any visible catalog card opens that exact product by its `productSlug`, regardless of active search, category, filters, or sort.

### R-002 — Return to the catalog

After returning, the user sees the same query, accumulated results, and approximately the same scroll position as before opening the product.

### R-003 — Ukrainian contract data

Details are always requested in Ukrainian. The screen shows all fields available from the current API without an invented description: name, ID, main photo, scheme, stock, category, category slug, quantity in pack, price, and breadcrumbs.

### R-004 — Gallery of available images

The main photo and scheme are gallery candidates in that order. An empty or unavailable URL does not leave a broken image. Two available images can be swiped; one available image is shown without an unnecessary pager indicator; if neither loads, show a neutral fallback.

### R-005 — Clear states

Loading, offline, not found, invalid link, and transport failure have separate Ukrainian messages and only relevant actions. Do not show raw backend errors.

### R-006 — Add to cart

A product with `stock > 0` and a numeric price is added one unit at a time. Repeated additions of the same ID increase quantity. Confirm success with “Товар додано до кошика”.

### R-007 — Cart action unavailable

For `stock <= 0`, disable the button and show “Немає в наявності”. For `price=null`, disable the button and show the price and reason as “Ціну уточнюйте”.

### R-008 — Calm corporate presentation

The screen follows the reference’s information hierarchy and uses only the current corporate Paper theme and typography, without decorative colored shapes, a favorite control, or visual noise.

## Acceptance scenarios

### SC-001 — Open a product from the current result

**Covers:** R-001

Given the catalog shows results for an active search or filters\
When the user taps a product card\
Then the detail page for that exact product opens\
And the URL contains its `productSlug`.

### SC-002 — Return without losing context

**Covers:** R-002

Given the user opened a product from a scrolled and filtered catalog\
When they tap Back\
Then the catalog shows the previous search, filters, sort, and loaded rows\
And the list position is restored near the previously selected card.

### SC-003 — See all product details

**Covers:** R-003

Given the API returned the product in Ukrainian\
When the page loads\
Then the user sees name, ID, price, stock, category name, category slug, quantity in pack, and breadcrumbs\
And a description missing from the API is not replaced with invented text.

### SC-004 — Swipe between photo and scheme

**Covers:** R-004

Given the main photo and scheme load successfully\
When the user swipes horizontally through the gallery\
Then they move between the two images\
And the indicator and screen reader announce the current position out of two.

### SC-005 — Handle missing image files

**Covers:** R-004, R-005

Given the `photo` or `scheme` URL is empty or returns an image load error\
When the gallery finishes loading\
Then the unavailable frame is not shown as a broken image\
And “Зображення недоступне” is shown when no frames loaded.

### SC-006 — Wait for loading

**Covers:** R-005

Given the detail request is still running\
When the page is open\
Then a stable gallery and content skeleton is visible without layout jumps\
And the cart action is unavailable.

### SC-007 — See that the product was not found

**Covers:** R-005

Given the API returns 404\
When the response is handled\
Then “Товар не знайдено” and the “Повернутися до каталогу” action are visible.

### SC-008 — Retry a failed request

**Covers:** R-005

Given the API returned a network or server error\
When the error state is visible\
Then the user sees “Не вдалося завантажити товар” and “Спробувати ще раз”\
And tapping the action repeats the request without duplicating the screen.

### SC-009 — See the offline state

**Covers:** R-005

Given the device has no network and no cached detail\
When the user opens a product\
Then “Немає з’єднання з інтернетом” and “Спробувати ще раз” are visible\
And restored connectivity allows a successful retry.

### SC-010 — Add a product to the cart

**Covers:** R-006

Given the product has a price and `stock > 0`\
When the user taps “Додати до кошика”\
Then one unit is added or the existing line quantity increases by one\
And “Товар додано до кошика” is shown.

### SC-011 — Do not add an unavailable product

**Covers:** R-007

Given the product has no price or has `stock <= 0`\
When the page loads\
Then the cart action is unavailable and explains the reason in Ukrainian\
And the product does not change cart state.

### SC-012 — Open an invalid direct link

**Covers:** R-001, R-005

Given the direct link has no non-empty `productSlug`\
When the app handles the route\
Then no API request is made\
And “Неправильне посилання на товар” and a return-to-catalog action are visible.

## Examples

| Input/state                  | Expected observable result               |
| ---------------------------- | ---------------------------------------- |
| `price=null`                 | “Ціну уточнюйте”, add action disabled    |
| `stock=0`                    | “Немає в наявності”, add action disabled |
| photo succeeds, scheme empty | one image, no pager indicator            |
| photo fails, scheme succeeds | scheme remains as the only image         |
| both images fail             | “Зображення недоступне”                  |

## Deferred scenarios

- View cart, checkout, and synchronize cart with the backend.
- Product description after a versioned OpenAPI field is added.
- Fullscreen image zoom, sharing, favorites, reviews, and recommendations.
