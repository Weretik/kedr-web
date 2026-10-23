# Implementation plan: catalog discovery UI

**Spec:** [spec.md](spec.md)  
**Visual contract:** [visual-spec.md](visual-spec.md)

## Summary

Redesign the `CatalogScreen` composition without changing the route or API: install exactly two approved libraries, replace the list implementation, split control UI across the Appbar and action sheets, add local search history, and provide granular chip actions.

## Technical context

- **Stack:** Expo SDK 56, React Native, Expo Router, React Native Paper, RTK Query, Nx.
- **New dependencies:** T005 installed `@shopify/flash-list@2.0.2` and `react-native-actions-sheet@0.9.7`. Expo requires a direct `react-native-gesture-handler@2.31.2` peer for the latter; it was added with `expo install`. Version `0.9.7` was selected instead of the planned `10.1.2` because `10.1.2` adds an incompatible second `react-native-worklets@0.7.4` alongside Expo SDK 56's `0.11.3`.
- **Target:** Android, iOS, web.
- **Native:** Run `npx expo-doctor` before installation; current documentation expects the catalog to work in Expo Go. If the resolved package/version changes the native runtime or config, follow [Development Build](../../../../architecture/mobile/platform/development-build.md) and record the change in the quickstart.

## Source paths and responsibilities

```text
apps/mobile/src/app/(tabs)/catalog.tsx                         # thin route; do not change logic
libs/mobile/core/shell/src/components/theme/
  theme-preference-header-control.tsx                          # reuse in Appbar
libs/mobile/core/shell/src/theme/app-theme.ts                  # current colors only
libs/mobile/catalog/model/src/queries/catalog-query.ts         # current query types/defaults
libs/mobile/catalog/ui/src/components/
  catalog-list.tsx                                             # FlashList
  product-card.tsx                                             # elevated card, price + ID
  catalog-active-filters.tsx                                  # closeable chips
  catalog-filters-modal.tsx                                   # replace with filters action sheet, without category
  catalog-category-selector.tsx                               # reuse in category sheet
  catalog-sort-menu.tsx                                       # replace with sort action sheet
  catalog-*-sheet.tsx                                         # new presentational sheets
libs/mobile/catalog/feature/src/
  state/catalog-query-reducer.ts                               # sheet drafts, granular removal actions
  state/catalog-search-history.ts                              # pure normalize/upsert helpers
  storage/catalog-search-history-storage.ts                    # AsyncStorage adapter
  hooks/use-catalog-controller.ts                              # applied query, history bootstrap/persist
  components/catalog-query-controls.tsx                        # compose callbacks and sheets
  components/catalog-screen-content.tsx                       # screen background/layout
```

## Architecture boundaries

- The `apps/mobile` route remains a thin adapter.
- `apps/mobile/src/app/(tabs)/_layout.tsx` owns the shared `react-native-paper` `Appbar` and `BottomNavigation.Bar` for every tab page. The Appbar shows the title, theme control, and route-specific actions; feature screens do not render their own Appbar. The Paper bar forwards state, safe-area insets, and events to Expo Router, and obtains icons/labels through screen options; no second Paper provider is added.
- `ui` receives `CatalogProduct`, selected state, and callbacks; it does not import RTK Query, the router, or AsyncStorage.
- `feature` owns the reducer, query transitions, search history, and orchestration.
- `model` contains only pure query/history helper types when needed outside `feature`; DTOs remain in `data-access`.
- Theme controls and theme tokens are not copied into catalog; use the existing public API `@mobile/core/shell`.
- Public library exports are updated only through the relevant `src/index.ts`.

## Phase 00 confirmed contract

