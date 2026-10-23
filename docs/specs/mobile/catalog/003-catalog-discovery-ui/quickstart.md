# Quickstart and QA: catalog discovery UI

## Before implementation

```powershell
cd apps/mobile
npx expo-doctor
```

After phase 01, record the actual install commands, resolved versions, and whether Expo Go remains sufficient. Do not create an EAS binary only because the task includes UI packages.

## Phase 00 evidence (2026-07-31)

```powershell
npx nx show projects
npm ls react-native-actions-sheet @shopify/flash-list --depth=0
npm view react-native-actions-sheet@10.1.2 peerDependencies dependencies --json
```

- Nx confirmed `shell`, `mobile-catalog-model`, `mobile-catalog-ui`, `mobile-catalog-feature`, and `mobile`; model/UI/feature names in the following commands match the workspace.
- `npm ls` confirmed that neither new library was installed yet, so the resolved lockfile versions could not be recorded before T005.
- npm metadata for planned `react-native-actions-sheet@10.1.2` lists peer dependencies `react-native`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, and dependency `react-native-worklets`; check final Expo compatibility with `npx expo-doctor` before installing in T005.

## Phase 01 evidence (2026-07-31)

```powershell
cd apps/mobile
npx expo install @shopify/flash-list
npm install react-native-actions-sheet@0.9.7 --workspace mobile
npx expo install react-native-gesture-handler
npx expo-doctor
```

- Resolved application versions: `@shopify/flash-list@2.0.2`, `react-native-actions-sheet@0.9.7`, `react-native-gesture-handler@2.31.2`.
- `react-native-actions-sheet@10.1.2` was rejected: it adds nested `react-native-worklets@0.7.4`, duplicating Expo SDK 56's `react-native-worklets@0.11.3`. Version `0.9.7` has no such dependency, but requires a direct `react-native-gesture-handler` peer, installed through Expo.
- After aligning the root/application runtime (`expo@56.0.18`, `react-native-safe-area-context@5.7.x`, `react-native-gesture-handler@2.31.x`), a repeat `npx expo-doctor` passed all 21 checks. Root `expo-router` remained at `56.2.16` to avoid expanding the change to its newer React peer requirement; no duplicate native modules were found.
- `FlashList` and ActionSheet `0.9.7` did not change `app.json`, permissions, or config plugins. Expo Go remains the target runtime; a separate native binary is not needed for this UI task.

## Phase 01 automated checks

```powershell
npx jest --config libs/mobile/catalog/feature/jest.config.cts src/state/catalog-search-history.spec.ts src/storage/catalog-search-history-storage.spec.ts src/state/catalog-query-reducer.spec.ts
npx nx test mobile-catalog-ui
npx nx lint mobile-catalog-feature
npx nx lint mobile-catalog-ui
```

- Targeted feature tests: 3 suites, 12 tests passed.
- UI tests: 5 suites, 11 tests passed. Feature and UI lint passed.
- Full `npx nx test mobile-catalog-feature` has an existing unrelated failure in `catalog-screen.spec.tsx`: the test requests nested radio `Категорія Кабелі` without first expanding `Електрика`. Foundation state/storage suites pass.

## Phase 02 automated checks (2026-07-31)

```powershell
npx nx test mobile
npx nx test mobile-catalog-feature
npx nx test mobile-catalog-ui
npx nx lint mobile
npx nx lint mobile-catalog-feature
npx nx lint mobile-catalog-ui
```

- Mobile route tests: 1 suite, 2 tests passed. Catalog feature tests: 5 suites, 18 tests passed. Catalog UI tests: 5 suites, 12 tests passed.
- Lint passed for `mobile`, `mobile-catalog-feature`, and `mobile-catalog-ui`.
- `npx tsc --noEmit -p libs/mobile/catalog/ui/tsconfig.lib.json` is not yet a valid production type check: its existing `src/test-setup.ts` is included without Jest types and has two implicit `any` parameters. The FlashList callback mismatch discovered by this command was fixed before handoff.
- `npx nx lint shell` is blocked by an existing ESLint configuration error: rule `@typescript-eslint/no-array-constructor` is configured without the `@typescript-eslint` plugin. This is unrelated to the Paper test mock change.

## Paper BottomNavigation migration (2026-07-31)

```powershell
npx nx lint mobile
npx nx test mobile
```

