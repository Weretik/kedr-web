# EN-001 — Nx-проекты cart и узкий test harness

- **ID:** EN-001.
- **Enables:** SC-001, SC-002, SC-003, SC-004, SC-005, SC-006, SC-007, SC-008, SC-009, SC-010, SC-011, SC-012, SC-013, SC-014, SC-015, SC-016, SC-017, SC-018, SC-019, SC-020, SC-021, SC-022, SC-023, SC-024, SC-025, SC-026, SC-027, SC-028, SC-029, SC-030.
- **Depends on:** нет.
- **Статус:** implemented, automated/source verified — 2026-11-04.
- **Уровень:** генерация и configuration checks.
- **Архитектурный базис:** [frontend design](../../design/frontend.md), [API](../../contracts/api-contract.md), [правила проверок](../../../../../../standards/shared/testing-rules.md).

## Точные пути

- `libs/site/cart/{model,data-access,ui,seo,feature}/project.json`.
- `libs/site/cart/{model,data-access,ui,seo,feature}/vite.config.mts`.
- `tsconfig.base.json`.
- `package.json`.

Фактические владельцы созданы; итоговое дерево и точные test paths приведены в feature card и implementation evidence.

## Work

- [x] Создать пять библиотек Nx-генератором; SEO имеет type:util, остальные — соответствующий model/data-access/ui/feature; scope:site и domain:cart. Сохранить существующие изменения manifest/config.
- [x] Пример проверенной по установленной schema команды: npx nx g @nx/react:library libs/site/cart/model --name=site-cart-model --bundler=none --unitTestRunner=vitest --tags=scope:site,domain:cart,type:model. Выполнено для всех пяти путей/имён/tags при реализации 2026-11-04.
- [x] Подтвердить public aliases @site/cart/<layer>, отсутствие generator demo UI и server-only contamination в model/UI. Конфигурацию runner брать из ближайших product libraries, с resolve.tsconfigPaths и current executor conventions.
- [x] Подтвердить inferred vite:test, typecheck/lint targets по project config и scoped nx show project; проверить точные команды до business tasks. Синхронизировать site test/typecheck scripts для новых projects, не запускать run-many.
- [x] Нужные отсутствующие UI primitives добавлять shadcn generator из libs/site/shared/ui только при появлении конкретного использования; существующие Button/Sheet переиспользовать.
- [x] Проверить изменённые файлы на одну понятную ответственность; разделить независимые store/transport/mapping/UI роли и переполненные каталоги по границам проекта. Небольшой цельный файл не делить по одному размеру.

## Evidence

Генератор создал model/data-access/ui/seo/feature с scope:site/domain:cart и type:model/data-access/ui/util/feature. Aliases, lint/typecheck/vite:test и пакетный test:site зарегистрированы; лишний второй Vitest plugin от генератора удалён, ближайшие product configs сохранены как образец. nx show project site-cart-model --json подтвердил inferred targets. Business Red для scaffolding неприменим; заменён config/source assertions. Новые зависимости и primitives не понадобились.

[Сводка, пути и команды](../../verification/implementation.md). Исходный Red означает behavioral assertion failure, не ошибку инфраструктуры. Финальный scope — unit/component/server/source; build, HTTP, browser/visual/manual, E2E и реальный заказ не запускались.

## Checkpoint

Пять независимых cart projects и их публичные aliases существуют, теги согласованы, focused test harness исполняется; smoke не объявлен доказательством SC.

## Архитектурный аудит — 2026-11-04

AF-003 verified: cached lint inputs всех5cart projects включают реальный rootCJS и tools/eslint-rules/**/*; actual Nx resolved targets5/5, остальные JSON fields сохранены. Config-only change, искусственный Red не создавался. [Полный scoped report и команды](../../code-audit/audit.md).
