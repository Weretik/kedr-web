# Архитектурный аудит — Реквизиты

- **Scope:** Kedr apps/site, implemented requisites и непосредственные public dependencies.
- **SDD:** [001-requisites](../README.md).
- **Дата:** 2026-11-03.
- **Режим:** аудит и исправления по прямому запросу пользователя.
- **Итог:** 1 low finding, AF-001 verified; открытых архитектурных findings в рассмотренной цепочке нет.
- **Поставка:** локальный архитектурный checkpoint verified; внешний EN-002/SC-012 остаётся publication gate.

Это scoped-аудит фичи по применимым фазам 00–06, а не аудит всего workspace. SEO correctness/индексация повторно не аудировались; проверены только владельцы SEO-кода и его dependencies. Browser, build, HTTP и E2E не запускались.

## Источники правил

- `AGENTS.md` и `apps/site/AGENTS.md` — выбранный Next.js client, thin routes, narrow checks и приоритет правил проекта.
- [Site modules](../../../../../architecture/site/structure/modules.md), [application](../../../../../architecture/site/runtime/application.md) — layers, public entrypoints и server/client.
- [Delivery rules](../../../../../standards/shared/delivery-rules.md), разделы Staged structure check / Definition of done — ответственность файлов и компонентов без порога строк.
- [Testing rules](../../../../../standards/shared/testing-rules.md), Verification scope — scoped runtime/type checks и отдельное разрешение browser/build.
- `project.json` затронутых библиотек, `tsconfig.base.json`, `eslint.config.cjs:184–363` и `tools/architecture/project-boundary-rules.mjs:17–76` — фактические aliases/tags/constraints.
- [Frontend plan](../design/frontend.md) и [Next.js contract](../design/nextjs.md) — принятые владельцы и rendering.

## 00. Область и исходное состояние

Проверены 17 production-файлов фичи после исправления, семь spec roots, route и main/public primitives как прямые зависимости. Общий sitemap рассмотрен только как уже существующая integration boundary. Source других content-фич не аудировался.

Git status содержит параллельные articles/wholesale/public-offer и изменения конфигурации. Они сохранены. Runtime-fix ограничен тремя UI paths; public indexes, packages, aliases, tags, shared UI, config facts, route и model не менялись.

Архитектура: config facts → feature → model formatter / server UI; metadata/JSON-LD в content/seo. Все эти роли подтверждены кодом, а не только именами библиотек.

## 01. Матрица зависимостей

| Модуль                  | Actual metadata / роль                                             | Разрешённые dependencies этого scope                            |
| ----------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| site                    | scope:site, type:app; thin locale route                            | content/feature, content/seo, core/i18n                         |
| site-content-feature    | domain:content, type:feature; server composition                   | content/model, ui, seo; core/config, i18n, seo                  |
| site-content-model      | domain:content, type:model; readonly contracts/dictionary/payload  | core/i18n type; без React/config/transport в formatter          |
| site-content-ui         | domain:content, type:ui; server presentation и один client adapter | content/model, core/i18n, shared/ui                             |
| site-content-seo        | domain:content, type:util                                          | только core/config, core/i18n, core/seo по отдельному allowlist |
| site-core-config / i18n | scope:site-shared, type:util                                       | public facts / locale utilities; новый facts module без imports |
| site-core-seo           | scope:site-shared, type:core                                       | существующие metadata/JSON-LD helpers                           |
| site-shared-ui          | scope:site-shared, type:ui                                         | существующий Button/cn; не изменялся                            |

AST-проверка реальных import declarations 17 production-файлов подтвердила **16 уникальных межпроектных связей**, public aliases и отсутствие циклов внутри этого scoped graph. Фактические tags прочитаны из project.json.

Четыре выбранных negative cases проверены существующим validateProjectBoundary: ui → feature, model → feature, content/seo → content/model, core/seo → domain/model отклоняются. Scoped ESLint изменённых файлов проходит. Это доказательство конкретных направлений, а не утверждение о полном переборе всех возможных workspace edges.

## 02. Состояние, данные и API

- COMPANY_REQUISITES остаётся единственным runtime-источником подтверждённых реквизитов, COMPANY — телефона.
- Model formatter чистый, сохраняет строки и формирует шесть строк; transport/DTO/backend/auth/cache здесь n/a.
- UI получает readonly values и готовый copyText. Параллельного источника банковских фактов нет.
- Единственный собственный `use client` — requisites-copy-button.tsx. Clipboard write, pending guard и feedback принадлежат одному lifecycle; извлечение отдельного hook не требуется.
- Transport/API, imperative router hooks и приватные @site imports в рассмотренном production scope не найдены.

## 03. UI и исправление AF-001

До исправления `requisites-support.tsx:17–39` строил юридическую навигацию, а `:40–64` — карточку менеджера. У блоков разные inputs и поводы изменения, общей является только responsive-раскладка.

После исправления Support принимает прежние dictionary/phone и собирает два server blocks с узкими props. DOM IDs, aria, href, классы, порядок элементов и внешний API сохранены. Нет новых DOM wrappers, client boundaries или общего абстрактного primitive.

Next Link остаётся декларативной ссылкой по правилам публичного Next.js сайта. Generic ограничения React Admin не переносились на этот client; next/navigation в presentational UI отсутствует.

## 04. Файлы, public API и split/keep

