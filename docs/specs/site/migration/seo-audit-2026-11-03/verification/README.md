# Доказательства SEO-аудита

Проверка нового `apps/site` в `E:/RiderProjects/kedr-web`, 2026-11-03. Пользователь отдельно разрешил локальные HTTP и браузерные проверки. Основной агент собрал runtime evidence и интегрировал независимые source-аудиты двух агентов; один из них также выполнил ограниченные unit-проверки, второй проверил проект итогового отчёта на необоснованные выводы.

## Среда и границы

- Origin запросов: `http://localhost:3000`. Использован существующий Next.js dev-сервер, PID 31324 на момент обнаружения; он не перезапускался и не останавливался. Попытка запуска отдельного dev-процесса завершилась из-за занятого dev lock; её переменные окружения не применялись к существующему серверу.
- Production origin в metadata: `https://classkedr.com.ua`. Отсюда не выполнялся crawl production-страниц: URL sitemap переписывались на localhost перед запросом.
- Наблюдаемая защита: robots meta `noindex, nofollow`, robots.txt `Disallow: /`. Реальные значения process env существующего сервера не извлекались; секреты и `.env` не читались.
- Фактические пакеты проекта: Next 16.4.3, Vitest 5.0.5. Browser automation — ephemeral `@playwright/cli`, без изменения зависимостей репозитория.
- Рабочее дерево было и остаётся незакоммиченным, часть соседних фич менялась параллельно. SHA-256 в source-hashes.json фиксируют файлы на момент сбора контрольных сумм; они не превращают разные HTTP-запросы в одну неизменяемую сборку.
- Production build, полный Site test suite, typegen, нагрузочные тесты, E2E-набор, API fault injection, production Rich Results и полевая оценка CWV не выполнялись.

## Файлы

| Файл                                                                             | Назначение                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `http-pages.json`                                                                | Последний сохранённый результат URL/сценария: время, статус/redirect chain, headers, metadata, H1/H2, canonical/hreflang, links и parsed JSON-LD. Для images пропущены двоичные тела. Ответы robots/sitemap сохранены текстом |
| `browser-pages.json`                                                             | DOM шести контрольных адресов после навигации и отдельная мобильная запись `/uk/public-offer` при 390px                                                                                                                       |
| `sitemap-before-gallery.xml`, `sitemap-partial.xml`, `sitemap-observations.json` | Сохранённые полное и сокращённое состояния sitemap с временем запросов; HTTP 200 при исчезновении 86 категорий                                                                                                                |
| `analysis.json`                                                                  | Покрытие всех loc sitemap, canonical/title/description/H1, языковые пары, JSON parse, сравнение HTTP с browser DOM; не является Google Rich Results validation                                                                |
| `pages.csv`                                                                      | Таблица данных для фильтрации/сравнения, UTF-8 BOM                                                                                                                                                                            |
| `public-offer-mobile.png`                                                        | Снимок страницы шириной 390px после браузерной навигации                                                                                                                                                                      |
| `core-seo-tests.txt`, `catalog-seo-tests.txt`                                    | Исходный stdout focused Vitest, exit 0 / exit 0, 12 + 5 passed                                                                                                                                                                |
| `source-hashes.json`                                                             | Контрольные суммы непосредственно использованных исходников и SEO-правил                                                                                                                                                      |
| `gsc-access.json`                                                                | Результат read-only list sites: пустой список доступных properties; не оценка индекса                                                                                                                                         |
| `dev-observations.json`                                                          | Зафиксированные dev retry и предупреждение об LCP-кандидате, без production CWV score                                                                                                                                         |
| `collect-http.cjs`, `browser-dom.js`, `extra-cases.json`, `final-cases.json`     | Использованные read-only сборщики и адреса повторного прохода                                                                                                                                                                 |

Raw mainText/mainWords получены DOM-парсером до исполнения служебных streaming-скриптов Next. Часть готового серверного HTML находится в потоковых контейнерах вне исходного main; поэтому эти поля не означают полноту видимого текста и не использованы как показатель качества/минимальной длины. Фактический видимый текст есть в browser-pages.json; serverText в поздних запросах сохраняет plain text всех потоковых фрагментов без script/style.

