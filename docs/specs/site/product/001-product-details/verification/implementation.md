# Реализация независимого этапа 4A — 2026-11-03

## Выполненный объём

EN-001 и TS-001/002/003/004/006/007/008 реализованы для независимой карточки: реальный API, domain model, фото/схема, server UI, UK/RU, темы, contact states, thin route, canonical/редиректы, metadata/JSON-LD, seed и product sitemap. TS-009 выполнена в части документации и проверки 4A. EN-002 и TS-005 остаются blocked: общего cart domain/checkout по-прежнему нет.

Целевой код: `apps/site`, `libs/site/product`, узкий optional sitemap input в `core/seo`, один разрешённый product-feature→catalog-model flow, регистрация новых aliases/targets. Производственные backend DTO/operations, глобальная тема и другие приложения не изменялись.

## Автоматические результаты

Команды выполнялись из `E:\RiderProjects\kedr-web`. В таблице приведены уникальные тесты; узкие повторные проверки после финальных правок не суммируются второй раз.

| Scope                        | Фактическая команда                                                                                                                                                              | Результат                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Model                        | `.\node_modules\.bin\vitest.cmd run --config libs/site/product/model/vite.config.mts`                                                                                            | exit0, 2 files /33 tests |
| Data access                  | `.\node_modules\.bin\vitest.cmd run --config libs/site/product/data-access/vite.config.mts`                                                                                      | exit0, 3 files /55 tests |
| UI                           | `.\node_modules\.bin\vitest.cmd run --config libs/site/product/ui/vite.config.mts`                                                                                               | exit0, 4 files /19 tests |
| SEO                          | `.\node_modules\.bin\vitest.cmd run --config libs/site/product/seo/vite.config.mts`                                                                                              | exit0, 2 files /9 tests  |
| Routing + server composition | `.\node_modules\.bin\vitest.cmd run --config libs/site/product/feature/vite.config.mts src/lib/routing/product-routing.spec.ts src/lib/detail/product-page.spec.tsx`             | exit0, 2 files /13 tests |
| Product crawling             | `.\node_modules\.bin\vitest.cmd run --config libs/site/product/feature/vite.config.mts src/lib/crawling/product-sitemap.spec.ts src/lib/crawling/product-sitemap-shards.spec.ts` | exit0, 2 files /29 tests |
| Core robots compatibility    | `.\node_modules\.bin\vitest.cmd run --config libs/site/core/seo/vite.config.mts src/lib/crawling/crawling.spec.ts`                                                               | exit0, 1 file /5 tests   |
| Boundaries                   | `npm run architecture:boundaries`                                                                                                                                                | exit0, 108 projects      |
| Boundary fixtures            | `npm run architecture:boundaries:fixtures`                                                                                                                                       | exit0, 27 tests          |

**Product:158 тестов**, отдельно core5 и boundary27. После уточнения перегрузки cacheLife повторён только index loader — 10/10. После исправления совместимости теста с lib ES2020 повторена только server composition — 3/3. Перестановки импортов линтером не меняли runtime поведение.

Новая междоменная fixture сначала упала на запрещённом product-feature→catalog-model flow, затем 5/5 прошли после узкого разрешения. Ни один другой cross-domain flow не открывался.

## Red → Green и структура

- Model: неправильный `cart` вместо `request-stock` на одновременно отсутствующих stock/price; mapper: отсутствие реальных mapped facts; loader/index: отсутствие ожидаемого товара/страниц. Затем 33+55 Green и разделение normalization, transport, walker/cache.
- UI: only-scheme, mixed price/stock и clipboard дали три behavioral Red, без ошибок runner/import. Затем 19 Green, typed dictionaries, маленькие client leaves.
- SEO: core default выдумывал неподтверждённую locale, Product ещё не содержал Offer. Два behavioral Red; затем9 Green с conditional Offer, confirmed alternates и безопасной сериализацией.
- Feature: old slug отдавал товар вместо redirect, unavailable подменялся missing, sitemap был пуст. Три behavioral Red; затем13 routing/SSR и29 crawling Green.
- Core robots: новый product shard отсутствовал в discovery — behavioral Red; после универсального optional input все5 compatibility tests Green.

