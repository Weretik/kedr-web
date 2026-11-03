# Архитектурный аудит — Контакти

- **SDD:** [001-contacts](../README.md).
- **Дата:** 2026-11-03.
- **Поручение:** аудит внедрённой фичи, исправление подтверждённых проблем и разделение смешанных UI-ответственностей.
- **Объём:** contacts route, model/UI/SEO/feature, public exports, существующий content sitemap, непосредственные core/shared зависимости; конфигурация и тесты защиты этих границ.
- **Статус:** **verified** в automated/source scope. 6 findings закрыты: 2 medium, 4 low; open/blocked/fixed без проверки — 0. Изменение структуры UI выполнено отдельно как запрошенное уточнение, без приписывания старой SDD несуществующего нарушения.
- **Пределы:** соседние фичи не аудировались, SEO-семантика не подвергалась отдельному seo-audit. Browser/visual, HTTP, production build, deployment не запускались.

## 00. Источники и исходное состояние

Применены корневой `AGENTS.md`, `apps/site/AGENTS.md`, [site modules / Dependency rules](../../../../../architecture/site/structure/modules.md), [site runtime](../../../../../architecture/site/runtime/application.md), [design system](../../../../../standards/site/design-system.md), [delivery rules](../../../../../standards/shared/delivery-rules.md), [testing rules](../../../../../standards/shared/testing-rules.md), принятые [frontend design](../design/frontend.md) и [сценарии](../requirements/behavior.md).

Факты конфигурации: `eslint.config.cjs`, `nx.json`, `tsconfig.base.json`, четыре content `project.json`, их `tsconfig.lib.json`/`tsconfig.spec.json`, Vite configs, `tools/architecture/project-boundary-rules.mjs`. Installed Next.js 16.4.3, Nx 24.0.3; CLI target definitions проверены через nx show project. Git status до правок содержал сторонние изменения; затронутые файлы переносились с SHA preflight, без reset/commit/ветки.

Nx graph сохранён командой `node node_modules/nx/dist/bin/nx.js graph --focus site-content-feature --file <audit-stage>/contacts-graph.json`. Его project edges сверены с фактическими imports. В graph UI → core/config присутствует из существующих тестов; production contacts UI получает факты только через props.

## 01. Матрица проектов и границ

| Проект               | Роль и tags                  | Фактический путь зависимостей          | Итог                                                                    |
| -------------------- | ---------------------------- | -------------------------------------- | ----------------------------------------------------------------------- |
| site                 | scope:site, type:app         | route → content feature/seo, core i18n | Thin route; guard в metadata и page; keep                               |
| site-content-feature | domain:content, type:feature | model, ui, seo, core config/seo/i18n   | Проекция COMPANY и server composition; keep                             |
| site-content-model   | domain:content, type:model   | core/i18n для Locale                   | Чистые типы/словарь; lint inputs исправлены AF-003                      |
| site-content-ui      | domain:content, type:ui      | model, core/i18n, shared/ui; Next Link | Публичный ContactsContent; отдельные внутренние секции; keep/split ниже |
| site-content-seo     | domain:content, type:util    | core config/i18n/seo                   | Runtime imports корректны; исходящие project edges защищены AF-002      |

Межбиблиотечные imports используют public aliases/index.ts. Закрытых shell imports, feature-to-feature, циклов, транспортных DTO или мёртвых contacts exports не обнаружено. Новых проектов/aliases/packages нет. Nx depConstraints не заменяют дополнительный validator: scoped allowlist для content SEO добавлен в существующий CI boundary checker, вызываемый `.github/workflows/ci.yml:56`.

## 02. Данные и состояние

| Поток                              | Владелец                                                  | Решение                                                          |
| ---------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| Публичные факты                    | core/config COMPANY → ContactsPage → ContactsDetails → UI | Один источник, локализация города в feature; keep                |
| UK/RU copy                         | content/model → feature/UI                                | Без копий контактов и JSX; keep                                  |
| Clipboard                          | ContactsCopyPhoneButton                                   | Локальные idle/pending/success/error, mutex, status, retry; keep |
| Remote API, DTO, query cache, auth | Не используются контактами                                | data-access/Server Actions/новые cache tags — n/a                |

