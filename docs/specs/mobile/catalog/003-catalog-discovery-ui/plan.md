# План реалізації: catalog discovery UI

**Spec:** [spec.md](spec.md)  
**Visual contract:** [visual-spec.md](visual-spec.md)

## Summary

Переробити композицію `CatalogScreen` без зміни route і API: встановити рівно дві схвалені бібліотеки, замінити list implementation, розділити control UI на Appbar/action sheets, додати локальну історію пошуку та granular chip actions.

## Technical context

- **Stack:** Expo SDK 56, React Native, Expo Router, React Native Paper, RTK Query, Nx.
- **Нові залежності:** у T005 встановлено `@shopify/flash-list@2.0.2` та `react-native-actions-sheet@0.9.7`. Для останнього Expo вимагає прямий peer `react-native-gesture-handler@2.31.2`; він доданий через `expo install`. `0.9.7` обрано замість запланованої `10.1.2`, оскільки `10.1.2` додає несумісний другий `react-native-worklets@0.7.4` поруч з Expo SDK 56 `0.11.3`.
- **Target:** Android, iOS, web.
- **Native:** перед install виконати `npx expo-doctor`; за чинною документацією каталог очікує роботу в Expo Go. Якщо resolved package/version змінює native runtime або config, діяти за [Development Build](../../../../architecture/mobile/development-build.md) і зафіксувати це в quickstart.

## Source paths and responsibilities

```text
apps/mobile/src/app/(tabs)/catalog.tsx                         # тонкий route, не змінювати логіку
libs/mobile/core/shell/src/components/theme/
  theme-preference-header-control.tsx                          # reuse в Appbar
libs/mobile/core/shell/src/theme/app-theme.ts                  # тільки чинні colors
libs/mobile/catalog/model/src/queries/catalog-query.ts         # чинні query types/defaults
libs/mobile/catalog/ui/src/components/
  catalog-list.tsx                                             # FlashList
  product-card.tsx                                             # elevated card, price + ID
  catalog-active-filters.tsx                                  # closeable chips
  catalog-filters-modal.tsx                                   # замінити filters action sheet без category
  catalog-category-selector.tsx                               # reuse у category sheet
  catalog-sort-menu.tsx                                       # замінити sort action sheet
  catalog-*-sheet.tsx                                         # нові presentational sheets
libs/mobile/catalog/feature/src/
  state/catalog-query-reducer.ts                               # sheet drafts, granular removal actions
  state/catalog-search-history.ts                              # pure normalize/upsert helpers
  storage/catalog-search-history-storage.ts                    # AsyncStorage adapter
  hooks/use-catalog-controller.ts                              # applied query, history bootstrap/persist
  components/catalog-query-controls.tsx                        # compose callbacks and sheets
  components/catalog-screen-content.tsx                       # screen background/layout
```

## Architecture boundaries

- `apps/mobile` route залишається thin adapter.
- `apps/mobile/src/app/(tabs)/_layout.tsx` володіє спільними `react-native-paper` `Appbar` і `BottomNavigation.Bar` для кожної tab-сторінки. Appbar показує title, theme control і route-specific actions; feature-екрани не рендерять власні Appbar. Paper bar передає state, safe-area insets та events Expo Router, а icon/label отримує через screen options; другого Paper provider немає.
- `ui` отримує `CatalogProduct`, selected state та callbacks; не імпортує RTK Query, router або AsyncStorage.
- `feature` володіє reducer, query transition, search history і orchestration.
- `model` містить лише pure query/history helper types, якщо вони потрібні поза feature; DTO лишаються в `data-access`.
- Theme control та theme tokens не копіюються в catalog; use existing public API `@mobile/core/shell`.
- Публічні exports libraries оновлюються лише через відповідний `src/index.ts`.

## Phase 00 confirmed contract

