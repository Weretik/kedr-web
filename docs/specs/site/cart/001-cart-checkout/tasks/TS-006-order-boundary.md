# TS-006 — Серверная контрактная граница createQuickOrder

- **ID:** TS-006.
- **Covers:** SC-015, SC-016, SC-017, SC-018, SC-019, SC-020, SC-028, SC-029.
- **Depends on:** EN-001, TS-001.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** unit + focused transport/action integration.
- **Архитектурный базис:** [frontend design](../design/frontend.md), [API](../contracts/api-contract.md), [правила проверок](../../../../../standards/shared/testing-rules.md).

## Точные пути

- `libs/site/shared/api-client/src/lib/site-order-api.ts`.
- `libs/site/shared/api-client/src/lib/site-order-api.spec.ts`.
- `libs/site/shared/api-client/src/index.ts`.
- `libs/site/cart/data-access/src/lib/contracts/order-contracts.ts`.
- `libs/site/cart/data-access/src/lib/contracts/order-response.ts`.
- `libs/site/cart/data-access/src/lib/orders/create-quick-order.ts`.
- `libs/site/cart/data-access/src/lib/orders/create-quick-order.spec.ts`.
- `libs/site/cart/feature/src/lib/actions/submit-quick-order.ts`.
- `libs/site/cart/feature/src/lib/actions/submit-quick-order.spec.ts`.
- `docs/architecture/site/platform/rendering-and-caching.md`.
- `docs/architecture/site/structure/modules.md`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Добавить в shared API client узкий server-only siteApiCreateQuickOrder с фиксированным POST /api/orders на siteConfig.apiUrl, JSON, no-store, timeout convention и без retry/session forwarding. Нынешний typed catalog GET не менять по смыслу.
- [x] В cart/data-access держать generated aliases приватно, валидировать input/unknown response и маппить только подтверждённые поля; ответ успеха — только корректный UUID.
- [x] Server Function принимает недоверенный ввод и возвращает сериализуемый доменный result. Использовать существующую anonymous security операции, не добавлять auth gate.
- [x] Безопасно распознанные 400 fields + global fallback, 409 messages, неопределённость network/timeout/5xx/malformed success. Никаких invented validation DTO, stock/price conclusions или raw stack/HTML.
- [x] Проверить request shape/string productId, нулевой HTTP call при input rejection, exactly one controlled POST/no auto retry, no-store и сохранность catalog GET regression; обновить архитектурную формулировку этого narrow mutation extension.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

shared API: Red 10 assertions → Green 14/14 (новый POST10 + сохранённый catalog GET4). cart/data-access: Red 24 fail / 8 pass → Green 32/32. submit-quick-order.spec.ts: behavioral Red → Green 7/7. Моки покрывают exact URL/body, omit credentials, no-store, timeout/no retry, validation400/conflict409/unknown and malformed success. Snapshot/generated не изменялись.

[Сводка, пути и команды](../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

Controlled boundary tests доказывают mapping и все исходы операции без реальных заказов; transport не импортируется клиентским UI и не кеширует данные.
