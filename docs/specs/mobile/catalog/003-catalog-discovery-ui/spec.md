# Specification: refreshed catalog discovery UI

**Created:** 2026-07-31\
**Status:** implemented (see [README](README.md))\
**Input:** Refresh the Mobile catalog without changing the corporate theme or API.

## Scope

**In scope:**

- A shared Appbar in the tab layout for “Головна”, “Каталог”, and “Профіль”: active tab title, current theme control, and route-specific actions; the catalog has a search icon.
- Bottom navigation in the same tab layout using `react-native-paper` `BottomNavigation.Bar`, integrated with the existing Expo Router tabs.
- `@shopify/flash-list` for the product list.
- Product cards with a name, price formatted as `… грн.`, and compact `ID: …`.
- Icons to open filters, sorting, and categories.
- Four `react-native-actions-sheet` sheets: search, sort, filters, and categories.
- Active `Chip` for every selected filter, category, and non-default sort.
- Local history of up to ten applied search phrases.

**Out of scope:**

- New endpoints or DTOs, server-side search persistence, or changes to pagination or API filtering logic.
- Changes to the corporate Paper theme, local color tokens, or copying themes from examples.
- Product detail card, cart, favorites, camera, carousel, or gestures.
- Bulk migration of `FlatList` outside the catalog.

## UI corrections — phase 06

- Card spacing is set by `FlashList.ItemSeparatorComponent` (`12dp`); screen inset is set by the container (`16dp`).
- In each card, `ID` appears above the name. `in_stock` uses `primary` (green), `out_of_stock` uses `error` (red), and `unknown` uses `tertiary` (yellow). The photo always sits in a white fixed `96×96dp` frame with `contain` and `overflow: hidden`.
- The filters sheet has no category selector. The category tree opens only in its own sheet and uses `react-native-tree-multi-select` with single selection and Apply.
- The shared Appbar theme control and all feature sheets use `react-native-actions-sheet`. The container and drag indicator get their colors from the active Paper theme.

## Surface and sheet corrections — phase 08

- The catalog screen uses the gray `theme.colors.background`; product cards use `theme.colors.surface` (white in the light theme).
- The shared sheet adapter receives a centered title. The light sheet uses a light surface; the dark sheet uses a dark surface.
- Sort and theme options are neutral by default; only the selected option uses `primary` and a check. Sort direction includes the text “за зростанням” or “за спаданням” with an arrow.

## Search sheet corrections — phase 11

- Recent search rows use `onSurface`, include a control to delete one phrase, and have a neighboring “Очистити” action to clear all.
- Search is submitted with the trailing `primary` icon in the field or keyboard Submit; there is no separate Apply button.
- The search bar is filled `surfaceVariant`, 52–56dp, with no outline: neutral search icon on the left, `onSurface` input text, primary submit on the right, and `×` to clear entered text.
- The sheet has a keyboard-safe scroll layout without an overlay covering history or the submit control.

## Product card hierarchy — phase 12

- ID is the first element, a bold `bodySmall` identifier without increasing its size.
- The name uses normal weight, is slightly more compact than the current title, and is limited to two lines.
- Price remains bold. Price and semantic availability share the bottom row: price on the left, status on the right.

## Applied query chips — phase 13

- Explicit search appears above the product list with other applied values, using `react-native-paper` `Chip` with `onClose`.
- Chips are compact, on one line, with an 8dp gap. A short one-word search query is shown in full; a long or multi-word query is truncated to one line with an ellipsis inside the chip.
- Closing the search chip clears only search; all close actions remain granular.
- All chips use the built-in `react-native-paper` `Chip` in a compact outlined presentation with 13sp text, 8dp gap, 16dp horizontal strip padding, a close icon, and a width limit; no third-party package is added.

## Floating bottom navigation — phase 10 clarification

- Bottom navigation sits in a translucent floating pill with a 16dp horizontal inset, 32dp radius, and shadow/elevation. Only the frame is filled; the screen background remains visible around it.
- Content height (64dp) and system safe area remain separate. Scroll content has sufficient bottom inset beneath the floating frame.

## User scenarios and acceptance

### US1 — User sees a clear catalog (P1)

The user opens the catalog tab and immediately sees the screen title, theme switch, search button, product list on the theme background, and cards with clear contrast.

**Independent test:** Open `/(tabs)/catalog` in light and dark themes and inspect the first screen without searching or filtering.

1. Given the catalog has loaded, when the user opens the tab, then the Appbar shows “Каталог”, the theme control, and the search icon with Ukrainian accessible names.
2. Given a product has a price, when it appears in the list, then its card shows the name, price with the `грн.` suffix, and `ID: <id>`.
3. Given the price is missing, when the card renders, then it shows “Ціну уточнюйте” without an invented amount or currency.
4. Given either theme, when the list renders, then the page uses the current `theme.colors.background` and the card uses an elevated Paper surface with visible separation from the background in both themes.
5. Given many products or another page has loaded, when the user scrolls the list, then `FlashList` renders the items and current pull-to-refresh and “Завантажити ще” behavior is preserved.

### US2 — User controls search through a bottom sheet (P1)

The user taps the search icon in the Appbar, enters a phrase, and explicitly applies it. The bottom sheet also shows up to ten most recently applied phrases.

**Independent test:** Apply two different phrases, restart the app, open the search sheet, and select one of them.

