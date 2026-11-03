# SEO-дизайн wholesale

Применение [Site SEO rules](../../../../../standards/site/seo-rules.md) и [архитектуры](../../../../../architecture/site/platform/seo-architecture.md). Продуктовая цель — органическое привлечение покупателей дверной фурнитуры оптом и квалифицированный переход к менеджеру, без гарантии ранжирования.

## URL / индексирование

| URL           | Canonical итогового HTML | HTML languages                                           | Sitemap       | Индекс           |
| ------------- | ------------------------ | -------------------------------------------------------- | ------------- | ---------------- |
| /uk/wholesale | SITE_URL + /uk/wholesale | uk-UA self; ru-UA /ru/wholesale; x-default /uk/wholesale | один UK entry | по existing gate |
| /ru/wholesale | SITE_URL + /ru/wholesale | ru-UA self; uk-UA /uk/wholesale; x-default /uk/wholesale | один RU entry | по existing gate |

Slug одинаковый, без завершающего slash. Path owner — core localizedPath/buildCanonicalPath. Query/hash не создают самостоятельные индексируемые страницы: metadata path всегда /wholesale. Неподдерживаемая локаль — 404, без украинского fallback или языкового alternate.

Старый /{locale}/wholesale сохраняется; trailing slash нормализуется существующей Next/site политикой. Не добавлять отдельный redirect для неизменного slug. HTTP/www и доменное переключение остаются общим cutover, вне этой функции.

Index/follow разрешены только при SITE_ENV=production и SITE_INDEXING=true. Иные сочетания — noindex,nofollow. Wholesale не меняет robots.ts, configuration или deployment settings. Присутствие entries в preview sitemap наследуется от core и не означает включённую индексацию.

## Метаданные

buildWholesaleMetadata(locale, config?) в content/seo вызывает buildPageMetadata с path '/wholesale'. Plain title без бренда; root template добавляет его ровно один раз.

| Поле                  | UK                                                                                                                                                       | RU                                                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H1                    | Дверна фурнітура оптом                                                                                                                                   | Дверная фурнитура оптом                                                                                                                                 |
| Plain title           | Дверна фурнітура оптом — замовити                                                                                                                        | Дверная фурнитура оптом — заказать                                                                                                                      |
| Итоговый title        | Дверна фурнітура оптом — замовити &#124; Class Kedr                                                                                                      | Дверная фурнитура оптом — заказать &#124; Class Kedr                                                                                                    |
| Description           | Дверна фурнітура оптом у Class Kedr: завіси, замки, ручки, циліндри та міжкімнатні механізми. Перегляньте каталог і дізнайтеся оптові умови у менеджера. | Дверная фурнитура оптом в Class Kedr: петли, замки, ручки, цилиндры и межкомнатные механизмы. Посмотрите каталог и узнайте оптовые условия у менеджера. |
| OG locale / alternate | uk_UA / ru_UA                                                                                                                                            | ru_UA / uk_UA                                                                                                                                           |
| OG type               | website                                                                                                                                                  | website                                                                                                                                                 |

metadataBase/robots/canonical/alternates/OG — существующий core owner. Не импортировать content/model UI copy в type:util SEO; статические SEO-строки согласуются с visible copy и тестируются в доменном builder. Новые Twitter-specific overrides и OG-image не требуются; сохраняется базовая конфигурация сайта. Не переносить ограничение 160 символов или density keyword в критерии: проверяется принятый текст и уникальное содержание.

## Структурированные данные

Layout уже выводит Organization/ContactPoint/подтверждённый город. Страница добавляет только buildWholesaleBreadcrumbJsonLd(locale, config=siteConfig) через JsonLd.

| position | UK / RU name               | item                               |
| -------- | -------------------------- | ---------------------------------- |
| 1        | Головна / Главная          | абсолютная главная текущей locale  |
| 2        | Співпраця / Сотрудничество | абсолютный wholesale той же locale |

Origin из SiteConfig + buildCanonicalPath, не строка production домена. JsonLd сохраняет safe escaping. Нет второй Organization, LocalBusiness с выдуманными часами/улицей, Product/Offer, рейтинга или FAQPage.

FAQ — содержимое для покупателя. FAQ rich results в Google прекращены 7 мая 2026, потому такая разметка/обещание не является задачей. [Официальные изменения Google](https://developers.google.com/search/updates#may-2026).

## Sitemap / связи

Добавить ровно один descriptor `{path:'/wholesale'}` в content-sitemap.ts. Core создаёт два абсолютных entries и взаимные UK/RU alternates. Текущее отсутствие x-default в sitemap сохраняется; HTML x-default задаёт metadata. Не использовать вымышленный lastModified или дату SDD.

App sitemap уже распространяет CONTENT_SITEMAP_PAGES, его правка не требуется. Сохраняются delivery, returns, contacts и прочие текущие entries. Shell/home уже ведут на wholesale; новых массовых link blocks не нужно. С этой страницы исходят реальные category href, catalog hub, company anchor, delivery/returns и контактные ссылки.

## Разделение поисковых задач

- Главная: Class Kedr, компания и общий ассортимент опт/розница.
- Wholesale: дверная фурнитура оптом, купить/заказать/поставщик и порядок обращения по закупке.
- Категории: конкретный вид фурнитуры и реальные товары.
- Product: конкретная модель/артикул.

Совпадение слова «оптом» не считается доказанной каннибализацией. Отдельные почти одинаковые URL под варианты формулировок не создаются. Семантика — гипотеза содержания, не измеренная частотность; доступный Search Console не вернул сайтов при предшествующем исследовании.

## Серверное содержание / производительность

H1, lead, company, steps, FAQ, контакты и category links при доступном tree находятся в server output. При деградации meaningful static content сохраняется и metadata не меняется на заглушку. Нет дополнительного client data fetching.

Текст ведёт первый экран; изображения категорий имеют размеры и корректный sizes, без лишнего priority. Текущие Site LCP/INP/CLS цели и способы измерений описаны в [platform rendering](../../../../../architecture/site/platform/rendering-and-caching.md). Реальные field/lab данные здесь не заявлены.

## Изменение общей документации при реализации

TS-006 добавляет явную Wholesale-строку URL policy и schema inventory (layout Organization + page BreadcrumbList) в seo-architecture.md. Не меняет site-wide locale/canonical/gate policy. Это документация нового вида контента, не новый SEO-механизм.

План unit/server/source и отдельно разрешаемых HTTP/head/build проверок — [SEO verification](../verification/seo-verification.md). Продуктовых SEO-блокеров нет; публикация условий не требуется.
