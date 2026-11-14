# Архитектурный аудит — Site wholesale

- **Функция:** [001-wholesale](../README.md), `/uk/wholesale` и `/ru/wholesale`.
- **Дата:** 2026-11-03.
- **Статус:** verified в automated/source scope; AF-001 и AF-002 закрыты с повторной проверкой.
- **Авторизация:** пользователь явно запросил аудит внедрённой функции, исправления и разделение смешанных компонентов. Исходный режим skill «только отчёт» расширен этим запросом.
- **Владельцы:** координатор — findings, Nx/tooling, интеграция и evidence; независимые агенты — архитектура/data/public API и UI/ответственности. Финальные изменения интегрированы координатором.

## 00. Объём и baseline

Проверены wholesale route; `content/{model,ui,seo,feature}` в части wholesale; общий sitemap; компактный вариант `catalog/ui/category-cards`; разрешённые cross-domain edges и fixtures. Непосредственные зависимости прочитаны в объёме роли: `catalog/{data-access,model}`, `shared/api-client`, `core/{config,i18n,seo}`, shell/layout, публичные barrels, project/TypeScript/Vitest/ESLint/Nx configs. Соседние Articles, Contacts, Requisites и Public offer учтены как существующие consumers/exports, без расширения аудита на их реализацию.

Применены корневой [AGENTS.md](../../../../../../AGENTS.md) и [apps/site/AGENTS.md](../../../../../../apps/site/AGENTS.md), [Site modules / Dependency rules](../../../../../architecture/site/structure/modules.md), [Delivery / Definition of done](../../../../../standards/shared/delivery-rules.md), [Testing / Verification scope](../../../../../standards/shared/testing-rules.md), [SDD frontend map](../design/frontend.md) и [Next.js design](../design/nextjs.md). Skill: `E:\Development\Skills\frontend-code-audit\SKILL.md`; шаблон `E:\Development\Templates\frontend-sdd\code-audit`, фазы 00–06. Вспомогательный nextjs-site-architecture использован только для серверной границы, без отдельного SEO/HTTP-аудита.

Git status и scoped diff проверены до исправления. Исходный manifest сохранён в локальном baseline; его старые inputs и новый target записаны в [verification.json](verification.json). Изменения других задач не восстанавливались и не перезаписывались. Единственное изменение production/config в этом аудите — удаление устаревшего `lint.inputs` из `libs/site/catalog/ui/project.json`; остальные изменения — отчёт, task и evidence.

Фактический стек: Next.js 16.4.3 App Router/Server Components и Cache Components, React 19.3, Nx 24.0.3, Vitest 5.0.5, TypeScript, Next Link/Image, существующие UI primitives и Lucide. Подключение подтверждено импортами, Next/Vite/ESLint configs и выполненными targets, а не одним package.json.

## 01. Матрица архитектуры

| Модуль                       | Фактическая роль                                             | Метаданные / разрешённые зависимости                                                            | Результат                                          |
| ---------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `site` route                 | await params, locale guard, metadata export, вызов feature   | scope:site / type:app; public content feature/seo и core/i18n                                   | Соответствует; API/UI-композиция не попали в route |
| `site-content-feature`       | загрузка, COMPANY projection, category slot, schema, sitemap | scope:site/domain:content/type:feature; собственные model/ui/seo, core; три явных catalog edges | Соответствует documented wholesale flow            |
| `site-content-model`         | presentation types и UK/RU copy                              | type:model; core/i18n type, без catalog/API/React                                               | Соответствует                                      |
| `site-content-ui`            | семь серверных компонентов, props и assortment slot/null     | type:ui; content/model, core/i18n, shared/ui, Next Link                                         | Соответствует; нет data-access                     |
| `site-content-seo`           | metadata и BreadcrumbList builders                           | type:util; core/seo и core/i18n                                                                 | Соответствует; без feature/UI/API                  |
| `site-catalog-ui`            | общие category cards и локальное соответствие фото           | type:ui; catalog/model, core/i18n, shared/ui                                                    | Ответственности верны; AF-001 — lint tooling       |
| `site-catalog-data-access`   | server-only cached read и DTO mapper                         | type:data-access; shared/api-client и catalog/model                                             | Существующий владелец сохранён                     |
| `core` / `shared/api-client` | конфигурация, locale/SEO policy, транспорт                   | существующие public APIs и слой транспорта                                                      | Дублирующих владельцев wholesale не создаёт        |

