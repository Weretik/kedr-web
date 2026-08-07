# Quickstart та QA: catalog discovery UI

## До реалізації

```powershell
cd apps/mobile
npx expo-doctor
```

Після phase 01 зафіксувати фактичні команди install, resolved versions і чи лишився достатнім Expo Go. Не створювати EAS binary лише тому, що задача містить UI-пакети.

## Phase 00 evidence (2026-07-31)

```powershell
npx nx show projects
npm ls react-native-actions-sheet @shopify/flash-list --depth=0
npm view react-native-actions-sheet@10.1.2 peerDependencies dependencies --json
```

- Nx підтвердив `shell`, `mobile-catalog-model`, `mobile-catalog-ui`, `mobile-catalog-feature` і `mobile`; назви model/UI/feature у наступних командах збігаються з workspace.
- `npm ls` підтвердив, що обидві нові бібліотеки ще не встановлено, тому resolved версію lockfile не можна зафіксувати до T005.
- Для запланованої `react-native-actions-sheet@10.1.2` npm metadata визначає peer dependencies `react-native`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context` та dependency `react-native-worklets`; остаточну Expo-сумісність перевірити через `npx expo-doctor` перед встановленням у T005.

## Phase 01 evidence (2026-07-31)

```powershell
cd apps/mobile
npx expo install @shopify/flash-list
npm install react-native-actions-sheet@0.9.7 --workspace mobile
npx expo install react-native-gesture-handler
npx expo-doctor
```

- Resolved application versions: `@shopify/flash-list@2.0.2`, `react-native-actions-sheet@0.9.7`, `react-native-gesture-handler@2.31.2`.
- `react-native-actions-sheet@10.1.2` було відхилено: воно додає вкладений `react-native-worklets@0.7.4`, який дублює Expo SDK 56 `react-native-worklets@0.11.3`. Версія `0.9.7` не має цього dependency, але потребує прямого peer `react-native-gesture-handler`, встановленого через Expo.
- Після вирівнювання root/application runtime (`expo@56.0.18`, `react-native-safe-area-context@5.7.x`, `react-native-gesture-handler@2.31.x`) повторний `npx expo-doctor` пройшов 21/21 перевірок. Root `expo-router` лишився на `56.2.16`, щоб не розширювати зміну до його нової peer-вимоги React; duplicate native modules відсутні.
- `FlashList` і ActionSheet `0.9.7` не змінили `app.json`, permissions або config plugins. Expo Go лишається цільовим runtime; окрема native binary для цієї UI-задачі не потрібна.

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
- Lint passed for `mobile`, `mobile-catalog-feature` and `mobile-catalog-ui`.
- `npx tsc --noEmit -p libs/mobile/catalog/ui/tsconfig.lib.json` is not a valid production type-check yet: its existing `src/test-setup.ts` is included without Jest types and has two implicit `any` parameters. The FlashList callback mismatch discovered by this command was fixed before handoff.
- `npx nx lint shell` is blocked by the existing ESLint configuration error: rule `@typescript-eslint/no-array-constructor` is configured without the `@typescript-eslint` plugin. It is unrelated to the Paper test mock change.

## Paper BottomNavigation migration (2026-07-31)

```powershell
npx nx lint mobile
npx nx test mobile
```

- The tab layout now owns both the shared Paper `Appbar` and `react-native-paper` `BottomNavigation.Bar` for every tab. It forwards tab press/long-press events, safe-area insets and navigation to Expo Router without adding a second Paper provider.
- The catalog screen registers its search action with the layout; it does not render a second Appbar.
- Після корекції ownership: `npx nx test mobile` пройшов 2 suites / 3 tests; `npx nx lint mobile` і `npx nx lint mobile-catalog-feature` пройшли успішно. `npx nx test mobile-catalog-feature` пройшов 5 suites / 19 tests.

## Phase 03 automated checks (2026-07-31)

```powershell
npx nx test mobile-catalog-ui
npx nx test mobile-catalog-feature
npx nx lint mobile-catalog-ui
npx nx lint mobile-catalog-feature
```

- UI: 5 suites / 13 tests; feature: 5 suites / 20 tests. Обидва lint targets пройшли.
- Покрито explicit Apply, відсутність query під час набору, blank Apply, history draft selection, reopen; pure history/storage tests покривають normalize, case-insensitive deduplicate та limit 10.
- T016 залишається ручним QA: Android/iOS keyboard і autofocus, а також web Escape/focus ще не перевірялися на цільових runtime.

## Phase 04 automated checks (2026-08-01)

```powershell
npx nx test mobile-catalog-ui
npx nx test mobile-catalog-feature
npx nx lint mobile-catalog-ui
npx nx lint mobile-catalog-feature
```

- UI: 5 suites / 9 tests; feature: 5 suites / 20 tests. Обидва lint targets пройшли.
- Перевірено ActionSheet transition для search/filter/category/sort через feature reducer та RNTL; category loading/error/empty, nested selection, filter range validation і точкове скидання query-полів покриті відповідними тестами.

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
- Manual Android/iOS/web QA and light/dark screenshot evidence remain recorded as blockers in `checklists/delivery.md`; they require the Mobile QA / product owner on target runtimes.
- Environment check: `adb` is unavailable and no Android/iOS simulator process is running; this workspace also has no interactive browser session for web focus/keyboard inspection.

## Automated checks після реалізації

```powershell
npx nx test mobile-catalog-model
npx nx test mobile-catalog-ui
npx nx test mobile-catalog-feature
npx nx lint mobile-catalog-ui
npx nx lint mobile-catalog-feature
cd apps/mobile
npx expo export --platform web
```

Перед виконанням уточнити реальні Nx project names через `npx nx show projects`; у delivery записати фактичні команди та результати, а не цей шаблонний список.

## Manual Android / iOS QA

1. У світлій і темній темі відкрити каталог: Appbar, фоновий колір і elevated cards мають бути видимими та контрастними.
2. Прокрутити довгий каталог, виконати pull-to-refresh і «Завантажити ще»; не повинно бути duplicate/missing items.
3. Відкрити search sheet, застосувати пошук, перезапустити застосунок, обрати фразу з history та застосувати її.
4. Відкрити кожен із трьох action sheets: filter, sort, category. Перевірити dismiss без Apply, Apply, error/loading/empty categories і довге дерево.
5. Вибрати category, кожен тип filter і sort; прибрати chips по одному. Перевірити, що нецільові values лишаються.
6. Перевірити TalkBack/VoiceOver та 48dp targets для іконок, chip close і sheet actions.

## Manual web QA

1. Tab order: theme → search → filters → sort → categories → chips → list.
2. Enter/Space активують icon buttons/chips; Escape закриває відкритий sheet.
3. Перевірити focus trap/visible focus у sheet, вертикальний scroll content і горизонтальний scroll chips.
4. Перевірити console без runtime errors під час відкриття кожного sheet і списку.

## Delivery evidence

- [ ] Команди та фактичні outputs записані.
- [ ] Скриншоти light/dark default catalog та всіх чотирьох sheets додані/посилені.
- [ ] Ручні Android/iOS/web результати та відомі обмеження записані.
