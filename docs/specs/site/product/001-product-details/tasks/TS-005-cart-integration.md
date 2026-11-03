# TS-005 — Quantity и подключение общей корзины

- **Covers:** SC-003, SC-011–SC-013, SC-027.
- **Depends on:** EN-002, TS-002, TS-004.
- **Status:** blocked by EN-002.
- **Exact paths:** `libs/site/product/feature/src/lib/purchase/product-cart-boundary.tsx`, `product-cart-boundary.spec.tsx`; `libs/site/product/ui/src/lib/purchase/product-quantity-control.tsx`; разрешённые cart public APIs и app provider/header paths из завершённой EN-002.
- **Test level:** focused integration на product↔cart boundary; не новый full checkout E2E.
- **Baseline:** [contract](../contracts/api-contract.md), R-003/R-004; feature→feature запрещён.

## Work

- [ ] Сопоставить реальный SKU/quantity с подтверждённым cart interface, не придумывая сетевую операцию.
- [ ] Реализовать positive integer control с policy cart owner; pack не меняет step, max99 не переносить.
- [ ] Один submit одновременно, успех/общий count только после принятия, rejection сохраняет quantity и допускает retry.
- [ ] Использовать готовые shared persistence/destination/header count; не сохранять новую product-local корзину.
- [ ] Проверить отсутствие cart/session в shared loader/metadata; подключить action slot к ProductPage.
- [ ] Сверить ответственность adapter/quantity control; product UI не импортирует cart domain.

## Evidence

Не реализовано: EN-002 не снята. Disabled controls и positive-quantity unit helper не являются реальной cart integration и не доказывают SC-011–SC-013. Нет invented cart API/storage или checkout. Возобновить после producer contract/evidence.

Подробности: [implementation evidence](../verification/implementation.md).

## Checkpoint

SC-011–SC-013 работают через общий cart owner, count совпадает с header и рабочей корзиной, ошибки правдивы. Без этого полная карточка не объявляется поставленной.
