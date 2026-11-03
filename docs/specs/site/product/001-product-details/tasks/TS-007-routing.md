# TS-007 — Product route и серверная композиция

- **Covers:** SC-001, SC-015, SC-018–SC-024, SC-027–SC-028.
- **Depends on:** TS-003, TS-004, TS-006, TS-008; action adapter TS-005 подключается после EN-002.
- **Status:** implemented 4A; routing/SSR verified, live HTTP unrun.
- **Exact paths:** `apps/site/src/app/[locale]/product/[slug]/page.tsx`; `libs/site/product/feature/src/lib/{detail/product-page.tsx,detail/product-crumbs.ts,routing/product-routing.ts}`; `detail/product-page.spec.tsx`, `routing/product-routing.spec.ts`.
- **Test level:** focused integration HTTP-outcome selection/page composition; actual status smoke отдельно.
- **Baseline:** [Next design](../design/nextjs.md), thin route/category example; разрешённый catalog-model flow из EN-001.

## Work

- [x] Thin route ожидает params, валидирует locale и вызывает feature metadata/static params/page.
- [x] Разрешить current/moved/category redirect/not-found/unavailable до streaming; `instant=false` как у category, без page loading boundary, превращающей результат в200.
- [x] Построить один breadcrumb trail с существующей catalog root policy, передать его UI и SEO; category redirect строить безопасно.
- [x] Получить минимум один реальный seed из источника TS-008, подтвердить detail; не подменять пустую seed выдачу фиктивным товаром.
- [x] Собрать server view/JSON-LD и leaves; сохранить existing catalog product links и legacy redirect, не переписывая весь next.config.
- [x] Проверить язык того же SKU и existing prefix-switch/серверный canonical redirect; не считать slug переводом имени.
- [ ] После EN-002 подключить TS-005; до этого route может разрабатываться в ветке, но не выпускаться с ложной покупкой.
- [x] Сверить thin route, composition, crumbs и routing responsibilities с планом.

## Evidence

Root: valid Red — former slug возвращал product, unavailable становился404. Routing/server composition run — exit0,2 files/13 tests; после финальной совместимости типизированного теста повторена server composition3/3. Thin route uses params Promise and instant=false; реальный bounded seed без placeholder. Структура peer-reviewed без actionable issues. Live404/308/500/streaming и build unrun. Cart adapter ожидает TS-005.

Подробности: [implementation evidence](../verification/implementation.md).

## Audit follow-up — 2026-11-03

AF-001: feature mapping делегирует category destination public `catalog.categoryPath`, затем локализует готовый путь. Fresh category mapping3 + existing SSR3 — exit0,6 tests; независимая post-fix сверка подтвердила границу, types/lint/boundaries pass. [Audit evidence](../code-audit/audit.md).

## Checkpoint

Прямые и каталоговые ссылки показывают реальный товар, canonical/404/308/error resolution правильны; main data и SEO — server, route остаётся thin.
