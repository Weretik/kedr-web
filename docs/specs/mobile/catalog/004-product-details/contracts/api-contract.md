# Mobile product details — API integration contract

## Source

- OpenAPI snapshot: [`products.openapi.yaml`](../../../../../contracts/openapi/catalog/products.openapi.yaml)
- Stable `operationId`: `getPublicProductBySlug`
- Generated operation: `operations['getPublicProductBySlug']`
- Consumer projection: [`public-products.md`](../../../../../contracts/catalog/public-products.md)
- Provider version: [`SOURCE.md`](../../../../../contracts/openapi/SOURCE.md)

## Operations

| User intent       | Method/path                                 | Request                                                 | Success                          | Expected errors                                                        |
| ----------------- | ------------------------------------------- | ------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Переглянути товар | `GET /api/catalog/uk/product/{productSlug}` | path `lang='uk'`, `productSlug`; query `priceTypeId=11` | generated `200 application/json` | `400` invalid input, `404` not found, normalized network/server errors |

## Generated transport types

```ts
import type { operations } from '@shared/api-contracts';

type GetProductDetails = operations['getPublicProductBySlug'];
type ProductDetailsDto = GetProductDetails['responses'][200]['content']['application/json'];
type ProductDetailsQuery = NonNullable<GetProductDetails['parameters']['query']>;
type ProductDetailsPath = GetProductDetails['parameters']['path'];
```

Generated types залишаються private у `@mobile/catalog/data-access`.

## Client projection

- Request завжди формує `lang: 'uk'`, trimmed `productSlug` і
  `priceTypeId: 11`; порожній slug блокується до HTTP boundary.
- Runtime schema перевіряє external response та має бути type-compatible з
  `ProductDetailsDto`; code generation не замінює runtime validation.
- Mapper повертає `CatalogProductDetails`: `id`, `name`, `price`, `stock`,
  `categoryName`, `categorySlug`, `quantityInPack`, `breadcrumbs` та image
  candidates `{kind: 'photo' | 'scheme', url}`.
- Порожні image strings не входять до candidates. HTTP-valid JSON не гарантує,
  що файл за URL існує; остаточний fallback належить image component.
- `404` стає domain not-found state; connectivity і network/server failures —
  safe retryable errors; raw body не показується й не логуються URL query/body.
- RTK Query cache key визначається `productSlug`, `lang='uk'` і
  `priceTypeId=11`; unmount скасовує непотрібний in-flight request.

## Contract verification

- `npm run contracts:check`.
- Mapper/runtime-schema unit tests у `mobile-catalog-data-access:test`.
- Endpoint request/404/error focused integration у тому самому target.
- Compatibility blocker: `ProductDetails` не містить description або масиву
  images; gallery свідомо будується лише з `photo` і `scheme`.