- The tab layout now owns both the shared Paper `Appbar` and `react-native-paper` `BottomNavigation.Bar` for every tab. It forwards tab press/long-press events, safe-area insets, and navigation to Expo Router without adding a second Paper provider.
- The catalog screen registers its search action with the layout; it does not render a second Appbar.
- After the ownership correction, `npx nx test mobile` passed 2 suites / 3 tests; `npx nx lint mobile` and `npx nx lint mobile-catalog-feature` passed. `npx nx test mobile-catalog-feature` passed 5 suites / 19 tests.

## Phase 03 automated checks (2026-07-31)

```powershell
npx nx test mobile-catalog-ui
npx nx test mobile-catalog-feature
npx nx lint mobile-catalog-ui
npx nx lint mobile-catalog-feature
```

- UI: 5 suites / 13 tests; feature: 5 suites / 20 tests. Both lint targets passed.
- Covered explicit Apply, no query during typing, blank Apply, history draft selection, and reopen; pure history/storage tests cover normalization, case-insensitive deduplication, and limit 10.
- T016 remains manual QA: Android/iOS keyboard and autofocus, and web Escape/focus, have not yet been checked on target runtimes.

## Phase 04 automated checks (2026-08-01)

```powershell
npx nx test mobile-catalog-ui
npx nx test mobile-catalog-feature
npx nx lint mobile-catalog-ui
npx nx lint mobile-catalog-feature
```

- UI: 5 suites / 9 tests; feature: 5 suites / 20 tests. Both lint targets passed.
- ActionSheet transitions for search/filter/category/sort were checked through the feature reducer and RNTL; category loading/error/empty, nested selection, filter range validation, and targeted query-field resets are covered by corresponding tests.

## Phase 05 delivery checks (2026-08-01)

```powershell
npx nx test mobile-catalog-model
npx nx test mobile-catalog-ui
npx nx test mobile-catalog-feature
npx nx lint mobile-catalog-ui
npx nx lint mobile-catalog-feature
npx nx lint mobile
cd apps/mobile
npx expo export --platform web
```

- Model: 4 suites / 12 tests; UI: 5 suites / 9 tests; feature: 5 suites / 20 tests. All listed lint targets passed.
- Web export passed: Metro bundled 1,787 modules and wrote `apps/mobile/dist`.
- Manual Android/iOS/web QA and light/dark screenshot evidence remain recorded as blockers in `checklists/delivery.md`; they require Mobile QA / the product owner on target runtimes.
- Environment check: `adb` is unavailable and no Android/iOS simulator process is running; this workspace also has no interactive browser session for web focus/keyboard inspection.

## Automated checks after implementation

```powershell
npx nx test mobile-catalog-model
npx nx test mobile-catalog-ui
npx nx test mobile-catalog-feature
npx nx lint mobile-catalog-ui
npx nx lint mobile-catalog-feature
cd apps/mobile
npx expo export --platform web
```

Before running, confirm actual Nx project names with `npx nx show projects`; record actual commands and results in delivery rather than treating this template list as evidence.

## Manual Android / iOS QA

1. Open the catalog in light and dark themes: Appbar, background color, and elevated cards should be visible and have sufficient contrast.
2. Scroll a long catalog, pull to refresh, and select “Завантажити ще”; there should be no duplicate or missing items.
3. Open the search sheet, apply a search, restart the app, choose a phrase from history, and apply it.
4. Open each of the three action sheets: filters, sort, and category. Check dismiss without Apply, Apply, category error/loading/empty states, and a long tree.
5. Select a category, each filter type, and a sort; remove chips one by one. Confirm unrelated values remain.
6. Check TalkBack/VoiceOver and 48dp targets for icons, chip close controls, and sheet actions.

## Manual web QA

1. Tab order: theme → search → filters → sort → categories → chips → list.
2. Enter/Space activate icon buttons/chips; Escape closes an open sheet.
3. Check focus trapping/visible focus in a sheet, vertical content scrolling, and horizontal chip scrolling.
4. Check the console for runtime errors while opening each sheet and the list.

## Delivery evidence

- [ ] Commands and actual outputs are recorded.
- [ ] Light/dark screenshots of the default catalog and all four sheets are added/linked.
- [ ] Manual Android/iOS/web results and known limitations are recorded.
