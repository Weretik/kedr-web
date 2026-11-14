# Mobile orders

**Scenario:** for the chosen customer the manager sees what is on its way to 1C, the customer's orders and drafts, opens an order with its lines, and opens a draft or a returned order in the calculation. [SDD](../../specs/mobile/manager/001-manager-app/README.md) (R-010, R-012, R-013; SC-014, SC-016, SC-017).

- [OrdersScreen](../../../libs/mobile/orders/feature/src/components/orders-screen.tsx): «Відправлення» lists the customer's [queue](calculation.md) entries («У черзі», the number once created, «Потрібна перевірка» with the reason). Below, orders and drafts come from the [customer activity](customers.md) cache and refresh online, also after each delivered order. The tab shows «Замовлення · N» while orders wait.
- A draft opens online in the calculation (`GET /api/admin/order-workspace/drafts/{draftId}`) with its version, so saving replaces it unless someone changed it. A returned order opens in the calculation. Neither overwrites a calculation that has lines; the screen asks to send or save it first.
- [OrderDetailScreen](../../../libs/mobile/orders/feature/src/components/order-detail-screen.tsx) reads `GET /api/admin/order-workspace/orders/{orderId}` online: number, customer, date, 1C number, comment, lines with quantity, adjustment and amount, total. Only a sync problem gets a status pill. Offline it says the order opens with the network.
- [OrdersWorkspace](../../../libs/mobile/orders/feature/src/components/orders-workspace.tsx) is what `/orders` shows: on a phone the lists open `/orders/[orderId]`, on a tablet the opened order stands next to the lists.

## Routes

| Route               | File                                              |
| ------------------- | ------------------------------------------------- |
| `/orders`           | `apps/mobile/src/app/(work)/orders/index.tsx`     |
| `/orders/[orderId]` | `apps/mobile/src/app/(work)/orders/[orderId].tsx` |

## Code structure

```text
libs/mobile/orders/
├── model/src/entities/  # order detail schema and mapping to kopecks
├── data-access/src/api/  # order read and useOrderDetail
└── feature/src/{components,hooks}/  # OrdersScreen, OrderDetailScreen, opening drafts and returned orders
```

## Tests

- `npx nx run mobile-orders-model:test`, `npx nx run mobile-orders-data-access:test` — mapping, online, offline and failed reads.
- `npx nx run mobile-orders-feature:test` — queue rows, opening an order and a draft, a returned order with a busy calculation, detail.