Parsed JSON-LD может иметь `@graph`; типы извлекаются также из его узлов. Успешный JSON.parse не доказывает прохождение всех требований поисковой функции Google. Noindex в локальном HTML не доказывает production-indexability фильтров: она проверена отдельно по исходникам и unit tests с тестовой production config.

## Повторение HTTP-проверки

Из корня репозитория, при отдельно разрешённом и уже работающем локальном Site:

```powershell
node docs/specs/site/migration/seo-audit-2026-11-03/verification/collect-http.cjs static
node docs/specs/site/migration/seo-audit-2026-11-03/verification/collect-http.cjs cases
node docs/specs/site/migration/seo-audit-2026-11-03/verification/collect-http.cjs custom docs/specs/site/migration/seo-audit-2026-11-03/verification/extra-cases.json
node docs/specs/site/migration/seo-audit-2026-11-03/verification/collect-http.cjs custom docs/specs/site/migration/seo-audit-2026-11-03/verification/final-cases.json
node docs/specs/site/migration/seo-audit-2026-11-03/verification/collect-http.cjs sitemap
```

Сборщик пишет новые результаты в `seo-runtime/` рядом со своим файлом, не перезаписывая исходные evidence в этой директории. Запросы идут по два одновременно, новые назначения redirect допускаются только на localhost/127.0.0.1. Времена относятся к dev и не являются production latency/CWV. Product URLs берутся из реального каталога; тело sitemap предоставляет все canonical destinations для последней фазы.

## Браузер

Создана и затем закрыта только сессия `kedr-seo`. Последний сохраняемый DOM-проход:

```powershell
npx --offline --yes --package @playwright/cli playwright-cli -s=kedr-seo open http://localhost:3000/uk
npx --offline --yes --package @playwright/cli playwright-cli -s=kedr-seo run-code --filename docs/specs/site/migration/seo-audit-2026-11-03/verification/browser-dom.js
npx --offline --yes --package @playwright/cli playwright-cli -s=kedr-seo close
```

В исходном проходе browser дополнительно навигировал по типам контентных страниц и 404; для проверяемых выводов о DOM сохранена компактная выборка из browser-pages.json. Для повторения не требуется регистрировать продуктовые/частные операции, входить в аккаунт или оформлять заказ.

## Focused tests

Рабочая директория: `E:/RiderProjects/kedr-web`. Точные команды:

```powershell
node 'E:\RiderProjects\kedr-web\node_modules\vitest\vitest.mjs' run --config 'E:\RiderProjects\kedr-web\libs\site\core\seo\vite.config.mts' 'src/lib/metadata/page-metadata.spec.ts' 'src/lib/crawling/crawling.spec.ts' 'src/lib/json-ld/json-ld.spec.tsx'
node 'E:\RiderProjects\kedr-web\node_modules\vitest\vitest.mjs' run --config 'E:\RiderProjects\kedr-web\libs\site\catalog\seo\vite.config.mts' 'src/lib/metadata/catalog-metadata.spec.ts'
```

Перед запуском в PowerShell установлены `$env:FORCE_COLOR = $null` и `$env:NO_COLOR = '1'`; stdout/stderr сохранены через Tee-Object с проверкой exit code Node. Результат: 4 spec-файла, 17 passed. Проверяются builders robots/canonical/alternates/sitemap/JSON serialization с production/preview fixture configs; не deployment, не реальный 503 и не production rendering. Исходники, зависимости и test configs не исправлялись.

## Ограничения полноты

Покрытие 120 canonical URL получено из объединения полного раннего sitemap (118 адресов) и финального XML с добавленной галереей. Финальный XML сократился до 34 адресов и это отдельно отражено как находка SEO-005; 120 не выдаётся за его фактический размер. Он не проверяет каждый product URL и каждый произвольный набор фильтров, не является инвентаризацией всех старых индексированных URL и не подтверждает живую индексацию Google. Для cutover нужна отдельная полная old→new карта из действующего сайта/GSC/логов и проверки готового hosting deployment.
