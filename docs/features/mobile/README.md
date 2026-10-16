# Фічі Mobile React Native

[Expo Router](../../../apps/mobile/src/app/_layout.tsx) підключає екрани з `libs/mobile/*/feature`.

| Область | Фічі                                                             | Вхід                                                                    |
| ------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Основа  | [Оболонка й навігація](shell.md)                                 | `_layout.tsx`, `(tabs)/_layout.tsx`                                     |
| Каталог | [Перегляд, фільтри, деталі й товари без фото](catalog/README.md) | `(tabs)/catalog.tsx`, `product/[productSlug].tsx`, `(tabs)/profile.tsx` |
| Продаж  | [Кошик, клієнти й замовлення](sales/README.md)                   | `(tabs)/cart.tsx`, `(tabs)/orders.tsx`, `orders/[orderId].tsx`          |

`index` поки показує placeholder. Вкладка `profile` фактично відкриває товари без фото, а не завершений профіль користувача.
