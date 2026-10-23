# Mobile product details — scope and outcome

## Goal

As a manager, I want to tap a product in the current catalog to view all details and images available in Ukrainian and add an available product to the cart.

## In scope

- Open details from any visible result in the current catalog, including search and filtered results.
- Direct link `/product/{productSlug}`.
- Load `getPublicProductBySlug` only with `lang=uk` and retail `priceTypeId=11`.
- Display every field supplied by the current `ProductDetails` contract.
- Gallery with the main photo and scheme when their URLs actually load.
- Clear Ukrainian loading, not-found, offline, error, and image fallback states.
- Retry after transport failure.
- Add one unit of an available product with a known price to the local Mobile cart and show a Ukrainian confirmation.
- Preserve the catalog query, loaded rows, and scroll position after Back.
- Light/dark theme, safe area, text scaling, TalkBack/VoiceOver, and web fallback.

## Out of scope

- Checkout, cart screen, quantity editor, removing items from the cart, and server cart sync.
- Favorites, reviews, recommendation carousel, sharing, and image zoom.
- Authentication or manager-role enforcement.
- Product editing.
- Invented description or new backend fields.
- OpenAPI changes or a separate HEAD request to check file availability.

## Actors and external systems

- Manager: opens a product, reviews its data, returns, or adds the product.
- KedrStore Catalog API: returns a Ukrainian product projection by slug.
- Image storage/CDN: loads the `photo` and `scheme` URLs or returns an image load error.
- Local Mobile cart: stores the added line within the app installation.

## Constraints

- `ProductDetails` has no description field. Do not show a description section until the field appears in the canonical backend OpenAPI.
- `photo` and `scheme` are declared as strings, but a URL may be empty or point to a missing file; success is determined by the image load event.
- Mobile authentication is deferred and the operation is anonymous; “manager” describes the audience but does not guarantee authorization.
- Existing catalog state must remain owned by the current catalog feature.

## Open product questions

There are no blocking questions. The minimum cart contract for this feature: one unit per tap, repeated taps increase quantity, and AsyncStorage preserves the cart across restarts; the cart screen and checkout need a separate SDD.
