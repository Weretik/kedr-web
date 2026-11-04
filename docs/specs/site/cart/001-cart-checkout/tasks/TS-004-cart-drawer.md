# TS-004 — Представления и контроллеры корзины из шапки

- **ID:** TS-004.
- **Covers:** SC-003, SC-004, SC-005, SC-012, SC-022, SC-024.
- **Depends on:** TS-003, EN-002.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** component.
- **Архитектурный базис:** [frontend design](../design/frontend.md), [API](../contracts/api-contract.md), [правила проверок](../../../../../standards/shared/testing-rules.md).

## Точные пути

- `libs/site/cart/ui/src/lib/cart/cart-drawer.tsx`.
- `libs/site/cart/ui/src/lib/cart/cart-line.tsx`.
- `libs/site/cart/ui/src/lib/cart/cart-quantity.tsx`.
- `libs/site/cart/ui/src/lib/cart/cart-drawer.spec.tsx`.
- `libs/site/cart/ui/src/lib/i18n/cart-copy.ts`.
- `libs/site/cart/feature/src/lib/cart/cart-header-action.tsx`.
- `libs/site/cart/feature/src/lib/cart/cart-drawer-controller.tsx`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Использовать существующий controlled Sheet, props/callbacks и model types. Client controller читает owner, UI не импортирует data-access/actions.
- [x] Показать реальный header count/сумму, строки, unit/row price, quantity, delete, empty/recovery/storage notices и checkout action. Никаких placeholder product success.
- [x] Оформление ведёт на локализованный /checkout и закрывает drawer; это Link rel=nofollow. Продолжить покупки закрывает Sheet, не стирая корзину.
- [x] Проверить focus trap/return, Escape/backdrop, labels, long lists с доступным footer/CTA и 44px touch targets; UK/RU и tokens без изменений shell дизайна.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

UI Red: 25 behavioral failures при работающем harness. Финальный UI Green/regression 31/31 в четырёх spec; cart-drawer.spec.tsx — 8: строки/итог, edit/delete, loading/empty/recovery/pending, broken image и Escape/return focus. Controllers подключены к общему owner; runtime composition проверяет две кнопки и один drawer.

[Сводка, пути и команды](../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

Drawer и оба cart action presentation используют shared data через callbacks, keyboard закрытие корректно, пустая корзина не предлагает отправку.

## Архитектурный аудит — 2026-11-04

AF-004/005 verified: независимый focus adapter и feature-owned productHref; CartLine получает готовый destination. Focus27, UI row/drawer/checkout27, mapper11 и runtime2 passed. CSS/720container/static service links не менялись. [Полный scoped report и команды](../code-audit/audit.md).