Теги и aliases соответствуют модулям. Межбиблиотечные импорты идут через public entry points. Allowlist разрешает ровно `site-content-feature -> site-catalog-{data-access,model,ui}`; обратные UI/model/SEO направления и feature-to-feature не разрешены. Свежая проверка фактического графа — 103 проекта; fixtures — 22, включая positive и negative cases.

## 02. Данные, API и серверная граница

`route -> WholesalePage -> getCatalogTree(locale) -> catalog loader -> siteApiGet -> getCategoryTree` — существующая операция `GET /api/catalog/{lang}/categories`. Провайдерный CategoryTreeNode остаётся в transport/mapper; до feature доходит CatalogTreeNode. `category-tree.mapper` разворачивает hardware и исключает Cosmos, feature исключает doors, а URL/фото создаёт catalog UI.

[WholesalePage](../../../../../../libs/site/content/feature/src/lib/wholesale/wholesale-page.tsx):15–46 координирует один серверный render. [Catalog loader](../../../../../../libs/site/catalog/data-access/src/lib/loaders/catalog-loaders.ts):29–40 владеет `server-only`, `use cache`, tags и success/failure lifetime. При null/empty/doors-only feature передаёт null; UI сохраняет статические разделы и выводит предусмотренный fallback. Отдельные запросы, клиентский loading/error state или локальный кэш не добавлены. Мутаций, cancellation lifecycle или формы в этой функции нет.

Телефон, город и messenger URL проецируются из COMPANY в typed props; редакционный словарь не стал владельцем runtime-контактов. Не добавлены новые условия опта или численные обещания. Route не использует cookies/headers, новую client boundary или устаревшие rendering overrides. JSON-LD/metadata остаются отдельными server builders. Это source-проверка владельцев; итоговый HTTP head не проверялся.

## 03. UI и разделение ответственностей

| Область                              | Роли и lifecycle                                       | Решение / причина                                                                                  | Evidence                                          |
| ------------------------------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `wholesale-page.tsx`                 | один server load → projection → composition            | **keep**: 47 строк одной координации; выделение controller/mapper дублировало бы владельца         | Source, ранее 14 page cases; свежий app typecheck |
| `wholesale-content.tsx`              | композиция sections из props                           | **keep**: не загружает данные, не хранит состояние                                                 | Source, delivery UI 8 cases                       |
| `wholesale-hero.tsx`                 | предложение и контактная панель первого экрана         | **keep**: это утверждённый visual contract; у панели нет независимого состояния, формы или запроса | Source:7, SDD visual/file-role map                |
| assortment/company/steps/faq/contact | slot/fallback, факты, шаги, ответы, финальные действия | **keep**: уже шесть отдельных section owners; нет скрытых правил/транспорта                        | Source, UI/page tests                             |
| `category-cards.tsx`                 | default/compact представления одной категории          | **keep**: общий model, href, фото и семантика; variant не создаёт новый поток                      | Свежие 3 compact/default regression cases         |
| `wholesale-types.ts` / dictionary    | presentation contract / локализованный copy            | **keep раздельно**: типы отделены от редакционных данных                                           | Source + spec typechecks                          |
| wholesale metadata / JSON-LD         | разные SEO outputs                                     | **keep раздельно**: каждый builder имеет собственный контракт                                      | Delivery SEO 7 cases, свежий spec typecheck       |

Подтверждённых смешанных компонентов не обнаружено. Повторение простых contact-ссылок через существующий Button не создаёт отдельной бизнес-роли. Дополнительные wrappers и перестановка файлов не устраняли бы выявленный дефект. Применено правило проекта: размер файла сам по себе не требует split.

