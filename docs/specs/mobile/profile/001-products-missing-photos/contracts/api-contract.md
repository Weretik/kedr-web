# Products without photos in Profile — API integration contract

## Source

- Requested operation: `GET /api/admin/products/missing-photos`.
- OpenAPI snapshot: `docs/contracts/openapi/openapi.yaml` at provider commit
  `424d65a96b92ea651280107bfd6efd5fd027b48d`.
- Stable `operationId`: `getAdminProductsWithUnavailablePhotos`.
- Generated operation:
  `operations['getAdminProductsWithUnavailablePhotos']`.
- Generated response component:
  `components['schemas']['MissingProductPhotoPage']`.
- Consumer projection:
  [`missing-photo-products.md`](../../../../../contracts/catalog/missing-photo-products.md).
- Frontend OpenAPI YAML was synchronized through `contracts:sync`, not edited
  manually.

## Operations

| User intent                  | Method/path                              | Request                               | Success                                                                   | Expected errors                                       |
| ---------------------------- | ---------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| View products missing photos | `GET /api/admin/products/missing-photos` | generated optional `page`, `pageSize` | generated `MissingProductPhotoPage`; endpoint membership is authoritative | `400` validation plus normalized network/5xx failures |

Every returned item belongs in the list. The client does not inspect photo
fields or contact the CDN to re-evaluate that business decision.

## Client projection

- DTO validation: catalog data-access validates the synchronized response at
  runtime. Validation covers transport shape only, not the backend's
  missing-photo decision. The diagnostic `photoCheckedAtUtc` field is a
  backend `.NET DateTimeOffset`; its OpenAPI `date-time` validator accepts RFC
  3339 offsets such as `+00:00` as well as `Z`.
- Mapping: use existing `CatalogProduct`/`CatalogPage`. ID, localized name,
  availability, price and required `productSlug` map from the response;
  `imageUrl` is unconditionally `null` because operation membership is
  authoritative. Photo diagnostic fields remain private.
- Pagination/cache: generated page-based `page`/`pageSize`; separate stable
  cache key, page 1 replacement and later-page ID-based deduplication.
- Cancellation/retry: retain `baseApi` → `axiosBaseQuery` `AbortSignal` flow;
  manual `refetch` for initial/refresh failure and exact next-page retry when
  applicable; no infinite automatic retry.
- Safe errors: normalized Ukrainian error copy; never raw backend details.
- Navigation: required `productSlug` maps to the existing Mobile details route.

## Contract verification

- `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\KedrStore`:
  passed; provider commit `424d65a`.
- `npm run contracts:lint`: passed with the six documented upstream warnings.
- `npm run contracts:generate`: passed; generated operation and components are
  machine-owned.
- `npm run contracts:check`: lint and generation succeed; command exits `1` at
  its final diff guard because this delivery intentionally contains the newly
  synchronized uncommitted generated output. Rerun from the committed checkout.
- Test level and target: generated verification plus
  `mobile-catalog-data-access:test` for runtime validation/mapping/query.
- Fixture/source: examples derived from the synchronized OpenAPI schema; no
  handwritten parallel response interface.
- Compatibility or blocker: operation is temporarily anonymous, paginated and
  contains required `productSlug`; only the pre-commit generated-diff guard
  remains open.
