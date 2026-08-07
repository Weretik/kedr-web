# Quickstart: Mobile product catalog

## Щоденна розробка через Expo Go

```text
npx nx start mobile
```

Відкрити Expo Go на Samsung Galaxy A12 у тій самій LAN мережі. Якщо LAN
недоступний, зафіксувати tunnel failure або використати погоджений network workaround.

## Автоматичні перевірки

```text
npx nx test mobile
npx nx test mobile-catalog-model
npx nx test mobile-catalog-data-access
npx nx run-many -t lint -p mobile-catalog-model,mobile-catalog-data-access,mobile-catalog-ui,mobile-catalog-feature
cd apps/mobile
npx expo-doctor
npx expo export --platform web
```

## Результат перевірок фази 01 (2026-07-29)

- `npx nx test mobile-catalog-model` — успішно, 1 test passed.
- `npx nx test mobile-catalog-data-access` — успішно, 2 tests passed.
- `npx nx run-many -t lint -p mobile-catalog-model,mobile-catalog-data-access,mobile-catalog-ui,mobile-catalog-feature` — успішно, 4 projects linted.
- `npx tsc --project libs/mobile/catalog/model/tsconfig.lib.json --noEmit` — успішно.
- `npx tsc --project libs/mobile/catalog/data-access/tsconfig.lib.json --noEmit` — не пройшов через наявні помилки `TS4111` у незмінених `@mobile/shared/api-client` і `@mobile/shared/config`; нових помилок у `catalog` команда не вивела.

## Результат перевірок фази 02 (2026-07-30)

- `npx jest --config libs/mobile/catalog/data-access/jest.config.cts --runInBand` — успішно: 2 suites, 2 tests passed.
- `npx jest --config libs/mobile/catalog/ui/jest.config.cts --runInBand` — успішно: 2 suites, 2 tests passed.
- `npx jest --config libs/mobile/catalog/feature/jest.config.cts --runInBand` — успішно: 1 suite, 2 tests passed.
- `cd apps/mobile; npx jest --config jest.config.cjs --runInBand` — успішно: 1 suite, 2 tests passed.
- `npx eslint 'apps/mobile/src/app/(tabs)/catalog.tsx' 'apps/mobile/src/__tests__/start-route.spec.tsx' 'libs/mobile/catalog/ui/src' 'libs/mobile/catalog/feature/src'` — успішно.
- `npx tsc --project apps/mobile/tsconfig.app.json --noEmit` — успішно.
- `cd apps/mobile; npx expo export --platform web` — не завершився в межах 60 секунд; без діагностичного виводу.

## Результат перевірок фази 03 (2026-07-30)

- `npx jest --config libs/mobile/catalog/model/jest.config.cts --runInBand` — успішно: 2 suites, 2 tests passed.
- `npx jest --config libs/mobile/catalog/ui/jest.config.cts --runInBand` — успішно: 3 suites, 3 tests passed.
- `npx jest --config libs/mobile/catalog/feature/jest.config.cts --runInBand` — успішно: 2 suites, 4 tests passed.
- `npx jest --config libs/mobile/catalog/data-access/jest.config.cts --runInBand` — успішно: 2 suites, 2 tests passed.
- `npx tsc --project apps/mobile/tsconfig.app.json --noEmit` — успішно.
- `npx eslint 'libs/mobile/catalog/model/src' 'libs/mobile/catalog/ui/src' 'libs/mobile/catalog/feature/src' 'libs/mobile/core/shell/src/test-mocks/react-native-paper.tsx'` — успішно.
- Об’єднаний запуск усіх suite перевищив 60-секундний ліміт без підсумкового виводу; кожну suite перевірено окремою командою.

## Результат фази 04 (2026-07-30)