## 04. Публичный API и физическая структура

Целевая схема: тонкий app route; `content/feature` — координация; `content/model` — types/copy; `content/ui/wholesale` — presentation; `content/seo` — builders. Catalog loader/mapper/UI остаются в catalog. Фактическое дерево соответствует этой схеме и [feature card](../../../../../features/site/wholesale.md).

Снимок прямых production-файлов на момент финального аудита; specs исключены, чужие реализации не аудитировались по одному имени:

| Каталог `src/lib`           | Прямых production-файлов | Независимые потоки / решение                                                                                                                                                                     |
| --------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `content/model`             | 12                       | contacts, requisites, returns, wholesale — именованные types/copy; articles/public-offer уже в собственных папках. **keep**: wholesale добавляет только два связанных файла, catch-all не создан |
| `content/seo`               | 10                       | именованные metadata/schema builders content-страниц, articles в папке. **keep**: один output на файл, wholesale builders независимы и не смешаны                                                |
| `content/feature`           | 7                        | отдельные server pages и общий sitemap, articles в папке. **keep**: один page entry на поток; wholesale не поглощает соседние flows                                                              |
| `content/ui`                | 0                        | sections уже сгруппированы по pages; wholesale — отдельная папка. **keep**                                                                                                                       |
| `content/ui/wholesale`      | 7                        | composition + 6 section roles из таблицы выше. **keep**                                                                                                                                          |
| `catalog/ui`                | 0                        | category-cards и остальные группы уже разделены по ролям. **keep**                                                                                                                               |
| `catalog/ui/category-cards` | 2                        | renderer и приватная photo map. **keep**: одна область представления, mapping не экспортирован в content                                                                                         |

Полные имена файлов и child directories сохранены в verification.json. Число файлов не применялось как выдуманный порог. Barrels открывают dictionary/types, WholesaleContent/Props, SEO builders и WholesalePage; внутренние sections, DTO и photo map не экспортируются заново. Deep imports, обратные зависимости и циклы в затронутом потоке не обнаружены. Новые aliases/пустые слои/compatibility files не добавлены.

## 05. Findings и проверка инструментов

| ID     | Severity | Правило / исходное evidence                                                                                                                                                                                                                                                                                          | Исправление / владелец                                                                                                                                                                 | Задача и зависимости                                                                                 | Статус / проверка                                                                                                                                     |
| ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| AF-001 | medium   | Audit 05 п.1; Site modules: lint через принятую Nx/ESLint конфигурацию. Исходный `libs/site/catalog/ui/project.json:7–18` вручную перекрывал inferred inputs и ссылался на `.eslintrc.json`, `.eslintignore`, `eslint.config.mjs`; реальный root — `eslint.config.cjs`; `nx.json:17` sharedGlobals пуст              | Удалён только устаревший lint override. Владелец: catalog/ui tooling. Target — inferred lint c root config, custom rules и dependency inputs                                           | [TS-007](../tasks/TS-007-audit-remediation.md); после TS-006, затрагивает TS-002/EN-001 verification | **verified**: свежий target содержит root/local .cjs, `tools/eslint-rules/**/*`, `^default`; scoped lint, cards, fixtures/graph и source types passed |
| AF-002 | medium   | Audit 05 п.2: отдельно source/tests. В исходном [verification](../verification/seo-verification.md) указан app typecheck, но `apps/site/tsconfig.json:24–31`, `content/ui/tsconfig.lib.json:7–27` и `catalog/ui/tsconfig.lib.json:7–27` исключают specs; Vitest без typecheck не доказывает типы fixtures/assertions | Выполнены четыре существующих `tsconfig.spec.json`, результаты внесены в task/evidence. Владелец: wholesale integration/verification. Target — отдельно доказанные source и test types | TS-007; TS-002/003/004/005/006                                                                       | **verified**: четыре `tsc --noEmit` exit 0, новых типов ошибок не обнаружено                                                                          |