- Search history є локальною для інсталяції: `mobile.catalog.search-history.v1`, лише нормалізовані непорожні фрази після explicit «Застосувати», case-insensitive deduplicate, максимум 10. Вибір history entry тільки змінює draft; API query не змінюється до Apply.
- Search і filters мають ізольовані draft та відкидають його при dismiss. Sort застосовується одразу при виборі; category має draft і Apply. Будь-яка applied зміна query скидає page до `1`.
- «Скинути» у filters sheet скидає лише filter fields. Воно не змінює category, sort або search; close кожного chip змінює лише відповідне поле.
- Чинні публічні exports підтверджено: `@mobile/core/shell` експортує `ThemePreferenceHeaderControl`, `mobileLightTheme` і `mobileDarkTheme`; `@mobile/catalog/ui` — наявні catalog components; `@mobile/catalog/feature` — лише `CatalogScreen`. Нові внутрішні sheets, controller, reducer і storage не стають публічними без потреби поза feature.
- Точні Nx names: `shell`, `mobile-catalog-model`, `mobile-catalog-ui`, `mobile-catalog-feature`, застосунок — `mobile`. Усі назви з `quickstart.md` для model/UI/feature вже збігаються з workspace.
- У встановленій `react-native-paper@5.15.3` `IconButton`/`Appbar.Action` приймають string `IconSource`; поточний Paper icon resolver використовує Material Community icon names `magnify`, `filter-variant`, `sort`, `shape`, `theme-light-dark` і `check`. Усі labels з `visual-spec.md` лишаються українськими.

## Web action-sheet contract and fallback

`react-native-actions-sheet@0.9.7` не встановлює в публічній документації контрактів для web keyboard, Escape, focus trap або повернення фокусу. У фазі 01/03/04 використовується один тонкий feature-local adapter для кожного з чотирьох sheets: на web він обробляє `Escape` через той самий dismiss callback, переводить фокус у search input після відкриття search sheet і повертає його на trigger після dismiss. Якщо package не утримує Tab у панелі, adapter додає явний focus containment для sheet actions; він не замінює action sheet і не змінює native поведінку. Це перевіряється вручну у T016 і T024.

## Implementation sequence

1. Пройти phase 00 і погодити цей contract, включно з persistence history.
2. У phase 01 встановити залежності, оновити mocks/test setup, перевірити Expo compatibility; не створювати Development Build без фактичної native причини.
3. У phase 02 поставити Appbar, action row, FlashList і card layout; зберегти existing page states/pagination.
4. У phase 03 реалізувати search sheet, explicit Apply/dismiss і локальну history.
5. У phase 04 реалізувати sort/filter/category sheets, granular closeable chips і їхні transitions/tests.
6. У phase 05 пройти lint/tests/type checks та Android/iOS/web manual QA.

## Phase 06 correction plan

1. Додати `react-native-tree-multi-select@3.0.2`, не вмикати drag-and-drop, зберегти одиничний category draft та Apply.
2. Винести presentation ActionSheet у theme-aware adapter і використати його для search/sort/filters/categories; тему зі shared Appbar перенести з Paper Menu до ActionSheet.
3. Нормалізувати list/card geometry і статуси наявності через існуючі Paper tokens.
4. Оновити mocks і targeted tests, після чого пройти delivery у новій фінальній фазі 07.

## Phase 08 correction plan

1. Зберегти card/screen contrast через `surface` для картки та `background` для page container.
2. Розширити спільний ActionSheet adapter title slot і централізовано визначати світлу/dark surface та indicator.
3. Винести selected styling sort/theme options в один явний стан і розгорнути людські підписи напрямку сортування.
4. Повторити targeted UI checks; фінальною фазою стає 09 delivery.

## Risks

| Risk                                                  | Mitigation                                                              | Verification               |
| ----------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------- |
| FlashList props/recycling відрізняються від FlatList  | Переносити list із мінімальним API, тестувати footer/refresh/pagination | RNTL + Android long scroll |
| Sheets перекривають keyboard або не скроляться        | Один scroll owner, max height 88%, keyboard QA                          | Android/iOS manual QA      |
| Search history пишеться до Apply чи містить дублікати | Pure normalize/upsert helper із unit tests                              | Jest state/storage tests   |
| Прибирання chip скидає весь query                     | Окремі reducer actions і targeted tests                                 | Jest reducer tests         |
| Elevated card втрачає контраст у dark mode            | Лише theme surface/background і manual contrast review                  | Light/dark screenshots     |
| Наявна category UI дублюється у filters               | Винести її в окремий sheet, покрити acceptance test                     | RNTL + manual scenario     |
