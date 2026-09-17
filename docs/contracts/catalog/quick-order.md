# Quick order consumer contract

## Machine contract

- OpenAPI: [`orders.openapi.yaml`](../openapi/catalog/orders.openapi.yaml)
- Operation: `createQuickOrder`
- Generated request: `operations['createQuickOrder']['requestBody']['content']['application/json']`
- Generated response: `operations['createQuickOrder']['responses'][200]['content']['application/json']`
- Consumer: Storefront checkout

The checkout mapper sends only contract fields: `firstName`, `phone` and order
lines with `productId`, `title`, `unitPrice`, `quantity`. UI-only values such as
product `slug` are not serialized.

```http
POST /api/orders
Content-Type: application/json

{"firstName":"Ірина","phone":"+380501234567","lines":[{"productId":123,"title":"Кабель","unitPrice":120.5,"quantity":2}]}
```

The operation is anonymous and does not define an idempotency key. Checkout must
disable duplicate submission while the request is pending. A `400` response is
handled as validation failure and `409` as a business conflict through the
shared error normalization rules.
