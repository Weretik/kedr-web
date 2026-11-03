# TS-006 — Серверная страница, тонкий route и sitemap

- **Status:** completed для согласованного видеоэтапа, 2026-11-03.
- **Covers:** SC-001, SC-010, SC-012, SC-016, SC-017, SC-018.
- **Depends on:** TS-002, TS-003, TS-004, TS-005.
- **Test level:** server-markup/component + source integration + typecheck.
- **Architecture baseline:** [frontend.md](../design/frontend.md), [testing rules](../../../../../standards/shared/testing-rules.md); действующие public APIs и tags сохраняются.

## Exact paths

- `apps/site/src/app/[locale]/(content)/galleria/page.tsx`
- `libs/site/content/feature/src/lib/gallery-page.tsx`
- `libs/site/content/feature/src/lib/gallery-page.spec.tsx`
- `libs/site/content/feature/src/lib/content-sitemap.ts`
- `libs/site/content/feature/src/lib/content-sitemap.spec.ts`
- `libs/site/content/feature/src/index.ts`

## Work

- [x] Собрать GalleryPage на сервере: locale source/dictionary, server header, island, noscript-остаток и JsonLd; второй main не добавлять.
- [x] Добавить thin route с async params и существующей locale validation; не менять slug или shell navigation.
- [x] Добавить один gallery sitemap descriptor, проверить обе locale entries, отсутствие даты/дублей и сохранение прежних записей.
- [x] Проверить server markup: H1/названия/native href/JSON-LD, нет iframe до выбора; основное содержание не появляется только после effect.
- [x] SC-018 использует существующую locale/404 infrastructure: source review её вызова и site:typecheck, без выдуманного HTTP evidence.
- [x] Проверить только затронутые файлы по ответственности: решение сохранить/разделить записать здесь, не выполнять общий аудит.

## Evidence

Red 7 new failures при7 прежних sitemap passes; Green 14/14:6 page +8 sitemap. Next typegen+app tsc exit0.

Оба route, HTML/noscript/JSON-LD и один sitemap descriptor интегрированы. Locale404 использует existing validation; реальный HTTP не заявлен.

- Команда: `node --max-old-space-size=512 node_modules/vitest/vitest.mjs run --maxWorkers=1 --no-file-parallelism --config libs/site/content/feature/vite.config.mts src/lib/gallery-page.spec.tsx src/lib/content-sitemap.spec.ts`.
- Refactor/structure: роли сохранены, фактическая карта сверена с планом.
- Regression: результаты актуальны для соответствующих изменений; whitespace/docs-only правки не повторяли весь набор.
- Browser/manual/visual/E2E, live HTTP/YouTube и production build не выполнялись.

## Checkpoint

Source/feature/SEO связаны через public API; server markup и sitemap проверены. Отдельный npx nx run site:typecheck покрывает новый Next route. Реальный HTTP/build не заявлен.
