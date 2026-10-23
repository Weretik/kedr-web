# Products — scope and outcome

## Goal

As an Admin user, I want to open a product from the list, view its data, and separately see products without an available photo so I can review the catalog without editing it.

## In scope

- The sidebar has a clear «Товари» item for the existing list.
- A top-level switch provides «Усі товари» / «Без фото» / «На сайті». The second mode loads a separate server page of products without an available photo; the third loads a server result set with `exportToSite=true`.
- Each mode's table performs search, supported filtering, and pagination on the server before selecting the page. Availability, sale, and new-item filters offer «Так» / «Ні» / all. The «На сайті» tab controls that flag.
- Both modes provide accessible navigation to a detail card with Ukrainian and Russian names, basic data, four flags, and separate photo and scheme sections. An available image opens enlarged in an MUI Dialog.
- If a product is marked «На сайті», its card links to the public product by slug.
- Every product card has a button in the main section linking to the photo storage folder. The image itself opens enlarged; there is no separate JPG button.
- Returning from a card preserves the mode and list parameters in the current browser session or URL.
- Loading, empty, error, invalid-link, and not-found states; responsive viewing and keyboard navigation.

## Out of scope

- Creation, editing, deletion, bulk operations, cart, photo changes, and CDN diagnostics.
- The reference's edit form, technical `photoStatus`, changing flags, and bulk actions.

## Constraints

Admin uses a separate detail operation with `nameRu`, `isSale`, `isNew`, `exportToSite`, and product slug; the backend contract and frontend snapshot are synchronized. The client does not infer `photoStatus` or CDN state. Production rollout depends on the backend access policy for temporarily anonymous Admin endpoints.
