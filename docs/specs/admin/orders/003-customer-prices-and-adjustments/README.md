# 003 — Customer prices and per-unit discount/markup at checkout

- **Application:** Admin React (`apps/admin`)
- **Status:** Implemented 2026-10-29 (branch `claude/project-thread-0i1fvf`)
- **Backend:** KedrStore spec `sales/008-workspace-customer-prices-and-adjustments` (`POST /api/admin/order-workspace/customer-prices`, `priceAdjustment` on input lines, `adjustmentAmount` in the order list)
- **Source:** user request in the project thread of 2026-10-29

## Goal and scope

On the checkout page and in draft editing, the manager sees each product's price **for the chosen customer** right away (the customer's category price rule, inherited by subcategories) and can set a per-unit discount or markup in UAH for each line. The catalog keeps showing retail prices. The adjustment is stored with the order and the draft and shown in details and the order history; 1C receives only the resulting amounts.

The same change labels the retail price column «Ціна (роздріб)» in the catalog, the product picker and the product card, shows the role in the sidebar badge (Admin / Manager) and the top bar («Кабінет адміністратора» / «Кабінет менеджера»), and adds the Kedr favicon and the emblem in the collapsed sidebar.

**Out of scope:** Storefront and Mobile prices, percentage discounts, discount approval limits.

## Product rules

- **R-001.** With a customer chosen, the price column is «Ціна клієнта» and comes from the backend customer prices, independent of stock and of the full quote. Without a customer, it is «Ціна (роздріб)» with the hint «Показано роздрібні ціни. Оберіть клієнта, щоб побачити його ціни.»
- **R-002.** Each line has a «Знижка/Націнка, ₴ за шт.» field. `-50` is a 50 ₴ discount per unit (red), `+50` or `50` a markup (green); a comma works as the decimal separator; at most two decimals and ±1 000 000. Any value is allowed; the server rejects a negative final price.
- **R-003.** Final unit price = base price + adjustment, rounded to kopecks; line amount = final price × quantity. The total and the total adjustment («Знижка: −150,00 ₴») update immediately; the server quote stays authoritative.
- **R-004.** The adjustment is kept in the local order set, in drafts (editable there), and in the created order. Order and draft details show a «Знижка/Націнка за шт.» column only when a line has one; the order list shows a «Знижка/Націнка» column with the order's total adjustment.
- **R-005.** When a draft is merged into the current set, a product already in the set keeps its own adjustment; a new product brings the draft's.

- **R-006 (revision 2026-10-29).** A discount may not take the unit price below 1 ₴ (a product already cheaper than 1 ₴ cannot be discounted; a markup is always allowed). The line shows the reason and the largest allowed discount under the field while typing; the server returns `price_below_minimum` with the same wording.
- **R-007 (revision 2026-10-29).** Errors and confirmations follow the [feedback rules](../../../../standards/admin/feedback-and-errors.md): blocking problems in a pinned block under the top bar with the server's specific reason, success notices at the top centre after an order or draft is saved. On draft editing, «Додати з каталогу» and «Зберегти зміни» sit in one row.

## Acceptance scenarios

| ID         | Scenario                                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **SC-001** | A manager chooses a customer whose category has a price rule; every line shows the customer price, not retail.                   |
| **SC-002** | The manager types `-50` for a 100 ₴ product with quantity 3; the field turns red, the line shows 50 ₴ per unit, the total 150 ₴. |
| **SC-003** | Typing `-1,555` shows «до двох знаків після коми» and changes nothing.                                                           |
| **SC-004** | A draft saved with an adjustment reopens with it and can be changed; the created order shows it in details and in the history.   |
| **SC-005** | The sidebar badge says Manager for a manager and Admin for an admin; the top bar names the matching cabinet.                     |

## Design and file map

| Path                                                                                                         | State  | Responsibility                                                 |
| ------------------------------------------------------------------------------------------------------------ | ------ | -------------------------------------------------------------- |
| `libs/admin/orders/model/src/price-adjustment.ts`                                                            | New    | Parse, tone, format, and apply a per-unit adjustment           |
| `libs/admin/orders/model/src/orders-model.ts`                                                                | Change | `priceAdjustment`, `baseUnitPrice`, `adjustmentAmount`         |
| `libs/admin/orders/data-access/src/api/orders.api.ts`, `mappers/orders.mapper.ts`                            | Change | Customer prices query, request lines with the adjustment       |
| `libs/admin/orders/feature/src/hooks/use-customer-prices.ts`                                                 | New    | Customer prices for the current lines                          |
| `libs/admin/orders/feature/src/state/{current-order-set,draft-edit-session}.ts`                              | Change | Persist and validate the adjustment                            |
| `libs/admin/orders/ui/src/forms/order-lines/{line-pricing.ts,order-line-row.tsx,price-adjustment-field.tsx}` | New    | Price source priority, one editable line, the adjustment input |
| `libs/admin/orders/ui/src/forms/order-line-editor.tsx`                                                       | Change | Table, totals, retail hint                                     |
| `libs/admin/orders/ui/src/components/price-adjustment-text.tsx`                                              | New    | Coloured signed amount                                         |
| `libs/admin/orders/ui/src/{details/order-document-view,tables/order-list-grid}.tsx`                          | Change | Adjustment column and total                                    |
| `libs/admin/core/shell/src/components/{layout/admin-sidebar,top-bar/admin-top-bar}.tsx`                      | Change | Role badge, cabinet title, collapsed emblem                    |
| `apps/{admin,storefront}/public/favicon.*`, `apple-touch-icon.png`                                           | New    | Favicon                                                        |

## Verification

- `admin-orders-model`, `admin-orders-data-access`, `admin-orders-ui`, `admin-orders-feature`, `admin-core-shell`, `admin-products-ui`, `admin`: Vitest focused runs pass.
- Lint and typecheck of the same projects, `typecheck:tests:web`, `architecture:boundaries`, `contracts:check` pass.

## Rollout

Deploy together with the KedrStore change: the request lines now carry `priceAdjustment` and responses carry the new fields. The migration is additive (default 0). Quotes taken before the deploy have a different fingerprint, so the page re-quotes.
