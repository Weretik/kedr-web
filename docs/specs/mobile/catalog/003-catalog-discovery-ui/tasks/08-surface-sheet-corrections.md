# Фаза 08 — Коригування поверхонь і списків sheet

## Мета

Уточнити візуальну ієрархію catalog та `react-native-actions-sheet` без зміни запитів, маршрутизації або поведінки вибору.

- [x] C038. Фон екрана каталогу має бути нейтрально-сіруватим `theme.colors.background`; кожна product card лишається білою у світлій темі (`theme.colors.surface`) та контрастною surface у темній.
- [x] C039. Додати до спільного theme-aware ActionSheet центрований заголовок. Search, sort, filters, categories і theme picker передають свій title через цей adapter; локальні дублікати заголовків прибрати.
- [x] C040. У світлій темі ActionSheet має білу surface; у темній — surface активної dark Paper theme. Drag indicator лишається контрастним в обох темах.
- [x] C041. Пункти sort і theme picker за замовчуванням використовують звичайний `onSurface` text. Лише обраний пункт виділяється green `primary` і check icon; колір не застосовується до всього списку.
- [x] C042. Для кожного sort option показувати іконку стрілки та текстове пояснення напряму: «за зростанням» або «за спаданням»; accessibility label містить повний зміст.
- [x] C043. Оновити UI tests/mocks і виконати targeted UI test та lint.

## Acceptance

1. На світлому catalog-екрані видно сіруватий page background і окремі білі картки.
2. Кожен ActionSheet має один центрований заголовок; у light theme його container білий, у dark — не білий.
3. Необрані sort/theme options мають звичайний колір тексту. Тільки активний option зелений і має check.
4. Sort options читаються без інтерпретації стрілок: наприклад, «Ціна — за зростанням».

## Checkpoint

Не переходити до фінального delivery, доки C038–C043 не виконані й не перевірені.
