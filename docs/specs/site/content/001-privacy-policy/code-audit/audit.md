# Архитектурный аудит — Privacy policy

- **SDD:** [001-privacy-policy](../README.md).
- **Объём:** privacy route, 4 content-слоя, публичные входы и непосредственные core/shared зависимости; 20 feature files (15 production с CSS и 5 specs), existing sitemap/spec как точка интеграции.
- **Дата:** 2026-11-03.
- **Режим:** аудит и разрешённые пользователем исправления.
- **Статус:** verified в пределах автоматических/source проверок.
- **Итог:** 0 blocker/high, 1 medium и 1 low; обе находки verified. Подтверждённых нарушений архитектуры, циклов в privacy-срезе или смешанных ответственностей нет.

Источники: [modules](../../../../../architecture/site/structure/modules.md), [application](../../../../../architecture/site/runtime/application.md), [delivery rules](../../../../../standards/shared/delivery-rules.md), [testing rules](../../../../../standards/shared/testing-rules.md), [SDD frontend](../design/frontend.md). Фактическая конфигурация: eslint.config.cjs (import/order:144 и depConstraints), project.json четырёх content-проектов, nx.json, tsconfig.base.json и spec configs. Пользовательский frontend-code-audit и фазы 00–06 применены только к этой фиче; Admin-правила не перенесены на Site.

## 00 — Инвентаризация и baseline

- Применимые AGENTS и текущая СДД использованы из контекста; feature card и актуальный код/конфигурация сверены.
- Незакоммиченные изменения других страниц выделены и сохранены. Public barrels содержат параллельные article/gallery/offer/requisites изменения; они не переписывались.
- Production: route 1, feature 1, model 4, UI 6 TSX + CSS, SEO 2. Specs: model 1, UI 1, SEO 2, feature 1; existing sitemap spec включён в проверку типов как непосредственная интеграция.
- Нового API/transport, request data, browser state, private DTO или data-access для privacy нет.
- Legacy source SHA-256 по-прежнему совпадает с EN-001. Принятый дизайн и юридический текст не менялись.

## 01 — Архитектура и зависимости

| Модуль          | Роль / tags                              | Разрешённые и фактические privacy зависимости                      | Решение |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------ | ------- |
| site app        | scope:site, type:app                     | feature, seo, core/i18n; async params и locale guard               | keep    |
| content/model   | scope:site, domain:content, type:model   | Только type Locale из core/i18n; copy/mapper/dictionary внутренние | keep    |
| content/ui      | scope:site, domain:content, type:ui      | View types, core/i18n, shared/ui; config также у test fixture      | keep    |
| content/seo     | scope:site, domain:content, type:util    | Только core/config, core/i18n, core/seo                            | keep    |
| content/feature | scope:site, domain:content, type:feature | model/UI/SEO и core config/SEO/i18n                                | keep    |

Cached Nx graph сопоставлен с фактическими AST imports. Все 17 различных межпроектных связей из privacy-среза проходят действующий validator. Три отрицательных случая реально отклонены: UI → feature, content SEO → content model, content model → catalog model. Public aliases совпадают с tsconfig; private cross-library imports и новые boundary exceptions отсутствуют.

После исправлений наборы импортируемых модулей не изменились: переставлены только import groups. Полного аудита остальных content-фич и глобального project graph не проводилось.

## 02 — State / data / contracts

Feature получает COMPANY и siteConfig и передаёт явные bindings чистой модели. Model не читает environment; UI не обращается к API и не хранит server state. Политика — immutable локальный текст; отдельный data-access не нужен. Generated DTO, query cache, mutations, cancellation и permissions неприменимы. Server/client boundary соответствует static content; новых client islands нет.

## 03–04 — Ответственности и структура

