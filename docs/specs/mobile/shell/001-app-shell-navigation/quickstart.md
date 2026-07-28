# Quickstart: Mobile app shell and navigation

## Daily development in Expo Go

```text
npx nx start mobile
```

Відскануйте QR-код через Expo Go на Android. Для обмеженої мережі:

```text
cd apps/mobile
npx expo start --tunnel
```

## Automated checks

```text
npx nx test mobile
cd apps/mobile
npx expo-doctor
```

За потреби web verification:

```text
cd apps/mobile
npx expo export --platform web
```

## Manual acceptance

1. В Expo Go відкрити Головну, Каталог і Профіль; перевірити labels, active state і safe area.
2. Змінити System, Light і Dark; перезапустити застосунок та перевірити persistence.
3. Перевірити loading, empty і offline states разом із header і tab bar.
4. Відкрити web export та перевірити navigation без console errors.
