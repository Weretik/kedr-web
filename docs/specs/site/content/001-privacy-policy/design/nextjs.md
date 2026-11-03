# Next.js public site

Проверены Next 16.4.3 из lockfile и установленные guides: node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md (включая async params) и 08-caching.md. Перед кодом сверить эти же разделы, если версия изменилась.

## Route contract

| Адрес                                      | Тип            | Rendering / freshness                                         | Static params                    | Ожидаемый status |
| ------------------------------------------ | -------------- | ------------------------------------------------------------- | -------------------------------- | ---------------- |
| /uk/privacy-policy                         | public content | Статический серверный документ, обновление при rebuild/deploy | Наследует uk/ru от locale layout | 200              |
| /ru/privacy-policy                         | public content | То же                                                         | То же                            | 200              |
| Неподдерживаемая локаль / неизвестный path | invalid        | Existing not-found policy                                     | Не расширять список локалей      | 404              |

Тонкий route ожидает params как Promise, проверяет isLocale, вызывает PrivacyPage и buildPrivacyMetadata. Защита notFound остаётся у app boundary. Layout уже задаёт generateStaticParams для LOCALES, shell, lang, fonts, theme, root metadata и Organization; дублировать их в странице не нужно.

## Rendering и кэш

Cache Components и partialPrefetching включены в next.config.ts. У политики нет runtime data, API fetch, clock, cookies, headers, searchParams или зависимости от пользовательской сессии. Все локализованные блоки и metadata доступны при prerender; специальных Suspense, loading.tsx и page cache directives не требуется.

Не добавлять revalidate, dynamic/dynamicParams, unstable_cache или fetch-next caching. Конфигурация окружения читается только существующим core/config. Отдельные cache tags, webhook и data-access для политики не нужны. Existing shell data/caching остаются в своём владельце.

## Server/client boundary

- model: pure copy, types и deterministic bindings.
- UI: server components, native details и ссылки; CSS :target/:has.
- feature: получает COMPANY/siteConfig, собирает dictionary, добавляет JsonLd с BreadcrumbList и вызывает UI.
- seo: metadata и breadcrumb builder; только core config/i18n/seo public APIs.
- app: route params, guard и delegation.

Новых client components, Server Actions, browser storage, API операций, OpenAPI snapshot changes или permissions нет. Шапка уже имеет свои клиентские controls; фича их не дублирует.

## UI и states

[Визуальный контракт](visual.md) задаёт обе темы и 320–1440 px. Нет новой картинки, next/image, web-font загрузки, внешнего скрипта или большого client bundle. Принятый PNG хранится только в документации.

Network-dependent loading/empty/error для статической политики — n/a. Unknown route/locale использует существующую 404-границу; не создавать отдельную альтернативную error page.

## Проверка

Точные файлы и команды — [TS-001](../tasks/TS-001-policy-model.md), [TS-002](../tasks/TS-002-policy-ui.md), [TS-003](../tasks/TS-003-policy-seo.md), [TS-004](../tasks/TS-004-route-discovery.md). Site typecheck проверяет thin boundary; статический анализ и server-render тест не выдаются за HTTP/build evidence. Все фактические результаты записываются отдельно.
