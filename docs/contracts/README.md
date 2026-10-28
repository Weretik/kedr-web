# Frontend API contracts

`docs/contracts/` brings together the provider-owned OpenAPI snapshot, generated TypeScript transport types, and concise frontend consumer projections. These three layers have different responsibilities:

1. [`openapi/openapi.yaml`](openapi/openapi.yaml) is the machine-readable snapshot of the canonical `KedrStore` contract; YAML in this directory is not edited manually.
2. `@shared/api-contracts` contains machine-owned TypeScript types generated from the snapshot. They are imported only at transport/data-access boundaries.
3. Module Markdown pages record consumer decisions: which client calls an operation, how the transport response maps to a domain model, and which cache/error/rollout rules the frontend applies.

Backend OpenAPI remains the provider source of truth. The frontend snapshot records the exact provider contract version; generated types are not a separate source and are not edited manually. Snapshot provenance is recorded in [`openapi/SOURCE.md`](openapi/SOURCE.md).

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

Commands:

```text
npm run contracts:sync -- <path-to-KedrStore>
npm run contracts:lint
npm run contracts:generate
npm run contracts:check
```

`contracts:sync` accepts only a clean backend checkout, copies all OpenAPI YAML files, and records the backend commit. `contracts:check` validates OpenAPI and confirms that checked-in generated types match the snapshot.

Do not edit the YAML snapshot or generated TypeScript manually. To update them: pin the backend contract in a clean checkout, run `contracts:sync`, run `contracts:generate` and review the semantic diff, update affected mappers, consumer pages, and tests, then run `contracts:check`.

## Consumer projections

- [Shared integration rules](integration.md)
- Catalog:
  - [Public products](catalog/public-products.md)
  - [Admin products](catalog/admin-products.md)
  - [Products with unavailable photos](catalog/missing-photo-products.md)
  - [Admin categories](catalog/admin-categories.md)
  - [Quick order](catalog/quick-order.md)
- Identity:
  - [Session](identity/session.md)
  - [Staff accounts](identity/staff-accounts.md)
- Sales:
  - [Mobile manager order](sales/manager-order.md)
  - [Admin customers](sales/admin-customers.md)
  - [Admin order workspace](sales/admin-order-workspace.md)

A detailed consumer projection is needed only for operations with status `used`, `planned`, or `blocked`. For `not consumed`, OpenAPI and the registry row are sufficient; do not create a manual copy of a request/response schema without a frontend decision.

## Operation registry

