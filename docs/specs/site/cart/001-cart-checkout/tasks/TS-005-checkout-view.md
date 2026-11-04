# TS-005 — Двухколоночный checkout и локальные состояния формы

- **ID:** TS-005.
- **Covers:** SC-004, SC-005, SC-010, SC-011, SC-012, SC-021, SC-023, SC-024.
- **Depends on:** TS-001, TS-003.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** component + source/token verification.
- **Архитектурный базис:** [frontend design](../design/frontend.md), [API](../contracts/api-contract.md), [правила проверок](../../../../../standards/shared/testing-rules.md).

## Точные пути

- `libs/site/cart/ui/src/lib/checkout/checkout-view.tsx`.
- `libs/site/cart/ui/src/lib/checkout/checkout-contacts.tsx`.
- `libs/site/cart/ui/src/lib/checkout/checkout-summary.tsx`.
- `libs/site/cart/ui/src/lib/checkout/order-confirmation.tsx`.
- `libs/site/cart/ui/src/lib/checkout/checkout-view.spec.tsx`.
- `libs/site/cart/feature/src/lib/checkout/checkout-controller.tsx`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Перенести принятое направление design/visual.md на реальные строки и props; ширина контейнера >=720: товары слева, контакты/итог справа; ниже одна колонка.
- [x] Полная адаптация 320/390/719/720/736/1024/1440, перенос длинного title/UUID и totals. Shell использует собственные существующие breakpoints.
- [x] Только имя и телефон; локальная валидация/маска, server field error presentation, goods-only total и существующие информационные ссылки.
- [x] Restoring, empty, recovery acknowledgement, storage limitation, pending, rejected/uncertain и receipt — отдельные mapped states. Реальная отправка подключается TS-007; не использовать demo transport как production behavior.
- [x] Переиспользовать шрифты, tokens, primitives, image pipeline и neutral missing-photo fallback; без внешних CDN и демонстрационных UUID/цен в рабочем UI.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

checkout-view.spec.tsx — 16 passed, общий UI 31/31. Проверены UK/RU, contacts callbacks/validation/plaintext errors, goods-only total, loading/empty/recovery/pending/receipt/storage cleanup. @container checkout (min-width:720px) размещает товары слева и контакты/итог справа; ниже одна колонка. Темы/ширины подтверждены source/token review, не browser visual.

[Сводка, пути и команды](../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

Представления соответствуют принятой композиции, обеим темам/локалям и всем данным состояний; форма не содержит неподдержанных order fields.

## Архитектурный аудит — 2026-11-04

AF-005 verified: BasketProps.lines теперь CartLineView[] с required productHref; checkout и drawer используют общий feature mapper, UI не владеет dynamic product URL. UI row/drawer/checkout27, mapper11 и runtime2; app/feature.spec/UI.spec types и lint passed. [Полный scoped report и команды](../code-audit/audit.md).
