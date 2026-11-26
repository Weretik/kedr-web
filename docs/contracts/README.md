# Frontend API contracts

`docs/contracts/` brings together the provider-owned OpenAPI snapshot, generated TypeScript transport types, and concise frontend consumer projections. These three layers have different responsibilities:

1. [`openapi/openapi.json`](openapi/openapi.json) is a copy of the contract that KedrStore generates from its code on every build (`docs/sdd/contracts/openapi.json` on its default branch `master`). It is never edited here.
2. `@shared/api-contracts` contains machine-owned TypeScript types generated from the snapshot. They are imported only at transport/data-access boundaries.
3. Module Markdown pages record consumer decisions: which client calls an operation, how the transport response maps to a domain model, and which cache/error/rollout rules the frontend applies.

Backend code is the provider source of truth. Snapshot provenance (branch and commit) is recorded in [`openapi/SOURCE.md`](openapi/SOURCE.md). Why it works this way: [ADR-0003](../architecture/adr/0003-types-from-backend-openapi.md) and [ADR-0004](../architecture/adr/0004-contract-follows-backend-and-typed-client.md).

## Contract workflow

```text
KedrStore code ──build──► docs/sdd/contracts/openapi.json (master)
        │ npm run contracts:sync   (or the daily sync pull request)
        ▼
docs/contracts/openapi/openapi.json
        │ contracts:generate (runs inside sync)
        ▼
@shared/api-contracts (paths, components, operations)
        │
        ▼
Admin data-access: apiCall(apiClient.GET('/api/...', { params, signal }), mapper) → domain model → feature/UI
```

Commands:

```text
npm run contracts:sync                     # from the KedrStore default branch
npm run contracts:sync -- --ref <branch>   # from a backend branch that is not merged yet
npm run contracts:sync -- --file <path>    # from a local backend build
npm run contracts:check                    # generated types match the snapshot
npm run contracts:drift                    # the snapshot matches the backend default branch
```

CI runs `contracts:check` and `contracts:drift`, so a pull request fails while the snapshot lags the backend. Every weekday at 07:00 Kyiv time the workflow `contract-sync.yml` syncs the snapshot and, when it changed, opens or updates the pull request `chore/sync-backend-contract` with the typecheck result. CI does not start by itself on that pull request (a GitHub rule for workflow-created pull requests): close and reopen it, or push a commit.

### Automatic synchronization

A branch (or agent thread) that touches a backend contract synchronizes the snapshot itself, before its pull request is merged, without waiting for `contracts:drift` to fail and without asking the owner:

1. Merge the KedrStore change into `master` first. While it is unmerged, use `npm run contracts:sync -- --ref <backend branch>` for development.
2. Update the frontend branch from `master`, then run `npm run contracts:sync` (from the backend default branch) and `npm run contracts:check`.
3. Commit the snapshot and generated types in the same pull request, then merge the frontend.

Order: merge backend → sync the contract in the frontend branch → merge frontend.

To consume a new or changed operation: merge the backend change, run `contracts:sync`, fix the type errors it shows, call the operation through `apiClient` in the domain `data-access` (path and body come from the contract), map the response to the domain model, and update the consumer page and tests.

## Consumer projections

- [Shared integration rules](integration.md)
- Catalog:
  - [Public products](catalog/public-products.md)
  - [Admin products](catalog/admin-products.md)
  - [Products without a photo](catalog/missing-photo-products.md)
  - [Admin retail prices from a file](catalog/admin-retail-prices.md)
  - [Admin categories](catalog/admin-categories.md)
  - [Quick order](catalog/quick-order.md)
- Media:
  - [Admin media library](media/admin-media.md)
- Identity:
  - [Session](identity/session.md)
  - [Staff accounts](identity/staff-accounts.md)
  - [Staff profile](identity/profile.md)
- Sales:
  - [Mobile manager order](sales/manager-order.md)
  - [Admin customers](sales/admin-customers.md)
  - [Admin site orders](sales/admin-site-orders.md)
  - [Admin order workspace](sales/admin-order-workspace.md)

A detailed consumer projection is needed only for operations with status `used`, `planned`, or `blocked`. For `not consumed`, OpenAPI and the registry row are sufficient; do not create a manual copy of a request/response schema without a frontend decision.

## Operation registry

