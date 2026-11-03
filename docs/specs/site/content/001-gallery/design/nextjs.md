# Next.js: route, rendering и client islands

## Проверенная версия и руководства

Next 16.4.3 подтверждён package-lock.json и установленным node_modules/next/package.json. Изучены installed guides: layouts-and-pages, caching и Image API. Cache Components включён в текущем проекте; правила — [rendering-and-caching](../../../../../architecture/site/platform/rendering-and-caching.md).

Реализация сохранила этот выбор без изменения Next config. При изменении установленной версии до реализации перепроверить только используемые APIs.

## Route и свежесть

| Route                      | Тип / rendering                                        | Индексация            | Свежесть                            | Params / status                                   |
| -------------------------- | ------------------------------------------------------ | --------------------- | ----------------------------------- | ------------------------------------------------- |
| /uk/galleria, /ru/galleria | public content, static server HTML с SSR client island | Общий production gate | Rebuild при изменении source/assets | Locale из существующего layout, async params; 200 |
| Неизвестная locale/route   | Существующий not-found                                 | Не индексируется      | n/a                                 | Существующий 404                                  |

Новый route `apps/site/src/app/[locale]/(content)/galleria/page.tsx` только await params, locale validation, GalleryPage и generateMetadata через domain SEO. Route group не меняет URL. Отдельный generateStaticParams для галереи не нужен, locale param уже задан общим layout.

Source — синхронный immutable локальный manifest, как существующий content source статей. Сетевого fetch, request-time данных и повторного дорогого чтения metadata/page нет. Поэтому дополнительные use cache/cacheTag/cacheLife здесь не вводятся. При будущем API это решение пересматривается в data-access, не в UI.

Нельзя вводить export revalidate, dynamic/dynamicParams, fetch next-options или unstable_cache. cookies/headers/searchParams, Server Actions, webhook и personal data не нужны.

## Server / client

| Владелец                                       | Ответственность                                                |
| ---------------------------------------------- | -------------------------------------------------------------- |
| Route + GalleryPage                            | Locale, source/dictionary, server breadcrumb/H1/intro, JSON-LD |
| GalleryBrowser (client, SSR output обязателен) | Общая интерактивная коллекция и её локальное состояние         |
| MediaImage / MediaViewer / VideoFrame          | Ограниченные browser-only состояния, dialog и iframe           |
| data-access                                    | Только server-only source и locale mapping                     |
| SEO                                            | Только metadata/BreadcrumbList через core builders             |

Начальный render клиентского island совпадает с серверным: все/7, закрытый viewer, без iframe. Не получать основное содержание через useEffect. Для записей сверх начального набора server feature добавляет noscript-список обычных ссылок, чтобы без JS не потерять остаток коллекции. Карточки имеют native href; при hydration интерактивный обработчик улучшает просмотр.

Не создавать route-level Suspense/loading/error только ради статического source. Ошибки image локальны. Некорректный immutable source выявляется в source validation/test и не превращается в выдуманный «успешный» перевод. Существующая site error/not-found инфраструктура остаётся у приложения.

## Изображения и видео

Реальные фото/постеры — локально в public/images/gallery, с width/height, alt и корректным sizes. Используется next/image. Остальные карточки lazy; для единственного заметного кандидата LCP допускается eager/high fetch priority после source review. В Next 16.4.3 priority deprecated; не копировать этот prop из старой документации и не preload все картинки. Layout резервирует размеры; viewer использует contain.

До выбора видео iframe нет. Нажатие карточки открывает viewer и монтирует iframe с autoplay=0; пользователь запускает стандартным контролом player. Выбор следующего видео тоже не начинает воспроизведение автоматически. Оригинальная YouTube-ссылка и reload всегда доступны. Закрытие/смена media удаляет iframe, поэтому прежнее воспроизведение прекращается.

URL собирается только из фиксированного разрешённого provider и проверенного youtubeId, не из произвольной строки source. Не добавлять YouTube Data API, iframe JS API, внешний SDK или enablejsapi ради этой страницы. По cross-origin load нельзя обещать распознавание private/deleted/embed-disabled: сообщение может отображать сам player, а приложение гарантирует выход/повтор/оригинал.

[Документация YouTube player parameters](https://developers.google.com/youtube/player_parameters) подтверждает autoplay=0; это не измерение доступности конкретных видео. Доступность/пригодность источников остаётся EN-001.

## Проверка

Unit/component и server-markup проверки описаны в задачах. site:typecheck проверяет Next type generation после реализации. HTTP/build, браузер, visual/manual/E2E требуют отдельного разрешённого объёма и сейчас не выполнялись. Реальную работу YouTube mock iframe не доказывает.

## Evidence реализации

Thin route и server composition реализованы. Initial HTML/native destinations/noscript/BreadcrumbList:6 server cases, sitemap:8 cases passed. Next typegen+app tsc прошли; next-env.d.ts остался прежним. Live HTTP/build/browser/player не проверялись. Данные первого этапа — семь подтверждённых видео, фотографии отложены пользователем.
