# Mobile products

**Scenario:** the manager finds a product by name or code, narrows by category and stock, sees the chosen customer's price, and opens large photos and the scheme, also without a network. [SDD](../../specs/mobile/manager/001-manager-app/README.md) (R-005, R-006, R-007, R-008, R-017; SC-006 to SC-010, SC-025).

- Products, categories and prices come from the [local database](sync.md); nothing here calls the API.
- [Price resolver](../../../libs/mobile/catalog/model/src/pricing/customer-price.ts): the customer's rule on the product's category, else on the nearest parent, else the default price type, as KedrStore `CustomerPriceResolver`. A type without a price gives «Ціну уточнюйте». [Queries](../../../libs/mobile/catalog/data-access/src/queries/catalog-queries.ts) price the whole list for the [selected customer](customers.md).
- [ProductList](../../../libs/mobile/catalog/feature/src/components/product-list.tsx): search by the code from its start or every word in the name (in memory, about 2.5 thousand rows), category chips with the path, «Лише в наявності», sort by name or price. A row shows the photo, code, stock or «немає в наявності», and the price; the «+» adds it to the [calculation](calculation.md) and is disabled out of stock or without a price.
- [ProductDetail](../../../libs/mobile/catalog/feature/src/components/product-detail.tsx): [gallery](../../../libs/mobile/catalog/ui/src/components/product-gallery.tsx) «Фото N/M | Схема» on a white stage (photo and scheme side by side when the column is at least 520 dp wide), code, category path, stock, pack, «Ціна для <клієнт>». The [viewer](../../../libs/mobile/catalog/ui/src/components/zoom-viewer.tsx) opens full screen on white with swipe between photos and the scheme, pinch and double-tap zoom.
- [ProductCatalog](../../../libs/mobile/catalog/feature/src/components/product-catalog.tsx) opens the product screen on a phone and keeps the list and the detail side by side on a tablet; a wide tablet keeps the calculation panel next to the products and opens a product in the list's place with «До списку товарів».
- Offline photos: [`useEssentialPhotoDownload`](../../../libs/mobile/catalog/data-access/src/hooks/use-photo-downloads.ts) keeps the main photo of every product and every scheme in the `expo-image` disk cache, on Wi‑Fi only, once per catalog version; [PhotoDownloadCard](../../../libs/mobile/catalog/feature/src/components/photo-download-card.tsx) in the cabinet downloads every photo with progress and a stop button. A photo not on the device says «Фото буде доступне з мережею» offline.

## Routes

| Route                   | File                                                  |
| ----------------------- | ----------------------------------------------------- |
| `/products`             | `apps/mobile/src/app/(work)/products/index.tsx`       |
| `/products/[productId]` | `apps/mobile/src/app/(work)/products/[productId].tsx` |

## Code structure

```text
libs/mobile/catalog/
├── model/src/{entities,pricing,categories,search,media}/  # product types, price resolver, tree, search and sort, image sets
├── data-access/src/{queries,hooks,media}/  # local DB reads with prices, photo download store and hooks
├── ui/src/components/  # ProductRow, ProductImage, ProductGallery, ZoomViewer, ZoomableImage
└── feature/src/components/  # ProductList, ProductDetail, ProductCatalog, PhotoDownloadCard
```

## Tests

- `npx nx run mobile-catalog-model:test` — price resolver with the KedrStore cases, tree, search, sort, image sets.
- `npx nx run mobile-catalog-data-access:test` — priced queries, Wi‑Fi download once per version, «Завантажити всі фото».
- `npx nx run mobile-catalog-ui:test`, `npx nx run mobile-catalog-feature:test` — rows, out of stock, offline photo, «Схема», full screen, tablet split, wide layout, side by side gallery.

Jest cannot start Reanimated, so tests replace `ZoomableImage`; pinch and double tap are checked on a device.
