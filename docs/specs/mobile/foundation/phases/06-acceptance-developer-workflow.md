# Phase 06: Acceptance and developer workflow

**Status:** completed  
**Depends on:** phase 05  
**Blocks:** the first domain feature

## Goal

Confirm that the Mobile foundation is ready for catalog development and document
repeatable developer commands.

## Commands

```powershell
npx nx lint mobile
npx nx test mobile
npx nx export mobile --platform=android

Set-Location apps/mobile
npx expo start --clear
```

Use the QR code from interactive `npx expo start` for Android Expo Go. Nx can
suppress Expo's interactive QR interface when using `npx nx start mobile`.

## Acceptance criteria

- [x] Android Expo Go starts the application and root route.
- [x] Theme, providers, router, config, API foundation, and connectivity run
      without console errors on Android and Web.
- [x] Tracked Mobile environment files contain only public configuration.
- [x] `apps/mobile/README.md` documents installation, start, lint, test, export,
      and the Android demo flow.
- [x] The SDD records executed commands, results, and known risks.

## Result

- `npx nx lint mobile`, `npx nx test mobile`, and
  `npx nx export mobile --platform=android` completed successfully.
- Android Expo Go and the Web target were manually verified successfully.
- Mobile is an npm workspace (`apps/*`). Metro uses standard `expo/metro-config`
  with a custom `@mobile/*` alias resolver, ensuring one React runtime for the
  application and workspace libraries.

## Risks

- Web emits dependency-level `pointerEvents` and `Animated.useNativeDriver`
  warnings. They do not block the foundation application.
- Android application ID, iOS bundle ID, and final icon/splash assets must be
  agreed before the first native production or development build.

## Change history

- 2026-07-28: phase completed after Android Expo Go and Web acceptance.
