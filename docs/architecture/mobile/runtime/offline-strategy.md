# Mobile offline strategy

Kedr Manager is **offline-first** ([ADR-0005](../adr/0005-offline-first-local-database.md)). Screens read a local SQLite database. Two parts of the app reach the network: the sync service, which downloads data, and the send queue, which uploads it. A few online-only reads go straight to the server.

## What lives on the device

| Data                                               | Source                                    | Kept                                                                              |
| -------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------- |
| Catalog: categories, products, prices, price types | `GET /api/mobile/sync/catalog` snapshot   | until the next snapshot; replaced in one transaction                              |
| Customers and their category price rules           | `GET /api/mobile/sync/customers` snapshot | same                                                                              |
| Customer orders and drafts lists                   | `order-workspace` reads, last 50 of each  | refreshed online, shown from cache offline                                        |
| Calculations (one per customer)                    | the manager                               | until sent, saved as a draft or cleared                                           |
| Send queue (`outbox`)                              | the manager                               | until delivered; a delivered order stays a day to show its number                 |
| Main photo and scheme of every product             | CDN, on Wi‑Fi                             | `expo-image` disk cache; «Завантажити всі фото» in the cabinet fetches the rest   |
| Session                                            | sign-in                                   | SecureStore; works offline for 7 days after the last confirmed sign-in or refresh |

Sign-out empties every table and the sync status. Tokens never go to SQLite or AsyncStorage.

## Sync

The automatic sync runs once a day: on start, when the network returns and on an hourly check, it runs only when the stored data is a day old. «Оновити дані зараз» syncs at once. Each snapshot uses `If-None-Match`; `304` keeps the data. A new body is validated with zod and swaps the tables in one transaction, so a screen sees either the old or the new data. A broken body keeps the old data; `401`/`403` stops the run. Until the first snapshot is stored, the work area shows progress or «Немає мережі»; afterwards it never blocks, and the status strip says how old the data is.

## Send queue

Orders and drafts go through the `outbox` table one entry at a time, each with its own idempotency key, so a retry never creates a second order. Network errors and 5xx retry after 5 s, 30 s, 2 min, then every 5 min. A business rejection (changed price, stock, minimum price, unknown customer) stops the entry and returns it to the calculation with the server's reason. Before creating an order the queue compares the quoted prices with what the manager saw. An expired session pauses the queue until sign-in. Sign-out warns when the queue is not empty.

## Online only

- Sign-in, profile changes (name, photo, Admin e-mail and password).
- Opening a saved draft and an order's lines.

These screens say they open with the network instead of showing stale data.

## Limits

- The server is the authority for prices and stock; the device shows the last snapshot and the queue re-checks prices before an order.
- Search filters the priced list in memory (about 2.5 thousand products). Full-text search is an option only past about 20 thousand.
- Feature details: [sync](../../../features/mobile/sync.md), [calculation and queue](../../../features/mobile/calculation.md), [orders](../../../features/mobile/orders.md).
