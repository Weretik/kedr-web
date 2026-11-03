# SEO страницы политики

Применяются [SEO rules](../../../../../standards/site/seo-rules.md) и [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md). Это существующий тип public content, новый policy URL реализует его текущие правила.

## URL и индексация

| URL                | Index policy                                  | Canonical | robots.txt                               | Sitemap / discovery |
| ------------------ | --------------------------------------------- | --------- | ---------------------------------------- | ------------------- |
| /uk/privacy-policy | Index только при существующем production gate | Self, uk  | Existing public-content allow после gate | Да; existing footer |
| /ru/privacy-policy | То же                                         | Self, ru  | То же                                    | Да; existing footer |

Gate сохраняется: SITE_ENV=production и SITE_INDEXING=true. Dev/preview остаются noindex,nofollow по существующей конфигурации. SDD не включает деплой или включение indexing.

Адрес и общий slug не меняются. Новых redirects, query model или faceted URLs нет. Fragment относится только к чтению, не входит в canonical/sitemap/alternates. Неподдерживаемая локаль и unknown path используют existing 404.

## Metadata

| Поле           | uk                                                                                                                        | ru                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Page title     | Політика конфіденційності                                                                                                 | Политика конфиденциальности                                                                                                     |
| Итоговый title | Політика конфіденційності \| Class Kedr                                                                                   | Политика конфиденциальности \| Class Kedr                                                                                       |
| Description    | Політика конфіденційності Class Kedr: обробка персональних даних, їх захист, права користувачів та контакти для звернень. | Политика конфиденциальности Class Kedr: обработка персональных данных, их защита, права пользователей и контакты для обращений. |
| H1             | Політика конфіденційності                                                                                                 | Политика конфиденциальности                                                                                                     |

buildPrivacyMetadata вызывает buildPageMetadata с locale и path /privacy-policy; title передаётся без повторного brand suffix. Root template добавляет бренд один раз. Canonical/alternates/robots/OG и существующие social defaults берутся из core builder, не переопределяются неполным nested object.

Существующий template добавляет бренд и разделитель один раз; тест проверяет точный итоговый title. Не добавлять новую social image или вымышленную дату.

## Locales и sitemap

- Обе полные локали доступны. Alternates: uk-UA, ru-UA, x-default → uk.
- Canonical каждого языка указывает на себя, не на другую локаль.
- В CONTENT_SITEMAP_PAGES добавить ровно { path: '/privacy-policy' }; app sitemap уже разворачивает обе локали.
- Сохранить все текущие content/article/catalog entries и reciprocal language links.
- lastModified не задавать: дата концепта/СДД не является датой изменения юридического документа.

## Structured data

Один новый page-level BreadcrumbList: локализованные «Головна/Главная» и H1, последовательность 1/2, абсолютные URL из configured siteUrl и core canonical builder. buildPrivacyBreadcrumbJsonLd находится в content/seo; JsonLd сериализует существующий escaped core component.

Organization остаётся у locale layout. Не добавлять LegalService, Product/Offer, FAQPage, отдельную организацию, автора, даты, сертификаты или утверждения о юридическом лице. Содержание страницы не подтверждает такие сущности.

## HTML, ссылки и performance

Полный документ и H1 находятся в первоначальном server HTML. Internal links — home breadcrumb, восемь native fragments и локализованная public-offer. Footer legal link уже существует; его не заменять кнопкой.

Основной визуальный элемент — текст H1; новых медиа, шрифтов и client islands нет. Стабильные блоки и родительский shell уменьшают CLS risk. Новые бюджеты фича не вводит. Ориентир действующей site baseline: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1; отдельная content-строка в baseline пока не выделена. Измерение CWV не заявлено как выполненное.

## Проверка и открытые вопросы

Metadata, BreadcrumbList и sitemap доказываются focused unit tests. Server-render test проверяет присутствие контента. HTTP status/head, production route table и browser без JS фиксируются в [SEO-журнале](../verification/seo-verification.md) как unrun до отдельного разрешения на соответствующую проверку.

Новых продуктовых SEO-решений или отсутствующих API-полей в этой фиче нет. При реализации обновить central URL policy точными адресами, не менять site-wide gate.
