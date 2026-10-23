# Admin React features

[AppRouter](../../../apps/admin/src/app/router/app-router.tsx) assembles routes inside `AdminLayout`.

| Feature                   | Route                                        | Status                                             |
| ------------------------- | -------------------------------------------- | -------------------------------------------------- |
| [Dashboard](dashboard.md) | `/dashboard`                                 | Visual metrics are currently static                |
| [Products](products.md)   | `/catalog`, `/catalog/:productSlug`          | List, details, and adding products to an order set |
| [Customers](clients.md)   | `/customers`, `/customers/:counterpartyId`   | List, details, and order tables                    |
| [Orders](orders.md)       | `/orders`, `/orders/new`, details and drafts | Lists, checkout, and draft editing                 |

[Session and shell](session.md) are shared across all routes; Admin has no separate login screen. See [Admin architecture](../../architecture/admin/README.md) for shared boundaries.
