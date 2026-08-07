# Quickstart: Вибір категорії у mobile catalog

## Щоденна розробка через Expo Go

```text
npx nx start mobile
```

Відкрити «Каталог» на Android в Expo Go та натиснути «Фільтри». Expo Go
достатній: feature не додає native dependency, Expo config або config plugin.

## Автоматичні перевірки

```text
npx jest --config libs/mobile/catalog/data-access/jest.config.cts --runInBand
npx jest --config libs/mobile/catalog/ui/jest.config.cts --runInBand
npx jest --config libs/mobile/catalog/feature/jest.config.cts --runInBand
npx eslint 'libs/mobile/catalog/data-access/src' 'libs/mobile/catalog/ui/src' 'libs/mobile/catalog/feature/src'
npx tsc --project apps/mobile/tsconfig.app.json --noEmit
cd apps/mobile
npx expo-doctor
npx expo export --platform web
```

### Результат фази 01 (2026-07-31)

- `npx jest --config libs/mobile/catalog/data-access/jest.config.cts --runInBand --runTestsByPath libs/mobile/catalog/data-access/src/mappers/catalog-categories.mapper.spec.ts --forceExit` — пройдено: 3 tests.
- `npx jest --config libs/mobile/catalog/model/jest.config.cts --runInBand --runTestsByPath libs/mobile/catalog/model/src/queries/catalog-filters.spec.ts --forceExit` — пройдено: 9 tests.
- `npx eslint 'libs/mobile/catalog/data-access/src/contracts/admin-categories.dto.ts' 'libs/mobile/catalog/data-access/src/mappers/catalog-categories.mapper.ts' 'libs/mobile/catalog/data-access/src/mappers/catalog-categories.mapper.spec.ts' 'libs/mobile/catalog/data-access/src/api/catalog.api.ts' 'libs/mobile/catalog/model/src/queries/catalog-filters.spec.ts'` — пройдено.
- `npx eslint 'libs/mobile/catalog/data-access/src/contracts/admin-categories.dto.ts'` — пройдено.
- `npx tsc --project libs/mobile/catalog/data-access/tsconfig.lib.json --noEmit` — не пройдено через наявні TS4111 у `@mobile/shared/api-client` і `@mobile/shared/config`; зміни фази їх не торкалися.

### Результат фази 02 (2026-07-31)

- `npx jest --config libs/mobile/catalog/ui/jest.config.cts --runInBand --runTestsByPath libs/mobile/catalog/ui/src/components/catalog-filters-modal.spec.tsx --forceExit` — пройдено: 3 tests.
- `npx jest --config libs/mobile/catalog/feature/jest.config.cts --runInBand --runTestsByPath libs/mobile/catalog/feature/src/screens/catalog-screen.spec.tsx --forceExit` — пройдено: 5 tests.
- Перший запуск feature test перевищив Jest timeout 5 s у наявному debounce scenario; повторний ідентичний запуск пройшов (5 tests), тому failure не відтворився.
- `npx eslint 'libs/mobile/catalog/ui/src/components/catalog-filters-modal.tsx' 'libs/mobile/catalog/ui/src/components/catalog-filters-modal.spec.tsx' 'libs/mobile/catalog/ui/src/components/catalog-active-filters.tsx' 'libs/mobile/catalog/feature/src/hooks/use-catalog-controller.ts' 'libs/mobile/catalog/feature/src/components/catalog-query-controls.tsx' 'libs/mobile/catalog/feature/src/screens/catalog-screen.spec.tsx'` — пройдено.

### Результат фази 03 (2026-07-31)

- `npx jest --config libs/mobile/catalog/ui/jest.config.cts --runInBand --runTestsByPath libs/mobile/catalog/ui/src/components/catalog-filters-modal.spec.tsx --forceExit` — пройдено: 5 tests.
- `npx jest --config libs/mobile/catalog/feature/jest.config.cts --runInBand --runTestsByPath libs/mobile/catalog/feature/src/screens/catalog-screen.spec.tsx --forceExit` — пройдено: 6 tests.
- `npx eslint 'libs/mobile/catalog/ui/src/components/catalog-filters-modal.tsx' 'libs/mobile/catalog/ui/src/components/catalog-filters-modal.spec.tsx' 'libs/mobile/catalog/feature/src/components/catalog-query-controls.tsx' 'libs/mobile/catalog/feature/src/screens/catalog-screen.spec.tsx'` — пройдено.

### Результат фази 04 (2026-07-31)

- `npx jest --config libs/mobile/catalog/data-access/jest.config.cts --runInBand --forceExit` — пройдено: 3 suites, 5 tests.
- `npx jest --config libs/mobile/catalog/ui/jest.config.cts --runInBand --forceExit` — пройдено: 5 suites, 9 tests.
- `npx jest --config libs/mobile/catalog/feature/jest.config.cts --runInBand --forceExit` — пройдено: 3 suites, 8 tests.
- `npx eslint 'libs/mobile/catalog/data-access/src' 'libs/mobile/catalog/ui/src' 'libs/mobile/catalog/feature/src'` — пройдено.
- `npx tsc --project apps/mobile/tsconfig.app.json --noEmit` — пройдено.
- `cd apps/mobile; npx expo-doctor` — 20/21 checks пройдено; blocker: дублікати `expo` (56.0.18/56.0.17) і `react-native-safe-area-context` (5.7.0/5.8.0) у поточній залежнісній структурі. Ця feature не змінювала залежності.
- `cd apps/mobile; npx expo export --platform web` — не завершилась за 120 s без build output; потребує повторної перевірки в CI або локальному середовищі з доступним Expo bundler.
- Android Expo Go і ручна web-перевірка не виконані: у поточній сесії немає підключеного Android пристрою або browser session.
- Backend access policy `GET /api/categories` для mobile production traffic не підтверджено; до підтвердження feature не випускається поза internal/admin surface.

### Діагностика UI та API (2026-07-31)

- Category selector оновлено до scrollable accordion tree: parent rows розгортаються окремою button-дією, а натискання на row обирає category. UI tests: selector 2/2, filters modal 6/6; ESLint змінених UI files пройдено.
- Живий `GET /api/categories` за `EXPO_PUBLIC_API_BASE_URL` повернув `200` і валідне дерево category rows.
- Живий `GET /api/admin/products?page=1&pageSize=20&sort=IdAsc` повернув `200`, але `totalRecords: 0`, `totalPages: 0`, `value: []`. Ті самі результати отримано з `inStock=false`, `categoryId=5513` та `categoryId=900001`. Empty state не спричинений mobile serialization; потрібен import/publication products або перевірка backend-власником даних endpoint.

## Ручна перевірка в Expo Go

1. Відкрити filters modal: перевірити loading, локалізоване дерево до трьох рівнів і TalkBack label для category control.
2. Обрати category, Apply і «Завантажити ще»: перевірити `categoryId`, reset до page 1 та відсутність duplicate cards.
3. Змінити й скинути category: перевірити active chip та products request без category parameter після reset.
4. Перевірити empty і network/server error categories states; retry не має прибрати existing products або статично підмінити categories.
5. Повторити на web: keyboard focus, modal dismissal і console errors.

## Коли Expo Go недостатньо

Не застосовується в поточному scope. Якщо буде додано native dependency або
змінено Expo config, дійте за [Expo Go та Development Build](../../../../architecture/mobile/development-build.md).
