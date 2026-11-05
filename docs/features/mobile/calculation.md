# Mobile calculation and send queue

**Scenario:** the manager adds products for the chosen customer, sets quantities and a per-unit discount or markup, then saves a draft or sends the order to 1C; offline both wait in the send queue and go out by themselves. [SDD](../../specs/mobile/manager/001-manager-app/README.md) (R-009 to R-012, R-017; SC-011 to SC-017, SC-024).

- Each customer has its own calculation in the local tables `calculations` and `calculation_lines`; it keeps only product, quantity and adjustment. Prices are read live from the [catalog](catalog.md) for that customer by [`priceLine`](../../../libs/mobile/calculation/model/src/lines/calculation-line.ts), so a new catalog version updates them.
- «± ₴/шт» ([parser](../../../libs/mobile/calculation/model/src/adjustment/price-adjustment.ts)): «−10» is a discount in red, «+5» or «5» a markup in green, «12,50» works. A discount may not take the unit price below 1 ₴; the field says the largest allowed one (KedrStore `price_below_minimum`). A line out of stock, without a price, missing from the catalog or above the stock blocks «Чернетка» and «Відправити в 1С».
- [CalculationPanel](../../../libs/mobile/calculation/feature/src/components/calculation-panel.tsx): lines, comment, adjustment total and total, «Чернетка» (asks for a name; an opened draft keeps its own) and «Відправити в 1С» (confirms the total first). On a wide tablet it stands next to the products. «+» on a product row and «Додати в розрахунок» on the detail add one more of the product ([`useAddToCalculation`](../../../libs/mobile/calculation/feature/src/hooks/use-add-to-calculation.ts)). The tab shows «Розрахунок · N».
- Send queue (table `outbox`, [runner](../../../libs/mobile/calculation/data-access/src/runner/outbox-runner.ts)): one entry at a time in creation order, each with its own `Idempotency-Key`, so a retry never makes a second order. An order calls `quote` first and stops if a customer price differs from what the manager saw; then `orders`. Network errors and 5xx retry after 5 s, 30 s, 2 min, then every 5 min; a 401 that cannot be refreshed pauses the queue; any other refusal returns the entry with the server's reason. [`useOutboxRunner`](../../../libs/mobile/calculation/data-access/src/hooks/use-calculation.ts) runs it from the working area on start, on network return, after each change and when a retry is due.
- A returned entry goes back into the calculation at once if it is empty (reason on top, changed lines outlined); otherwise it waits in «Замовлення» until the manager finishes the current one. Sending or saving again replaces it.
- An order made from a draft deletes that draft through the queue; «Видалити чернетку» does the same. A delivered order keeps its number in the queue list for a day.
- Signing out wipes the calculations and the queue with the other local data.

## Routes

| Route          | File                                         |
| -------------- | -------------------------------------------- |
| `/calculation` | `apps/mobile/src/app/(work)/calculation.tsx` |
| `/products`    | side panel on a wide tablet                  |

## Code structure

```text
libs/mobile/calculation/
├── model/src/{adjustment,lines,outbox}/  # «± ₴/шт» rules, priced lines and totals, queue entry states and backoff
├── data-access/src/{api,store,runner,hooks}/  # order workspace calls, local tables, enqueue and return, queue runner
├── ui/src/components/  # CalculationLineRow, CalculationFooter, ReviewBanner, OutboxRow
└── feature/src/{components,hooks}/  # CalculationPanel, confirm and draft steps, controller, «+», tab badges
```

Tables: `libs/mobile/core/local-db/src/schema/calculation.ts` (migration 3).

## Tests

- `npx nx run mobile-calculation-model:test` — adjustment parsing and the 1 ₴ rule, line problems, totals, backoff, queue order.
- `npx nx run mobile-calculation-data-access:test` — store, idempotent send, retry, price change and refusal returns, paused session, drafts.
- `npx nx run mobile-calculation-ui:test`, `npx nx run mobile-calculation-feature:test` — line colours and messages, footer, queue rows, per-customer calculations, confirm and offline queue, drafts, badges.
