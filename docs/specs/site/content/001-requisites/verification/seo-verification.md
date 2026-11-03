# Проверка реализации и ограничения

Дата: 2026-11-03. Реализация разрешена пользователем; production-реквизиты подтверждены отдельным ответом в текущем чате.

## Автоматизированные доказательства

| Boundary       | Точная команда                                                                                                                                    | Valid Red                                                                                 | Green первичного пакета                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Model          | `npx nx run site-content-model:vite:test -- --run src/lib/requisites-copy.spec.ts`                                                                | exit 1, 2 failed / 3 passed; отсутствовал № в выписке                                     | exit 0; 1 file / 5 tests                              |
| Clipboard      | `npx nx run site-content-ui:vite:test -- --run src/lib/requisites/requisites-copy-button.spec.tsx`                                                | exit 1, 4 failed / 7 passed; отсутствовал exact selectable fallback                       | exit 0; 11 tests, затем повторён в финальном UI scope |
| UI final       | `npx nx run site-content-ui:vite:test -- --run src/lib/requisites/requisites-content.spec.tsx src/lib/requisites/requisites-copy-button.spec.tsx` | exit 1, 2 failed / 16 passed; отсутствовала privacy link в UK/RU                          | exit 0; 2 files / 18 tests                            |
| SEO            | `npx nx run site-content-seo:vite:test -- --run src/lib/requisites-metadata.spec.ts src/lib/requisites-json-ld.spec.ts`                           | exit 1, 4 failed / 5 passed; explicit config/origin/robots не учитывались                 | exit 0; 2 files / 9 tests                             |
| Server feature | `npx nx run site-content-feature:vite:test -- --run src/lib/requisites-page.spec.tsx`                                                             | exit 1, 3 failed / 2 passed; отсутствовали breadcrumbs/full payload                       | exit 0; 1 file / 5 tests                              |
| Sitemap        | `npx nx run site-content-feature:vite:test --output-style=static -- --run src/lib/content-sitemap.spec.ts`                                        | тот же scope без output-style: exit 1, 1 failed / 4 passed; отсутствовали requisites URLs | exit 0; 1 file / 5 tests                              |

Итого — **43 passing tests в 7 spec-файлах**, без двойного счёта промежуточных clipboard/UI прогонов. Последние unit/component/server прогоны свежие, Nx cache 0/1. Ошибка detached DOM fixture перед valid TS-003 Red исправлена и не считалась поведенческим Red.

`npx nx run site:typecheck --output-style=static`: exit 0, **Nx cache 1/1**. Это подтверждённый результат для вычисленного target state; свежий запуск compiler/typegen этим прогоном не заявляется.

Scoped ESLint завершился с exit 0 для групп новых model/SEO/config/index файлов (13), UI (9), feature/route (3), sitemap/index (3). После последних UI правок повторялись только изменённые 3 файла. Prettier выполнен для новых/изменённых файлов; style/links/diff документации проверяются отдельно от runtime.

Финальная перепроверка после параллельного добавления public-offer в общий registry: `npx nx run site-content-feature:vite:test --output-style=static -- --run src/lib/requisites-page.spec.tsx src/lib/content-sitemap.spec.ts` — exit 0, 2 files / 11 tests passed (feature 5 + registry 6), cache 0/1. Текущий итог по последним scope — 43 tests, а не сумма повторных прогонов. Остальные code boundaries не менялись и не повторялись.

## Source и структура

- Coordinator проверил public exports, отсутствие deep/cross-layer обходов, planned/actual map и сохранение соседних реестров.
- Source facts находятся только в COMPANY_REQUISITES; phone в COMPANY; словарь содержит интерфейсные подписи.
- Feature SSR выводит все 6 фактов, исходное UAимя в обеих локалях и один BreadcrumbList; UI и real copy controls не mock в integration test.
- Thin route ожидает Promise params и вызывает isLocale/notFound в page/metadata. Неподдерживаемая locale проверена source/type способом, не реальным HTTP.
- Тема и responsive wiring: existing tokens, primary Button, md grid/mobile stack, min-w-0, breakable values, 44px actions, focus/scroll offsets.
- Независимый source review семи UI компонентов не выявил существенных дефектов. Это source review внедрения; последующий scoped architecture audit 00–06 записан ниже и не является browser/fidelity pass.

## Подтверждение и gate публикации

EN-001 verified 2026-11-03: пользователь ответил «Да, подтверждаю эти данные и подписи». Точный набор и краткое имя банка находятся в [data-confirmation](../design/data-confirmation.md).

EN-002 open. В параллельной работе появился `(content)/public-offer/page.tsx`; его бизнес-содержание/HTTP этим объёмом не проверялись. Privacy-policy не найден в проверенных named destinations. Href assertions обеих ссылок pass; реальная доступность и полнота SC-012 не подтверждены. Локальная реализация завершена, публикация юридических ссылок ждёт владельца релиза.

## Документация

Feature card содержит actual Mermaid/tree/Tests; catalog/spec index и затронутые modules/SEO facts обновлены. Локальные Markdown links, R/SC/TS/EN, трассировка и graph consistency проверяются в текущем handoff. PNG и prompt сохраняются без изменения. Подробные behavioral evidence находятся в задачах.

## Незапущенные проверки

| Проверка                           | Статус / причина                             | Влияние                                                |
| ---------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| Production build / rendering table | unrun; отдельно не поручен                   | Не заявляется подтверждённый deployment prerender      |
| HTTP 200/404, реальный head/XML    | unrun; приложение не запускалось             | Unit/SSR objects не объявляются HTTP evidence          |
| Schema external validators         | unrun; отдельно не поручены                  | Rich results не обещаются                              |
| Browser/visual/manual/E2E          | unrun; отдельного разрешения не было         | Geometry/fidelity/реальные permissions не подтверждены |
| Полный suite/coverage/audit        | unrun; не входит в необходимый focused scope | Не считается провалом узких проверок                   |
| Deploy/публикация                  | unrun; не поручены, EN-002 open              | Release gate остаётся открытым                         |

После отдельного поручения на HTTP/browser/build использовать согласованную процедуру и записать origin/revision/date/точные результаты. Эти действия не разрешаются автоматически наличием SDD.

## Архитектурный аудит после внедрения

По отдельному запросу пользователя выполнен [scoped audit](../code-audit/audit.md) и TS-008. AF-001 low verified: Support разделён на legal navigation и manager card. Fresh regression: UI 18/18 + server feature 5/5, skip-nx-cache. Source/test Compiler API с реальными options: 2 source roots и 7 spec roots, обе группы 0 diagnostics. Runtime data/model/SEO/sitemap не менялись; их suites не повторялись. Scoped lint/format трёх runtime файлов pass; 16 actual edges и четыре negative cases проверены. Это заменяет прежнюю ограниченность cached source-only type evidence для текущего аудита. Build/HTTP/browser/SEO-audit не выполнялись; EN-002 остаётся отдельным gate.
