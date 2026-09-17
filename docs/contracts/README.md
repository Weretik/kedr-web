# Frontend API contracts

`docs/contracts/` поєднує provider-owned OpenAPI snapshot, згенеровані
TypeScript transport types і короткі frontend consumer projections. Ці три
шари мають різні відповідальності:

1. [`openapi/openapi.yaml`](openapi/openapi.yaml) — машинозчитуваний snapshot
   канонічного контракту з `KedrStore`; YAML у цій папці не редагується вручну.
2. `@shared/api-contracts` — machine-owned TypeScript types, згенеровані з
   snapshot. Їх імпортують лише transport/data-access boundaries.
3. Markdown-сторінки модулів — consumer decisions: хто викликає operation, як
   transport response мапиться в domain model, які cache/error/rollout rules
   застосовує frontend.

Backend OpenAPI лишається provider source of truth. Frontend snapshot фіксує
точну версію provider contract, а generated types не є окремим джерелом і не
редагуються вручну. Походження snapshot записане в
[`openapi/SOURCE.md`](openapi/SOURCE.md).

## Contract workflow

```text
KedrStore OpenAPI
        │ contracts:sync
        ▼
docs/contracts/openapi
        │ contracts:generate
        ▼
@shared/api-contracts
        │ type-only import
        ▼
transport/data-access → runtime validation/mapping → domain model → feature/UI
```

Команди:

```text
npm run contracts:sync -- <path-to-KedrStore>
npm run contracts:lint
npm run contracts:generate
npm run contracts:check
```

`contracts:sync` приймає лише clean backend checkout, копіює всі OpenAPI YAML і
фіксує backend commit. `contracts:check` перевіряє OpenAPI та підтверджує, що
checked-in generated types відповідають snapshot.

## Consumer projections

- [Shared integration rules](integration.md)
- Catalog:
  - [Public products](catalog/public-products.md)
  - [Admin products](catalog/admin-products.md)
  - [Admin categories](catalog/admin-categories.md)
  - [Quick order](catalog/quick-order.md)
- Identity:
  - [Session](identity/session.md)
- Sales:
  - [Mobile manager order](sales/manager-order.md)

Детальна consumer projection потрібна лише для operation зі статусом `used`,
`planned` або `blocked`. Для `not consumed` достатньо OpenAPI і рядка реєстру;
не створюйте ручну копію request/response schema без frontend-рішення.

## Operation registry

| Backend module     | `operationId`                     | Method/path                                                 | Access                            | Consumers                  | Status       |
| ------------------ | --------------------------------- | ----------------------------------------------------------- | --------------------------------- | -------------------------- | ------------ |
| Catalog categories | `getCategoryTree`                 | `GET /api/catalog/{lang}/categories`                        | anonymous                         | —                          | not consumed |
| Catalog categories | `getCategoryBySlug`               | `GET /api/catalog/{lang}/categories/by-slug/{categorySlug}` | anonymous                         | —                          | not consumed |
| Catalog categories | `getAdminCategories`              | `GET /api/categories`                                       | temporary anonymous admin surface | Mobile                     | used         |
| Catalog categories | `getAdminCategoryById`            | `GET /api/categories/{id}`                                  | temporary anonymous admin surface | —                          | not consumed |
| Catalog products   | `getPublicProducts`               | `GET /api/catalog/{lang}/products`                          | anonymous                         | Storefront                 | used         |
| Catalog products   | `getPublicProductsByCategorySlug` | `GET /api/catalog/{lang}/{categorySlug}/products`           | anonymous                         | Storefront                 | used         |
| Catalog products   | `getPublicProductBySlug`          | `GET /api/catalog/{lang}/product/{productSlug}`             | anonymous                         | Storefront; Mobile planned | used         |
| Catalog products   | `getAdminProducts`                | `GET /api/admin/products`                                   | temporary anonymous admin surface | Admin, Mobile              | used         |
| Catalog products   | `getAllAdminProducts`             | `GET /api/admin/products/all`                               | temporary anonymous admin surface | —                          | not consumed |
| Quick order        | `createQuickOrder`                | `POST /api/orders`                                          | anonymous                         | Storefront                 | used         |
| Identity           | `loginSession`                    | `POST /api/auth/session/login`                              | anonymous, rate-limited           | Admin, Storefront          | used         |
| Identity           | `refreshSession`                  | `POST /api/auth/session/refresh`                            | CSRF cookie/header, rate-limited  | Admin, Storefront          | used         |
| Identity           | `logoutSession`                   | `POST /api/auth/session/logout`                             | bearer                            | Admin, Storefront          | used         |
| Identity           | `getCurrentSession`               | `GET /api/auth/session/me`                                  | bearer                            | —                          | not consumed |
| Sales catalog      | `getSalesCatalogProducts`         | `POST /api/sales/{lang}/catalog/products`                   | bearer                            | —                          | not consumed |
| Sales customers    | `getAdminCustomers`               | `GET /api/admin/customers`                                  | current OpenAPI anonymous         | Mobile                     | planned      |
| Sales customers    | `getAdminCustomerById`            | `GET /api/admin/customers/{counterpartyId}`                 | current OpenAPI anonymous         | —                          | not consumed |
| Sales orders       | `getAdminOrders`                  | `GET /api/admin/orders`                                     | anonymous                         | Mobile                     | used         |
| Sales orders       | `getAdminOrderById`               | `GET /api/admin/orders/{orderId}`                           | anonymous                         | Mobile                     | used         |
| Sales order sync   | `createAdminOrder`                | `POST /api/admin/orders`                                    | temporary anonymous               | Mobile                     | planned      |
| Sales order sync   | `getAdminOrderSyncStatus`         | `GET /api/admin/orders/{orderId}/sync-status`               | temporary anonymous               | —                          | not consumed |
| Sales order sync   | `retryAdminOrderSync`             | `POST /api/admin/orders/{orderId}/sync/retry`               | temporary anonymous               | —                          | not consumed |

## Known provider-contract warnings

`contracts:lint` currently accepts the snapshot with six upstream warnings:

- ambiguous OpenAPI templates for category products and product details;
- missing explicit `security` on five anonymous Sales order-read/order-sync
  operations.

Do not patch these warnings in the snapshot. Record a backend blocker and update
the canonical `KedrStore` contract first, then run sync and generation again.

## Rules for new or changed operations

1. Update the canonical backend OpenAPI and aggregate entry point first.
2. Run `contracts:sync`, `contracts:lint` and `contracts:generate`.
3. Use `operations['operationId']` or `components[...]` only at a transport or
   `data-access` boundary. Do not import generated types in feature, UI or
   domain model code.
4. Keep runtime validation and DTO-to-domain mapping in the consuming
   `data-access` library. Generated static types do not validate network data.
5. Add or update one module consumer page and link it from the feature-local
   `contracts/api-contract.md`.
6. Run `contracts:check`, relevant typecheck, tests and builds. Commit snapshot,
   generated output, consumer projection and implementation together when they
   represent one compatible contract change.