| Область                           | Production / tests    | Решение | Причина                                                                                                                                                     |
| --------------------------------- | --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| privacy model family              | 4 / 1                 | keep    | Types, raw copy, source→ordered view и dictionary имеют явные роли. Ordered mapping и разрешённые bindings обслуживают одно преобразование, назначенное СДД |
| ui/privacy                        | 6 TSX + CSS / 1       | keep    | Composition, header, summary, navigation, document и contact разделены. Общего lifecycle/API/state внутри них нет                                           |
| ContentsLinks + PrivacyNavigation | один TOC              | keep    | Две адаптивные формы одной навигации используют общий список; нет независимого состояния                                                                    |
| InlineContent + PrivacyPolicy     | один renderer         | keep    | Inline links и paragraph/list rendering — единое семантическое представление документа                                                                      |
| Contact + related offer           | один завершающий блок | keep    | Небольшой связный блок помощи и legal reference после документа, без отдельного flow                                                                        |
| SEO                               | 2 / 2                 | keep    | Metadata и graph builders раздельны; проверяется только ownership/import boundary, не SEO-аудит                                                             |
| Route / feature                   | 1 + 1 / 1             | keep    | Guard/delegation отделены от config binding и server composition                                                                                            |

UI использует next/link декларативно; router state/hooks и императивная навигация отсутствуют. Это соответствует Site-решению и не требует переноса Admin-ограничений. Внутренние UI helpers не экспортируются library barrel. Raw source и mapper не выведены в public model API. Новых catch-all каталогов, мёртвых слоёв или дублей владельцев нет.

## 05 — Найденные проблемы

| ID     | Severity | Статус   | Evidence до исправления                                                                                         | Правило / влияние                                                                              | Target / owner / task                                                                                                 |
| ------ | -------- | -------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| AF-001 | medium   | verified | ui/privacy/privacy-content.spec.tsx:128,132,136,140 — 4 TS2345: Element не соответствует HTMLElement для within | Test compilation, audit phase 05; app typecheck исключает specs и ранее не подтверждал их типы | Semantic Testing Library queries возвращают HTMLElement; frontend privacy; [TS-006](../tasks/TS-006-audit-quality.md) |
| AF-002 | low      | verified | privacy-content.tsx:8; privacy-dictionary.ts:1,3; privacy-policy-sections.spec.ts:2 — 5 import/order errors     | eslint.config.cjs:144, фактическое error-правило порядка и разделения групп                    | Только reorder/group spacing в 3 файлах; frontend privacy; TS-006                                                     |

Подробные машинные результаты: [до](checks-before.json), [после](checks-after.json). Предупреждение о переданном CSS в первом lint invocation — ограничение конфигурации ESLint, не finding в CSS. Финальный lint ограничен 19 TS/TSX; CSS проверен по source в рамках responsibility boundary.

AF-001: два data-attribute querySelector заменены на getByRole article/complementary с локализованными accessible names. Небезопасных casts или ослабления компилятора в проекте не добавлено.

AF-002: применён действующий import/order autofix только к трём диагностированным файлам. Runtime-функции, текст, export names, JSX composition и dependency targets сохранены.

## 06 — Проверка исправлений

- ESLint действующего проекта: 19 privacy TS/TSX files, **0 errors / 0 warnings**.
- Типы шести затронутых spec roots по четырём реальным tsconfig.spec.json: model/SEO/feature прошли исходную проверку; исправленный UI spec повторно прошёл, **0 diagnostics**. Проверка in-memory с узкими roots, noEmit, отключённым build state; semantic compiler options унаследованы, repo configs не менялись.
- UI regression: **12/12 passed**, exit 0, 35.73s.
- Сравнение с snapshot до аудита: изменены ровно 4 файла; только два test DOM queries и import ordering.
- 17 разрешённых edges и 3 запрета подтверждены; после исправлений новые targets/cycles не появились.
- Поведенческий Red для import/type-only правок не создавался: failing static diagnostics — characterization, затем целевые проверки и regression.

```text
node node_modules/vitest/vitest.mjs run --config libs/site/content/ui/vite.config.mts src/lib/privacy/privacy-content.spec.tsx
```

Исходные 39 implementation tests остаются историческим evidence; они не объявлены повторно выполненными в этом аудите. Browser/manual/visual/HTTP/E2E/build и отдельный SEO-аудит не проводились. Открытых AF и необходимости системной remediation SDD нет.
