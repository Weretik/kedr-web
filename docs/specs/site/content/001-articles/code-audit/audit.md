# Аудит функції «Статті» — 2026-11-03

- **Skill:** web-frontend:frontend-code-audit, застосовані фази 00–06.
- **SDD:** [001-articles](../README.md).
- **Scope:** article-only model/data-access/UI/SEO/feature files, public APIs, два app routes, deployment redirect map і прямі core залежності.
- **Запит:** аудит функції та виправлення/розділення там, де це необхідно. Візуальний redesign, інші content features і каталог поза межами.
- **Статус постачання в межах аудиту:** verified (source/automated); AF-001 та AF-002 verified.
- **Власник:** coordinator, [TS-007](../tasks/TS-007-audit-refactor.md).

## 00. Інвентаризація та правила

Використані вже прочитані root/site AGENTS, [модулі](../../../../../architecture/site/structure/modules.md), [delivery §Staged structure check](../../../../../standards/shared/delivery-rules.md), [testing rules](../../../../../standards/shared/testing-rules.md), [frontend design](../design/frontend.md), [Next.js](../design/nextjs.md), requirements і task/evidence поточного SDD.

Actual Nx graph отримано через createProjectGraphAsync. У п’яти content projects є lint/typecheck/vite:test; tags scope:site/domain:content та типи model/data-access/ui/util/feature відповідно. Alias/public APIs перевірені у tsconfig.base.json та index.ts. На початку: model 4 production files + 1 spec; data-access 2 + 1; UI 9 + 1; SEO 4 + 2; article feature 2 + 1 (окремо shared sitemap spec). App: 2 thin routes + redirect map і підключення next.config.

Working tree зафіксовано перед аудитом. Паралельні wholesale/catalog/boundary edits відокремлено; вони не є findings статей і не редагуються цим завданням. Наявність catalog edges у спільному content-feature graph походить із документованого wholesale flow; article source imports catalog не має.

## 01. Матриця архітектури

| Module              | Production role / dependency projection                                              | Результат                                              |
| ------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| content/model       | typed query/listing, route identity, normalization/filter/window; core i18n для copy | AF-001 verified: незалежні file roles розділені        |
| content/data-access | server-only local source → model/core i18n                                           | keep; approved temporary stage, source приватний       |
| content/ui          | server presentation → model/core i18n/shared UI, Next Link; один size client leaf    | keep; узгоджено з site runtime/client-island правилами |
| content/seo         | plain projection → тільки core config/i18n/SEO                                       | keep; private DTO/data-access/model не імпортує        |
| content/feature     | server composition → domain layers/core; metadata bridge, Suspense/404/redirect      | keep; thin app routes                                  |
| app                 | params/locale guards, delegated feature, maintained 301 configuration                | keep                                                   |

Схвалений site-specific Next client leaf із router не оцінюється за Admin router-free правилом generic template. Production/development graph edges відділені: testing-library/Vite у graph належать tests/config.

## 02. Стан і дані

URL є committed state; search native GET, page size — router transition, paging — server links. Немає другого store/query cache/localStorage або паралельного transport. Фільтрація повного набору перед slice належить model. Реальні шість локалізованих матеріалів, усі paragraphs і JPG залишаються server-only; client leaf отримує query + strings.

HTTP/API/DTO/cancellation/retry/invalidation для поточного source не застосовуються: користувач прямо затвердив синхронний immutable local stage. Майбутня БД/API залишається за рішенням міграції, без вигаданого endpoint. Source і selectors розділені; dataset 15KB збережено цілісним як одне підтверджене джерело.

## 03. UI та координація

ArticlesHeader — статичний list header поза request Suspense. ArticlesContent — один list flow: toolbar, result, empty і pager. ArticleContent — один reading flow з крошками/датою/обкладинкою/paragraphs/back. ArticleCover повторно використаний двома views. PageArrow — приватна частина одного pager. Підстав переносити їх у глобальний shared/UI або дробити за кількістю рядків немає.

Два Next entrypoints HTML/metadata викликають однакові model algorithms. Бізнес-правила не продубльовані; окремий shared resolver зараз факультативний і не є finding. Detail metadata/HTML/static params залишаються cohesive entrypoints однієї article-функції.

## 04. Public API та фізична структура

Між бібліотеками використовуються public aliases. Source/ArticleSource приватні; ArticlesResults не експортується з public feature index. URL parser — задокументований domain public API, не transport parser. Барелі не виносять private API DTO. Site UI зберігає domain/layer/feature структуру SDD; generic role-first Admin дерево не нав’язується.

| Область                         | Рішення та причина                                                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| model/articles-query.ts         | split: query parsing/serialization/href лишаються; route identity → article-routes.ts; page-window algorithm → article-page-window.ts    |
| model/article-types.ts          | move route path/slug identities до article-routes.ts; typed Article/query/result і query defaults лишаються cohesive view-model contract |
| model specs                     | existing route/window assertions перенести до subject specs; без зміни продуктового сценарію                                             |
| UI: 9 production files          | keep: один список + одне читання; shared cover має два реальних consumers                                                                |
| data-access: 2 production files | keep: confirmed source окремо від localization/selectors                                                                                 |
| feature: 2 production files     | keep: один list і один detail entry module                                                                                               |
| SEO: 4 production files         | keep: plain input/copy/metadata/schema — окремі ролі                                                                                     |
| deployment map                  | keep: app-level retained legacy mapping; перевірка consistency окрема від production domain import                                       |