Основное содержимое и BreadcrumbList серверные. Единственный новый client leaf остаётся clipboard; его production-код при аудите сохранён побайтно. Browser API вызывается по действию пользователя, без скрытой навигации. Organization/main/skip-link/theme/locale принадлежат существующему layout/shell.

## 03–04. Ответственности, public API и физическая структура

| Область            | Решение | Владелец после изменения                                                                     | Основание                                                                            |
| ------------------ | ------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| ContactsContent    | split   | Композиция; header в contacts-header.tsx, подготовка/help в contacts-help.tsx                | Разделены порядок страницы и самостоятельные блоки с собственными ссылками/разметкой |
| ContactsChannels   | split   | Section/anchor/grid; sales в contacts-sales.tsx, письменные каналы в contacts-messengers.tsx | Панели имеют разные данные и цели изменений; sales включает clipboard                |
| Clipboard UI/state | keep    | contacts-copy-phone-button.tsx                                                               | Один пользовательский сценарий и жизненный цикл; hook/production adapter не нужен    |
| Model              | keep    | contacts-types.ts, contacts-dictionary.ts                                                    | Контракт и copy разделены, каталог types/helpers не добавляется                      |
| SEO и feature      | keep    | По одному metadata/BreadcrumbList builder и server composition                               | Короткие связные роли без лишних слоёв                                               |
| contacts/          | keep    | 9 production-файлов + 2 specs одной страницы                                                 | Нет независимых функций, требующих новых общих папок; числовой порог не применяется  |

Public UI API остаётся только ContactsContent с теми же dictionary/details props. Новые секции внутренние. Next Link соответствует принятой Next.js SDD: client router state или навигационная координация в UI не вводятся. Generic запрет router-aware UI не подменяет это проектное решение.

Ранее SDD разрешала header/help внутри ContactsContent и две панели внутри ContactsChannels. Их выделение — refinement по текущему поручению пользователя и delivery-rules о разделении самостоятельных визуальных ролей, а не ретроактивная архитектурная находка. Порядок DOM, тексты, href, locale и визуальные классы сохранены, кроме исправления незаданного токена AF-004.

## Findings

| ID     | Severity / status     | Исходное evidence и правило                                                                                                                                                                                                                                  | Влияние / владелец / target                                                                                                                   | Проверка                                                                                                                  |
| ------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| AF-001 | medium / **verified** | contacts-copy-phone-button.spec.tsx, до исправления строки 64/86: проверялось только неизменное window.location.href. jsdom navigation.js:75–77 не выполняет document navigation. R-004/SC-004, TS-002, testing-rules требуют контролировать внешнюю границу | Реальная попытка tel могла не сломать тест. Владелец TS-002; test-only fixture контролирует location/window.open, без production adapter      | Контрольная мутация дала 4 expected failures; после восстановления UI 36/36 и UI spec typecheck/lint passed               |
| AF-002 | low / **verified**    | project-boundary-rules.mjs, прежние строки 45–63, и seo/project.json:7: type:util допускал content SEO → feature/UI/model; probe возвращал null. Site Dependency rules + SDD baseline                                                                        | Защита границы отсутствовала при корректных текущих imports. Владелец TS-004; allowlist только site-content-seo → core-config/i18n/seo        | 4 forbidden-edge Red failures; final fixtures 12/12, actual graph checker 102 projects passed                             |
| AF-003 | low / **verified**    | content/model/project.json, прежние строки 9–17: lint inputs ссылались на .eslintrc.json/.eslintignore/eslint.config.mjs вместо eslint.config.cjs; nx.json sharedGlobals пуст. AGENTS Commands и Nx project conventions                                      | Изменение настоящих lint rules могло не инвалидировать cache. Владелец TS-001; убрать старый override и использовать inferred plugin settings | nx show project включает eslint.config.cjs, tools/eslint-rules и ^default; site-content-model:lint --skip-nx-cache exit 0 |
| AF-004 | low / **verified**    | contacts-channels.tsx, прежние строки 26/60, location:17: text-card-foreground отсутствует в global.css @theme. Design-system tokens                                                                                                                         | Utility не выражала предусмотренный цвет панели; в текущем UI текст наследовался. Владелец TS-003; использовать существующий text-foreground  | sales:18, messengers:17, location:17; старых references нет, global.css не менялся; UI regression/lint passed             |
| AF-005 | medium / **verified** | content-sitemap.spec.ts:25: readonly CONTENT_SITEMAP_PAGES передавался как mutable SitemapPage[]. tsc feature/tsconfig.spec.json дал TS2345. Testing-rules и audit phase05                                                                                   | Vitest transpile проходил, а test TypeScript/CI проверка падала. Владелец TS-005; spread-copy только в вызове теста                           | feature spec tsc exit 0; final feature 9/9; core API сохранён                                                             |
| AF-006 | low / **verified**    | contacts-dictionary.ts:1–3: два import/order errors при свежем model lint. Правило eslint.config.cjs:144–156                                                                                                                                                 | Код не проходил lint. Владелец TS-001; порядок type imports исправлен, contacts UI imports приведены к тому же правилу при extraction         | Model lint uncached exit 0, scoped contacts lint и UI lint exit 0                                                         |

