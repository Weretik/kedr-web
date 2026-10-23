# Quickstart: Mobile app shell and navigation

## Daily development in Expo Go

```text
npx nx start mobile
```

Scan the QR code with Expo Go on Android. For restricted networks:

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

For web verification, if needed:

```text
cd apps/mobile
npx expo export --platform web
```

## Manual acceptance

1. In Expo Go, open Головна, Каталог, and Профіль; check labels, active state, and safe area.
2. Change among System, Light, and Dark; restart the app and check persistence.
3. Check loading, empty, and offline states together with the header and tab bar.
4. Open the web export and check navigation for console errors.