1. Given the catalog Appbar, when “Пошук товарів” is tapped, then an action sheet opens with a search field, an “Застосувати” button, and recent searches.
2. Given the field contains non-empty text, when “Застосувати” is tapped, then the catalog request starts from the first page, the sheet closes, and the normalized phrase moves to the beginning of history.
3. Given the field is empty or contains only whitespace, when “Застосувати” is tapped, then search is cleared, the sheet closes, and nothing is added to history.
4. Given history contains a phrase, when the user taps it, then that phrase is copied into the field; results and history order change only after “Застосувати” is tapped.
5. Given history contains more than ten unique phrases, when an eleventh phrase is applied, then only the ten most recent remain.

### US3 — User controls the catalog with icons and sees active state (P1)

The user sees no text buttons for “Фільтри” or “Сортування” beside the list. They open separate, recognizable icons and see selections as individually removable chips.

**Independent test:** Select a category, a minimum price, “Лише в наявності”, and price sorting; then remove all chips one by one.

1. Given the Appbar and product list, when the user views query controls, then there are three separate icon buttons: “Фільтри”, “Сортування”, and “Категорії”; there is no text `Searchbar` or text button at the top of the screen.
2. Given “Сортування” is tapped, when the action sheet opens, then it shows all supported options, marks the current one, and applies a choice immediately.
3. Given “Фільтри” is tapped, when the action sheet opens, then it contains only availability/new/sale toggles and price boundaries, has an isolated draft, “Скинути”, and “Застосувати”; category is not duplicated in this sheet.
4. Given “Категорії” is tapped, when the action sheet opens, then the user sees a scrollable tree with expand/collapse, selects one category, and applies it to the list.
5. Given a category, each filter, or a non-default sort is selected, when the sheet closes, then a separate `Chip` with a removal button appears for each value.
6. Given the user taps a specific chip’s close icon, when the action completes, then only the corresponding value is removed, the page resets to `1`, and other selections remain.

## Functional requirements

- **FR-001:** `apps/mobile/src/app/(tabs)/_layout.tsx` owns the single `react-native-paper` `Appbar` for every tab page. It shows the active tab title and current `ThemePreferenceHeaderControl`; the catalog adds a search icon in the right action area. Feature screens do not render their own Appbar.
- **FR-002:** The catalog list uses `@shopify/flash-list`; replace `FlatList` in `CatalogList` only within this task.
- **FR-003:** Card presentation does not change `CatalogProduct`. Price is `${price} грн.`; ID is `ID: ${id}`; image and availability remain supporting data if already present.
- **FR-004:** The screen background is centralized as `theme.colors.background`; the card uses `Card`/an elevated surface from the current Paper theme. Literal corporate colors are prohibited in feature/UI.
- **FR-005:** Search, sort, filters, and categories use four separate `react-native-actions-sheet` instances; visibility and drafts are not shared between sheets.
- **FR-006:** Search is not debounced while typing: the API query changes only on “Застосувати”, selecting a history entry followed by “Застосувати”, or clearing search.
- **FR-007:** Search history is stored locally in AsyncStorage under a key isolated in `catalog/feature`; it contains at most 10 unique normalized strings. Data is not sent to the API.
- **FR-008:** Show `Chip` for category, `inStock`, `isNew`, `isSale`, price boundary/range, and sort when sort is not `IdAsc`. Each has `onClose` and a localized accessible name.
- **FR-009:** Removing one chip must not reset other filters, search, or sort. Global “Скинути все” may remain only in the filters sheet and resets filter fields, not category/sort/search.
- **FR-010:** All visible text, labels, and accessible names are Ukrainian; touch targets are at least 48dp.
- **FR-011:** `apps/mobile/src/app/(tabs)/_layout.tsx` owns the single `react-native-paper` `BottomNavigation.Bar` for all tab pages. It shows “Головна”, “Каталог”, and “Профіль”, forwards Expo Router navigation state, safe-area insets, and tab events, and delegates icons through screen options. No second Paper provider is created.

## Edge cases

- Categories are still loading, empty, or unavailable: the category sheet shows the current loading, empty, or error/retry state in place of the tree; other sheets remain available.
- Filters contain invalid price boundaries: existing local validation prevents non-numeric/negative values; a range with `from > to` shows a visible error before “Застосувати”.
- Long name, ID, or history phrase: text wraps/truncates without overflowing the card or action sheet.
- Dismissing an action sheet without “Застосувати” discards search and filter drafts; sort and category apply through the explicit action described in the visual contract.
- Offline/error/loading/empty catalog states preserve existing page states and are not obscured by bottom sheets.
- Web: manually check action sheet, focus, Enter/Space, and Escape; an accessible button/Chip does not rely on a gesture alone.

## Success criteria

- **SC-001:** The catalog screen has no inline `Searchbar` or text buttons for filters/sort; all four scenarios are available through the described Appbar/icon actions.
- **SC-002:** Every active filter, category, and non-default sort has its own chip that removes only itself.
- **SC-003:** After 11 different searches are applied, the sheet shows exactly the latest 10; they remain after app restart.
- **SC-004:** Targeted Jest/RNTL tests cover reducer/storage, `FlashList` rendering, sheets, and chip removal; Android and web QA confirm scrolling, safe area, theme, keyboard/focus, and accessibility.

## Assumptions and dependencies

- Add only `@shopify/flash-list` and `react-native-actions-sheet` versions compatible with Expo SDK 56. Run `npx expo-doctor` before installation.
- The current products/categories API is sufficient; this task adds no parameters or endpoints.
- “грн.” is an approved UX suffix for price, not a server-contract field.
- Local history belongs to the current app installation and is not synchronized across devices or users.