- Search history is local to the installation: `mobile.catalog.search-history.v1`. Store only normalized, non-empty phrases after explicit “Застосувати”; deduplicate case-insensitively and keep at most 10. Selecting a history entry changes only the draft; the API query remains unchanged until Apply.
- Search and filters have isolated drafts that are discarded on dismiss. Sort applies immediately when selected; category has a draft and Apply. Any applied query change resets the page to `1`.
- “Скинути” in the filters sheet resets filter fields only. It does not change category, sort, or search; closing each chip changes only its corresponding field.
- Current public exports are confirmed: `@mobile/core/shell` exports `ThemePreferenceHeaderControl`, `mobileLightTheme`, and `mobileDarkTheme`; `@mobile/catalog/ui` exports existing catalog components; `@mobile/catalog/feature` exports only `CatalogScreen`. New internal sheets, controller, reducer, and storage do not become public unless needed outside the feature.
- Exact Nx names: `shell`, `mobile-catalog-model`, `mobile-catalog-ui`, `mobile-catalog-feature`; the app is `mobile`. All model/UI/feature names in `quickstart.md` already match the workspace.
- In installed `react-native-paper@5.15.3`, `IconButton`/`Appbar.Action` accept string `IconSource`; the current Paper icon resolver uses Material Community icon names `magnify`, `filter-variant`, `sort`, `shape`, `theme-light-dark`, and `check`. All labels from `visual-spec.md` remain Ukrainian.

## Web action-sheet contract and fallback

The public documentation for `react-native-actions-sheet@0.9.7` does not define contracts for web keyboard behavior, Escape, focus trapping, or focus restoration. Phases 01/03/04 use one thin feature-local adapter for each of the four sheets: on web, it handles `Escape` through the same dismiss callback, moves focus to the search input when the search sheet opens, and returns it to the trigger after dismiss. If the package does not keep Tab focus inside the panel, the adapter adds explicit focus containment for sheet actions; it does not replace the action sheet or change native behavior. Verify this manually in T016 and T024.

## Implementation sequence

1. Complete phase 00 and agree on this contract, including history persistence.
2. In phase 01, install dependencies, update mocks/test setup, and check Expo compatibility; do not create a Development Build without a concrete native reason.
3. In phase 02, add the Appbar, action row, FlashList, and card layout; preserve existing page states and pagination.
4. In phase 03, implement the search sheet, explicit Apply/dismiss, and local history.
5. In phase 04, implement sort/filter/category sheets, granular closeable chips, and their transitions/tests.
6. In phase 05, run lint/tests/type checks and manual Android/iOS/web QA.

## Phase 06 correction plan

1. Add `react-native-tree-multi-select@3.0.2`, keep drag-and-drop disabled, and preserve single category draft plus Apply.
2. Move ActionSheet presentation into a theme-aware adapter and use it for search/sort/filters/categories; move the theme menu from the shared Appbar from Paper Menu to ActionSheet.
3. Normalize list/card geometry and availability status through existing Paper tokens.
4. Update mocks and targeted tests, then run delivery in the new final phase 07.

## Phase 08 correction plan

1. Preserve card/screen contrast with `surface` for the card and `background` for the page container.
2. Extend the shared ActionSheet adapter with a title slot and centrally determine light/dark surfaces and indicator color.
3. Move selected styling for sort/theme options into one explicit state and expand sort direction into human-readable labels.
4. Repeat targeted UI checks; phase 09 becomes the final delivery phase.

## Risks

| Risk                                                          | Mitigation                                                          | Verification               |
| ------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------- |
| FlashList props/recycling differ from FlatList                | Migrate the list with a minimal API; test footer/refresh/pagination | RNTL + Android long scroll |
| Sheets cover the keyboard or do not scroll                    | One scroll owner, max height 88%, keyboard QA                       | Android/iOS manual QA      |
| Search history is written before Apply or contains duplicates | Pure normalize/upsert helper with unit tests                        | Jest state/storage tests   |
| Removing a chip resets the whole query                        | Separate reducer actions and targeted tests                         | Jest reducer tests         |
| Elevated card loses contrast in dark mode                     | Use only theme surface/background and review contrast manually      | Light/dark screenshots     |
| Existing category UI is duplicated in filters                 | Move it to a separate sheet and cover with an acceptance test       | RNTL + manual scenario     |
