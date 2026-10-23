# Mobile React Native features

[Expo Router](../../../apps/mobile/src/app/_layout.tsx) connects screens from `libs/mobile/*/feature`.

| Area       | Features                                                                     | Entry points                                                            |
| ---------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Foundation | [Shell and navigation](shell.md)                                             | `_layout.tsx`, `(tabs)/_layout.tsx`                                     |
| Catalog    | [Browsing, filters, details, and products without photos](catalog/README.md) | `(tabs)/catalog.tsx`, `product/[productSlug].tsx`, `(tabs)/profile.tsx` |
| Sales      | [Cart, customers, and orders](sales/README.md)                               | `(tabs)/cart.tsx`, `(tabs)/orders.tsx`, `orders/[orderId].tsx`          |

`index` currently displays a placeholder. The `profile` tab opens the products-without-photos screen rather than a completed user profile.
