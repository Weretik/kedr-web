# План SEO-проверки checkout

**Статус:** unit/component/server/source проверки выполнены 2026-11-04; [команды и результаты](implementation.md). HTTP/build/browser output не проверялся.

| Проверяемый риск             | Минимальный уровень                      | Проверяемое утверждение                                                              |
| ---------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| Private robots meta          | cart-seo unit                            | UK/RU; indexing enabled → noindex/follow, preview → noindex/nofollow                 |
| Canonical/alternates/privacy | metadata unit                            | Нет canonical/hreflang/orderId/контактов/товаров в metadata                          |
| Sitemaps                     | focused core crawling / descriptor check | Checkout не добавлен в root/product sitemaps; нет lastModified для него              |
| Robots file                  | существующий focused crawling test       | Сохраняются private checkout disallow и общий preview Disallow:/                     |
| Navigation                   | drawer/header component                  | Checkout Link rel=nofollow; modal trigger — button, не fake href                     |
| Server frame                 | cart-feature server composition          | H1/breadcrumb/restoring без customer values, известная empty route не становится 404 |
| No shared user cache         | source + focused boundary                | order POST no-store; cart/draft вне use cache/URL; action не вызывается при render   |

Выполнены узкие configs: site-cart-seo:vite:test, site-cart-feature:vite:test и существующий core crawling spec (сохранённая политика robots/sitemap). Полный npm test:site не является обязательным пакетом этой проверки.

Если отдельно назначены HTTP/build: для обоих locale получить статус, title/robots/отсутствие canonical/hreflang/customer data и проверить robots/sitemap на локальном output. Пустая корзина даёт200, неизвестная locale сохраняет404. Точные команды и вывод записать после исполнения; сейчас они не выполнялись.

Browser/visual/manual/E2E требуют отдельного конкретного разрешения пользователя. Production cutover, реальные заказы и внешнее индексирование вне выполненного объёма реализации.