Локальные structure checks пройдены на каждом пакете и при интеграции. DTO остались в data-access, SEO input создаётся feature, UI не импортирует API/catalog/cart, core не зависит от domain. Gallery/image, clipboard, server view, detail routing и crawling имеют отдельные владельцы ответственности. Подтверждённых открытых in-scope архитектурных findings нет; полный аудит не выполнялся.

## Типы и lint

Scoped ESLint проверял только product domain и непосредственно изменённые route/core crawling файлы. Исправлены9 ошибок порядка импортов, новых правил/исключений не добавлялось. Итоговая проверка прошла без нерешённых ошибок.

Узкая TypeScript-проверка объединила **23 root-файла** из actual пяти product `tsconfig.spec.json` и трёх app entries с их реальными импортируемыми production dependencies. No emit, exit0. Рабочий helper: `E:\Development\work\kedr-product-implementation\typecheck-product.cjs`. Отдельно UI `tsc --noEmit --project libs/site/product/ui/tsconfig.lib.json` — pass. Исправлены совместимость cacheLife overload и `Array.at` в типизированном тесте, без изменения app-wide compiler target.

Nx graph подтвердил `vite:test`, `typecheck`, `lint` у всех пяти новых проектов и правильные tags. Повторный запуск всей feature/app suite ради документации не выполнялся.

## Сохранность изменений

Чужие незакоммиченные изменения не включались в собственную реализацию и не откатывались. Генераторные добавления лишнего scoped Vitest plugin и форматирование global ESLint удалены только после сравнения с сохранённым baseline; существующие настройки сохранены. Общие robots файлы интегрированы context-checked Git patch с резервными копиями вместо полной замены. Изменённые индексы/архитектура обновляются точечно. Commit/branch/push/PR не создавались.

## Не выполнено и реальные ограничения

- Реальная покупка/quantity integration, общий count/persistence и working checkout — blocked EN-002/TS-005. Текущие disabled controls не являются завершением SC-011–SC-013. Контактный fallback доступному товару не придуман.
- Production build, live HTTP/streaming/status, browser/visual/manual/E2E, внешние validators и performance measurements — unrun, не были отдельно разрешены. Unit outcome selection и static server rendering не объявлены доказательством live HTTP404/308/500.
- Макетное фото/цена/SKU не используются в production; реальные media могут отсутствовать/не загружаться, для этого есть fallback.
- Публичный кеш обновляется по времени; backend webhook отсутствует. Покупка/заказ должны перепроверять актуальные данные у cart/order owner.
- У offset API нет snapshot token: индекс best-effort, наблюдаемая несогласованность получает один повтор, атомарная полнота не обещается. Лимит1000 страниц/locale явный, не скрытое усечение.
- Реальный seed нужен во время разрешённой сборки; при полном отсутствии доступных seeds подготовка завершается ошибкой. Фиктивный slug не подставляется.

Независимый этап4A готов в коде с автоматическим/source evidence. Полная поставка карточки с покупкой не объявляется завершённой до EN-002.

## Финальная документационная сверка

Целевой SDD validator: PASS — 31 Markdown-файл, 174 относительные ссылки, 12 правил, 29 сценариев, 9 TS/2 EN; checksum принятого концепта сохранён. Проверка добавленных ссылок по manifest34 изменённых/new docs:23 новых относительных targets — PASS. Scoped git diff --check — exit0, whitespace ошибок нет. Финальный scoped ESLint product/app/core — exit0. Все115 исходных git status entries сохранились; параллельные изменения вне feature не редактировались. Runtime проверки после документационных правок не повторялись, поскольку код не менялся.

## Последующий аудит с исправлениями — 2026-11-03

По отдельному запросу пользователя выполнен [scoped architecture audit](../code-audit/audit.md), найденные AF-001/002/003 исправлены. Category policy перемещена из UI в feature, DTO projections/raw404 parser — в private contracts, Site consumer docs/registry синхронизированы. Новых API operations, зависимостей и cross-domain разрешений нет.

Свежие focused проверки: data55, detail UI3, feature mapping/SSR6 —64 tests passed; source/test/app type projection24 roots, scoped ESLint14 paths и boundary graph108 projects pass. Это не повторный прогон всех162 текущих product tests: исходные158 results выше относятся к реализации до4 новых regression tests. Нижние unaffected model/SEO/crawling/core проверки и27 fixtures повторно не запускались. Подробности docs/source/diff verification и split/keep — в audit report. Live HTTP/build/browser/E2E unrun, EN-002/TS-005 всё ещё blocked.
