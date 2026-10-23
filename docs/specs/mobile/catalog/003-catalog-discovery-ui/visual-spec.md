# Visual and interaction contract: catalog

## Wireframe

```text
┌────────────────────────────────────────────┐
│ Каталог                    [тема] [пошук] │  Appbar
├────────────────────────────────────────────┤
│                       [фільтри][sort][кат.]│  icon actions
│ [Категорія: Ноутбуки ×] [В наявності ×] → │  horizontal chips, if any
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ [фото]  Назва товару                  │  │
│  │         2 499 грн.                    │  │
│  │         ID: 12345                     │  │  elevated card
│  └──────────────────────────────────────┘  │
│                                            │
│  … FlashList …                             │
└────────────────────────────────────────────┘

Search / sort / filters / categories open as separate bottom action sheets.
```

## Anatomy

| Part                | Purpose                                           | Component / token                                                                            |
| ------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Appbar              | Screen context, theme, and search                 | Paper `Appbar`, existing `ThemePreferenceHeaderControl`, `theme.colors.surface`              |
| Action row          | Open filters/sort/categories without text clutter | Paper `IconButton`; `filter-variant`, `sort`, `shape`, or approved equivalent Material icons |
| Active chips row    | Show the current query and allow targeted removal | Horizontal `ScrollView` + Paper `Chip` with `onClose`                                        |
| Screen background   | Separate cards from the page                      | `theme.colors.background`                                                                    |
| Product card        | Scannable product result                          | Paper `Card` mode `elevated`, `theme.colors.surface`, image + title + price + ID             |
| Bottom action sheet | Focused flow for one scenario                     | `react-native-actions-sheet`, safe-area bottom padding, its own scroll owner                 |

## Interaction matrix

| Element                 | Action              | Result                                                              | Accessible name           |
| ----------------------- | ------------------- | ------------------------------------------------------------------- | ------------------------- |
| Theme icon              | tap / Enter / Space | Opens the existing theme menu                                       | `Змінити тему оформлення` |
| Search icon             | tap / Enter / Space | Opens the search sheet and focuses the field                        | `Пошук товарів`           |
| Apply search            | tap / Enter         | Applies the draft, updates history, and closes the sheet            | `Застосувати пошук`       |
| History entry           | tap / Enter         | Copies the value into the draft; does not run a query on its own    | `Шукати: <фраза>`         |
| Filters icon            | tap / Enter / Space | Opens the filters sheet with drafts of the current filter fields    | `Фільтри`                 |
| Apply filters           | tap / Enter         | Applies filters and closes the sheet                                | `Застосувати фільтри`     |
| Sort icon               | tap / Enter / Space | Opens the sort sheet with the current option marked                 | `Сортування`              |
| Sort option             | tap / Enter         | Applies the sort immediately, resets the page, and closes the sheet | `Сортувати за: <label>`   |
| Categories icon         | tap / Enter / Space | Opens the category sheet                                            | `Категорії`               |
| Category option         | tap / Enter         | Selects a category draft; “Застосувати” confirms it                 | `Категорія: <label>`      |
| Chip close              | tap / Enter / Space | Removes only the value represented by that chip                     | `Прибрати: <label>`       |
| Sheet backdrop / Escape | tap / Escape        | Closes the sheet without applying the draft                         | `Закрити`                 |

## State matrix

| State                          | Visible content                             | Enabled actions                     | Transition            |
| ------------------------------ | ------------------------------------------- | ----------------------------------- | --------------------- |
| Default                        | Appbar, 3 icon actions, cards               | All                                 | Open sheet / scroll   |
| Search sheet                   | Field, Apply, history up to 10              | Apply; history entries              | Apply or dismiss      |
| Empty history                  | Field, Apply, “Нещодавніх пошуків немає”    | Apply                               | After first Apply     |
| Filters sheet                  | Boolean filters, price fields, Reset, Apply | Reset/Apply                         | Apply or dismiss      |
| Categories loading/error/empty | Existing state in place of the tree         | Retry on error                      | Query succeeds        |
| Active query                   | Individual chips                            | Close each chip                     | Locally reset a field |
| Product loading/error/empty    | Existing `CatalogPageState`                 | Retry / clear search when available | RTK Query result      |

## Layout, scroll, and responsive behavior

- **Android/iOS:** The Appbar accounts for the top safe area. The action row and chips stay above `FlashList`; the list is the screen’s only vertical scroll owner.
- **Action sheets:** Maximum height is 88% of the viewport; their inner content has its own vertical scroll. The category tree and filter form must not create uncontrolled nested scrolling.
- **Chips:** Use one horizontally scrolling row; do not shrink chips until they become unreadable.
- **Product cards:** 16dp inset from screen edges, 12dp between cards, and 120dp minimum height. Long titles use at most two lines. Price has stronger visual hierarchy than ID.
- **Web:** The screen stays within the useful viewport width; all icon buttons have visible focus. Escape closes a sheet, and Tab focus stays within it.

## Accessibility

- Touch targets for every icon button, action, and chip close control are `>= 48dp`.
- Icon-only controls have Ukrainian `accessibilityLabel` values; selected sort/category state has a non-color label and check indicator.
- `Chip` does not rely on color alone: its text identifies the value, and its close control has a separate name.
- Haptics, gestures, or animation are not the only signal of success; they are not needed for this task.

## Do / don't

| Do                                      | Don’t                                                            |
| --------------------------------------- | ---------------------------------------------------------------- |
| Use existing Paper theme colors         | Copy the palette/theme from examples                             |
| Open one focused scenario in each sheet | Combine search, sort, filters, and categories in one large modal |
| Show one chip per query value           | Provide only a general “Скинути” button without targeted removal |
| Apply search with an explicit button    | Run an API request on every keystroke in the sheet               |
| Save history only after Apply           | Save accidental, unfinished text drafts                          |
