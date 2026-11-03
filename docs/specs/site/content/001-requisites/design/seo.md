# SEO-дизайн

Источники: [SEO rules](../../../../../standards/site/seo-rules.md), [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md), [сценарии SC-013…SC-016](../requirements/behavior.md). Применяем существующую политику; новых site-wide решений нет.

## URL и индексирование

| Тип                     | Пример                                 | Canonical                     | Robots                                                                                   | Sitemap / links                  |
| ----------------------- | -------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------- |
| Public content UK       | https://classkedr.com.ua/uk/requisites | Self UK, без trailing slash   | index,follow только при SITE_ENV=production и SITE_INDEXING=true; иначе noindex,nofollow | Одна UK запись; настоящие ссылки |
| Public content RU       | https://classkedr.com.ua/ru/requisites | Self RU                       | То же                                                                                    | Одна RU запись; настоящие ссылки |
| Неподдерживаемая locale | /en/requisites                         | Не canonical обычной страницы | Существующий not-found policy                                                            | Не включать                      |

URL строится через core/i18n/core/seo. Query-параметры не выбирают язык; дополнительных filter/sort/page URL у функции нет. Старые URL сохраняются, redirect config не меняется. Non-localized/trailing-slash поведение остаётся общей политикой; не вводить IP/Accept-Language redirects.

## Metadata

| Поле               | UK                                                                                                                                | RU                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| title input        | Реквізити                                                                                                                         | Реквизиты                                                                                                                          |
| итоговый title     | Реквізити \| Class Kedr                                                                                                           | Реквизиты \| Class Kedr                                                                                                            |
| description        | Офіційні реквізити адміністрації Class Kedr: дані ФОП, IBAN і банк. Контакт менеджера для уточнення реквізитів оплати замовлення. | Официальные реквизиты администрации Class Kedr: данные ФОП, IBAN и банк. Контакт менеджера для уточнения реквизитов оплаты заказа. |
| OG type / locale   | website / uk_UA                                                                                                                   | website / ru_UA                                                                                                                    |
| OG alternateLocale | ru_UA                                                                                                                             | uk_UA                                                                                                                              |

`buildRequisitesMetadata(locale, config?)` в content/seo вызывает существующий `buildPageMetadata` с path `/requisites`. Root metadata задаёт metadataBase и brand title template; page builder задаёт собственные title, description, canonical, alternates, robots и полный OG объект по текущему helper. Не собирать вложенные OG частями с расчётом на глубокое merge.

SEO-тексты — маленький `Record<Locale, ...>` внутри SEO. Импорт dictionary из content/model запрещён фактическими boundary rules. Юридические/банковские значения не вставляются в description.

Отдельного Twitter image/OG image у функции нет: новых изображений и Twitter-конфигурации не добавляем. Если общий default изменится, его наследование проверяется при интеграции, не выдумывается в этой SDD.

## Локали

Обе полные версии обязательны; имена и идентификаторы — исходные факты, не fallback текста. HTML lang и theme/locale switch принадлежат layout/shell.

Каждая страница получает такой набор alternates из core builder:

```html
<link rel="alternate" hreflang="uk-UA" href="https://classkedr.com.ua/uk/requisites" />
<link rel="alternate" hreflang="ru-UA" href="https://classkedr.com.ua/ru/requisites" />
<link rel="alternate" hreflang="x-default" href="https://classkedr.com.ua/uk/requisites" />
```

Это ожидаемый результат, не запись уже выполненного HTTP-теста. Self canonical остаётся в текущем языке; RU не canonical на UK.

## Структурированные данные

`buildRequisitesBreadcrumbJsonLd` в content/seo возвращает двухэлементный BreadcrumbList; выводится через existing core JsonLd с безопасной сериализацией на server.

| Locale | position 1                            | position 2                                         |
| ------ | ------------------------------------- | -------------------------------------------------- |
| UK     | Головна → https://classkedr.com.ua/uk | Реквізити → https://classkedr.com.ua/uk/requisites |
| RU     | Главная → https://classkedr.com.ua/ru | Реквизиты → https://classkedr.com.ua/ru/requisites |

Organization остаётся в locale layout; WebSite остаётся на главной. Страница реквизитов добавляет только BreadcrumbList. Не добавлять BankAccount, LocalBusiness, FAQ, адрес/статус НДС или банковские поля в Organization. Разметка описывает видимый контент.

## Sitemap

Добавляется один locale-free descriptor `{ path: '/requisites' }` в существующий CONTENT_SITEMAP_PAGES. App sitemap и shared builder не меняются. Сохранить все актуальные descriptors, включая articles и будущие параллельные дополнения.

Общий builder создаёт оба URL и alternates `uk-UA`/`ru-UA`. `x-default` по текущей реализации присутствует в HTML metadata, не в sitemap; расширение shared builder не входит в scope. lastModified не задаётся: подтверждённого источника даты нет.

## Контент, производительность и открытые зависимости

Основной H1/текст/ссылки и BreadcrumbList доступны в initial HTML. LCP-кандидат — текст заголовка/вводного блока, собственных изображений/third-party scripts нет. Резерв места под local feedback уменьшает CLS, client hydration ограничена копированием.

Проектная таблица performance budgets не задаёт отдельные числа для content route. Не объявлять новые budgets/результаты этой SDD: сохраняется лёгкая server-композиция, измерения — отдельный разрешённый этап.

EN-001 закрыт явным подтверждением пользователя; EN-002 остаётся внешним publication gate для legal destinations. SEO unit-тесты не подменяют эти evidence. Методика и незапущенные проверки находятся в [verification](../verification/seo-verification.md).
