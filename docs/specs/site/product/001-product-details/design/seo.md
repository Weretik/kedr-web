# SEO детальной страницы товара

Источники: [SEO rules](../../../../../standards/site/seo-rules.md), [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md), [core page metadata](../../../../../../libs/site/core/seo/src/lib/metadata/page-metadata.ts), [JsonLd renderer](../../../../../../libs/site/core/seo/src/lib/json-ld/json-ld.tsx). Вариант SDD — Next.js public site. Эта работа не включает индексацию preview и не обещает появление rich result.

## URL и индексирование

| URL                               | Index в production после gate                 | Canonical                | Sitemap / результат                  |
| --------------------------------- | --------------------------------------------- | ------------------------ | ------------------------------------ |
| `/{locale}/product/{currentSlug}` | да, включая out-of-stock и price-query товары | self, без tracking/query | да, если текущая locale подтверждена |
| прежний slug                      | нет отдельного документа                      | destination              | 308, исключить                       |
| удалённый с category redirect     | нет страницы товара                           | destination category     | 308, исключить                       |
| неизвестный slug                  | noindex                                       | нет выдуманной карточки  | 404, исключить                       |
| API unavailable                   | не успешная товарная страница                 | нет Offer                | 500, не выдавать пустой sitemap      |
| cart/private routes               | существующая private policy                   | по владельцу cart        | нет; вне public page cache           |

Путь принадлежит product model, locale добавляет core i18n. Существующие каталоговые ссылки сохраняют тот же route contract. Не транслитерировать имя в slug. Нормализация и redirect до streaming; новые query-фильтры/варианты на странице не создаются. Старые URL из app config не переписывать целиком, особенно при незакоммиченных изменениях.

## Metadata

- Title: имя товара + SKU при необходимости различения, с существующим Class Kedr title template; не удваивать бренд вручную.
- Description: локализованный шаблон на основе имени, артикула и категории. Без неподтверждённых скидок, сроков доставки, бренда/характеристик и гарантий.
- Canonical: `core/seo` builder, absolute site URL и актуальный slug выбранной locale.
- `product/seo` начинает с `buildPageMetadata`, затем формирует **полный** alternates/OG объект из подтверждённых language URLs, учитывая shallow merge. Не оставлять автоматически добавленные обе локали core helper при отсутствии подтверждения.
- OG/Twitter: имя/описание/current URL, реальный разрешённый photo URL при наличии; без фото — обычный site fallback, не нарисованный товар. `openGraph.type=website` совместим с существующим core builder.
- Robots meta наследует существующий production/indexing gate. Не читать env в feature или UI.

## Structured data

| Тип              | Поля / ограничения                                                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Product`        | стабильный `@id = canonical#product`, name, sku, canonical url, реальные media URL при наличии; description/brand/gtin/ratings отсутствуют, если нет источника |
| `Offer`          | только положительная price; UAH, canonical URL, stock-derived InStock/OutOfStock; price как number, не локализованная строка                                   |
| `BreadcrumbList` | тот же видимый trail: главная → каталог → разрешённые категории → товар, absolute URLs                                                                         |

Для неизвестной цены `offers` полностью опускается, не `price=0`. Отсутствие фото не создаёт фиктивный image. Глобальные Organization/WebSite повторно не добавлять в product feature. JSON-LD создаёт `product/seo`, render на сервере существующим JsonLd с экранированием `<`. Текст/API поля не вставляются в script без safe renderer. Нет скрытых отзывов/свойств ради обязательности schema.

## Языки

UK/RU. Успешный detail lookup с непустым именем и тем же SKU подтверждает доступную версию; использовать возвращённый текущий slug. На обеих подтверждённых версиях reciprocal `uk-UA`/`ru-UA` links согласно core language tags. `x-default` — подтверждённый UK URL по Site policy; если UK не подтверждён, не выдумывать его. При временном отказе второго языка текущая карточка остаётся рабочей, неподтверждённый alternate не выводится. Отдельного translation availability flag контракт не предоставляет; frontend не считает одинаковые названия доказательством отсутствия перевода.

## Sitemap: принятое техническое решение

Отдельного product feed нет. Использовать текущий `getPublicProducts`: обе locale, `availability=All`, `sort=IdAsc`, `pageSize=100`, без остальных фильтров. Собирать ограниченный best-effort нормализованный индекс, дедуплицировать по SKU/locale/current slug, исключать пустую идентичность. Сбой любой страницы — typed unavailable, не частичный успешный документ. Если наблюдаемо меняются total/page structure или появляются межстраничные дубли, один ограниченный повтор; при повторной несогласованности — ошибка и последующий retry. У API нет snapshot/version token: изменение строк при том же total может остаться незамеченным; атомарная полнота не гарантируется и не объявляется доказанной тестом. Не делать N detail-запросов ради дат.

Список не содержит `updatedAt`: `lastModified` опустить. Первая реальная страница этого же источника используется для prerender seed; полный обход ради одного seed запрещён.

Планируемый metadata route `apps/site/src/app/product/sitemap.ts` экспортирует generateSitemaps; URL `/product/sitemap/{id}.xml`, `id` ожидается как `Promise<string>` в установленном Next. Делить нормализованный список на детерминированные shards максимум **20 000 URL**; дополнительно ограничивать фактический сериализованный XML до 50 MB без сжатия. Не предполагать, что две языковые версии и alternate links всегда помещаются по одному лишь числу продуктов. Проверка границ/size на больших фикстурах — TS-008. Последовательное чтение/ограниченный concurrency, без неограниченного Promise.all по всему каталогу.

В product entries указывать только реальные языковые URL из локализованных списков. Для alternates сопоставлять по SKU, не механически дублировать каждую строку core `buildSitemapEntries`, который сейчас всегда создаёт две версии. Product feature строит свои entries через универсальные URL helpers.

Корневой `/sitemap.xml` с home/category/content сохранить. `apps/site/src/app/robots.ts` в индексируемом окружении получает список product shards и передаёт его в `buildRobotsFile` универсальным optional input вместе с корневым sitemap. Core не импортирует product. В preview запрет `/` сохраняется, список продукта ради robots не запрашивается. При отказе product feed не объявлять вымышленные shards; ошибка получения полного robots/sitemap не маскируется подтверждением полноты.

## Контент и производительность

H1, price/availability/facts/links и JSON-LD в исходном HTML. Видимые breadcrumb links и разметка строятся из одной модели. Delivery/returns/wholesale/contacts — реальные ссылки. LCP — начальный real media, стабильный frame предотвращает CLS, клиентскими остаются только небольшие интерактивные части. Ориентиры Site p75: LCP≤2.5 s, INP≤200 ms, CLS≤0.1; измерения не подменяются unit tests и выполняются только в отдельно разрешённой проверке.

## Ограничения и evidence

Состояние перевода без отдельного provider signal, CDN URL с фактическим 404 и изменения списка между страницами остаются ограничениями источника. UI умеет fallback, а builder не выдумывает факты. SEO unit tests и протокол [SEO verification](../verification/seo-verification.md) фиксируют эти случаи. Validator/browser/build/HTTP results при написании SDD не получены.