## 05. Тестування

Захист до перенесень: model 17, source 7, UI 13, article SEO 17, feature/sitemap 12 — попередні фактичні результати у [verification](../verification/results.md). Під час аудиту перечитані саме ці spec-файли та configs. Вони перевіряють observable behavior: hidden label, reset, full-text before page, disabled/current/empty, plain full text, 404 та query-aware metadata.

Для structural split штучний behavioral Red не потрібен. Після перенесень: focused model specs + source/consumer regression; model spec types і site source types; scoped ESLint/public imports; позитивні/негативні boundary assertions. 301 source consistency перевіряється відтворюваним Node assert; самі HTTP redirects не перевірялися. Відсутність окремого app browser harness не маскується позитивним тестом.

## Findings

| ID     | Severity                      | Статус   | Evidence / правило                                                                                                                                                                                                                                           | Target / task                                                                                                                   |
| ------ | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| AF-001 | low (P3)                      | verified | До split: articles-query.ts:45 articlePath та :50 articlePageNumbers незалежні від URL query; article-types.ts:27 містить route identities. Delivery §Staged structure check; SDD map відводить query-файлу parse/serialize/href.                            | article-routes.ts + article-page-window.ts, незмінний public API; TS-007                                                        |
| AF-002 | low (P3), regression coverage | verified | До аудиту TS-005/Evidence містив одноразовий Node assert карти 301; збереженого source-regression guard не було. Audit phase05/testing rules: наявні перевірки мають бути відтворюваними для зміненого routing identity. Поточні redirects були правильними. | [source-invariants.mjs](../verification/source-invariants.mjs): map/config wiring + actual positive/negative boundaries; TS-007 |

Поведінкових P1/P2, витоку raw source до client або порушень server-only/module boundaries незалежні проходи не підтвердили. Повний SEO/візуальний аудит сюди не входить.

## 06. Виправлення та перевірка

TS-007 виконано. Нові article-routes.ts володіє ARTICLES_PATH/ARTICLE_SLUGS/articlePath; article-page-window.ts — articlePageNumbers; articles-query.ts зберігає тільки normalization/parse/serialize/query href. Public exports збережені, compatibility shims не створені. Final model inventory: 6 production files + 3 specs.

| Перевірка                               | Команда / доказ                                                                                                                                                                                                              | Результат                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Model regression                        | `node node_modules/nx/dist/bin/nx.js run site-content-model:vite:test --output-style=static -- --run src/lib/articles/articles.spec.ts src/lib/articles/article-routes.spec.ts src/lib/articles/article-page-window.spec.ts` | exit0, 18/18, 3 files                                                   |
| Source consumer                         | `site-content-data-access:vite:test -- --run`                                                                                                                                                                                | exit0, 7/7                                                              |
| UI consumer                             | `site-content-ui:vite:test -- --run src/lib/articles/articles-content.spec.tsx`                                                                                                                                              | exit0, 13/13                                                            |
| Feature/sitemap consumer                | `site-content-feature:vite:test -- --run src/lib/articles/articles-page.spec.tsx src/lib/content-sitemap.spec.ts`                                                                                                            | exit0, 13/13; shared sitemap містить паралельний wholesale case         |
| Source boundary/config guard            | `node --experimental-strip-types docs/specs/site/content/001-articles/verification/source-invariants.mjs`                                                                                                                    | exit0; 9 allowed, 5 forbidden edges; 6 ID→slug 301 + Next config wiring |
| Source types                            | `node node_modules/nx/dist/bin/nx.js run site:typecheck --output-style=static`                                                                                                                                               | exit0; next typegen + tsc                                               |
| Model test types                        | `node node_modules/typescript/bin/tsc -p libs/site/content/model/tsconfig.spec.json --noEmit`                                                                                                                                | exit0                                                                   |
| Scoped ESLint                           | model article files/public index + source-invariants.mjs                                                                                                                                                                     | exit0                                                                   |
| Independent post-refactor source review | exact route/window/query module roles, spec imports, unchanged alias/public API                                                                                                                                              | verified, no defects                                                    |

51 focused tests passed after the split. Один колишній route assertion тепер окремий case; продуктові сценарії не додані. Нові model modules не мають зовнішніх imports; актуальні project roles/edges та aliases перевірені. Заборонених imports, циклів і нових dependencies немає.

Build/browser/HTTP/E2E не запускалися за окремим правилом репозиторію; source guard не є runtime-перевіркою 301/404. Full SEO/visual audit не виконувалися.

- [x] AF-001/AF-002 verified; open/blocked/deferred findings немає.
- [x] Target tree, public API, actual constraints і characterization regression перевірені після split.
- [x] UI/data/feature/SEO keep-рішення мають обґрунтовані ролі.
- [x] SDD/task/traceability/feature card оновлені; сторонні wholesale/catalog правки збережені.
