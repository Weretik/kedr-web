# Public products consumer contract

## Machine contract

- OpenAPI: [`products.openapi.yaml`](../openapi/catalog/products.openapi.yaml)
- Operations: `getPublicProducts`, `getPublicProductsByCategorySlug`,
  `getPublicProductBySlug`
- Consumers: Storefront catalog; Site product details/discovery; Mobile product details (planned)

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

<a id="site-product-details-and-discovery"></a>

## Site product details and discovery

The new Next.js Site consumes `getPublicProductBySlug` on the server for the selected
`uk`/`ru` locale with fixed public `priceTypeId=11`, through the shared typed
`siteApiGet`. Private generated projections and the unknown redirect-body parser
live in `product/data-access/contracts`; mappers return Site-owned `ProductDetails`
and domain results. Mandatory identity is validated; price, stock, informational
pack, breadcrumbs and independently permitted photo/scheme URLs are normalized.
Feature/UI do not consume provider DTOs.

A current 200 result renders the product; a different canonical `productSlug` maps
to a permanent product redirect. A valid category `CatalogRedirect` in a 404 body
maps to a permanent category redirect; a bare/invalid-body 404 remains not-found.
Transport failure, invalid mandatory identity and unexpected 410 map to unavailable,
not a fabricated product or missing state. Feature owns the actual HTTP response.

`'use cache'` uses hours for current success and the explicit failure/redirect
profile `{ stale: 60, revalidate: 60, expire: 3600 }`. Detail tags include shared
`catalog`/`catalog:products`, requested/canonical product slug and SKU; the bounded
index also uses `catalog:products:index`. Cache inputs contain no session, cookie
or cart state. Time-based public caching does not replace cart/order validation.

Discovery uses `getPublicProducts` with fixed `priceTypeId=11`, `availability=All`,
`sort=IdAsc`, `pageSize=100` and no catalog filters. First-page candidates provide
real prerender seeds; the full index walks at most 1000 pages per locale. Observable
paging/identity inconsistency receives one retry, and unavailable/truncated walks
do not become partial success. Offset paging cannot guarantee an atomic snapshot.
There are no detail requests per sitemap row or invented modification dates.

See the [Site product feature](../../features/site/product.md) and its
[API decisions](../../specs/site/product/001-product-details/contracts/api-contract.md).
Shared cart integration is still blocked by EN-002; these GET operations do not
create an order or implement a separate cart.

## Compatibility note

Redocly reports an ambiguous templated path pair between the category list and
product detail routes. The frontend uses the documented literal `/product/`
segment, but the provider should remove the ambiguity before adding another
neighboring route. Any path or parameter change requires snapshot sync,
regeneration and Storefront/Site integration verification.
