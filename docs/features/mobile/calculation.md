# Mobile calculation and send queue

**Scenario:** the manager adds products for the chosen customer, sets quantities and a per-unit discount or markup, then saves a draft or sends the order to 1C; offline both wait in the send queue and go out by themselves. [SDD](../../specs/mobile/manager/001-manager-app/README.md) (R-009 to R-012, R-017; SC-011 to SC-017, SC-024).

- Each customer has its own calculation in the local tables `calculations` and `calculation_lines`; it keeps only product, quantity and adjustment. Prices are read live from the [catalog](catalog.md) for that customer by [`priceLine`](../../../libs/mobile/calculation/model/src/entities/calculation-line.ts), so a new catalog version updates them.
- Price per piece ([parser](../../../libs/mobile/calculation/model/src/validators/price-adjustment.ts)): in the line sheet the switch «Знижка − | Націнка +» gives the sign and the field the hryvnias per piece, «12,50» works; the row shows it as a «−10/шт» mark. A discount may not take the unit price below 1 ₴; the field says the largest allowed one (KedrStore `price_below_minimum`). A line out of stock, without a price, missing from the catalog or above the stock blocks «Чернетка» and «Відправити в 1С».
- [CalculationPanel](../../../libs/mobile/calculation/feature/src/components/calculation/calculation-panel.tsx) is a compact work sheet: one row per line («3 × price», line sum), the comment, and under the list «N позицій · M шт», the total, «Чернетка» (asks for a name; an opened draft keeps its own) and «Відправити в 1С» (confirms the total first). A tap on a row opens [CalculationLineSheet](../../../libs/mobile/calculation/feature/src/components/calculation/calculation-line-sheet.tsx) as a native sheet with quantity, price per piece and «Прибрати з розрахунку»; a swipe left removes a row too, and «Скасувати» brings the last removed line back for 5 s. On a wide tablet the panel stands next to the products. «+» on a product row and «Додати в розрахунок» on the detail add one more of the product ([`useAddToCalculation`](../../../libs/mobile/calculation/feature/src/hooks/use-add-to-calculation.ts)). The tab icon shows the number of lines.
- Send queue (table `outbox`, [runner](../../../libs/mobile/calculation/data-access/src/sync/outbox-runner.ts)): one entry at a time in creation order, each with its own `Idempotency-Key`, so a retry never makes a second order. An order calls `quote` first and stops if a customer price differs from what the manager saw; then `orders`. Network errors and 5xx retry after 5 s, 30 s, 2 min, then every 5 min; a 401 that cannot be refreshed pauses the queue; any other refusal returns the entry with the server's reason. [`useOutboxRunner`](../../../libs/mobile/calculation/data-access/src/local/use-calculation.ts) runs it from the working area on start, on network return, after each change and when a retry is due.
- A returned entry goes back into the calculation at once if it is empty (reason on top, changed lines outlined); otherwise it waits in «Замовлення» until the manager finishes the current one. Sending or saving again replaces it.
- An order made from a draft deletes that draft through the queue; «Видалити чернетку» does the same. A delivered order keeps its number in the queue list for a day.
- Signing out wipes the calculations and the queue with the other local data.

## Routes

| Route                           | File                                                          |
| ------------------------------- | ------------------------------------------------------------- |
| `/calculation`                  | `apps/mobile/src/app/(work)/calculation/index.tsx`            |
| `/calculation/line/[productId]` | `apps/mobile/src/app/(work)/calculation/line/[productId].tsx` |
| `/products`                     | side panel on a wide tablet                                   |
| `/products/line/[productId]`    | line sheet over that side panel                               |

## Code structure

```text
libs/mobile/calculation/
├── model/src/{validators,entities}/  # price-per-piece rules, priced lines and totals, queue entry states and backoff
├── data-access/src/{api,store,sync,local}/  # order workspace calls, local tables, enqueue and return, queue runner
├── ui/src/components/  # CalculationLineRow + SwipeToRemove, LineEditor, CalculationFooter, UndoBar, ReviewBanner, OutboxRow
└── feature/src/{components,hooks}/  # CalculationPanel, CalculationLineSheet, confirm and draft steps, controller, removed line for «Скасувати», «+», tab badges
```

Tables: `libs/mobile/core/local-db/src/schema/calculation.ts` (migration 3).

## Tests

- `npx nx run mobile-calculation-model:test` — adjustment parsing and the 1 ₴ rule, line problems, totals, backoff, queue order.
- `npx nx run mobile-calculation-data-access:test` — store, idempotent send, retry, price change and refusal returns, paused session, drafts.
- `npx nx run mobile-calculation-ui:test`, `npx nx run mobile-calculation-feature:test` — line colours and messages, footer, queue rows, per-customer calculations, confirm and offline queue, drafts, badges.
