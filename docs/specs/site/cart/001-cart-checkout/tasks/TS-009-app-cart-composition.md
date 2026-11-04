# TS-009 — Подключение общего runtime к shell, checkout и покупке

- **ID:** TS-009.
- **Covers:** SC-001, SC-002, SC-003, SC-013, SC-015, SC-022, SC-023, SC-024, SC-027.
- **Depends on:** EN-002, EN-003, TS-004, TS-007, TS-008.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** focused composition integration + scoped types/boundaries.
- **Архитектурный базис:** [frontend design](../design/frontend.md), [API](../contracts/api-contract.md), [правила проверок](../../../../../standards/shared/testing-rules.md).

## Точные пути

- `apps/site/src/app/[locale]/layout.tsx`.
- `apps/site/src/app/[locale]/product/[slug]/page.tsx`.
- `libs/site/cart/feature/src/lib/runtime/cart-runtime.tsx`.
- `libs/site/cart/feature/src/lib/runtime/cart-runtime.spec.tsx`.
- `libs/site/cart/feature/src/lib/purchase/render-cart-purchase-action.tsx`.
- `libs/site/cart/feature/src/lib/purchase/cart-purchase-controller.tsx`.
- `libs/site/cart/feature/src/lib/purchase/cart-purchase.spec.tsx`.
- `docs/specs/site/product/001-product-details/tasks/TS-005-cart-integration.md`.
- `docs/specs/site/product/001-product-details/tasks/enablers/EN-002-cart-prerequisite.md`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] В locale app layout собрать один CartRuntime под ThemeProvider, server action prop, SiteShell с основным/compact cart nodes и одним drawer. Существующий server catalog/shell/Organization не переводить в client bundle.
- [x] App product route передаёт публичный server renderer в ProductPage; cart adapter создаёт клиентский purchase binding из сериализуемого seed. Ни feature→feature, ни shell→domain imports не появляются.
- [x] На доступном priced product реальное действие обновляет тот же store/persistence/count; неизвестная цена/наличие сохраняют текущий manager policy. Проверить исходный product page без второго owner.
- [x] Координировать product:TS-005 один раз в этой интеграции: заменить прежний planned ProductCartBoundary подход описанным server injection, приложить то же фактическое evidence. Product:EN-002 закрывать лишь после доказанного foundation; существующие ID и read-stage evidence сохранить.
- [x] В app composition тесте пройти add→header/drawer→checkout→controlled response; remount/soft locale не дублирует store или pending. Подтвердить structural public signatures и imports; общий graph/build не запускать по умолчанию.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

cart-runtime.spec.tsx: behavioral Red при отключённом provider (restoring не завершался) → Green 2/2. Доступный descriptor добавляет реальный товар, обе кнопки получают один count, drawer/checkout разделяют quantity, две отправки дают один action call; фактический UUID подтверждает очистку cart_v1. Непокупаемые descriptors не создают island. Product15/shell focused checks и типы подтвердили серверный callback/generic slots.

[Сводка, пути и команды](../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Дополнительная regression

AF-002/P3: accepted → rejected add больше не сохраняет прежнее Added-подтверждение. cart-purchase-controller.spec.tsx 1/1 passed после valid Red; количество/count остаются прежними. Это focused component evidence, без browser/live заказа.

## Checkpoint

Реальные producer и consumers связаны одним cart owner, покупка больше не заглушка, product dependency закрыта фактическим evidence без циклических импортов.

## Архитектурный аудит — 2026-11-04

AF-005 verified: один documented cart-feature→product-model flow только для canonical path policy в view mapper. Runtime2 подтверждает сохранение общего product/header/drawer/checkout поведения. Pure architecture move, искусственный Red не создавался. [Полный scoped report и команды](../code-audit/audit.md).