| Backend module     | `operationId`                     | Method/path                                                 | Access                       | Consumers                  | Status       |
| ------------------ | --------------------------------- | ----------------------------------------------------------- | ---------------------------- | -------------------------- | ------------ |
| Catalog categories | `getCategoryTree`                 | `GET /api/catalog/{lang}/categories`                        | anonymous                    | —                          | not consumed |
| Catalog categories | `getCategoryBySlug`               | `GET /api/catalog/{lang}/categories/by-slug/{categorySlug}` | anonymous                    | —                          | not consumed |
| Catalog categories | `getAdminCategories`              | `GET /api/categories`                                       | staff (Manager or Admin)     | Mobile, Admin              | used         |
| Catalog categories | `getAdminCategoryById`            | `GET /api/categories/{id}`                                  | staff (Manager or Admin)     | —                          | not consumed |
| Catalog products   | `getPublicProducts`               | `GET /api/catalog/{lang}/products`                          | anonymous                    | Storefront, Site           | used         |
| Catalog products   | `getPublicProductsByCategorySlug` | `GET /api/catalog/{lang}/{categorySlug}/products`           | anonymous                    | Storefront                 | used         |
| Catalog products   | `getPublicProductBySlug`          | `GET /api/catalog/{lang}/product/{productSlug}`             | anonymous                    | Storefront, Mobile, Site   | used         |
| Catalog products   | `getAdminProducts`                | `GET /api/admin/products`                                   | staff (Manager or Admin)     | Admin, Mobile              | used         |
| Catalog products   | `getAdminProductBySlug`           | `GET /api/admin/products/by-slug/{productSlug}`             | staff (Manager or Admin)     | Admin                      | used         |
| Catalog products   | `getAllAdminProducts`             | `GET /api/admin/products/all`                               | staff (Manager or Admin)     | —                          | not consumed |
| Catalog products   | `getAdminProductMedia`            | `GET /api/admin/products/{id}/media`                        | staff (Manager or Admin)     | Admin                      | used         |
| Catalog products   | `setAdminProductMedia`            | `PUT /api/admin/products/{id}/media`                        | staff (Manager or Admin)     | Admin                      | used         |
| Quick order        | `createQuickOrder`                | `POST /api/orders`                                          | anonymous                    | Storefront                 | used         |
| Quick order        | `getAdminQuickOrders`             | `GET /api/admin/quick-orders`                               | staff (Manager or Admin)     | Admin                      | used         |
| Quick order        | `getAdminQuickOrderById`          | `GET /api/admin/quick-orders/{orderId}`                     | staff (Manager or Admin)     | Admin                      | used         |
| Quick order        | `resendAdminQuickOrderToTelegram` | `POST /api/admin/quick-orders/{orderId}/telegram-resend`    | staff (Manager or Admin)     | Admin                      | used         |
| Identity           | `loginCookieSession`              | `POST /api/auth/cookie/login`                               | anonymous, rate-limited      | Admin, Storefront          | used         |
| Identity           | `logoutCookieSession`             | `POST /api/auth/cookie/logout`                              | session cookie + CSRF header | Admin, Storefront          | used         |
| Identity           | `loginMobile`                     | `POST /api/auth/mobile/login`                               | anonymous, rate-limited      | Mobile                     | used         |
| Identity           | `refreshMobile`                   | `POST /api/auth/mobile/refresh`                             | anonymous, rate-limited      | Mobile                     | used         |
| Identity           | `logoutMobile`                    | `POST /api/auth/mobile/logout`                              | bearer                       | Mobile                     | used         |
| Identity           | `getCurrentSession`               | `GET /api/auth/session/me`                                  | session cookie or bearer     | Admin, Storefront, Mobile  | used         |
| Identity users     | `getStaffAccounts`                | `GET /api/admin/users`                                      | Admin                        | Admin                      | used         |
| Identity users     | `createStaffAccount`              | `POST /api/admin/users`                                     | Admin                        | Admin                      | used         |
| Identity users     | `changeStaffRole`                 | `PUT /api/admin/users/{userId}/role`                        | Admin                        | Admin                      | used         |
| Identity users     | `setStaffBlocked`                 | `PUT /api/admin/users/{userId}/blocked`                     | Admin                        | Admin                      | used         |
| Identity users     | `setStaffPassword`                | `PUT /api/admin/users/{userId}/password`                    | Admin                        | Admin                      | used         |
| Identity users     | `changeStaffName`                 | `PUT /api/admin/users/{userId}/name`                        | Admin                        | Admin                      | used         |
| Identity users     | `changeStaffEmail`                | `PUT /api/admin/users/{userId}/email`                       | Admin                        | Admin                      | used         |
| Identity users     | `uploadStaffAvatar`               | `PUT /api/admin/users/{userId}/avatar`                      | Admin                        | Admin                      | used         |
| Identity users     | `removeStaffAvatar`               | `DELETE /api/admin/users/{userId}/avatar`                   | Admin                        | Admin                      | used         |
| Identity profile   | `getMyProfile`                    | `GET /api/profile`                                          | Admin, Manager               | Admin                      | used         |
| Identity profile   | `changeMyName`                    | `PUT /api/profile/name`                                     | Admin, Manager               | Admin                      | used         |
| Identity profile   | `uploadMyAvatar`                  | `PUT /api/profile/avatar`                                   | Admin, Manager               | Admin                      | used         |
| Identity profile   | `removeMyAvatar`                  | `DELETE /api/profile/avatar`                                | Admin, Manager               | Admin                      | used         |
| Identity profile   | `changeMyEmail`                   | `PUT /api/profile/email`                                    | Admin                        | Admin                      | used         |
| Identity profile   | `changeMyPassword`                | `PUT /api/profile/password`                                 | Admin                        | Admin                      | used         |
| Media              | `getAdminMediaFolders`            | `GET /api/admin/media/folders`                              | staff (Manager or Admin)     | Admin                      | used         |
| Media              | `createAdminMediaFolder`          | `POST /api/admin/media/folders`                             | staff (Manager or Admin)     | Admin                      | used         |
| Media              | `updateAdminMediaFolder`          | `PUT /api/admin/media/folders/{id}`                         | staff (Manager or Admin)     | Admin                      | used         |
| Media              | `deleteAdminMediaFolder`          | `DELETE /api/admin/media/folders/{id}`                      | Admin                        | Admin                      | used         |
| Media              | `getAdminMediaFiles`              | `GET /api/admin/media/files`                                | staff (Manager or Admin)     | Admin                      | used         |
| Media              | `uploadAdminMediaFile`            | `POST /api/admin/media/files`                               | staff (Manager or Admin)     | Admin                      | used         |
| Media              | `getAdminMediaFile`               | `GET /api/admin/media/files/{id}`                           | staff (Manager or Admin)     | —                          | not consumed |
| Media              | `updateAdminMediaFile`            | `PUT /api/admin/media/files/{id}`                           | staff (Manager or Admin)     | Admin                      | used         |
| Media              | `deleteAdminMediaFile`            | `DELETE /api/admin/media/files/{id}`                        | Admin                        | Admin                      | used         |
| Media              | `replaceAdminMediaFile`           | `PUT /api/admin/media/files/{id}/content`                   | staff (Manager or Admin)     | Admin                      | used         |
| Media              | `moveAdminMediaFiles`             | `POST /api/admin/media/files/move`                          | staff (Manager or Admin)     | Admin                      | used         |
| Sales catalog      | `getSalesCatalogProducts`         | `POST /api/sales/{lang}/catalog/products`                   | authenticated                | —                          | not consumed |
| Sales customers    | `getAdminCustomers`               | `GET /api/admin/customers`                                  | staff (Manager or Admin)     | Mobile cart, orders, Admin | used         |
| Sales customers    | `getAdminCustomerById`            | `GET /api/admin/customers/{counterpartyId}`                 | staff (Manager or Admin)     | Admin                      | used         |
| Sales orders       | `getAdminOrders`                  | `GET /api/admin/orders`                                     | staff (Manager or Admin)     | Mobile                     | used         |
| Sales orders       | `getAdminOrderById`               | `GET /api/admin/orders/{orderId}`                           | staff (Manager or Admin)     | Mobile                     | used         |
| Sales workspace    | `getAdminWorkspaceOrders`         | `GET /api/admin/order-workspace/orders`                     | staff (Manager or Admin)     | Admin                      | used         |
| Sales workspace    | `getAdminWorkspaceOrderById`      | `GET /api/admin/order-workspace/orders/{orderId}`           | staff (Manager or Admin)     | Admin                      | used         |
| Sales workspace    | `quoteAdminWorkspaceOrder`        | `POST /api/admin/order-workspace/quote`                     | staff (Manager or Admin)     | Admin                      | used         |
| Sales workspace    | `createAdminWorkspaceOrder`       | `POST /api/admin/order-workspace/orders`                    | staff (Manager or Admin)     | Admin                      | used         |
| Sales drafts       | `getAdminOrderDrafts`             | `GET /api/admin/order-workspace/drafts`                     | staff (Manager or Admin)     | Admin                      | used         |
| Sales drafts       | `getAdminOrderDraftById`          | `GET /api/admin/order-workspace/drafts/{draftId}`           | staff (Manager or Admin)     | Admin                      | used         |
| Sales drafts       | `createAdminOrderDraft`           | `POST /api/admin/order-workspace/drafts`                    | staff (Manager or Admin)     | Admin                      | used         |
| Sales drafts       | `updateAdminOrderDraft`           | `PUT /api/admin/order-workspace/drafts/{draftId}`           | staff (Manager or Admin)     | Admin                      | used         |
| Sales drafts       | `deleteAdminOrderDraft`           | `DELETE /api/admin/order-workspace/drafts/{draftId}`        | staff (Manager or Admin)     | Admin                      | used         |
| Sales order sync   | `createAdminOrder`                | `POST /api/admin/orders`                                    | staff (Manager or Admin)     | Mobile cart                | used         |
| Sales order sync   | `getAdminOrderSyncStatus`         | `GET /api/admin/orders/{orderId}/sync-status`               | staff (Manager or Admin)     | —                          | not consumed |
| Sales order sync   | `retryAdminOrderSync`             | `POST /api/admin/orders/{orderId}/sync/retry`               | staff (Manager or Admin)     | —                          | not consumed |

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
