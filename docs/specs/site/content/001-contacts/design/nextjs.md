# Next.js-дизайн

Один публичный content-route в существующем приложении. [Карта файлов](frontend.md) определяет владельцев, [SEO](seo.md) — URL и метаданные.

## Маршруты и рендеринг

| URL                                           | Тип            | Рендеринг                                                        | Свежесть                                                | Статус                                                   |
| --------------------------------------------- | -------------- | ---------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| `/uk/contacts`                                | public content | Статическое серверное содержимое из локального словаря и COMPANY | Меняется с кодом/деплоем; новых cache tags/lifetime нет | 200; индексирование только по текущему production gate   |
| `/ru/contacts`                                | public content | То же, полный русский текст                                      | То же                                                   | 200; та же политика                                      |
| `/en/contacts` и иная неподдерживаемая локаль | invalid        | Существующий locale/not-found flow                               | n/a                                                     | 404; без canonical/indexable alternates для этого адреса |

Путь файла: `apps/site/src/app/[locale]/(content)/contacts/page.tsx`. Route group не входит в URL. Существующий delivery-route остаётся на своём месте. Старые `/uk/contacts` и `/ru/contacts` не меняются; нового redirect не нужно. Безъязычные адреса и trailing slash следуют действующей site policy.

Route читает `params: Promise<{ locale: string }>`, ожидает их, проверяет `isLocale`, вызывает `notFound()` для неподдерживаемой локали и возвращает `ContactsPage`. `generateMetadata` делегирует `buildContactsMetadata` только после locale guard; не делает молчаливый fallback на uk. Порядок guard должен сохранять существующий site 404 flow.

Родительский locale layout уже создаёт локализованные static params. Отдельный `generateStaticParams` для контактов не нужен. Cache Components включён; содержимое контактов не вызывает cookies/headers/fetch. Собственных Suspense, Server Actions, data-access, revalidation endpoints или timers кэша нет. Не вводить `export const revalidate`, `dynamicParams`, `unstable_cache` или старый `fetch next`.

Запросы общего header/catalog layout остаются у существующих владельцев. Статичность контактов не является заявлением об отсутствии общих запросов приложения. Фактическую таблицу рендеринга production build записывать только после отдельного разрешённого запуска.

## Серверная граница

- Server: route, ContactsPage, ContactsContent и смысловые UI-блоки, словарь, metadata и BreadcrumbList. Основные контакты и crawlable links доступны до hydration.
- Client: только `contacts-copy-phone-button.tsx` с `'use client'`. Props: e164 и copy/success/error labels. Browser API вызывается только по пользовательскому действию.
- Главный номер и основной CTA — настоящие `tel:` ссылки вне copy-button. Telegram/map — обычные внешние ссылки с безопасным `rel` при новом окне. Viber — исходный deeplink, email — `mailto:`. Внутренние полезные ссылки создаются через `localizedPath` и Next Link.
- Hash-якоря локальны странице; используемые preview IDs можно заменить на понятные page-local `contact-channels`, `contact-location`, `contact-wholesale`, согласовав href и target. `content` зарезервирован shell.
- Сохранённый HTML-концепт не импортируется в runtime, не используется как iframe и не заменяет живой текст картинкой. Его CSS/JS, Google Fonts import и preview Tweak API в приложение не переносятся.

## Интеграция и состояния

`ContactsPage` получает строго Locale, читает `COMPANY` и `getContactsDictionary`, передаёт локализованный city и общие ссылки в UI. Никакой backend-operation, OpenAPI-ревизии, DTO mapping или авторизации для этой фичи нет; API-контракт не создаётся.

Для локального контента loading/empty/network error — n/a. Существующие error/not-found boundaries приложения сохраняются. Clipboard rejection/unavailable обрабатывается внутри leaf с локальным текстом и повтором; сайт не вызывает системный звонок из обработчика ошибки. Основные сведения и ссылки остаются полезными при отключённом JavaScript.

Используются existing shared Button/cn и site tokens; новый Radix/shadcn primitive не требуется. Onest приходит из locale layout, собственных картинок, map embed, third-party script и CSS-зависимостей страницы нет.

## Проверки

При реализации нужны focused tests `site-content-ui`, `site-content-seo`, `site-content-feature` и узкий `site:typecheck` для нового route. Предварительная инфраструктура уже есть; `EN-*` не нужны. Проверка исходного server HTML и реальные HTTP/status evidence различаются: компонентный рендер не доказывает HTTP 200/404 или итоговый metadata head.

Production build, `next start`/curl, браузер, визуальные/manual и E2E-проверки не запускаются автоматически из SDD. План и незапущенные проверки фиксируются в [SEO verification](../verification/seo-verification.md) по действующим [правилам проекта](../../../../../standards/shared/testing-rules.md).
