# Фаза 06 — Коригування discovery UI

## Мета

Виправити виявлені під час перегляду UI недоліки без зміни API, маршрутизації або query-логіки каталогу.

- [x] C026. Зробити стабільний відступ `12dp` між картками через `FlashList.ItemSeparatorComponent`; горизонтальний відступ `16dp` належить контейнеру списку, а не картці.
- [x] C027. Перебудувати картку товару: `ID` має бути над назвою; статус наявності — зелений для `in_stock`, червоний для `out_of_stock`, жовтий для `unknown`; використати чинні токени Paper theme (`primary`, `error`, `tertiary`).
- [x] C028. Помістити кожне фото у фіксований білий frame `96×96dp` з `overflow: hidden`; зображення відображати через `resizeMode="contain"`, щоб воно не виходило за межі frame.
- [x] C029. У sheet фільтрів залишити лише filter-поля та ціни. Вибір категорії доступний тільки з окремої кнопки та окремого category sheet.
- [x] C030. Замінити Paper `Menu` вибору теми у спільному Appbar на `react-native-actions-sheet`; filters, search, sort і category також мають використовувати цей компонент через один theme-aware adapter.
- [x] C031. Theme-aware adapter передає ActionSheet background із активної Paper theme та контрастний drag indicator. Перевірити світлу й темну теми.
- [x] C032. Замінити саморобний selector категорій на `react-native-tree-multi-select@3.0.2`: дерево без drag-and-drop, з одиничним вибором і явним Apply у category sheet.
- [x] C033. Оновити unit/UI тести й mocks для нового дерева, картки та sheet adapter; виконати targeted automated checks.

## Acceptance

1. У списку картки не злипаються: між будь-якими двома елементами є 12dp, з країв екрана — 16dp.
2. У картці `ID` видно першим у текстовому блоці. Статус наявності має семантично правильний колір у світлій і темній темі; фото не обрізає frame та не виходить за його межі.
3. У filters sheet немає дерева або control вибору категорії.
4. Theme, search, sort, filters і categories відкриваються як `react-native-actions-sheet`; лист теми доступний зі спільного Appbar кожної tab-сторінки.
5. У dark theme контейнер sheet не білий, а індикатор зверху достатньо контрастний.
6. Category sheet рендерить `react-native-tree-multi-select`, дозволяє розкрити гілки, обрати одну категорію й підтвердити вибір через Apply.

## Checkpoint

Не переходити до delivery, доки C026–C033 не виконані та не зафіксовані результати automated checks.
