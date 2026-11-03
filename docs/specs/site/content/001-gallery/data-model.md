# Модель представления и источник

## Публичная модель

Владелец — `libs/site/content/model/src/lib/gallery/`. Это новый presentation contract, не backend DTO.

| Поле           | Значение и правило                                                                                        |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| GalleryFilter  | `all / photo / video`; UI не сериализует его в URL                                                        |
| id             | Стабильная непустая строка, уникальная в коллекции и одинаковая между локалями                            |
| kind           | Discriminated union `photo / video`                                                                       |
| title          | Непустая локализованная строка                                                                            |
| caption        | Необязательное подтверждённое локализованное пояснение; не заполнитель                                    |
| image / poster | Локальный src, фактические width/height, содержательный локализованный alt                                |
| photo          | kind=photo, image; без provider-полей                                                                     |
| video          | kind=video, provider=youtube, youtubeId и poster; исходная ссылка выводится из разрешённого provider + ID |

Длительность, uploadDate, просмотры, SKU, авторство и продуктовые характеристики в этот объём модели не входят: подтверждённых данных нет. Фактическая позиция viewer вычисляется из списка, не хранится как коммерческий показатель.

Публичные чистые функции: фильтрация с сохранением порядка, начальная порция 7 и следующая порция 4. Не вводить общую state machine, query cache или generic pagination framework для одной коллекции.

## Внутренний authoring source

`content/data-access/src/lib/gallery-source.ts` — server-only curated manifest: инвариантные ID/provider/src/dimensions и `Record<Locale, {title, caption?, alt}>`. Порядок записей явный. Он не импортируется UI и не экспортируется как двуязычный массив.

`getGalleryMedia(locale): readonly GalleryMedia[]` в `gallery.ts` проверяет/локализует source. Наружу передаёт только готовый readonly список выбранного языка. Некорректный source — ошибка подготовки данных, без молчаливого удаления записей/подмены переводов. Сетевого fetch, динамического провайдера и cache tags нет; изменение source требует rebuild.

Проверяются ID на дубли, completeness UK/RU, положительные размеры, локальные пути внутри gallery asset directory и допустимая форма YouTube ID. Существование/состав реальных файлов подтверждает EN-001 и focused source test; модельный валидатор не выполняет I/O.

## Локальный UI state

`filter` и `visibleCount` принадлежат GalleryBrowser; `activeMediaId` и ссылка на исходный trigger — его viewer-control. Отдельный MediaImage владеет только loading/error/retry изображения. Смена фильтра сбрасывает порцию и закрывает viewer; смена media/закрытие размонтирует iframe. Фильтр не меняет ID и не переписывает исходный порядок.

Viewer проходит по всей отфильтрованной коллекции, а не только видимым карточкам. На концах нет wrap. При закрытии фокус возвращается к карточке, из которой открыли просмотр, даже после переходов внутри viewer.

Backend/admin/CMS и авторизация редактирования — отдельный будущий этап. Здесь не задаются вымышленные operationId, URL API или контракты загрузки.