| Backend module     | `operationId`                                     | Method/path                                                 | Access                       | Consumers                  | Status       |
| ------------------ | ------------------------------------------------- | ----------------------------------------------------------- | ---------------------------- | -------------------------- | ------------ |
| Catalog categories | `getCategoryTree`                                 | `GET /api/catalog/{lang}/categories`                        | anonymous                    | —                          | not consumed |
| Catalog categories | `getCategoryBySlug`                               | `GET /api/catalog/{lang}/categories/by-slug/{categorySlug}` | anonymous                    | —                          | not consumed |
| Catalog categories | `getAdminCategories`                              | `GET /api/categories`                                       | staff (Manager or Admin)     | Mobile, Admin              | used         |
| Catalog categories | `getAdminCategoryById`                            | `GET /api/categories/{id}`                                  | staff (Manager or Admin)     | —                          | not consumed |
| Catalog products   | `getPublicProducts`                               | `GET /api/catalog/{lang}/products`                          | anonymous                    | Storefront                 | used         |
| Catalog products   | `getPublicProductsByCategorySlug`                 | `GET /api/catalog/{lang}/{categorySlug}/products`           | anonymous                    | Storefront                 | used         |
| Catalog products   | `getPublicProductBySlug`                          | `GET /api/catalog/{lang}/product/{productSlug}`             | anonymous                    | Storefront, Mobile         | used         |
| Catalog products   | `getAdminProducts`                                | `GET /api/admin/products`                                   | staff (Manager or Admin)     | Admin, Mobile              | used         |
| Catalog products   | `getAdminProductBySlug`                           | `GET /api/admin/products/by-slug/{productSlug}`             | staff (Manager or Admin)     | Admin                      | used         |
| Catalog products   | `getAllAdminProducts`                             | `GET /api/admin/products/all`                               | staff (Manager or Admin)     | —                          | not consumed |
| Catalog products   | `getAdminProductsWithUnavailablePhotos`           | `GET /api/admin/products/missing-photos`                    | staff (Manager or Admin)     | Mobile, Admin              | used         |
| Quick order        | `createQuickOrder`                                | `POST /api/orders`                                          | anonymous                    | Storefront                 | used         |
| Identity           | `loginCookieSession`                              | `POST /api/auth/cookie/login`                               | anonymous, rate-limited      | Admin, Storefront          | used         |
| Identity           | `logoutCookieSession`                             | `POST /api/auth/cookie/logout`                              | session cookie + CSRF header | Admin, Storefront          | used         |
| Identity           | `loginMobile`                                     | `POST /api/auth/mobile/login`                               | anonymous, rate-limited      | Mobile                     | used         |
| Identity           | `refreshMobile`                                   | `POST /api/auth/mobile/refresh`                             | anonymous, rate-limited      | Mobile                     | used         |
| Identity           | `logoutMobile`                                    | `POST /api/auth/mobile/logout`                              | bearer                       | Mobile                     | used         |
| Identity           | `getCurrentSession`                               | `GET /api/auth/session/me`                                  | session cookie or bearer     | Admin, Storefront, Mobile  | used         |
| Identity           | `loginSession`, `refreshSession`, `logoutSession` | `POST /api/auth/session/*`                                  | deprecated                   | —                          | not consumed |
| Identity users     | `getStaffAccounts`                                | `GET /api/admin/users`                                      | Admin                        | Admin                      | used         |
| Identity users     | `createStaffAccount`                              | `POST /api/admin/users`                                     | Admin                        | Admin                      | used         |
| Identity users     | `changeStaffRole`                                 | `PUT /api/admin/users/{userId}/role`                        | Admin                        | Admin                      | used         |
| Identity users     | `setStaffBlocked`                                 | `PUT /api/admin/users/{userId}/blocked`                     | Admin                        | Admin                      | used         |
| Identity users     | `setStaffPassword`                                | `PUT /api/admin/users/{userId}/password`                    | Admin                        | Admin                      | used         |
| Sales catalog      | `getSalesCatalogProducts`                         | `POST /api/sales/{lang}/catalog/products`                   | authenticated                | —                          | not consumed |
| Sales customers    | `getAdminCustomers`                               | `GET /api/admin/customers`                                  | staff (Manager or Admin)     | Mobile cart, orders, Admin | used         |
| Sales customers    | `getAdminCustomerById`                            | `GET /api/admin/customers/{counterpartyId}`                 | staff (Manager or Admin)     | Admin                      | used         |
| Sales orders       | `getAdminOrders`                                  | `GET /api/admin/orders`                                     | staff (Manager or Admin)     | Mobile                     | used         |
| Sales orders       | `getAdminOrderById`                               | `GET /api/admin/orders/{orderId}`                           | staff (Manager or Admin)     | Mobile                     | used         |
| Sales workspace    | `getAdminWorkspaceOrders`                         | `GET /api/admin/order-workspace/orders`                     | staff (Manager or Admin)     | Admin                      | used         |
| Sales workspace    | `getAdminWorkspaceOrderById`                      | `GET /api/admin/order-workspace/orders/{orderId}`           | staff (Manager or Admin)     | Admin                      | used         |
| Sales workspace    | `quoteAdminWorkspaceOrder`                        | `POST /api/admin/order-workspace/quote`                     | staff (Manager or Admin)     | Admin                      | used         |
| Sales workspace    | `createAdminWorkspaceOrder`                       | `POST /api/admin/order-workspace/orders`                    | staff (Manager or Admin)     | Admin                      | used         |
| Sales drafts       | `getAdminOrderDrafts`                             | `GET /api/admin/order-workspace/drafts`                     | staff (Manager or Admin)     | Admin                      | used         |
| Sales drafts       | `getAdminOrderDraftById`                          | `GET /api/admin/order-workspace/drafts/{draftId}`           | staff (Manager or Admin)     | Admin                      | used         |
| Sales drafts       | `createAdminOrderDraft`                           | `POST /api/admin/order-workspace/drafts`                    | staff (Manager or Admin)     | Admin                      | used         |
| Sales drafts       | `updateAdminOrderDraft`                           | `PUT /api/admin/order-workspace/drafts/{draftId}`           | staff (Manager or Admin)     | Admin                      | used         |
| Sales drafts       | `deleteAdminOrderDraft`                           | `DELETE /api/admin/order-workspace/drafts/{draftId}`        | staff (Manager or Admin)     | Admin                      | used         |
| Sales order sync   | `createAdminOrder`                                | `POST /api/admin/orders`                                    | staff (Manager or Admin)     | Mobile cart                | used         |
| Sales order sync   | `getAdminOrderSyncStatus`                         | `GET /api/admin/orders/{orderId}/sync-status`               | staff (Manager or Admin)     | —                          | not consumed |
| Sales order sync   | `retryAdminOrderSync`                             | `POST /api/admin/orders/{orderId}/sync/retry`               | staff (Manager or Admin)     | —                          | not consumed |

## Known provider-contract warnings

`contracts:lint` currently accepts the snapshot with one upstream warning: ambiguous OpenAPI templates for category products and product details.

Do not patch these warnings in the snapshot. Record a backend blocker and update the canonical `KedrStore` contract first, then run sync and generation again.

## Rules for new or changed operations

1. Update the canonical backend OpenAPI and aggregate entry point first.
2. Run `contracts:sync`, `contracts:lint`, and `contracts:generate`.
3. Use `operations['operationId']` or `components[...]` only at a transport or `data-access` boundary. Do not import generated types in feature, UI, or domain model code.
4. Keep runtime validation and DTO-to-domain mapping in the consuming `data-access` library. Generated static types do not validate network data.
5. Add or update one module consumer page and link it from the feature-local `contracts/api-contract.md`.
6. Run `contracts:check`, relevant typecheck, tests, and builds. Commit the snapshot, generated output, consumer projection, and implementation together when they represent one compatible contract change.
