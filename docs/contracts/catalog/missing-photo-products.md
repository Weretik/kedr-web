# Products with unavailable photos consumer contract

## Machine contract

- OpenAPI: [`products.openapi.yaml`](../openapi/catalog/products.openapi.yaml)
- Operation: `getAdminProductsWithUnavailablePhotos`
- Generated response:
  `operations['getAdminProductsWithUnavailablePhotos']['responses'][200]['content']['application/json']`
- Generated query:
  `NonNullable<operations['getAdminProductsWithUnavailablePhotos']['parameters']['query']>`
- Consumers: Mobile Profile missing-photo products section, Admin products list

`GET /api/admin/products/missing-photos` is a temporarily anonymous internal
admin surface. Mobile does not add an authorization bypass; production access
remains owned by the backend rollout policy.

## Request projection

The client sends only the generated `page` and `pageSize` query parameters.
Both are page-based: `page >= 1`, `1 <= pageSize <= 100`; provider defaults are
`page=1` and `pageSize=20`.

Admin додатково передає `searchTerm`, `inStock`, `isSale`, `isNew`,
`exportToSite`, `categoryId` і `sort`. Backend застосовує їх до всієї множини товарів без
доступного фото перед обчисленням `totalRecords` і пагінацією. Для кожної
булевої ознаки Admin передає `true`, `false` або не передає параметр.
Frontend snapshot і generated types синхронізовано з backend commit `8fc8729`
2026-10-19; query mapper звіряє параметри з generated type.

```http
GET /api/admin/products/missing-photos?page=1&pageSize=20
Accept: application/json
```

## Consumer mapping

Mobile validates the generated page at runtime inside
`@mobile/catalog/data-access` and maps it to the existing `CatalogPage` and
`CatalogProduct` domain projection:

- `id`, localized `nameUk`/`nameRu`, `productSlug`, `inStock` and `price` use
  the same mapping as the admin-products catalog response;
- `imageUrl` is always `null` because membership in this operation is the
  authoritative unavailable-photo decision; the client does not re-check
  `photo`, `photoAvailable`, `photoStatus` or HTTP status fields;
- photo-check diagnostic fields remain private transport data and are not
  exported to feature/UI.

The stable `productSlug` enables the existing Mobile product-details route.

## Behavior and limitations

- Pagination is page-based and uses `pagedInfo`; page 1 replaces the cached
  list and later pages merge by product ID without duplicates.
- Cache identity is separate from the ordinary admin-products catalog query.
- Pull-to-refresh requests page 1; load-more is offered only while
  `pageNumber < totalPages`.
- A next-page failure preserves cached rows and exposes explicit retry.
- The operation returns only active products whose persisted latest photo
  check is unavailable; Mobile trusts that membership and never contacts the
  CDN to verify it.
- `photoStatus`, check timestamp and HTTP status are not presented by this
  feature.
- Transport errors are normalized through the shared Mobile API client.