| Область                          | Количество production-файлов scope | Решение и причина                                                |
| -------------------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| content/ui/src/lib/requisites    | 7 до / 9 после; 2 specs рядом      | Один feature folder; Support разделён по двум независимым блокам |
| content/model requisites cohort  | 3                                  | keep: contracts, dictionary и pure formatter уже разделены       |
| content/seo requisites cohort    | 2                                  | keep: metadata и breadcrumb имеют разные pure builders           |
| content/feature requisites entry | 1                                  | keep: только config/model/UI/JSON-LD coordination                |
| core/config company-requisites   | 1                                  | keep: подтверждённые значения без domain import                  |
| app requisites route             | 1                                  | keep: async params/locale guard/feature/metadata                 |

Числа описывают scope и не являются порогом дробления. Остальные потоки существующих libraries находятся вне этого аудита.

| Путь                                       | Решение | Ответственность после аудита                           |
| ------------------------------------------ | ------- | ------------------------------------------------------ |
| requisites-support.tsx                     | split   | Только grid и композиция двух локальных server blocks  |
| requisites-legal-links.tsx                 | new     | Locale/title/offer/privacy navigation                  |
| requisites-contact-card.tsx                | new     | Phone/title/call presentation                          |
| requisites-copy-button.tsx                 | keep    | Один clipboard lifecycle и его feedback                |
| header/administration/bank/payment/content | keep    | Последовательные section/presentation/composition роли |

UI public index по-прежнему экспортирует только RequisitesContent; два новых leaf не раскрыты наружу. Новых aliases, generated configs, пустых слоёв и catch-all folders нет. Фактическая карта обновлена в [карточке функции](../../../../../features/site/requisites.md).

## 05. Свежие проверки

| Проверка           | Команда / scope                                                                                                                                                                         | Результат                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| UI regression      | `npx nx run site-content-ui:vite:test --skip-nx-cache --output-style=static -- --run src/lib/requisites/requisites-copy-button.spec.tsx src/lib/requisites/requisites-content.spec.tsx` | exit 0, 2 files / 18 tests                                    |
| Server integration | `npx nx run site-content-feature:vite:test --skip-nx-cache --output-style=static -- --run src/lib/requisites-page.spec.tsx`                                                             | exit 0, 1 file / 5 tests                                      |
| Source types       | Compiler API с apps/site/tsconfig.json, roots next-env + requisites route                                                                                                               | 0 diagnostics, fresh/no emit                                  |
| Test types         | Compiler API с реальными spec options, 7 exact spec roots                                                                                                                               | 0 diagnostics, fresh/no emit                                  |
| Boundaries         | AST imports + actual project tags + existing validator                                                                                                                                  | 16 positive edges, 4 rejected negative cases, 0 scoped cycles |
| Lint/format        | Три изменённых UI файла                                                                                                                                                                 | ESLint и Prettier exit 0                                      |

Для structural extraction поведенческий Red n/a: продуктовые правила не менялись. Существующие tests фиксируют UK/RU sections, href, phone, payload и SSR; новых tests, зеркалящих имена компонентов, не добавлено.

До и после исправления fresh source/test type check прошёл с исходными options. Подозрение на DOM iteration не подтвердилось; specs и compiler lib options не менялись. Vitest не выдавался за проверку TypeScript.

Одноразовый checker: `node C:/Users/Віталій/.codex/visualizations/2026/11/03/01a19ef2-e8b5-7823-88f8-0bc406946184/requisites-audit/typecheck-requisites.cjs`. Он использует installed TypeScript, readConfigFile/parseJsonConfigFileContent/createProgram, actual options и явные rootNames; не создаёт конфиги или output в repo. Spec options model/UI/SEO/feature одинаковы; sibling specs не становятся roots. Импортируемый source проверяется транзитивно через public APIs.

`npm run typecheck:tests:site` здесь не запускался: текущий tools/testing/typecheck-tests.mjs проверяет весь Site и не поддерживает --projects/--filter. Приписывать ему фиктивное сужение нельзя.

Model/SEO/sitemap runtime suites после UI-only refactor не повторялись: их реализация не менялась. Предыдущие 43 tests остаются историческим evidence внедрения; новый audit regression — 23 tests без двойного счёта.

## Findings

| ID     | Severity | Правило / evidence                                       | Влияние / цель                                                                                        | Владелец / задача                                           | Статус / verification                               |
| ------ | -------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| AF-001 | low      | Delivery: Staged structure check; Support до split:17/40 | Независимые legal/contact обязанности связаны одним renderer; выделить два leaf, сохранить layout/API | content/ui; [TS-008](../tasks/TS-008-architecture-audit.md) | verified; 18 UI + 5 server tests, fresh types, lint |

Подтверждённых systemic source violations, требующих отдельной remediation SDD, в рассмотренной цепочке не выявлено. Новых AF по поведению clipboard или данным нет.

## 06. Итог и границы

- [x] AF-001 исправлен и verified, открытых in-scope architectural findings нет.
- [x] Фактические imports, public API и scoped DAG перепроверены после разделения.
- [x] Source/test type evidence свежий, без Nx cache.
- [x] Focused runtime regression 23/23, без Nx cache.
- [x] Actual feature tree/SDD/task/traceability синхронизированы.
- [x] Существующие незакоммиченные изменения сохранены.

Внешний EN-002/SC-012 не закрыт этим архитектурным аудитом. Source review не доказывает geometry, HTTP, SEO rich results или публикацию. Коммиты, push, build, приложение, browser/manual/E2E не запускались.
