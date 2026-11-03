# Проверка wholesale — результаты

**Дата:** 2026-11-03. **Статус:** implementation и architecture audit complete в automated/source scope. Production release не выполнялся.

## Выполненные проверки

Для Nx использованы NX_DAEMON=false, NX_ISOLATE_PLUGINS=false, NX_NO_CLOUD=true; в статических выводах также NX_TUI=false.

| Область                 | Точная команда                                                                                                                       | Результат                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| Catalog compact/default | npx nx run site-catalog-ui:vite:test -- --run src/lib/category-cards/category-cards.spec.tsx                                         | exit0,3/3                              |
| Wholesale UI            | npx nx run site-content-ui:vite:test -- --run wholesale                                                                              | exit0,8/8                              |
| Wholesale SEO           | node node_modules/nx/dist/bin/nx.js run site-content-seo:vite:test --output-style=static -- --run wholesale                          | exit0,2files/7 tests                   |
| Page/sitemap            | node node_modules/nx/dist/bin/nx.js run site-content-feature:vite:test --output-style=static -- --run wholesale-page content-sitemap | exit0,2files/18 tests                  |
| Boundary fixtures       | node --test tools/architecture/check-project-boundaries.spec.mjs                                                                     | exit0,22/22                            |
| Actual graph            | node tools/architecture/check-project-boundaries.mjs                                                                                 | exit0,103 проектов после новых imports |
| Site types              | node node_modules/nx/dist/bin/nx.js run site:typecheck --output-style=static                                                         | exit0; next typegen + tsc passed       |

Итого36 focused unit/component/integration tests;22 policy fixtures отдельно. Это не весь suite и не36 новых тестов: included regression сохраняет прежние sitemap/catalog defaults. Все перечисленные final task runs uncached по полученным выводам.

Red/evidence каждого этапа записаны в [задачах](../tasks/README.md): compact2 expected fail, UI8, SEO4 (3gate passed), integration15 (3existing sitemap passed); EN дополнительно3 intended-policy failures до allowlist. После исправлений все выбранные проверки прошли.

## Что доказано и чего не следует выводить

Серверный renderToStaticMarkup подтверждает один H1/no nested main, реальные локализованные category href, COMPANY contacts, complete/partial/null/empty/doors-only, сохранённый static content и один BreadcrumbList. Подменён только public loader, real UI/catalog/SEO используются вместе.

Unit metadata возвращает принятые plain title/description, relative canonical/reciprocal alternates/x-default, OG и правильный gate на реальной config factory. Root metadataBase/template и locale guard проверены по source, route types компилируются. Это не проверка окончательного HTTP head.

Существующий LocaleSwitch сохраняет pathname через switchLocalePath. Theme/responsive/focus wiring сверено по исходникам; layout Organization не дублируется. Source review — [local-review](local-review.md).

## Отложенные release-проверки — unrun

| Объект                                 | Что требуется при отдельном разрешении                         | Статус |
| -------------------------------------- | -------------------------------------------------------------- | ------ |
| Production build                       | Реальная route table/rendering                                 | unrun  |
| UK/RU HTTP                             | 200, итоговый head/body/robots/canonical/hreflang/JSON-LD      | unrun  |
| Unsupported locale                     | Фактический HTTP404                                            | unrun  |
| Redirect/origin variants               | Реальные цепочки trailing slash/http/www                       | unrun  |
| Deployment sitemap/robots              | Доступность и согласованность с release gate                   | unrun  |
| Browser/manual/visual/E2E              | Фактический desktop/mobile/two-theme render и критический путь | unrun  |
| Field/lab performance / Search Console | LCP/INP/CLS, index state, показы/клики/обращения               | unrun  |

Наличие плана не разрешает запуск этих проверок. Публикация/cutover/indexing opt-in не входят в выполненную работу. Расширенные результаты и рост позиций не обещаются.

## Документация

Feature card, feature/spec indexes, URL/schema policy и task/traceability statuses обновлены. Scoped links/format/diff и список actual paths проверены root-helper; [machine summary](implementation-summary.json). Исходный SDD-only [spec review](spec-review.md) сохранён как история.

## Последующий архитектурный аудит — TS-007

По явному запросу пользователя выполнен аудит фаз 00–06 и исправлены AF-001/AF-002. [Отчёт](../code-audit/audit.md), [machine evidence](../code-audit/verification.json), [задача](../tasks/TS-007-audit-remediation.md).

Свежие результаты: ESLint 27 файлов — exit 0; inferred catalog/ui lint inputs — root/local .cjs, custom rules и dependency tracking; отдельный tsc четырёх spec configs content/ui, catalog/ui, content/seo, content/feature — exit 0; catalog cards — 3/3; boundary fixtures — 22/22; actual graph — 103; site:typecheck — exit 0. Приведённые выше 36 focused cases относятся к поставке и не объявляются повторно выполненными в аудите. Финальные ссылки/формат/scoped diff проверены в пределах документационных изменений. Release-проверки остаются unrun.
