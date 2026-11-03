# Frontend baseline і карта

Джерела: [модулі](../../../../../architecture/site/structure/modules.md), [delivery](../../../../../standards/shared/delivery-rules.md), [testing](../../../../../standards/shared/testing-rules.md), [дизайн](../../../../../standards/site/design-system.md).

## Початковий baseline перед реалізацією

Існують content/model, ui, seo, feature з tags scope:site/domain:content і aliases @site/content/*. Нового data-access на момент baseline не було; EN-001 створює його Nx generator, без нових npm dependencies. Next 16.4.3, React 19.3.0, Tailwind 4.3.3, lucide-react 1.66.0 — існуючий stack. Vitest/RTL, inferred vite:test; без нових harness.
Shell володіє main#content/header/footer/theme/locale. Core SEO вже має search-aware canonical. content/seo суворо залежить тільки від core config/i18n/seo. Ніяких імпортів Angular/admin/catalog UI.

Найближчі приклади: catalog SearchPage GET + Suspense + sr-only label; catalog SortSelect client leaf; content ContactsPage server composition. Catalog pager не перевикористовується: його розміри 20/50/100 і приховані межі не відповідають погодженню.

## Цільові межі

app → content feature/seo; feature → content model/ui/data-access/seo, core. data-access → content/model. ui → model, core i18n, shared/ui. seo → core config/i18n/seo. Тільки public index. Model — чисті обчислення; data-access — локальні дані; feature — orchestrating, без карткового JSX; UI — семантика/стилі; client leaf — лише change size та scroll, без повних текстів.

## Карта (від кореня репозиторію)

| Шлях                                                                | Стан             | Одна роль / task                                    |
| ------------------------------------------------------------------- | ---------------- | --------------------------------------------------- |
| libs/site/content/model/src/lib/articles/article-types.ts           | exists           | typed Article/query/result, TS-001                  |
| libs/site/content/model/src/lib/articles/articles-query.ts          | exists           | parse/serialize/href, TS-001                        |
| libs/site/content/model/src/lib/articles/article-routes.ts          | exists           | route path/slug identities, TS-007                  |
| libs/site/content/model/src/lib/articles/article-page-window.ts     | exists           | pager window algorithm, TS-007                      |
| libs/site/content/model/src/lib/articles/articles-listing.ts        | exists           | filter/slice/clamp/range, TS-001                    |
| libs/site/content/model/src/lib/articles/articles-dictionary.ts     | exists           | UK/RU labels, TS-003                                |
| libs/site/content/model/src/index.ts                                | exists           | coordinator public API                              |
| libs/site/content/data-access/**                                    | generated EN-001 | server-only legacy source + selectors/tests, TS-002 |
| apps/site/public/images/articles/Article_1.jpg … Article_6.jpg      | exists           | existing photos, TS-002                             |
| libs/site/content/ui/src/lib/articles/article-card.tsx              | exists           | one card/link/image, TS-003                         |
| libs/site/content/ui/src/lib/articles/articles-content.tsx          | exists           | list composition, TS-003                            |
| libs/site/content/ui/src/lib/articles/articles-search-form.tsx      | exists           | GET form, hidden label, TS-003                      |
| libs/site/content/ui/src/lib/articles/articles-page-size-select.tsx | exists           | narrow navigation leaf, TS-003                      |
| libs/site/content/ui/src/lib/articles/articles-pagination.tsx       | exists           | range and pager, TS-003                             |
| libs/site/content/ui/src/lib/articles/article-content.tsx           | exists           | full article reading UI, TS-003                     |
| libs/site/content/ui/src/index.ts                                   | exists           | coordinator exports                                 |
| libs/site/content/seo/src/lib/articles/articles-metadata.ts         | exists           | list/detail metadata, TS-004                        |
| libs/site/content/seo/src/lib/articles/articles-json-ld.ts          | exists           | BreadcrumbList/Article, TS-004                      |
| libs/site/content/seo/src/index.ts                                  | exists           | coordinator exports                                 |
| libs/site/content/feature/src/lib/articles/articles-page.tsx        | exists           | server list + metadata bridge, TS-005               |
| libs/site/content/feature/src/lib/articles/article-page.tsx         | exists           | server detail + notFound, TS-005                    |
| libs/site/content/feature/src/index.ts                              | exists           | coordinator exports                                 |
| libs/site/content/feature/src/lib/content-sitemap.ts                | exists           | list/detail descriptors, TS-005                     |
| apps/site/src/app/[locale]/(content)/articles/page.tsx              | exists           | thin list route, TS-005                             |
| apps/site/src/app/[locale]/(content)/articles/[slug]/page.tsx       | exists           | thin detail route, TS-005                           |
| apps/site/next.config.ts                                            | exists           | 6 old-ID → slug 301 entries, TS-005                 |
| docs/features/site/articles.md + indexes                            | exists           | actual feature navigation, TS-006                   |

Associated *.spec.ts(x) are owned by the same task as source. Existing delivery/returns/contacts components and tests stay unchanged. Generator may update tsconfig alias; coordinator owns root config/index integration. EN-001 verifies generated files before parallel editing. File structure is checked after each package and after integration; feature audit TS-007 completed after the direct request.

## State and tests

URL is committed state, search draft stays in native GET input; no Redux/localStorage. GET omits page on new search. Select uses router transition and resets page. Page links are server links with preserved query. Focus does not move automatically. Query content escapes as text. New source has no auth/private data. Synthetic 26/51 records only in model/UI tests.

## Фактичний результат

Карта реалізована; додатково виділені article-cover.tsx (спільне зображення/fallback), articles-header.tsx та articles-loading.tsx, plain SEO types/copy і apps/site/article-redirects.ts (deployment map). Source/selector розділені у data-access. Новий project має Node Vitest, moduleResolution=bundler і existing alias; root plugins/rules не змінені. [Повне актуальне дерево](../../../../../features/site/articles.md). Структура перевірена після кожного пакета та після інтеграції; підтверджених відкритих findings немає, аудит функції 00–06 виконаний у TS-007.

## Аудит responsibilities

[Аудит](../code-audit/audit.md): AF-001/AF-002 verified. Model тепер має 6 production files і 3 specs. Публічні aliases збережені, route/window assertions перенесені без втрати coverage. UI/data-access/feature/SEO залишені cohesive за записаними keep-рішеннями; нових шарів або dependencies немає.
