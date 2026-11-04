# TS-002 — Совместимое восстановление и сохранение cart_v1

- **ID:** TS-002.
- **Covers:** SC-006, SC-007, SC-008, SC-009, SC-014, SC-030.
- **Depends on:** TS-001.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** unit + controlled storage integration.
- **Архитектурный базис:** [frontend design](../design/frontend.md), [API](../contracts/api-contract.md), [правила проверок](../../../../../standards/shared/testing-rules.md).

## Точные пути

- `libs/site/cart/model/src/lib/persistence/cart-persistence.ts`.
- `libs/site/cart/model/src/lib/persistence/cart-persistence.spec.ts`.
- `libs/site/cart/feature/src/lib/storage/cart-storage.ts`.
- `libs/site/cart/feature/src/lib/storage/cart-storage.spec.ts`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Pure decoder/serializer понимает legacy {lines:[{variantId,quantity,snapshot}]} под cart_v1; storage IO вынести в feature browser adapter.
- [x] Валидные legacy строки и snapshots сохранять. Проверить invalid JSON, wrong top-level shape, null→0 price legacy, fraction/over-limit quantity, duplicates и отсутствующий slug.
- [x] Partial recovery сохраняет допустимые строки в памяти, объясняет пропуски и ждёт явного подтверждения; источник не перезаписывается эффектом загрузки/рендера. Несовместимая duplicate группа не обрезается.
- [x] Read/write/remove failures возвращать как ограничение хранения, не exception в UI. Хранить только basket; имя/телефон/receipt не сериализовать.
- [x] Expose success cleanup result так, чтобы confirmed receipt не становился failed при remove exception. Origin migration не обещать для другого preview domain.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

cart-persistence.spec.ts проверяет legacy key/shape, частичный recovery, дубликаты, overflow и PII projection; codec Red — 23 behavioral failures. cart-storage.spec.ts: Red 6 fail / 2 pass → Green 8/8; read без rewrite, denied read/write/remove и explicit cleanup. Model regression: 88/88.

[Сводка, пути и команды](../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

Контролируемые legacy fixtures восстанавливаются без молчаливой потери/исправления данных; частичный исход требует подтверждения, storage exceptions управляемы.
