# Visual та interaction contract: каталог

## Wireframe

```text
┌────────────────────────────────────────────┐
│ Каталог                    [тема] [пошук] │  Appbar
├────────────────────────────────────────────┤
│                       [фільтри][sort][кат.]│  icon actions
│ [Категорія: Ноутбуки ×] [В наявності ×] → │  horizontal chips, якщо є
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ [фото]  Назва товару                  │  │
│  │         2 499 грн.                    │  │
│  │         ID: 12345                     │  │  elevated card
│  └──────────────────────────────────────┘  │
│                                            │
│  … FlashList …                             │
└────────────────────────────────────────────┘

Search / sort / filters / categories відкриваються як окремі bottom action sheets.
```

## Anatomy

| Частина             | Призначення                                          | Компонент / token                                                                                 |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Appbar              | Контекст екрана, тема, пошук                         | Paper `Appbar`, чинний `ThemePreferenceHeaderControl`, `theme.colors.surface`                     |
| Action row          | Відкрити filters/sort/categories без текстового шуму | Paper `IconButton`; `filter-variant`, `sort`, `shape` або затверджені еквівалентні Material icons |
| Active chips row    | Видимий поточний query і точкове скасування          | horizontal `ScrollView` + Paper `Chip` з `onClose`                                                |
| Screen background   | Відділити картки від сторінки                        | `theme.colors.background`                                                                         |
| Product card        | Сканований результат товару                          | Paper `Card` mode `elevated`, `theme.colors.surface`, image + title + price + ID                  |
| Bottom action sheet | Окремий фокусований сценарій                         | `react-native-actions-sheet`, safe-area bottom padding, власний scroll owner                      |

## Interaction matrix

| Елемент                 | Дія                 | Результат                                                | Accessible name           |
| ----------------------- | ------------------- | -------------------------------------------------------- | ------------------------- |
| Theme icon              | tap / Enter / Space | Відкриває чинне меню теми                                | `Змінити тему оформлення` |
| Search icon             | tap / Enter / Space | Відкриває search sheet, фокус у полі                     | `Пошук товарів`           |
| Apply search            | tap / Enter         | Застосовує draft, оновлює history, закриває sheet        | `Застосувати пошук`       |
| History entry           | tap / Enter         | Підставляє значення в draft, не виконує query самостійно | `Шукати: <фраза>`         |
| Filters icon            | tap / Enter / Space | Відкриває filters sheet з draft чинних filter fields     | `Фільтри`                 |
| Apply filters           | tap / Enter         | Застосовує filters і закриває sheet                      | `Застосувати фільтри`     |
| Sort icon               | tap / Enter / Space | Відкриває sort sheet, current option позначено           | `Сортування`              |
| Sort option             | tap / Enter         | Одразу застосовує sort, скидає page, закриває sheet      | `Сортувати за: <label>`   |
| Categories icon         | tap / Enter / Space | Відкриває category sheet                                 | `Категорії`               |
| Category option         | tap / Enter         | Вибирає category draft; «Застосувати» підтверджує        | `Категорія: <label>`      |
| Chip close              | tap / Enter / Space | Прибирає тільки значення цього chip                      | `Прибрати: <label>`       |
| Sheet backdrop / Escape | tap / Escape        | Закриває sheet без застосування draft                    | `Закрити`                 |

## State matrix

| State                          | Visible content                             | Enabled actions                   | Transition               |
| ------------------------------ | ------------------------------------------- | --------------------------------- | ------------------------ |
| Default                        | Appbar, 3 icon actions, cards               | all                               | відкриття sheet / scroll |
| Search sheet                   | field, Apply, history до 10                 | Apply; history entries            | Apply або dismiss        |
| Empty history                  | field, Apply, «Нещодавніх пошуків немає»    | Apply                             | після першого Apply      |
| Filters sheet                  | boolean filters, price fields, Reset, Apply | Reset/Apply                       | Apply або dismiss        |
| Categories loading/error/empty | чинний state замість дерева                 | retry за помилки                  | успіх запиту             |
| Active query                   | individual chips                            | each chip close                   | локальне скидання поля   |
| Product loading/error/empty    | чинний `CatalogPageState`                   | retry / clear search за наявності | RTK Query result         |

## Layout, scroll and responsive behavior

- **Android/iOS:** Appbar враховує top safe area. Action row і chips лишаються над `FlashList`; сам список — єдиний вертикальний scroll owner екрана.
- **Action sheets:** maximum height 88% viewport; їхній внутрішній контент має власний vertical scroll. Category tree і filter form не створюють некерованого nested scroll.
- **Chips:** одна горизонтально прокручувана смуга; не стискати кожен chip до нечитабельної ширини.
- **Product cards:** відступ 16dp до країв екрана, 12dp між картками; мінімальна висота 120dp. Довгі заголовки — максимум два рядки. Price має вищу візуальну ієрархію за ID.
- **Web:** екран не перевищує корисну ширину viewport; усі icon buttons мають visible focus. Escape закриває sheet, а Tab не губиться за його межами.

## Accessibility

- Touch target кожної icon button, action і chip close — `>= 48dp`.
- Icon-only controls мають українські `accessibilityLabel`; обраний sort/category має non-color label і check indicator.
- `Chip` не залежить лише від кольору: текст указує значення, а close control має окрему назву.
- Haptic, gesture або анімація не є єдиним сигналом успіху; у цій задачі вони не потрібні.

## Do / don't

| Робити                                             | Не робити                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------- |
| Використовувати чинні Paper theme colors           | Копіювати palette/Theme із прикладів                                 |
| Відкривати один конкретний сценарій в одному sheet | Змішувати search, sort, filters і categories в одному великому modal |
| Показувати один chip на одне query-значення        | Давати лише загальну кнопку «Скинути» без точкового видалення        |
| Застосовувати search явною кнопкою                 | Виконувати API-запит на кожен символ у sheet                         |
| Зберігати історію лише після Apply                 | Зберігати випадкові незавершені набори тексту                        |
