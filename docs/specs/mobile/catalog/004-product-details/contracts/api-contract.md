# Mobile product details — API integration contract

## Source

- OpenAPI snapshot: [`products.openapi.yaml`](../../../../../contracts/openapi/catalog/products.openapi.yaml)
- Stable `operationId`: `getPublicProductBySlug`
- Generated operation: `operations['getPublicProductBySlug']`
- Consumer projection: [`public-products.md`](../../../../../contracts/catalog/public-products.md)
- Provider version: [`SOURCE.md`](../../../../../contracts/openapi/SOURCE.md)

## Operations

| User intent  | Method/path                                 | Request                                                 | Success                          | Expected errors                                                        |
| ------------ | ------------------------------------------- | ------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------- |
| View product | `GET /api/catalog/uk/product/{productSlug}` | path `lang='uk'`, `productSlug`; query `priceTypeId=11` | generated `200 application/json` | `400` invalid input, `404` not found, normalized network/server errors |

## Generated transport types

```ts
import type { operations } from '@shared/api-contracts';

type GetProductDetails = operations['getPublicProductBySlug'];
type ProductDetailsDto = GetProductDetails['responses'][200]['content']['application/json'];
type ProductDetailsQuery = NonNullable<GetProductDetails['parameters']['query']>;
type ProductDetailsPath = GetProductDetails['parameters']['path'];
```

Generated types remain private in `@mobile/catalog/data-access`.

## Client projection

- The request always sets `lang: 'uk'`, a trimmed `productSlug`, and
  `priceTypeId: 11`; an empty slug is blocked before the HTTP boundary.
- The runtime schema validates the external response and must be type-compatible
  with `ProductDetailsDto`; code generation does not replace runtime validation.
- The mapper returns `CatalogProductDetails`: `id`, `name`, `price`, `stock`,
  `categoryName`, `categorySlug`, `quantityInPack`, `breadcrumbs`, and image
  candidates `{kind: 'photo' | 'scheme', url}`.
- Empty image strings are excluded from candidates. Valid HTTP JSON does not
  guarantee that a file exists at the URL; the image component owns the final fallback.
- `404` becomes a domain not-found state; connectivity and network/server
  failures become safe retryable errors. Do not show the raw body or log URL query/body.
- The RTK Query cache key is determined by `productSlug`, `lang='uk'`, and
  `priceTypeId=11`; unmount cancels an unnecessary in-flight request.

## Contract verification

- `npm run contracts:check`.
- Mapper/runtime-schema unit tests run in `mobile-catalog-data-access:test`.
- Focused endpoint request/404/error integration runs in the same target.
- Compatibility blocker: `ProductDetails` has no description or image array;
  the gallery is intentionally built only from `photo` and `scheme`.
