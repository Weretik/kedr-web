# SEO приватного checkout

Применяется Next.js-вариант SDD публичного Site, но этот маршрут **не индексируется**. Источник — [действующая URL policy](../../../../../architecture/site/platform/seo-architecture.md), [Site SEO rules](../../../../../standards/site/seo-rules.md), [правило R-015](../requirements/overview.md) и [соответствующие SC](../requirements/behavior.md).

## URL policy

| URL type                | Пример                         | Index        | Canonical / alternates | Robots.txt                                                          | Sitemap | Links                                                               |
| ----------------------- | ------------------------------ | ------------ | ---------------------- | ------------------------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| Checkout                | `/uk/checkout`, `/ru/checkout` | false всегда | не добавляются         | существующий disallow обоих locale checkout при production indexing | нет     | header trigger — button; переход к checkout — Link с `rel=nofollow` |
| Cart drawer             | Нет URL                        | n/a          | n/a                    | n/a                                                                 | нет     | button                                                              |
| Success / error / empty | Состояния того же checkout     | false        | без новых URL          | наследуется                                                         | нет     | каталог и существующие информационные страницы                      |

Не вводить `/cart`, `/checkout/success`, orderId/contact query или перенос на другой locale через canonical. Unknown locale — существующий 404; empty checkout — содержательный 200 с запретом отправки. Существующий `/checkout` адрес сохраняется, redirect map не требуется.

## Metadata

`buildCheckoutMetadata(locale)` в cart/seo использует `buildRobotsMeta(siteConfig,false)` из core/seo. Production с разрешённой общей индексацией получает `noindex,follow`; preview/local — существующее `noindex,nofollow`. Checkout не наследует разрешение на index от root metadata.

Title: «Оформлення замовлення» / «Оформление заказа» плюс существующий brand template. Description — общий локализованный текст о быстром заказе; имя, телефон, суммы, товары и UUID в metadata отсутствуют. Generic `buildPageMetadata` сейчас автоматически добавляет canonical/языковые alternates; его не применять бездумно к checkout. Private builder делегирует robots core helper и **не добавляет** canonical/hreflang. Root metadata сейчас их не устанавливает; тест защищает отсутствие наследуемых personal alternates.

Open Graph/Twitter: только существующие неперсональные site defaults, без заказа/сумм/скриншота корзины. Новые изображения не нужны. JSON-LD заказа, Product/Offer/BreadcrumbList/FAQPage на checkout не добавляется; общий Organization остаётся ответственностью layout.

## Языки и discoverability

UK/RU интерфейс существует в обоих checkout URL; локализованный Link меняет путь без PII. `x-default` и hreflang для private checkout не добавляются. Shell сохраняет свои locale controls; отсутствие alternate links здесь — сознательная private policy.

Checkout не включается ни в root sitemap, ни в product shards, не получает lastModified. Проверить существующие PRIVATE_PATHS/robots tests, не менять общее preview gate. Robots disallow не заменяет noindex; SDD не обещает удаление старого URL из внешнего индекса одной этой директивой.

## HTML и производительность

H1, breadcrumb, неперсональный frame/fallback и metadata доступны сервером. Клиентская корзина не является индексируемым контентом и появляется после восстановления storage. Footer и каталог остаются существующими реальными ссылками. Без внешних font/icon CDN в рабочем приложении; использованы self-hosted fonts и существующий image pipeline.

Для private route не вводятся отдельные недоказанные CWV обещания. Существующие budgets Site применяются; network order creation — пользовательская mutation, не preload. Локальный skeleton и подходящие размеры фото снижают сдвиг при восстановлении. Конкретные HTML/robots/sitemap assertions перечислены в [плане проверки](../verification/seo-verification.md).

Продуктовых вопросов нет; build/HTTP/browser — ещё не выполненные уровни проверки будущей реализации.