AF-001 мог позволять Nx использовать прежний lint result после изменения общих правил: root config и custom rules находились вне project default inputs. Фактический stale cache hit не заявляется. Удаление override восстановило поддерживаемое plugin inference, без ослабления ESLint/boundary rules. Новый [manifest](../../../../../../libs/site/catalog/ui/project.json):1–7 сохраняет name/sourceRoot/projectType/tags.

AF-002 — пробел evidence, а не найденная ошибка runtime или утверждение о некорректном тесте. Общий `typecheck:tests:site` обходит все Site конфигурации; вместо его лишнего расширения использованы четыре нужных spec configs. Новые harness/dependencies/targets не добавлялись.

## 06. Remediation verification

Все команды выполнены 2026-11-03. Полные точные argv, inputs, exit codes и inventory: [verification.json](verification.json).

| Проверка                                                                                                                                          | Свежий результат                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| ESLint: 27 wholesale production/test/policy файлов                                                                                                | exit 0, без диагностик                                          |
| `node node_modules/nx/dist/bin/nx.js show project site-catalog-ui --json`                                                                         | exit 0; inferred inputs проверены после свежего пересчёта graph |
| `node node_modules/typescript/bin/tsc -p libs/site/content/ui/tsconfig.spec.json --noEmit`                                                        | exit 0                                                          |
| Та же команда: `libs/site/catalog/ui/tsconfig.spec.json`                                                                                          | exit 0                                                          |
| Та же команда: `libs/site/content/seo/tsconfig.spec.json`                                                                                         | exit 0                                                          |
| Та же команда: `libs/site/content/feature/tsconfig.spec.json`                                                                                     | exit 0                                                          |
| `node node_modules/nx/dist/bin/nx.js run site-catalog-ui:vite:test --output-style=static -- --run src/lib/category-cards/category-cards.spec.tsx` | exit 0; 3/3, uncached                                           |
| `node --test tools/architecture/check-project-boundaries.spec.mjs`                                                                                | exit 0; 22/22                                                   |
| `node tools/architecture/check-project-boundaries.mjs`                                                                                            | exit 0; 103 проекта                                             |
| `node node_modules/nx/dist/bin/nx.js run site:typecheck --output-style=static`                                                                    | exit 0; next typegen + tsc, uncached                            |

Nx: `NX_DAEMON=false`, `NX_ISOLATE_PLUGINS=false`, `NX_NO_CLOUD=true`, `NX_TUI=false`, `NX_CACHE_PROJECT_GRAPH=false`, `NX_FORCE_REUSE_CACHED_GRAPH=false`. Первая metadata-проба после изменения manifest ещё показывала прежний cached graph и не принята как verification; после принудительного свежего вычисления target подтверждён. Общий Nx cache не сбрасывался.

Ранее при поставке прошли 36 focused тестов. Они остаются [историческим delivery evidence](../verification/seo-verification.md), а не выдаются за повторный запуск во время аудита. После manifest-only исправления повторены cards regression и проверки затронутых инструментов; дополнительных runtime-изменений нет. После финальной документационной правки проверены scoped links, формат и diff; результат включён в verification.json.

- [x] Фазы 00–05 выполнены в указанном feature scope, владельцы и keep-решения записаны.
- [x] AF-001/AF-002 имеют owner, TS-007, целевое состояние и статус verified.
- [x] Финальные manifest, inferred inputs, public APIs и actual graph согласованы.
- [x] Source и test types проверены раздельно; positive/negative boundary evidence присутствуют.
- [x] Task, traceability и статус SDD обновлены, сторонние изменения сохранены.

Production build, итоговый HTTP/head/404, браузер/manual/visual/E2E и публикация не запускались: они требуют отдельного запроса по правилам проекта и не являются доказательствами этого аудита. Repository-wide аудит и новые бизнес-условия не входили в scope. Системного нарушения, требующего отдельной remediation SDD, не подтверждено; незакрытых in-scope findings нет.
