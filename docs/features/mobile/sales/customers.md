# Mobile Customer Selection

**Scenario:** shared customer search and selection for [checkout](cart.md) and [order filtering](orders.md); there is no separate route.

- [customers.api](../../../../libs/mobile/customers/data-access/src/api/customers.api.ts) reads `GET /api/admin/customers`; runtime contract and mapper produce the [Customer model](../../../../libs/mobile/customers/model/src/lib/customer.ts).
- [CustomerSelectorSheet](../../../../libs/mobile/customers/ui/src/lib/customer-selector-sheet.tsx) and the list render the selection. The cart keeps the selected customer in the [checkout controller](../../../../libs/mobile/cart/feature/src/hooks/use-cart-checkout-controller.ts) form; orders keep it in the [filter hook](../../../../libs/mobile/orders/feature/src/hooks/use-order-customer-filter.ts) and Redux session state.

## Architecture

```mermaid
flowchart LR
API["customers.api"] --> Model["Customer model"]
Model --> Sheet["CustomerSelectorSheet"]
Sheet --> Cart["Checkout controller"]
Sheet --> Orders["Order customer filter"]
Orders --> Session["Redux session state"]
```

## Code structure

Actual entry points and primary feature files (other files in these directories are omitted):

```text
libs/mobile/cart/
└── feature/src/hooks/use-cart-checkout-controller.ts  # screen state and actions

libs/mobile/customers/
├── data-access/src/api/customers.api.ts  # API request
├── model/src/lib/customer.ts  # domain model
└── ui/src/lib/customer-selector-sheet.tsx  # UI component

libs/mobile/orders/
└── feature/src/hooks/use-order-customer-filter.ts  # screen state and actions
```
