# SEO-дизайн контактов

Источники: [SEO rules](../../../../../standards/site/seo-rules.md), [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md). Правила R-011…R-014 и сценарии SC-011…SC-014 находятся в [requirements](../requirements/behavior.md).

## URL и индексирование

| URL            | Canonical в итоговом HTML   | HTML alternates                                               | Sitemap после реализации | Robots             |
| -------------- | --------------------------- | ------------------------------------------------------------- | ------------------------ | ------------------ |
| `/uk/contacts` | `SITE_URL` + `/uk/contacts` | uk-UA: self; ru-UA: `/ru/contacts`; x-default: `/uk/contacts` | Одна UK-запись           | Текущий общий gate |
| `/ru/contacts` | `SITE_URL` + `/ru/contacts` | ru-UA: self; uk-UA: `/uk/contacts`; x-default: `/uk/contacts` | Одна RU-запись           | Текущий общий gate |

Production origin берётся из SiteConfig, `metadataBase` делает metadata URLs абсолютными. В builder-тестах допускаются возвращаемые core относительные canonical/alternates; абсолютность итогового head проверяется отдельно. Не hardcode production origin в runtime и не canonicalize между языками. Slug `/contacts` сохраняется в обеих локалях, завершающего `/` нет. Query и hash не создают самостоятельных SEO-страниц; path metadata остаётся `/contacts`.

Index разрешён только при одновременных `SITE_ENV=production` и `SITE_INDEXING=true`. Иначе сохраняются `noindex, nofollow` и общие ограничения robots. SDD не включает включение индексации или переключение домена. Неизвестная локаль — 404, без перевода по умолчанию. Назначения shell language switch ведут на эквивалентный contacts-route.

## Metadata

Новая `buildContactsMetadata(locale: Locale, config?: SiteConfig)` в content/seo вызывает `buildPageMetadata` с `path: '/contacts'`. Root template добавляет бренд один раз, поэтому функция передаёт plain title.

| Поле           | UK                                                                                                                                             | RU                                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Plain title    | Контакти                                                                                                                                       | Контакты                                                                                                                                       |
| Итоговый title | Контакти \| Class Kedr                                                                                                                         | Контакты \| Class Kedr                                                                                                                         |
| Description    | Контакти Class Kedr: телефон відділу продажу, Telegram, Viber, електронна пошта та розташування в Харкові. Дверна фурнітура оптом і в роздріб. | Контакты Class Kedr: телефон отдела продаж, Telegram, Viber, электронная почта и расположение в Харькове. Дверная фурнитура оптом и в розницу. |
| H1             | Контакти                                                                                                                                       | Контакты                                                                                                                                       |
| OG locale      | uk_UA                                                                                                                                          | ru_UA                                                                                                                                          |

Canonical, language alternates, Open Graph URL/title/description/type и robots остаются обязанностью core builder. Новая OG-картинка и изменение global defaults не нужны. Description описывает видимые данные, без графика и обещаний ответа.

## Структурированные данные

Organization, ContactPoint и подтверждённый PostalAddress уже выводятся один раз в `apps/site/src/app/[locale]/layout.tsx`. Контакты их не дублируют и не меняют COMPANY.

Новая `buildContactsBreadcrumbJsonLd(locale: Locale, config: SiteConfig = siteConfig): JsonLdData` в `libs/site/content/seo/src/lib/contacts-json-ld.ts` создаёт BreadcrumbList:

| position | name UK / RU        | item                                    |
| -------- | ------------------- | --------------------------------------- |
| 1        | Головна / Главная   | Абсолютный URL главной текущей локали   |
| 2        | Контакти / Контакты | Абсолютный URL контактов текущей локали |

`siteConfig` и SiteConfig экспортируются из `@site/core/config`, `buildCanonicalPath` и JsonLdData — из `@site/core/seo`. `SiteConfig.siteUrl` содержит origin без завершающего slash. Абсолютные item формируются как `${config.siteUrl}${buildCanonicalPath(locale, '/')}` и `${config.siteUrl}${buildCanonicalPath(locale, '/contacts')}`. Существующая factory `createSiteConfig` используется в тестах с контролируемым origin.

Существующий `JsonLd` обеспечивает безопасную сериализацию `<`, `>` и `&`. Не импортировать catalog/seo только ради breadcrumb и не создавать новый core API ради одного потребителя. JSON-LD выводится серверной ContactsPage, а не client leaf.

Прежняя строка schema inventory с будущим `LocalBusiness / Store` уточняется этим SDD: текущий объём использует общую Organization + page BreadcrumbList; расширение LocalBusiness/Store не планируется до появления подтверждённых данных и отдельной задачи. Адрес улицы, часы, geo и фиктивные отзывы не публикуются.

## Sitemap

В existing `libs/site/content/feature/src/lib/content-sitemap.ts` добавить один `{ path: '/contacts' }`. `apps/site/src/app/sitemap.ts` уже распространяет `CONTENT_SITEMAP_PAGES` — его менять не нужно. Core расширяет descriptor в UK/RU и добавляет взаимные абсолютные language alternates. Текущий sitemap builder не добавляет x-default; это поведение сохраняется, при этом в HTML x-default обязателен и уже задаётся core.

`lastModified` для контактов отсутствует: нет достоверного `updatedAt`. Не использовать дату генерации, дату SDD или `new Date()`. Delivery/returns/home/catalog entries не удаляются и не дублируются.

## Проверки и доказательства

TS-004: unit tests новых metadata/BreadcrumbList builders — обе локали, согласованные paths, template без двойного бренда, description, OG, indexing gate и отсутствие придуманных полей. TS-005: focused sitemap integration и server content output. Существующие core tests не переписываются, если core не меняется.

Для выпуска дополнительно нужны фактические HTTP/head/JSON-LD свидетельства из [verification](../verification/seo-verification.md), полученные при отдельно разрешённом запуске. В этой SDD-поставке они имеют статус «не запускалось»; согласование проекта не считается результатом runtime-проверки.
