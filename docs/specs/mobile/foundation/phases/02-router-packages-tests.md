# Фаза 02: Router, пакети та test harness

**Статус:** completed  
**Залежить від:** фаза 01  
**Блокує:** фази 03–06

## Мета

Додати погоджені залежності, Expo Router та стандартний Jest harness сумісними з
встановленим Expo SDK командами.

## Команди

Виконуються з `apps/mobile` після перевірки поточного Expo SDK:

```powershell
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar expo-secure-store @react-native-community/netinfo
npm install react-native-paper @reduxjs/toolkit react-redux axios react-hook-form zod @hookform/resolvers
npx expo install jest-expo jest @types/jest @testing-library/react-native -- --dev
npx expo-doctor
```

`expo-router` configuration і Jest setup створюються за офіційним Expo workflow;
ручні правки обмежені файлами, які потребують інтеграції з Nx app.

## Межі

- Створити root route layout, route group `(app)` і стартовий екран-заглушку.
- Не створювати бізнесові screens чи domain components.
- Не додавати SQLite, AsyncStorage, E2E runner або telemetry SDK.

## Критерії приймання

- [x] Router працює через `expo-router/entry` та має root `_layout.tsx`.
- [x] Jest використовує `jest-expo`; test files не лежать у `src/app`.
- [x] Встановлені версії Expo modules сумісні з активним SDK.

## Перевірка

- **Unit:** `npx nx test mobile`
- **Run:** `npx nx start mobile`
- **Ручна:** стартовий route відкривається на Android через Expo Go.

## Результат виконання

- Додано Expo Router з `main: expo-router/entry`, root `_layout.tsx`, route group
  `(app)`, redirect з `/` і стартовий route-заглушку українською мовою.
- Встановлено базові UI, state, form, transport і device-залежності фази;
  `npx expo-doctor` та `npx expo install --check` завершуються успішно для SDK 56.
- Jest налаштовано через `jest-expo` у `jest.config.cjs`; тест стартового route
  перенесено до `src/__tests__`, поза каталогом Expo Router.
- Успішно виконано `npx nx lint mobile`, `npx nx test mobile` (1 test suite,
  1 test) і `npx expo export --platform web`. Export використав
  `expo-router/entry` та зібрав маршрутну структуру.
- Ручна Android-перевірка очікує встановлення Expo Go для SDK 56: на пристрої
  наразі є Expo Go 54.0.8, який підтримує лише SDK 54.
