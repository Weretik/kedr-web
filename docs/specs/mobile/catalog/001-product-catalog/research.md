# Research: Mobile product catalog

| Питання | Рішення | Причина | Альтернативи |
| --- | --- | --- | --- |
| Основне представлення каталогу | React Native `FlatList` + одноколонкові `ProductCard` | `FlatList` дає virtualized list, header/footer, refresh, scroll loading і `numColumns` без нової native залежності. | MUI Data Grid не призначений для React Native; `ScrollView` рендерить весь каталог; `SectionList` потрібен лише для реальних секцій. |
| Pagination UX | Server-side cursor/page + явна кнопка «Завантажити ще»; optional `onEndReached` після API-перевірки | Явна дія стабільніша для mobile network, доступніша й простіше відновлюється після помилки; UI не прив'язаний до конкретної API pagination semantics. | Номери сторінок займають mobile space; client-side pagination потребує завантаження всього каталогу. |
| Search і filters | Server-side query з debounce; Paper `Searchbar`, `Modal`/`Portal`, `Chip`, `Menu` | Каталог може бути великим; filters/facets належать backend contract, а Paper вже є UI library проекту. | Локальна фільтрація неповна; окрема UI library порушує project standard. |
| Performance upgrade | Почати з `FlatList`; розглянути FlashList лише після profiling на Galaxy A12 | У поточному scope нова залежність не виправдана. FlashList v2 потребує New Architecture. | Передчасне додавання FlashList; Data Grid. |

Sources: [React Native FlatList](https://reactnative.dev/docs/flatlist), [FlashList v2](https://shopify.github.io/flash-list/docs/v2-migration/).
