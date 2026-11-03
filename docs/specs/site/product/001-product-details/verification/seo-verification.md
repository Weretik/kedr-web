# План runtime / SEO verification

**Состояние:** реализация4A и автоматические проверки выполнены; production HTTP/build/browser/validators не выполнялись. [Evidence](implementation.md). Этот протокол не является разрешением на build/browser/full suite. Действуют [правила проверки](../../../../../standards/shared/testing-rules.md) и root AGENTS.

## Автоматические проверки при реализации

| Владелец | Что доказывает                              | Evidence                 |
| -------- | ------------------------------------------- | ------------------------ |
| TS-002   | normalization/outcomes/public cache inputs  | task mapper/loader tests |
| TS-006   | canonical/alternates/Offer/escaping         | task builder tests       |
| TS-007   | route outcome selection/server composition  | task feature tests       |
| TS-008   | sitemap entries/paging/limits/robots inputs | task focused tests       |

Mock notFound/redirect не доказывает фактический HTTP status, source classes не доказывают browser layout.

## Отдельный production HTTP check

Только после разрешённого build/запуска. Записать разрешение, commit/worktree, команды, fixture/source и результат; не использовать demo SKU в реальном каталоге.

| Запрос                                         | Ожидание                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| текущий UK и RU product URL, cold request      | 200, свой H1/price/stock/facts в HTML, правильные canonical/locale/JSON-LD |
| old slug                                       | настоящий 308 с нужным Location до stream                                  |
| неизвестный slug                               | настоящий404, noindex, без Product/Offer                                   |
| removed + category destination                 | настоящий308 категории                                                     |
| unavailable controlled source                  | настоящий500/error/retry, не200 и не404                                    |
| price=null, stock≤0, missing media             | независимые видимые состояния, соответствующий JSON-LD                     |
| product sitemap shards / robots / root sitemap | валидный XML, expected URLs/alternates/limits, root сохранён               |
| preview                                        | noindex + robots disallow `/`, без переключения env флагов                 |

Планируемые команды после отдельной авторизации: `npx nx run site:build`, локальный production server, `curl.exe -i <local-product-url>` и чтение HTML/XML. Конкретный порт/URL/sku выбирается из запущенного окружения и записывается тогда; сейчас такой среды нет.

## Visual/manual/validators

Перед browser/visual/manual проверкой задать отдельный конкретный вопрос пользователю и дождаться ответа. Матрица: 320/390/768/1024/1440, обе темы/локали, long data, 200% text, one/both media failures, keyboard, quantity/cart outcomes. При разрешении записать capture paths и фактические результаты, а не только факт открытия браузера.

Rich Results Test / Schema Validator и performance measurements также не заявлены выполненными. Они применяются к реальному доступному output, не к концепту с демонстрационными данными.
