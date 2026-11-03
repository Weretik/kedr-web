# SEO-дизайн галереи

Источник — [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md), [SEO rules](../../../../../standards/site/seo-rules.md). Сценарии SC-012, SC-015…SC-018 — обычные приёмочные сценарии этой функции.

## URL policy

| URL / состояние      | Canonical             | Индексация / robots                                     | Sitemap       | Переход              |
| -------------------- | --------------------- | ------------------------------------------------------- | ------------- | -------------------- |
| /uk/galleria         | self, SITE_URL + path | Публичный content route, только общий production opt-in | Одна UK entry | Обычная ссылка       |
| /ru/galleria         | self, SITE_URL + path | То же                                                   | Одна RU entry | Обычная ссылка       |
| Фильтр/reveal/viewer | URL не создаётся      | Отдельной страницы нет                                  | Нет           | Кнопки / local state |
| Неизвестная locale   | n/a                   | Существующая 404 policy                                 | Нет           | Без fallback языка   |

Slug /galleria уже есть в shell и сохраняется. Нового redirect или media detail URL нет. Query/hash/history для формата, номера материала и порции не вводятся; отдельный URL parser/serializer не нужен. Пустой локальный фильтр не является HTTP 404.

Origin берётся из SITE_URL, trailing-slash policy сохраняется. Production индексация разрешена только при SITE_ENV=production и SITE_INDEXING=true; в остальных случаях действуют текущие noindex/nofollow и robots gate. Этот SDD не переключает их.

## Metadata и локали

`buildGalleryMetadata(locale, config?)` в content/seo вызывает buildPageMetadata с path=/galleria. Builder отдаёт относительные canonical/OG по текущему core API; root metadataBase делает итоговые URL абсолютными. Plain title не включает бренд, общий template добавляет его один раз.

| Поле             | UK                                                                                                                                  | RU                                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Plain title / H1 | Галерея та відео                                                                                                                    | Галерея и видео                                                                                                                |
| Итоговый title   | Галерея та відео — с существующим brand template                                                                                    | Галерея и видео — с существующим brand template                                                                                |
| Description      | Медіаматеріали Class Kedr про дверну фурнітуру: деталі, фактури та конструкцію механізмів. Переглядайте доступні матеріали галереї. | Медиаматериалы Class Kedr о дверной фурнитуре: детали, фактуры и конструкция механизмов. Смотрите доступные материалы галереи. |
| HTML alternates  | uk-UA self; ru-UA sibling; x-default → /uk/galleria                                                                                 | Взаимные uk-UA/ru-UA; x-default → /uk/galleria                                                                                 |
| OG locale        | uk_UA                                                                                                                               | ru_UA                                                                                                                          |

Обе локали имеют полные copy/media labels до публикации. Missing translation — content gate, без смешанного языка или ложного alternate. Смена фильтра/viewer не меняет metadata.

Open Graph формируется существующим core builder; отдельные Twitter metadata не вводятся. Отдельная OG картинка и screenshot концепта не нужны. Nested metadata собирается через builder, без слепого shallow override, который теряет defaults. Description должна оставаться правдивой относительно утверждённого source.

## Structured data

Organization уже принадлежит locale layout; второй Organization не выводится. Новый builder `buildGalleryBreadcrumbJsonLd` выводит серверный BreadcrumbList через JsonLd:

| Position | UK / RU name                       | item                           |
| -------- | ---------------------------------- | ------------------------------ |
| 1        | Головна / Главная                  | Абсолютный home текущей локали |
| 2        | Галерея та відео / Галерея и видео | Абсолютный self canonical      |

VideoObject/ImageObject/ItemList/Product/Offer/ratings не вводятся. YouTube ID и poster не подтверждают uploadDate, duration, авторство и характеристики. Дата СДД не становится датой медиа или lastModified.

## Sitemap

В content-sitemap.ts добавляется один descriptor `{ path: '/galleria' }`; существующий app sitemap распространяет его на обе локали. Дубли и source YouTube URLs не добавляются. lastModified отсутствует, пока нет достоверного source поля.

Текущий HTML builder добавляет x-default, а sitemap builder содержит только uk-UA/ru-UA. Сохраняется именно это поведение; изменение core sitemap не относится к галерее.

## HTML и performance

H1, introduction, названия и native href начального набора доступны в server HTML; остаток имеет noscript fallback. Iframe отсутствует до действия. Native navigation/breadcrumb — ссылки, фильтры — кнопки.

Фото имеют alt/размеры/sizes; доминирующий poster — потенциальный LCP. Ориентир соответствует общим site budgets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1; значения не измерены и этой документационной поставкой не заявляются как достигнутые. Локальные component tests не заменяют CWV или реальный HTTP head.

## Готовность

Архитектурных SEO-вопросов для реализации нет. Видеочасть EN-001 подтверждена; фотографии согласованы как следующий этап. Будущие проверки metadata/JSON-LD/sitemap/server markup и непройденные HTTP/build указаны в [verification](../verification/seo-verification.md).

## Полученные evidence

Metadata/JSON-LD 10/10 unit passed, server HTML+sitemap 14/14 passed. Existing canonical/alternates/indexing gate сохранены, выдуманных дат нет. Реальный HTTP head и CWV не измерялись.
