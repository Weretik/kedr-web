# Next.js и существующая интеграция

## Маршруты / Server Components

Тонкий route: `apps/site/src/app/[locale]/(content)/wholesale/page.tsx`. Await params → isLocale / notFound → WholesalePage. generateMetadata отдельно вызывает domain buildWholesaleMetadata после проверки locale. Ни API-получение, ни набор блоков, ни фактические SEO-строки не помещаются в route.

| Адрес                        | Рендеринг / статус                                                                          | Свежесть                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| /uk/wholesale, /ru/wholesale | Public server content + cached categories; 200 при нормальных/пустых/недоступных категориях | Локальные copy/COMPANY с deploy, каталог по текущему cache policy |
| Неподдерживаемая locale      | Штатный notFound, 404                                                                       | n/a                                                               |

Locale layout уже задаёт static params. Нового generateStaticParams, loading.tsx, layout, error.tsx или not-found.tsx для wholesale не нужно. Модель рендеринга наследует существующие Cache Components; фактическую route table можно утверждать только после отдельно разрешённого build.

Все новые page sections, словарь, composition, metadata и BreadcrumbList — server-compatible. Новых `'use client'` leaf, browser APIs, cookies/headers, Server Actions и личных данных нет. FAQ сразу показывает короткие ответы.

## Существующая API-граница

| Поле                            | Значение                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Provider                        | KedrStore                                                                                                                             |
| Snapshot source                 | `docs/contracts/openapi/SOURCE.md`: backend `docs/sdd/contracts/openapi.yaml`                                                         |
| Provider revision на подготовку | `527d18934ee271c9ffa3d475f3a545026f4b3248`                                                                                            |
| Версия документа                | Category Read API 0.1.0, OpenAPI 3.1.0                                                                                                |
| Операция                        | `getCategoryTree`, GET `/api/catalog/{lang}/categories`, security: []                                                                 |
| Schema owner                    | `docs/contracts/openapi/catalog/category-read.openapi.yaml`: CategoryTreeNode (OpenAPI DTO) → CatalogTreeNode (`@site/catalog/model`) |
| Transport                       | `@site/shared/api-client` через существующий `getCatalogTree(locale)`                                                                 |
| Mapping                         | `catalog/data-access/.../category-tree.mapper.ts`; normalized `@site/catalog/model`                                                   |
| Изменение контракта             | Не требуется; snapshot/DTO/types не редактируются и не копируются в content                                                           |

[Контракты проекта](../../../../../contracts/README.md), [SOURCE](../../../../../contracts/openapi/SOURCE.md). У wholesale нет собственного network/DTO слоя. В SDD не создаётся отдельная копия API-контракта. При реализации сверить, что существующий public API остаётся совместим; при реальном изменении провайдера остановить зависимую часть и применить project contract-sync процесс.

## Кэш и деградация

getCatalogTree уже `server-only`, `'use cache'`, tags `catalog` / `catalog:categories`. Успех: cacheLife('hours'); ошибка: существующий FAILURE_LIFE `{stale:60, revalidate:60, expire:3600}`, результат null. Wholesale не меняет эти сроки, не вводит own cache scope, polling, revalidation endpoint или новую отмену.

Cached categories включаются в серверный/prerendered output. Содержимое/metadata не переносятся в клиентский запрос или поздний Suspense fallback. Запрос layout к тому же каталогу остаётся его существующим делом; feature не создаёт вторую transport-реализацию. Metadata статична и не запрашивает tree.

Null/empty/doors-only → 200 с meaningful static content и сообщением в ассортименте. Partial → реальные группы. Не трактовать отсутствие категорий как отсутствие товара у компании. Непредвиденные programming errors не скрывать общим catch: штатный error flow сохраняется.

Запрещены старые `export const revalidate`, `fetch(...,{next})`, `unstable_cache`, `dynamic`, `dynamicParams`. Текущий missing backend revalidation webhook — общий проектный контекст, не новая предпосылка wholesale.

## Изображения / загрузка

Catalog CategoryCards получает optional `variant: 'default' | 'compact'`, default неизменен. Compact: две колонки на телефоне, три от lg; фото с известным соотношением сторон, name/link/arrow, без productCount и children. Next/Image и таблица assets остаются в catalog/ui, `sizes` соответствует двум/трём колонкам, object-contain сохраняет коллажи. Не делать все шесть фото priority: используется false; первый экран ведёт текстом, дополнительного hero-photo нет.

Onest приходит из существующего next/font. Никаких Google Fonts imports из макета, icon CDN, iframe PNG-концепта или third-party scripts. Целевые бюджеты применяют текущий Site подход (LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 при будущих согласованных измерениях); это цели, не полученный результат или обещание по PNG.

## Источники Next.js и проверки

Установлен Next 16.4.3. Прочитаны релевантные установленной версии guides:
`node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`,
`08-caching.md`; metadata guide сверён в read-only анализе SEO-агента.
Перед реализацией новых framework APIs дочитать только нужный раздел установленной документации.

Проверки будущей реализации: компонентный server output/locale/fallback, unit SEO, sitemap и route typecheck для отдельного риска async params/metadata. Source output не доказывает реальный HTTP 200/404, streaming/head или build table. План и отложенные release-измерения — в [verification](../verification/seo-verification.md). Реализация завершена: focused tests, route typecheck и actual graph прошли; build/HTTP/browser не запускались.
