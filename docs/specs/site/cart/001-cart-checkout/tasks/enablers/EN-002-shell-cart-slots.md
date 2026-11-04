# EN-002 — Generic cart slots существующего SiteShell

- **ID:** EN-002.
- **Enables:** SC-003, SC-022, SC-027.
- **Depends on:** нет.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** focused component/configuration.
- **Архитектурный базис:** [frontend design](../../design/frontend.md), [API](../../contracts/api-contract.md), [правила проверок](../../../../../../standards/shared/testing-rules.md).

## Точные пути

- `libs/site/core/shell/src/lib/site-shell.tsx`.
- `libs/site/core/shell/src/lib/header/site-header.tsx`.
- `libs/site/core/shell/src/lib/header/bars/main-bar.tsx`.
- `libs/site/core/shell/src/lib/header/bars/category-bar.tsx`.
- `libs/site/core/shell/src/lib/header/header-actions.tsx`.
- `libs/site/core/shell/src/lib/header/compact-actions.tsx`.
- `libs/site/core/shell/src/lib/header/cart-slots.spec.tsx`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Добавить optional cartAction/compactCartAction ReactNode props, протянуть их до двух action surfaces. Не импортировать cart domain, store или order action в core/shell.
- [x] При отсутствии slot сохранить нынешнюю checkout link fallback; при наличии заменить только соответствующее cart действие. Кабинет, поиск, язык, тема, footer и responsive shell роли не менять.
- [x] Component fixture с произвольным ReactNode доказывает обе точки injection без cart dependency; отдельно проверить imports, т.к. type:shell не покрыт одним type:core guard.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

SiteShell/Header/MainBar/CategoryBar передают два generic ReactNode slots. Core не импортирует cart. cart-slots.spec.tsx проверяет обе поверхности, частичный fallback, UK/RU и nofollow checkout navigation; исходный behavioral Red — четыре slot assertions. Финальные результаты shell и команды собраны в implementation evidence.

[Сводка, пути и команды](../../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

Обе поверхности shell принимают внешние cart nodes без domain import, fallback сохранён; ответственность shell ограничена каркасом.

## Архитектурный аудит — 2026-11-04

AF-006 verified: Site type:shell теперь fenced от domain dependencies в реальном ESLint и validator, без cart imports в source shell. Boundary Red6fail/32pass → Green38/38, real ESLint2 allowed +5 rejected probes. Generic slots сохранены. [Полный scoped report и команды](../../code-audit/audit.md).
