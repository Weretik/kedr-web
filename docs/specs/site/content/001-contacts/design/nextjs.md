# Контакты — Next.js

## Маршруты и рендеринг

| Адрес                                               | Тип                           | Рендеринг                      | Индексация                 | HTTP |
| --------------------------------------------------- | ----------------------------- | ------------------------------ | -------------------------- | ---- |
| `/uk/contacts`                                      | Публичная контентная страница | Статический серверный контент  | По флагам сайта            | 200  |
| `/ru/contacts`                                      | Публичная контентная страница | Статический серверный контент  | По флагам сайта            | 200  |
| `/{locale}/contacts?…` для uk/ru                    | То же содержимое              | Query не читается              | Canonical на URL без query | 200  |
| Неизвестная локаль / неизвестная вложенная страница | Общая 404-политика            | Существующие proxy / not-found | noindex                    | 404  |

Маршрут `apps/site/src/app/[locale]/contacts/page.tsx` следует существующему примеру home: асинхронно читает `params`, проверяет `isLocale`, вызывает `notFound()` при неподдерживаемой локали; `generateMetadata` делегирует в `content/seo`. Глобальный `PageProps<'/[locale]/contacts'>` появляется после `next typegen`. `generateStaticParams` для uk/ru уже находится в родительском layout; дублировать его не нужно.

Cache Components включён в `apps/site/next.config.ts`. Контакты и словари — статические импорты; обновление происходит с новой сборкой/публикацией кода. Собственного fetch, `use cache`, cacheTag/cacheLife, revalidate webhook, cookies, headers и searchParams страница не требует. Не вводить `revalidate`, `dynamicParams`, `unstable_cache` и старые fetch-cache опции. Существующая загрузка меню каталога остаётся в layout; содержимое контактов к ней не обращается.

## Серверная и клиентская границы

- Server Components: маршрут, композиция, крошки и все четыре блока; metadata и JSON-LD строятся на сервере.
- Единственный новый client-компонент — `copy-phone-button.tsx`; получает номер и локализованные строки через props, не импортирует API или секреты. После TS-005 browser lifecycle вынесен в приватный `ui/src/lib/hooks/use-copy-phone.ts`; он остаётся внутри той же client boundary.
- Номер виден в серверной разметке отдельно от JS-действия копирования. Без JS посетитель сохраняет прямой звонок и ссылки.
- Server Actions и отправка данных отсутствуют. Сайт не собирает персональные данные, не пишет сообщения или телефон в storage и логи.
- Внешние HTTPS-ссылки могут открываться в новой вкладке с `rel="noopener noreferrer"`; `tel:`, `mailto:` и `viber:` — системные переходы без искусственной отправки или тоста успеха.

## Интеграция и публичные API

- `@site/content/feature`: `ContactsPage`, `getContactsSitemapPages`.
- `@site/content/seo`: `CONTACTS_PATH`, `buildContactsMetadata`, `buildContactsJsonLd`.
- `@site/content/ui`: компоненты блоков, `getContactsDictionary` и тип словаря. Кнопка копирования остаётся внутренней деталью телефонного блока.
- Sitemap агрегирует `getContactsSitemapPages()` вместе с уже существующими home/catalog записями, без вызова одной feature из другой feature.

Новые библиотеки создаются в EN-001 генератором `@nx/react:library` (`--bundler=none --unitTestRunner=vitest`) с именами `site-content-ui`, `site-content-seo`, `site-content-feature`, описанными в [frontend-дизайне](frontend.md). Генерация выполняется только на этапе реализации. Контрактный документ и data-model не создаются: новых API и бизнес-сущностей нет.

## Проверки будущей реализации

Точные команды и владельцы — в [задачах](../tasks/README.md). По умолчанию только узкие component/unit проверки новой функции, отдельная typecheck для риска нового route typing, проверка границ для новых Nx-проектов. Production build, HTTP-проверка запущенного сайта, browser/visual/E2E и полные прогоны автоматически не запускаются. Для browser/visual нужна отдельная конкретная просьба о разрешении и прямой ответ владельца по правилам репозитория.