Точные текущие source paths всех entries находятся в [карточке функции](../../../../../features/site/contacts.md). Historical line numbers в таблице относятся к зафиксированному состоянию до исправления; выводы не основаны на длине файлов.

### Контрольная мутация AF-001

После setState('error') временно добавлялся `window.location.href = 'tel:' + e164`. Fixture зафиксировала попытку, и четыре unavailable/rejection cases UK/RU упали; ещё 5 cases прошли. Проверка самой fixture подтверждает перехват window.location assignment, location.href, assign, replace и window.open.

Mutation была удалена до final Green. SHA-256 production leaf до и после: `6e10eb2b2182c48fd12e6d0554b280209240ba03a90c0cd61ee69c4c0e77ab9d`. Тест проверяет отсутствие попытки, не отсутствие реализованной jsdom навигации.

## 05. Проверки

Команды запускались из корня repo через `C:\Program Files\nodejs\node.exe`; для Nx использованы NX_DAEMON=false, NX_ISOLATE_PLUGINS=false, NX_TUI=false и --output-style=static.

| Команда / scope                                                                                                                  | Результат                                                               |
| -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `node node_modules/nx/dist/bin/nx.js run site-content-ui:vite:test --output-style=static -- --run`                               | Exit 0, 4 specs / 36 tests, uncached; включает прежние delivery/returns |
| `node node_modules/nx/dist/bin/nx.js run site-content-feature:vite:test --output-style=static -- --run`                          | Exit 0, 3 specs / 9 tests, uncached                                     |
| `node --test tools/architecture/check-project-boundaries.spec.mjs`                                                               | Exit 0, 12/12 fixtures                                                  |
| `node tools/architecture/check-project-boundaries.mjs`                                                                           | Exit 0, 102 project graphs checked                                      |
| `node node_modules/nx/dist/bin/nx.js run site-content-model:lint --output-style=static --skip-nx-cache`                          | Exit 0 после исправления imports; cache skipped                         |
| Scoped ESLint: contacts model/SEO/feature/route; UI contacts/*.tsx; sitemap test + two boundary tools                            | Exit 0, реальные repo rules, без skip предупреждений                    |
| `node node_modules/nx/dist/bin/nx.js run site:typecheck --output-style=static`                                                   | Exit 0, next typegen + source tsc, uncached                             |
| `node node_modules/typescript/bin/tsc --noEmit -p libs/site/content/{ui,seo,feature}/tsconfig.spec.json` — три отдельных запуска | Каждый exit 0; исходная TS2345 устранена                                |

Всего в новых regression запусках 57 passed test cases (36 UI + 9 feature + 12 boundary fixtures). SEO builders не менялись: их предыдущие 20/20 не запускались повторно без нового риска. В repo есть `typecheck:tests:site`; выбранные три configs проверены напрямую, без обхода всех site-тестов.

## 06. Закрытие

Все AF-001…AF-006 проверены; deferred findings и обязательные EN/RM отсутствуют. Это локальные исправления одной фичи и защиты её непосредственных границ, не системная переработка других доменов. [TS-007](../tasks/TS-007-audit-verification.md) связывает итоговую проверку с существующими задачами-владельцами.

Фактическая карта и SDD синхронизированы; public API, локализованные сценарии и client scope сохранены. Пиксельный результат и реальные HTTP/status/head не проверялись. Коммит, merge/push и публикация не выполнялись.