- `npx jest --config libs/mobile/catalog/model/jest.config.cts --runInBand` — успішно: 3 suites, 9 tests passed.
- `npx eslint 'libs/mobile/catalog/model/src'` — успішно.
- `npx jest --config libs/mobile/catalog/model/jest.config.cts --runInBand` — успішно: 4 suites, 10 tests passed.
- `npx jest --config libs/mobile/catalog/ui/jest.config.cts --runInBand` — успішно: 4 suites, 4 tests passed.
- `npx eslint 'libs/mobile/catalog/model/src' 'libs/mobile/catalog/ui/src'` — успішно.
- `npx tsc --project apps/mobile/tsconfig.app.json --noEmit` — успішно після підключення `catalog-query-reducer.ts`.
- `npx jest --config libs/mobile/catalog/feature/jest.config.cts --runInBand` — успішно: 3 suites, 5 tests passed.
- `npx jest --config libs/mobile/catalog/model/jest.config.cts --runInBand` — успішно: 4 suites, 11 tests passed.
- `npx jest --config libs/mobile/catalog/ui/jest.config.cts --runInBand` — успішно: 5 suites, 6 tests passed.
- `npx jest --config libs/mobile/catalog/feature/jest.config.cts --runInBand` — успішно: 3 suites, 6 tests passed.
- `npx eslint 'libs/mobile/catalog/model/src' 'libs/mobile/catalog/ui/src' 'libs/mobile/catalog/feature/src' 'libs/mobile/core/shell/src/test-mocks/react-native-paper.tsx'` — успішно.
- `npx tsc --project apps/mobile/tsconfig.app.json --noEmit` — успішно.
- `npx nx test mobile` — успішно: 1 suite, 2 tests passed.
- `cd apps/mobile; npx expo-doctor` — не пройшов через наявні поза scope проблеми: дублікати `react-native-safe-area-context` 5.7.0/5.8.0 і patch-відставання `expo` 56.0.17 від ~56.0.18 та `expo-router` 56.2.16 від ~56.2.17.
- `cd apps/mobile; npx expo export --platform web` — не завершився в межах 60 секунд без діагностичного виводу.

## Результат delivery-фази 05 (2026-07-31)

- `npx nx test mobile` — успішно: 1 suite, 2 tests passed.
- `npx nx test mobile-catalog-model` — успішно: 4 suites, 12 tests passed.
- `npx nx test mobile-catalog-data-access` — успішно: 3 suites, 5 tests passed.
- `npx nx run-many -t lint -p mobile-catalog-model,mobile-catalog-data-access,mobile-catalog-ui,mobile-catalog-feature` — успішно: 4 projects linted.
- `npx tsc --project apps/mobile/tsconfig.app.json --noEmit` — успішно.
- `cd apps/mobile; npx expo-doctor` — 20/21 checks passed; blocker: duplicate `expo` 56.0.18/56.0.17 і `react-native-safe-area-context` 5.7.0/5.8.0. Dependency deduplication поза scope catalog feature.
- `cd apps/mobile; npx expo export --platform web` — не завершився в межах 120 секунд без build output; потребує повтору в CI або локальному runtime із доступним Expo bundler.
- Samsung Galaxy A12 і ручна web acceptance не виконані: у сесії немає підключеного Android пристрою або browser session.

## Ручна перевірка в Expo Go

1. Відкрити Каталог; перевірити initial loading, `ProductCard`, safe area та scroll.
2. Завантажити наступну порцію; перевірити відсутність duplicate cards і footer retry error state.
3. Ввести/очистити search; застосувати/скинути filter і sort; перевірити reset pagination.
4. Вимкнути мережу; перевірити offline indicator і читабельний existing-data/error state.
5. Повторити у web і перевірити console errors, keyboard interaction та два стовпці, якщо вони погоджені.

## Коли Expo Go недостатньо

P1 не додає native dependency або config plugin; Expo Go достатній. Якщо після
profiling погоджено FlashList або іншу native capability, перевірити її Expo Go
сумісність і за потреби створити development build.

Порядок переходу, EAS cloud build, повторна збірка native binary та щоденний
запуск через `--dev-client` описані в
[Expo Go та Development Build](../../../../architecture/mobile/development-build.md).
