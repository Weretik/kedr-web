# Модель представления wholesale

Владелец локализованного содержания — `site-content-model`. Это presentation model, не новая бизнес-модель и не OpenAPI DTO.

## Новые контракты

- `WholesaleDictionary`: группы hero, assortment, company, steps, faq, contact и локализованные подписи/сообщение недоступности. Полные UK/RU значения в [copy](design/content.md).
- `WholesaleCompanyDetails`: публичные name, phone(display/e164), локализованный city, telegram/viber. Содержит только данные для страницы, без секретов и browser state.
- `getWholesaleDictionary(locale: Locale)`: полный словарь выбранного языка без молчаливого fallback.
- UI `WholesaleContentProps`: dictionary, details, локализованные полезные href и `assortment: ReactNode | null`. ReactNode принадлежит content/ui, не model.

Копии телефона, города, адресов мессенджеров и slug в словаре не создаются. CompanyDetails строит feature из COMPANY; строка города соответствует locale. Часть copy с названием бренда остаётся редакционным текстом и должна совпадать с COMPANY.name.

## Существующие данные каталога

Feature получает `CatalogTreeNode[] | null` через публичный catalog/data-access. Узел уже нормализован: id, name, slug, children, productCount и прочие поля существующей модели; новая схема не дублируется.

Отбор совпадает с публичной моделью hub: mapper уже поднимает hardware children и удаляет скрытые группы; feature исключает `CATALOG_ROOTS.doorsId` и сохраняет порядок остальных действительных top-level групп. Состав не фиксируется повторным массивом ID в content. Полный текущий ответ даёт шесть групп; частичный ответ даёт только доступные, будущий действительный состав может расширяться.

## Преобразования и состояния

| Вход                     | Feature result                                 | Видимый результат                                                            |
| ------------------------ | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| Полный tree              | Hardware nodes → catalog CategoryCards compact | Текущие шесть категорий с действительными href/фото                          |
| Частичный tree           | Только доступные hardware nodes                | Неполная реальная сетка, без вымышленных групп                               |
| null / [] / только doors | assortment = null                              | Сообщение недоступности, catalog/manager links; остальная страница сохранена |

Изображения и URL формирует catalog/ui/model. `productCount` и children не показываются в compact, но остаются в исходной модели для default-потребителей. В content/model/ui не попадают catalog types, transport DTO, fetch или cache state.

Отдельные состояния loading/offline/forbidden не вводятся: данные серверные и публичные, деградация обрабатывает обычную недоступность. Неожиданный programming exception использует существующий error flow.
