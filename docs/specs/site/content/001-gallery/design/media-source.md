# Подтверждённый источник видео галереи

> Historical. Since admin stage 4 (2026-11-04) the gallery comes from the Content API, the local posters and `gallery-source.ts` are removed, and video posters load from `i.ytimg.com`. See the [site gallery card](../../../../../features/site/gallery.md).

**Снимок источника: 2026-11-03.** Пользователь прямо подтвердил перенос трёх роликов прежней галереи (`1eB0xxFgwlw`, `j9wrjRub9xI`, `0FDRbSaQ9Ec`) и всех публично доступных видео их канала. Проверка установила семь роликов одного владельца — **Kedr Class**, handle `@kedrclass2334`, channel ID `UCMzipw3fGj8I8HgQXiPoTWQ`.

Источники: [канонический канал](https://www.youtube.com/channel/UCMzipw3fGj8I8HgQXiPoTWQ), [публичный список видео](https://www.youtube.com/@kedrclass2334/videos), [официальный RSS](https://www.youtube.com/feeds/videos.xml?channel_id=UCMzipw3fGj8I8HgQXiPoTWQ). oEmbed каждого ролика независимо подтвердил одинакового владельца, название и URL постера.

## Полнота снимка

- Выбранная вкладка Videos содержит семь video items в `richGridRenderer.contents`; **продолжения списка видео нет**.
- Единственный найденный continuation относится к About в заголовке канала. Его официальный ответ был прочитан и содержит `videoCountText: "7 відео"` для того же channel ID; дополнительных видео или следующего continuation в нём нет.
- RSS возвращает те же семь ID в том же порядке. Сохранён официальный порядок **от новых к старым**.

Это полный публичный список, доступный анонимно при проверке. Закрытые, скрытые по ссылке, удалённые, доступные только участникам или недоступные в регионе материалы этим источником не перечисляются.

## Названия и локализация

RU — неизменённые официальные названия. UK — их буквальный перевод без добавления продуктовых утверждений или описаний содержимого.

| YouTube ID    | RU                                             | UK                                               |
| ------------- | ---------------------------------------------- | ------------------------------------------------ |
| `0FDRbSaQ9Ec` | Петля скрытая ZCG 40                           | Прихована петля ZCG 40                           |
| `j9wrjRub9xI` | Сравнение скрытых петель с ZCG 40 KEDR         | Порівняння прихованих петель із ZCG 40 KEDR      |
| `1eB0xxFgwlw` | 1 апреля 2021 г.                               | 1 квітня 2021 р.                                 |
| `8hLIBALylkQ` | CLASS Броненакладка Z 1021 CP (пустотелая)     | CLASS Броненакладка Z 1021 CP (порожниста)       |
| `LQcVX5dC9MM` | Сравнение замка Apecs 2600 с замком Class 2800 | Порівняння замка Apecs 2600 із замком Class 2800 |
| `SIWCZ5uVY_4` | CLASS Броненакладка Z 1021 CP (пустотелая)     | CLASS Броненакладка Z 1021 CP (порожниста)       |
| `ekr7ceJlJcg` | Замок Class 2800 (тех упаковка)                | Замок Class 2800 (технічне пакування)            |

Для общего названия `1eB0xxFgwlw` поясняющий caption не придуман. Разные ID `8hLIBALylkQ` и `SIWCZ5uVY_4` сохранены отдельными записями, несмотря на одинаковое официальное название. Стабильный ID модели — `youtube-<YouTube ID>`; alt локализован как «Постер відео/видео» с соответствующим названием.

## Реальные локальные постеры

Все семь оригинальных файлов размещены в `apps/site/public/images/gallery/`. Каждый файл проверен по JPEG-сигнатуре и фактическому декодированию: **JPEG, 480 × 360 px**. Исходные байты сохранены без генерации, надписей, изменения размеров и перекодирования; каждый локальный постер просмотрен как исходное изображение. SHA-256 повторно проверен после сохранения и покрыт focused source test после копирования в целевой репозиторий.

| Локальный файл    | Оригинальный URL                                                  | SHA-256                                                            |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| `0FDRbSaQ9Ec.jpg` | [hqdefault.jpg](https://i.ytimg.com/vi/0FDRbSaQ9Ec/hqdefault.jpg) | `11cb8ba4f7a03641ecf923a0314393eaa088604d853fc8c5101954101c983b8c` |
| `j9wrjRub9xI.jpg` | [hqdefault.jpg](https://i.ytimg.com/vi/j9wrjRub9xI/hqdefault.jpg) | `3b339774d614d1c2291dc7e15cd82cb885c229d526c4ec843551db5d69a228ee` |
| `1eB0xxFgwlw.jpg` | [hqdefault.jpg](https://i.ytimg.com/vi/1eB0xxFgwlw/hqdefault.jpg) | `bf2517e2a8c1991212baf68e7ca897a17863f07079db7cac763330396f933419` |
| `8hLIBALylkQ.jpg` | [hqdefault.jpg](https://i.ytimg.com/vi/8hLIBALylkQ/hqdefault.jpg) | `1ea3b2a5f666fa4e136d08da170aa663dfae6b6ca751aa2624b90749cd6bd5c6` |
| `LQcVX5dC9MM.jpg` | [hqdefault.jpg](https://i.ytimg.com/vi/LQcVX5dC9MM/hqdefault.jpg) | `140b422d0c11f0e30c6212a72ca0f220fcac37bb3ae5c3c4f1bad5fe24dd538d` |
| `SIWCZ5uVY_4.jpg` | [hqdefault.jpg](https://i.ytimg.com/vi/SIWCZ5uVY_4/hqdefault.jpg) | `97442258b7b32319795783d761800a6c0edc11558c95bf6800eb8bd8c1edfa59` |
| `ekr7ceJlJcg.jpg` | [hqdefault.jpg](https://i.ytimg.com/vi/ekr7ceJlJcg/hqdefault.jpg) | `10e0656f7bfc6d7aba93e92c97f991c900c011b598e0a38eae56d0dc4a203990` |

## Границы подтверждения

`gallery-source.ts` хранит текущий curated server-only снимок. Автоматического опроса канала нет; изменение коллекции требует проверки источника, изменения снимка и rebuild. `getGalleryMedia(locale)` отдаёт только readonly модель выбранной локали, без дат, длительности, bilingual manifest или provenance. Интеграционная focused проверка `gallery.spec.ts`: **44/44 passed, exit 0**.

Проверены метаданные и реальные постеры. Воспроизведение роликов, доступность iframe и поведение внешнего YouTube-плеера этой проверкой не подтверждались; видеофайлы не скачивались.

Подтверждена видеочасть из семи роликов. Реальные фотографии и подписи отложены на следующий этап прямым решением владельца; это не блокирует согласованный видеоэтап согласно [content-readiness.md](content-readiness.md).
