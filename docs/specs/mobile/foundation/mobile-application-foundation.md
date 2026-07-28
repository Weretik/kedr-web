# SDD: Mobile application foundation

**Статус:** completed  
**Домен:** `foundation`  
**Власник:** frontend team  
**Пов'язані документи:** [архітектура Mobile](../../../architecture/mobile/README.md), [ADR Mobile](../../../architecture/mobile/adr/README.md), [UI-стандарт](../../../standards/mobile-ui.md)

## Мета та користувацький результат

Створити окремий Expo/React Native застосунок `mobile` у наявному Nx workspace,
готовий для початку розробки каталогу. Після завершення foundation команда може
додавати domain feature за погодженою архітектурою без повторного налаштування
роутерів, теми, API-клієнта, Redux, мережевих станів або тестів.

## Межі

### У межах

- `apps/mobile` на Nx + Expo + TypeScript;
- Expo Router, кореневий layout, route groups і стартовий екран-заглушка;
- Mobile libraries: `shared/api-client`, `shared/config`, `shared/ui`,
  `shared/util`, `core/shell`, `core/connectivity`;
- React Native Paper theme на основі corporate кольорів Admin;
- Redux Toolkit, RTK Query, Axios `baseQuery`, config та нормалізовані помилки;
- dev-only HTTP logging без секретів, глобальний error notifier та NetInfo;
- Jest + `jest-expo` + React Native Testing Library;
- Nx tags, aliases і module boundaries для Mobile.

### Поза межами

- каталог, товар, кошик, login, refresh token та protected routes;
- AsyncStorage, SQLite, offline persistence і sync queue;
- Sentry або інший зовнішній telemetry service;
- EAS credentials, App Store/Google Play submission і production build;
- реальні API credentials або секрети в репозиторії.

## Зафіксовані рішення

- Пакетний менеджер: `npm`.
- Застосунок: `apps/mobile`, Nx project name `mobile`.
- Архітектура: така сама domain-first модель, що в Admin; Expo Router routes
  залишаються тонкими у `apps/mobile/src/app`.
- HTTP: Axios через custom RTK Query `baseQuery`.
- Перший реліз: online-first, без авторизації та persistent cache.
- UI: React Native Paper; light/dark corporate theme переноситься з Admin, а не
  MUI-компоненти чи web styles.
- `core/shell` володіє corporate Paper theme, global providers, Redux store,
  safe-area screen shell і test mocks для цієї композиції. `shared/ui` містить
  лише повторно використовувані presentational-компоненти.
- Усі можливі app/library/component scaffolds створюються Nx/Expo generators.
  Вручну пишеться лише integration code, який генератори не підтримують:
  Expo Router layouts/routes, providers, theme mapping, transport adapters.

## Пакети

| Група           | Пакети                                                                                                                       | Спосіб встановлення                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Nx / Expo       | `@nx/expo`, `expo`, React Native runtime                                                                                     | `npx nx add @nx/expo`, потім Nx generator |
| Router          | `expo-router`, `expo-linking`, `expo-constants`, `expo-status-bar`, `react-native-safe-area-context`, `react-native-screens` | `npx expo install`                        |
| UI              | `react-native-paper`                                                                                                         | `npm install` після генерації Expo app    |
| State/API       | `@reduxjs/toolkit`, `react-redux`, `axios`                                                                                   | `npm install`                             |
| Forms           | `react-hook-form`, `zod`, `@hookform/resolvers`                                                                              | `npm install`                             |
| Device services | `expo-secure-store`, `@react-native-community/netinfo`                                                                       | `npx expo install`                        |
| Tests           | `jest`, `jest-expo`, `@types/jest`, `@testing-library/react-native`                                                          | `npx expo install -- --dev`               |

`expo-secure-store` встановлюється як погоджена platform capability, але до
автентифікації не створюються session storage, token interceptor або login flow.

## План фаз

| №   | Фаза                                                                              | Залежить від | Результат                                                       | Статус      |
| --- | --------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------- | ----------- |
| 01  | [Nx та Expo scaffold](phases/01-nx-expo-scaffold.md)                              | —            | `apps/mobile`, сумісні Expo/Nx залежності, базові targets       | completed   |
| 02  | [Router, пакети та test harness](phases/02-router-packages-tests.md)              | 01           | Expo Router, усі базові залежності, Jest harness                | completed   |
| 03  | [Libraries, boundaries та config](phases/03-libraries-boundaries-config.md)       | 02           | generated libraries, aliases, ESLint boundaries, runtime config | completed   |
| 04  | [Theme, providers та shell](phases/04-theme-providers-shell.md)                   | 03           | Paper corporate theme, AppProviders, layouts і стартовий route  | completed   |
| 05  | [API, observability та connectivity](phases/05-api-observability-connectivity.md) | 04           | Axios/RTK Query foundation, error/logging, NetInfo              | completed   |
| 06  | [Acceptance та developer workflow](phases/06-acceptance-developer-workflow.md)    | 05           | перевірений Android flow, команди й onboarding                  | completed   |

## Загальні критерії приймання

- [x] Згенерований Expo application працює у Nx workspace та не ламає Admin/Storefront.
- [x] Усі Mobile бібліотеки мають tags, aliases, публічні `src/index.ts` і
      підпорядковуються `@nx/enforce-module-boundaries`.
- [x] App має Paper theme, Redux Provider, Expo Router root layout та безпечні
      loading/error/offline базові стани.
- [x] HTTP transport не логує токени, body або персональні дані.
- [x] `EXPO_PUBLIC_API_BASE_URL` не містить секретів; секрети не потрапляють у git.
- [x] Пройдені релевантні lint, Jest, type-check/export та ручна Android-перевірка.

## Відкриті питання

- [ ] Назва в store, Android application ID та iOS bundle ID потрібні перед
      першим production/development build; для локального foundation не блокують scaffold.
- [ ] Реальний endpoint каталогу та DTO будуть зафіксовані окремою SDD feature.
- [ ] Підключення зовнішньої telemetry вирішується окремим ADR після погодження
      DSN, privacy policy та owner alerts.

## Історія змін

- 2026-07-27: створено початковий план foundation.
- 2026-07-28: завершено фазу 01 — згенеровано Nx/Expo scaffold `mobile` і
  пройдено автоматичні перевірки; ручна Android-перевірка очікує Expo Go для SDK 56.
- 2026-07-28: завершено фазу 02 — додано Expo Router, базові залежності та
  Jest harness; автоматичні перевірки й web export пройдено.
- 2026-07-28: завершено фазу 03 — згенеровано Mobile libraries, aliases і
  module boundaries, додано runtime config та connectivity adapter.
- 2026-07-28: завершено фазу 04 — додано корпоративну light/dark Paper theme,
  AppProviders у `core/shell`, safe-area shell і стартовий route з компонентними
  тестами.
- 2026-07-28: завершено фазу 05 — додано Axios/RTK Query foundation,
  нормалізацію помилок, безпечне dev-логування та shell-level offline indicator.
- 2026-07-28: transport contract Mobile фази 05 узгоджено з Admin для спільного
  backend: `ApiRequest` / `ApiError`, Problem Details, Ardalis validation та
  cancellation signal; auth flow лишається поза межами foundation.
