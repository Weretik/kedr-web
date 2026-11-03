# Next.js-дизайн

Источники: [site architecture](../../../../../architecture/site/README.md), [rendering/cache rules](../../../../../architecture/site/platform/rendering-and-caching.md), [карта файлов](frontend.md), [SEO](seo.md). Установленный и lockfile Next.js — 16.4.3. Изучены соответствующие local guides `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` и `08-caching.md`; перед кодом исполнитель проверяет актуальность версии и нужных API.

## Маршруты и рендеринг

| Адрес                   | Тип / рендеринг                                                                | Свежесть                | Ответ                                         |
| ----------------------- | ------------------------------------------------------------------------------ | ----------------------- | --------------------------------------------- |
| /uk/requisites          | Public content; статическая server-разметка из локальных подтверждённых фактов | Review + rebuild/deploy | 200 после интеграции; indexing по общему gate |
| /ru/requisites          | То же, полный RU интерфейс                                                     | То же                   | То же                                         |
| Неподдерживаемая locale | Существующий not-found flow                                                    | n/a                     | 404, не обычная страница                      |

Реализованный route: `apps/site/src/app/[locale]/(content)/requisites/page.tsx`. Route group не входит в URL. Прежние Angular route уже имеют `/{locale}/requisites`, что подтверждается `app.routes.ts` и `about-us/src/lib/lib.routes.ts`; redirects для вымышленного `/about-us/requisites` не добавляются.

Route ожидает params, проверяет `isLocale` и передаёт Locale в `RequisitesPage`; `generateMetadata` после той же проверки делегирует `buildRequisitesMetadata`. Ближайший пример — существующий contacts route. Родительский locale layout уже определяет locales для prerender; собственный generateStaticParams этой странице не нужен.

Cache Components включён. Страница не вводит request-time API, cookies/headers, fetch, Server Actions, собственный Suspense или data-access. Для синхронных локальных фактов cache directives/tags/lifetime не нужны. Не вводить `revalidate`, `dynamicParams`, `unstable_cache` или старый fetch-next cache API. Общие catalog-запросы header остаются у существующих владельцев.

## Server/client

- Server: route, feature, весь основной контент и UI-блоки, чтение фактов/словаря, pure copy formatter, metadata и BreadcrumbList.
- Client: только `requisites-copy-button.tsx`. Два экземпляра получают text и labels, вызывают Clipboard write только по действию посетителя.
- Телефон и полезные ссылки — обычные anchor/Next Link; телефон независим от clipboard. Внешние URL не вводятся.
- Якоря: `#requisites-administration`, `#requisites-bank`, `#requisites-payment`. `#content` остаётся у единственного main shell.
- PNG, prompt и preview-макет не импортируются в runtime; изображения текста не заменяют факты.

## Данные и состояния

`COMPANY_REQUISITES` создан после явного подтверждения EN-001; feature структурно собирает RequisitesDetails вместе с COMPANY. Типы и helper не требуют обратной зависимости config → domain. API/operationId/DTO/auth/revalidation endpoint — n/a, эта функция не пересекает backend boundary.

У server content loading/empty/offline — n/a, источник локальный. Общие error/not-found boundaries сохраняются. Clipboard обрабатывает idle/pending/success/error локально, сохраняет selectable fallback и retry. В отсутствие JS сведения/ссылки доступны, а копирование возможно вручную.

## Навигация и зависимости

Существующий shell уже выводит requisites legal link и переключает язык на эквивалентный адрес. Новые shell exports, элементы навигации и рефакторинг contacts не нужны.

Доставка/оплата ведёт на `/{locale}/delivery-and-payment`. Оферта/политика — `/{locale}/public-offer` и `/{locale}/privacy-policy`; их фактическая готовность является внешним EN-002. Перенос целевых страниц в этот объём не включён.

## Проверяемые пределы

Server component tests подтверждают наличие текста и JSON-LD до hydration. Они не доказывают HTTP-код, реальный metadata head, размер rendered-layout или production rendering table.

В TS-005 проверяются thin route, locale guard и типы; реальный 200/404/head записывается отдельно только после разрешённого HTTP-прогона. Build, запуск приложения, браузер, visual/manual/E2E не запускаются автоматически из-за наличия этой SDD.
