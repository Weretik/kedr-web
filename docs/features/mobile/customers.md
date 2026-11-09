# Mobile customers

**Scenario:** every job starts from a customer. The manager finds one by name, phone or 1C code, sees the card with contacts, prices, debt and balance, the customer's orders and drafts, and the choice stays after a restart. Products, calculation and orders open only for a chosen customer. [SDD](../../specs/mobile/manager/001-manager-app/README.md) (R-002, R-003, R-004, R-013; SC-003, SC-004, SC-005).

- Customers come from the [local database](sync.md) filled by the customers snapshot; nothing here calls the network except the card's orders and drafts.
- [Selected customer store](../../../libs/mobile/customers/data-access/src/selection/selected-customer-store.ts) keeps only ids (the selected one and up to eight recent) in AsyncStorage. [useSelectedCustomer](../../../libs/mobile/customers/data-access/src/hooks/use-customers.ts) reads the customer from the database, so a customer that left the synced list locks the working tabs again. Sign-out in the cabinet clears the choice.
- [Search](../../../libs/mobile/customers/model/src/search/customer-search.ts) matches part of the name (quotes ignored), the 1C code, or three or more phone digits in any format; names that start with the query come first.
- [CustomerList](../../../libs/mobile/customers/feature/src/components/customer-list.tsx): search field, «Недавні», then А–Я sections. Picking a row selects the customer. [CustomerChoice](../../../libs/mobile/customers/feature/src/components/customer-choice.tsx) opens the card screen on a phone and keeps the list and the card side by side on a tablet.
- [CustomerCard](../../../libs/mobile/customers/feature/src/components/customer-card.tsx): contacts, price type and category rules, debt and balance («—» with one note until 1C sends them), segmented «Замовлення | Чернетки». The lists come from `GET /api/admin/order-workspace/{orders,drafts}?counterpartyId=` ([client](../../../libs/mobile/customers/data-access/src/activity/customer-activity-client.ts)), are stored in the `customer_activity` table and shown offline with their date. An order gets a pill only when it waits or failed.
- Working screens show the shell's `CustomerBar` line under the title with the name and price type; a tap returns to customer choice. After the send queue delivers an order or a draft change, that customer's orders and drafts read again ([`useRefreshCustomerActivity`](../../../libs/mobile/customers/data-access/src/hooks/use-customer-activity.ts)), so a saved draft shows in «Чернетки» at once.

## Routes

| Route                                | File                                                       |
| ------------------------------------ | ---------------------------------------------------------- |
| `/customer`                          | `apps/mobile/src/app/(work)/customer/index.tsx`            |
| `/customer/[counterpartyId]` (phone) | `apps/mobile/src/app/(work)/customer/[counterpartyId].tsx` |

## Code structure

```text
libs/mobile/customers/
├── model/src/{entities,activity,search}/  # types, zod schemas of orders and drafts, search, А–Я (money formats re-exported from shared/model)
├── data-access/src/{queries,selection,activity,hooks}/  # local DB reads, selected store, order-workspace client and cache
├── ui/src/components/  # CustomerRow, CustomerMoney, PriceRules, OrderRow, DraftRow
└── feature/src/{components,hooks}/  # CustomerList, CustomerChoice, CustomerCard, useSelectedCustomerSummary
```

Screens re-read the database after a sync through `useLocalDataVersion()` of [`@mobile/core/local-db`](../../../libs/mobile/core/local-db/src/react/local-database-context.tsx); `LocalDatabaseProvider` in `(work)/_layout.tsx` gives them the database.

## Tests

- `npx nx run mobile-customers-model:test` — search, А–Я, recent, money.
- `npx nx run mobile-customers-data-access:test` — card query, re-read after sync, selection, activity cache online and offline.
- `npx nx run mobile-customers-ui:test`, `npx nx run mobile-customers-feature:test` — card, «—» note, search by phone, recent, tablet split.
- `npx nx run mobile:test` — working tabs unlock with a customer.
