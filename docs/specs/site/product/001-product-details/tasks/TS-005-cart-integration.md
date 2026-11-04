# TS-005 — Quantity и подключение общей корзины

- **Covers:** SC-003, SC-011–SC-013, SC-027.
- **Depends on:** EN-002, TS-002, TS-004.
- **Status:** implemented, automated/source verified — 2026-11-04 via cart TS-009.
- **Exact paths:** product/feature/src/lib/detail/product-purchase-descriptor.ts + .spec.ts; product-page.tsx + .spec.tsx; apps/site/src/app/[locale]/product/[slug]/page.tsx; cart/feature/src/lib/purchase/{render-cart-purchase-action,cart-purchase-controller}.tsx; cart/ui/src/lib/purchase/cart-purchase-control.tsx + .spec.tsx; cart/feature/src/lib/runtime/cart-runtime.spec.tsx.
- **Test level:** focused integration на product↔cart boundary; не новый full checkout E2E.
- **Baseline:** [contract](../contracts/api-contract.md), R-003/R-004; feature→feature запрещён.

## Work

- [x] Сопоставить реальный SKU/quantity с подтверждённым cart interface, не придумывая сетевую операцию.
- [x] Реализовать positive integer control с policy cart owner; pack не меняет step, max99 не переносить.
- [x] Один submit одновременно, успех/общий count только после принятия, rejection сохраняет quantity и допускает retry.
- [x] Использовать готовые shared persistence/destination/header count; не сохранять новую product-local корзину.
- [x] Проверить отсутствие cart/session в shared loader/metadata; подключить action slot к ProductPage.
- [x] Сверить ответственность adapter/quantity control; product UI не импортирует cart domain.

## Evidence

Реализовано через общий cart owner, без product-local persistence или feature→feature imports. ProductPage выполняет injected callback на сервере после normalization; клиент получает descriptor. Integer1–1000 control принадлежит cart UI; merge/add rejection не показывает ложный успех. Доступность/known price проверяются и renderer, и model. Оба header consumers, drawer и checkout разделяют один owner.

Product descriptor/page15, cart purchase UI4, model reducer/quantity в model88, owner18 и runtime composition2 passed. Исходный behavioral Red handoff и runtime, Green и regression зафиксированы в [cart evidence](../../../cart/001-cart-checkout/verification/implementation.md). Pending/denied/overflow/explicit retry покрыты model/owner и component/source проверками; browser/live/build не запускались.

## Дополнительная regression

cart-purchase-controller.spec.tsx 1/1 passed: после accepted add отклонённая повторная попытка сбрасывает старый success feedback и сохраняет quantity/count. AF-002/P3 закрыта; valid Red/Green — в cart evidence.

## Checkpoint

SC-011–SC-013 работают через общий cart owner, count совпадает с header и рабочей корзиной, ошибки правдивы. Без этого полная карточка не объявляется поставленной.
