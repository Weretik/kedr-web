# Quick order consumer contract

## Machine contract

- OpenAPI: [`orders.openapi.yaml`](../openapi/catalog/orders.openapi.yaml)
- Operation: `createQuickOrder`
- Generated request: `operations['createQuickOrder']['requestBody']['content']['application/json']`
- Generated response: `operations['createQuickOrder']['responses'][200]['content']['application/json']`
- Consumers: Storefront checkout; Site cart/checkout (server-only action → data-access → shared fixed POST).

The checkout mapper sends only contract fields: `firstName`, `phone` and order
lines with `productId`, `title`, `unitPrice`, `quantity`. UI-only values such as
product `slug` are not serialized.

```http
POST /api/orders
Content-Type: application/json

{"firstName":"Ірина","phone":"+380501234567","lines":[{"productId":"123","title":"Кабель","unitPrice":120.5,"quantity":2}]}
```

The operation is anonymous and does not define an idempotency key. Checkout must
disable duplicate submission while the request is pending. A `400` response is
handled as validation failure and `409` as a business conflict through the
shared error normalization rules.

## Site cart / checkout consumer

[Implemented feature](../../features/site/cart.md), [SDD/API boundary](../../specs/site/cart/001-cart-checkout/contracts/api-contract.md). The existing OpenAPI snapshot and generated aliases are unchanged. Product IDs are strings; quantities are integers1–1000. Site projects only firstName, phone and contract line fields. UI validation uses a trimmed3–30 character name and the complete +38 (0XX) XXX-XX-XX phone mask; no registration, address, payment or contact values enter shared cache/storage/metadata.

The fixed server transport posts anonymously with cache:no-store, credentials:omit, redirect:error and a10s timeout; no automatic retry. Only HTTP200 with a valid UUID creates a receipt and clears the cart. Validation400 maps known fields plus safe global messages;409 is a conflict; network/5xx/timeout/malformed success are uncertain and preserve cart/draft. A single in-flight attempt is enforced per document, including synchronous subscriber reentrance; no cross-tab/reload idempotency guarantee is implied.
