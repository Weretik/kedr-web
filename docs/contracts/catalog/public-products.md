# Public products consumer contract

## Machine contract

- OpenAPI: [`products.openapi.yaml`](../openapi/catalog/products.openapi.yaml)
- Operations: `getPublicProducts`, `getPublicProductsByCategorySlug`,
  `getPublicProductBySlug`
- Consumers: Storefront catalog; Mobile product details (planned)

| Intent         | Method and path                                   | Generated operation               |
| -------------- | ------------------------------------------------- | --------------------------------- |
| Product list   | `GET /api/catalog/{lang}/products`                | `getPublicProducts`               |
| Category list  | `GET /api/catalog/{lang}/{categorySlug}/products` | `getPublicProductsByCategorySlug` |
| Product detail | `GET /api/catalog/{lang}/product/{productSlug}`   | `getPublicProductBySlug`          |

## Request and mapping

Storefront UI state uses its own domain query. The mapper in
`@storefront/data-access` converts it to the generated query type, emits
camelCase parameter names and maps the UI sort choice to the OpenAPI string
enum. Optional parameters are omitted.

```http
GET /api/catalog/uk/products?searchTerm=кабель&sort=PriceAsc&page=1&pageSize=20
Accept: application/json
```

Generated response types are private to `data-access`. Repository mappers return
Storefront domain models and normalize optional `categoryId` and nullable
`price`; feature and UI do not import the generated library.

Mobile product details plans `getPublicProductBySlug` with fixed `lang=uk` and
`priceTypeId=11`. Its generated response remains private in
`@mobile/catalog/data-access` and maps to a Mobile-owned details model. The
gallery derives only from `photo` and `scheme`; URL availability is handled by
the image component. See the planned
[Mobile SDD](../../specs/mobile/catalog/004-product-details/README.md).

## Compatibility note

Redocly reports an ambiguous templated path pair between the category list and
product detail routes. The frontend uses the documented literal `/product/`
segment, but the provider should remove the ambiguity before adding another
neighboring route. Any path or parameter change requires snapshot sync,
regeneration and Storefront integration verification.
