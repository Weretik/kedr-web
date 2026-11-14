# Kedr Manager — API contract

All calls use the bearer token from `POST /api/auth/mobile/login` and `POST /api/auth/mobile/refresh`. Admin and Manager roles pass the `CanManageOrders` policy.

## Existing operations used

| Operation                                                                                                                            | Use                                  | Source                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ | ---------------------------------------------------------------------------- |
| `POST /api/auth/mobile/login`, `/refresh`, `/logout`                                                                                 | sign-in, refresh, sign-out           | KedrStore `MobileAuthController`                                             |
| `GET /api/auth/session/me`                                                                                                           | role and profile in the session      | KedrStore `AuthSessionController`                                            |
| `GET /api/profile`, `PUT /api/profile/name`, `PUT/DELETE /api/profile/avatar`, `PUT /api/profile/email`, `PUT /api/profile/password` | cabinet                              | KedrStore `ProfileController`; contract `docs/contracts/identity/profile.md` |
| `POST /api/admin/order-workspace/quote`                                                                                              | check the calculation before sending | KedrStore spec `sales/004`, `sales/008`                                      |
| `POST /api/admin/order-workspace/orders` (+ `Idempotency-Key`)                                                                       | create the order                     | same                                                                         |
| `GET /api/admin/order-workspace/orders?counterpartyId=` and `/orders/{id}`                                                           | customer orders and order detail     | same                                                                         |
| `GET/POST/PUT/DELETE /api/admin/order-workspace/drafts…` (+ `Idempotency-Key` on create)                                             | drafts                               | KedrStore spec `sales/005`                                                   |

## New operations (KedrStore spec `platform/004-mobile-offline-sync`)

| Operation                        | Response                                                                                                                                                                                                                                                                                  | Notes                                                                                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/mobile/sync/catalog`   | `{ version, generatedAt, retailPriceTypeId, priceTypes[], categories[], products[] }`; each product has id (the 1C code), slug, Ukrainian name, categoryId, stock, inStock, quantityInPack, photos[] (URLs, main first), scheme, isSale, isNew, prices[] `{ priceTypeId, amount }` in UAH | `ETag` / `If-None-Match` → `304`; gzip or Brotli; deleted products and categories left out. No description or thumbnails: KedrStore has neither yet |
| `GET /api/mobile/sync/customers` | `{ version, generatedAt, customers[] }`; each customer has counterpartyId, name, phone, email, defaultPriceTypeId, categoryPriceTypes[] `{ categoryId, priceTypeId }`, `debt: null`, `balance: null`                                                                                      | `ETag` / `If-None-Match` → `304`; `debt` and `balance` are always null until 1C provides them                                                       |

The app validates both responses with zod schemas from `@mobile/sync/model` in `@mobile/sync/data-access`; DTOs do not leave that library. Unknown extra fields are ignored so the server can add fields without breaking old app versions.
