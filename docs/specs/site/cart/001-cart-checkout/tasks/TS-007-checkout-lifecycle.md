# TS-007 — Жизненный цикл отправки и подтверждения в общем owner

- **ID:** TS-007.
- **Covers:** SC-013, SC-015, SC-016, SC-017, SC-018, SC-019, SC-020, SC-029, SC-030.
- **Depends on:** TS-003, TS-005, TS-006.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** focused integration.
- **Архитектурный базис:** [frontend design](../design/frontend.md), [API](../contracts/api-contract.md), [правила проверок](../../../../../standards/shared/testing-rules.md).

## Точные пути

- `libs/site/cart/feature/src/lib/state/checkout-operation.ts`.
- `libs/site/cart/feature/src/lib/checkout/checkout-controller.tsx`.
- `libs/site/cart/feature/src/lib/checkout/checkout-lifecycle.spec.tsx`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Внедрить action reference от server composition, создавать immutable command только по явному submit, фиксировать single pending на document owner.
- [x] Блокировать click/Enter duplicates и изменения cart/contacts; поддержать theme/soft locale remount без повторного запроса или потери snapshot.
- [x] Created UUID сохраняет accepted summary/receipt до очистки, затем очищает cart/draft и пытается удалить storage. При cleanup failure оставить подтверждение и отдельное notice.
- [x] 400/409 сохраняют draft/cart и разрешают явное исправление; uncertain сохраняет данные и объясняет возможное создание, без автоматического повторения.
- [x] Проверить поздний ответ после remount, повторные submit events, валидный/невалидный success, сохранность неизвестных field errors и отсутствие PII в persistent state.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

cart-client-store.spec.ts — 18/18: одна immutable pending команда, блокировки редактирования/reentrant submit, valid UUID receipt, clear-after-success, validation/conflict/uncertain/throw без retry, explicit corrected attempt и remove-failed receipt. Provider12 подтверждает сохранение pending/draft при remount; runtime2 подтверждает общий submit/receipt. AF-001 исправлен и повторно проверен.

[Сводка, пути и команды](../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

Один подтверждённый заказ очищает basket ровно по успеху, все отказы сохраняют ввод, ни один исход не запускает автоматический новый POST.
