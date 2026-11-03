# Проверки — 2026-11-03

## Подготовка и источник

СДД и принятый PNG сохранены до реализации. Source SHA-256 повторно совпал с [EN-001](../tasks/enablers/EN-001-source-baseline.md). Raw copy значениями и порядком совпадает с legacy source; runtime Angular/Transloco dependency отсутствует.

## Automated evidence

Все команды выполнялись из корня E:/RiderProjects/kedr-web, кроме direct typecheck с cwd apps/site.

| Scope                       | Red                                                          | Green / последний необходимый прогон |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| Model                       | exit 1, два ожидаемых failures пустого sections              | exit 0, 1 file / 6 tests             |
| SEO metadata/BreadcrumbList | exit 1, 12 ожидаемых failures callable empty builders        | exit 0, 2 files / 12 tests           |
| UI                          | exit 1, 12 assertions отсутствующего H1/документа/TOC        | exit 0, 1 file / 12 tests            |
| Feature SSR + sitemap       | exit 1, 3 expected failures; 6 existing sitemap tests passed | exit 0, 2 files / 9 tests            |

Итого 39 focused tests passed. Compilation/runner failures не использовались как behavioral Red. Model/SEO после Green не менялись; их результаты приняты без повторного прогона. UI после Green получил только project Prettier formatting; конечная feature SSR-композиция проверена после него.

```text
node node_modules/vitest/vitest.mjs run --config libs/site/content/model/vite.config.mts src/lib/privacy-policy-sections.spec.ts
node node_modules/vitest/vitest.mjs run --config libs/site/content/seo/vite.config.mts src/lib/privacy-metadata.spec.ts src/lib/privacy-json-ld.spec.ts
node node_modules/vitest/vitest.mjs run --config libs/site/content/ui/vite.config.mts src/lib/privacy/privacy-content.spec.tsx
node node_modules/vitest/vitest.mjs run --config libs/site/content/feature/vite.config.mts src/lib/privacy-page.spec.tsx src/lib/content-sitemap.spec.ts
```

## Типы и проблема Nx wrapper

Фактическая цель site:typecheck проверена через Nx project config: next typegen && tsc --noEmit -p tsconfig.json, cwd apps/site.

Попытка node node_modules/nx/dist/bin/nx.js run site:typecheck --output-style=static завершилась exit 1 до компиляции: plugin workers не подключились к сокетам, default JS plugin не загрузился. Настройки проекта и permissions не менялись.

То же содержимое цели выполнено напрямую, с NX_DAEMON=false и NX_ISOLATE_PLUGINS=false в окружении только процесса:

```text
# cwd apps/site
node ../../node_modules/next/dist/bin/next typegen
node ../../node_modules/typescript/bin/tsc --noEmit -p tsconfig.json
```

Общий exit 0; Next подтвердил Types generated successfully, tsc diagnostics отсутствуют. Генерация типов не является production build.

## Подтверждённые уровни

| Риск                          | Evidence                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| Полнота и controlled bindings | Все 8 H2, 15 paragraphs, 11 list items и их порядок; independent non-default inputs                 |
| UI/no-JS document             | Весь текст и ссылки в renderToStaticMarkup; документ вне details                                    |
| Native TOC                    | Уникальные IDs/targets, closed/open click semantics в jsdom; source соответствует нативному summary |
| Canonical/alternates/indexing | Metadata unit: обе локали, custom origin, root title template once, existing gate                   |
| BreadcrumbList                | Builder unit + actual PrivacyPage SSR graph совпадает с крошками                                    |
| Sitemap                       | Две страницы, reciprocal alternates, сохранение соседей, no fabricated date/query/hash              |
| Route / boundaries            | Thin async params + isLocale/notFound; direct typegen/tsc; scoped source review                     |
| Themes/responsiveness         | Existing tokens, lg variants, min-width, wrapping, sticky/scroll offsets по source                  |

[Локальный source review](local-review.md) выполнен координатором и независимыми агентами в назначенных пределах; существенных замечаний нет. Это запись исходной реализации; последующий архитектурный аудит privacy-фичи сохранён отдельно.

## Документарная проверка

Фактическая feature card, catalog, module/SEO architecture, task status и traceability обновлены. Финальная проверка 2026-11-03: изменённые Markdown links/formatting/fences проверены; scoped git diff --check — exit 0. Source review подтверждает роли/границы без новых AF. Полный suite/build/browser не запускался.

Механический UI detector: impeccable detect --json для libs/site/content/ui/src/lib/privacy завершился exit 0 и вернул [] (замечаний нет). Это scoped статическая проверка, не browser/visual acceptance.

## Не выполнялось

HTTP 200/404/head, browser/manual/visual/E2E, реальная hash/history/keyboard навигация без JS, CWV, production build и deployment. Текущий gate индексации не включался. These unrun checks не являются утверждением о production приёмке.

## Последующий архитектурный аудит

[Аудит](../code-audit/audit.md) выявил AF-001 (medium: 4 TS2345 в UI spec) и AF-002 (low: 5 import/order errors). Обе verified после [TS-006](../tasks/TS-006-audit-quality.md): scoped lint 19 TS/TSX — 0 errors/warnings, UI spec types — 0 diagnostics, 12 UI cases passed. Остальные spec группы прошли исходную scoped type-проверку. Runtime, структура компонентов и dependency targets сохранены; source snapshot diff просмотрен. Browser/build/SEO review не добавлены.
