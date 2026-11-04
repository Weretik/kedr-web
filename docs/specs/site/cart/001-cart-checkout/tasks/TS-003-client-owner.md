# TS-003 — Один browser owner и сохранность draft при remount

- **ID:** TS-003.
- **Covers:** SC-001, SC-003, SC-009, SC-013, SC-014, SC-015, SC-027.
- **Depends on:** TS-001, TS-002.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** focused state / SSR-hydration integration.
- **Архитектурный базис:** [frontend design](../design/frontend.md), [API](../contracts/api-contract.md), [правила проверок](../../../../../standards/shared/testing-rules.md).

## Точные пути

- `libs/site/cart/feature/src/lib/state/cart-client-store.ts`.
- `libs/site/cart/feature/src/lib/state/cart-store.spec.ts`.
- `libs/site/cart/feature/src/lib/state/cart-hydration.spec.tsx`.
- `libs/site/cart/feature/src/lib/runtime/cart-provider.tsx`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Создавать document-scoped external store только в браузере; server snapshot детерминированный и без персональных данных. Не создавать server singleton.
- [x] Подписать provider через useSyncExternalStore; state, draft, errors и operation owner не зависят от locale layout instance. Повторное монтирование не повторяет чтение/очистку/POST.
- [x] Hydration начинает с restoring; только завершение storage read разрешает empty/count/submit. Partial acknowledgement gating сохраняется.
- [x] Разделить cart, contact draft, operation, receipt и UI state; hard reload восстанавливает только допустимую корзину. Поддержать общий immutable pending lock как контракт для TS-007.
- [x] Проверить provider unmount/remount и soft locale transitions с неполной формой и отложенным ответом; отсутствие server PII и hydration warning подтвердить focused test.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

cart-client-store.spec.ts: первоначальный Red → Green 17/17, затем regression 18/18 с reentrancy guard. browser-cart-store.spec.ts и cart-provider.spec.tsx / cart-provider.hydration.spec.tsx: Red 9 fail / 3 pass → Green 12/12. Подтверждены document lifetime, StrictMode read-once, neutral SSR/hydration, remount draft/pending и отсутствие PII storage.

[Сводка, пути и команды](../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

Основной, компактный header, drawer и checkout могут подписаться на один browser owner; remount не теряет draft и не запускает повторную мутацию.

## Архитектурный аудит — 2026-11-04

AF-004 verified: DOM focus/visibility/viewport вынесены в platform adapter; public API и единый atomic owner сохранены. Valid Red3 focus failures при18 прежних pass → owner21 + adapter6 Green27/27; types/lint passed. [Полный scoped report и команды](../code-audit/audit.md).
