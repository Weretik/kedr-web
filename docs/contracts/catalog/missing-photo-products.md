# Products without a photo consumer contract

## Machine contract

- OpenAPI: [`products.openapi.yaml`](../openapi/catalog/products.openapi.yaml)
- Operation: `getAdminProducts` with the query flag `withoutPhoto=true`
- Generated response: `operations['getAdminProducts']['responses'][200]['content']['application/json']`
- Generated query: `NonNullable<operations['getAdminProducts']['parameters']['query']>`
- Consumers: Mobile Profile «Без фото» section, Admin products «Без фото» tab

The former `GET /api/admin/products/missing-photos` and its photo check were removed by the backend (Media 001, stage 3). A product without a photo is now one without a linked library photo: its `photo` is an empty string. Staff access (Manager or Admin) is required, like the rest of `/api/admin/products`.

## Request projection

Mobile sends `page`, `pageSize=20`, and `withoutPhoto=true`. Admin sends the same flag together with its usual search, filters, sorting, and paging; the backend applies all of them before paging.

```http
GET /api/admin/products?page=1&pageSize=20&withoutPhoto=true
Accept: application/json
```

## Consumer mapping

The response is an ordinary admin product page, so both clients reuse their admin product mappers: Mobile maps it to `CatalogPage` with `imageUrl: null` for an empty `photo`; Admin shows the same table as in “Усі товари”.

## Behavior and limitations

- Pagination is page-based and uses `pagedInfo`; Mobile caches this list apart from the ordinary catalog query, page 1 replaces it and later pages merge by product ID.
- A product leaves the list as soon as a photo is linked to it on the Admin product page or by the CDN sync run.
- Transport errors are normalized through each client's shared API layer.
