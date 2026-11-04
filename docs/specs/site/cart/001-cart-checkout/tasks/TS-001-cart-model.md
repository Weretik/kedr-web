# TS-001 — Чистая модель корзины и валидация заказа

- **ID:** TS-001.
- **Covers:** SC-001, SC-002, SC-003, SC-004, SC-010, SC-011, SC-021.
- **Depends on:** EN-001.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** unit.
- **Архитектурный базис:** [frontend design](../design/frontend.md), [API](../contracts/api-contract.md), [правила проверок](../../../../../standards/shared/testing-rules.md).

## Точные пути

- `libs/site/cart/model/src/lib/cart/cart-reducer.ts`.
- `libs/site/cart/model/src/lib/cart/cart-totals.ts`.
- `libs/site/cart/model/src/lib/cart/quantity.ts`.
- `libs/site/cart/model/src/lib/checkout/checkout-validation.ts`.
- `libs/site/cart/model/src/lib/cart/cart-reducer.spec.ts`.
- `libs/site/cart/model/src/lib/cart/cart-totals.spec.ts`.
- `libs/site/cart/model/src/lib/cart/quantity.spec.ts`.
- `libs/site/cart/model/src/lib/checkout/checkout-validation.spec.ts`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Описать собственные модели строк, purchase input, draft, command и result; generated DTO не экспортировать в UI.
- [x] Реализовать объединение по ID с сохранением старого snapshot, сумму количеств/строк/товаров, positive finite price и независимость допуска от выдуманных сведений об остатке.
- [x] Количество 1..1000; overflow при повторном добавлении отклонить без изменения принятой строки. Отдельное удаление, без неявной zero-delete и округления дробей.
- [x] Имя trim + 3..30, полная UA phone mask/typing/paste и max20. Форматирование UAH единообразно; не подменять цену в отправляемом snapshot.
- [x] Проверить граничные числа, NaN/Infinity, пустую команду, большие допустимые количества и десятичные цены; не вводить новый minimum order/pack rule.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

Чистые quantity/reducer/totals/checkout validation проверены вместе с codec: model 88 passed / 5 spec. Исходный Red модели — 48 behavioral failures; допустимые цены/количества, merge с сохранением snapshot, overflow, имя/телефон и command projection подтверждены. Refactor: отдельные cart/checkout/persistence роли, без I/O.

[Сводка, пути и команды](../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

Доменные unit assertions доказывают все инварианты без React, browser storage и HTTP.
