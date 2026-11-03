# Next.js: маршруты, данные и кеш

Источники: [Site application](../../../../../architecture/site/runtime/application.md), [rendering/caching](../../../../../architecture/site/platform/rendering-and-caching.md), [тонкий category route](../../../../../../apps/site/src/app/[locale]/catalog/[slug]/page.tsx). Детали сверены с установленным Next 16.4.3: `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`, `03-api-reference/04-functions/{generate-static-params,generate-sitemaps,not-found,permanentRedirect}.md` и `03-api-reference/02-components/image.md`.

## Маршруты и HTTP

| Route                       | Рендер / индексирование                                                                                                      | Результаты                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `/{locale}/product/{slug}`  | server-first, кеш чтения по locale/slug, остальные slug на первом обращении; index только через существующий production gate | 200 current, 308 moved/category, 404 missing, 500 unavailable  |
| legacy product URLs         | существующий `next.config.ts` redirect сохраняется, затем действует canonical lookup                                         | 308                                                            |
| `/product/sitemap/{id}.xml` | metadata route, cached snapshot публичного списка, оба языка                                                                 | 200 valid shard; ошибка источника не превращается в пустой 200 |

`page.tsx` ожидает `params`, проверяет locale и делегирует product feature. `generateMetadata` использует тот же cached loader, не отдельный fetch. Lookup и slug/404/redirect разрешаются до отдачи основной страницы и до Suspense fallback. Повторить принцип существующего category route с `export const instant = false`, не подменять его `dynamic`/`revalidate`.

Не добавлять `product/[slug]/loading.tsx` или границу, которая начнёт 200-stream до разрешения товара. SC-028 покрывается доступным pending-состоянием навигации существующего приложения; тяжёлые необязательные client leaves могут иметь локальную загрузку после разрешения идентичности. Оболочка не должна показывать старые/dummy данные как новый товар. Статусы проверяются на cold request, а не выводятся только из unit mock.

## Cache Components

Cache Components включён. В `product/data-access`: `'use cache'`, `cacheLife('hours')` для успешного публичного чтения. Ключ содержит валидированные locale, requested slug и фиксированный price type 11. Теги: `catalog`, `catalog:products`, `product:slug:{requestedSlug}`; после успешного lookup также `product:{sku}` и canonical slug tag. Для not-found/unavailable/redirect — короткий failure lifetime по существующему образцу `{ stale:60, revalidate:60, expire:3600 }`, чтобы не закреплять сбой на часы.

Не читать cookies/headers/session в публичном loader, не кешировать quantity/cart. Не использовать `export const revalidate`, `fetch(...,{next})`, `dynamicParams` или `unstable_cache`. Защищённого backend webhook пока нет: действует time-based freshness, без обещания мгновенного обновления. Проверку фактической цены/наличия при заказе обеспечивает cart/order owner, а не часовой публичный кеш.

## Static params

С Cache Components пустой массив static params вызывает build error. TS-008 предоставляет чтение первой реальной страницы списка; TS-007 выбирает минимум один валидный текущий slug и подтверждает detail lookup, затем возвращает реальные locale/slug seeds. Не обходить весь каталог ради prerender и не добавлять вымышленный `__placeholder__` как обычный happy path. Если нет ни одного доступного реального seed либо API недоступен при сборке, явно завершить подготовку seed ошибкой с диагностикой; публикация требует доступного источника. Не менять глобальный Cache Components режим ради этого случая. Полная пустота каталога/автономная сборка потребует отдельного согласованного изменения стратегии.

Все остальные реальные slug обслуживаются при первом запросе. Обновление содержимого не зависит от повторного вызова generateStaticParams.

## Server / client

Server: lookup, HTTP resolution, breadcrumbs, H1, price/availability/pack/facts, service links, metadata и JSON-LD. Client leaves: gallery с onError/zoom, copy SKU, quantity/cart adapter после EN-002. Props сериализуемые, без DTO, transport errors/secrets или callback из server в client; действие покупки передаётся как client boundary/action slot, связанный с cart provider.

Локальный product state не заменяет общую корзину. Product feature не импортирует cart feature; app компонирует общий provider и shell slot отдельно. Нового Server Action для размещения заказов в этой SDD нет.

## Медиа и локали

Использовать `next/image`, явные `sizes`, фиксированное соотношение media frame, `object-contain`, `unoptimized` и local onError как у текущего каталога. Для единственного начального LCP image — актуальный `preload` API установленного Next; не переносить устаревший `priority` из старого prose. Остальные изображения lazy. Onest/Mono берутся из существующего `fonts.ts`, без Google Fonts CSS в runtime.

Запрашивать выбранную locale. Для alternates проверить второй язык тем же cached detail lookup и тот же SKU. Контракт задаёт единый productSlug, поэтому существующий prefix-based LocaleSwitch сохраняет адрес товара; прежний slug разрешается серверным canonical redirect. Если данные показывают необходимость разных независимых локализованных slug без такой связи, не изобретать URL: уточнить контракт и расширить [LocaleSwitch](../../../../../../libs/site/core/shell/src/lib/controls/locale-switch.tsx) отдельной явной задачей. Отсутствие второго подтверждённого lookup не делает текущую страницу ошибочной и не создаёт alternate наугад.

## Проверки

Focused loader/routing tests доказывают нормализацию и выбор 404/308/500. Компонентные проверки доказывают server text/props и client leaves. Реальные HTTP status, initial HTML, cache behavior и metadata требуют отдельного разрешённого production build/HTTP smoke; план — [verification](../verification/seo-verification.md). Эти проверки не запускаются при подготовке SDD и не объявляются уже пройденными.
