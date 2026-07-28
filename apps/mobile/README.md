# KEDR Mobile

Expo Router application in the Nx workspace. It uses React Native Paper,
`@mobile/core/shell`, RTK Query and the shared API transport contract.

## Install

Use the workspace package manager from the repository root:

```powershell
npm ci
```

## Runtime configuration

Tracked `.env.development` and `.env.production` use the same public backend URLs
as the corresponding Admin environments. Create `.env.local` only when a local
override is needed.

```powershell
Copy-Item .env.example .env.local
```

`EXPO_PUBLIC_API_BASE_URL` is compiled into the application. It must contain only
the public backend URL, never a token, password or another secret. The `.env.local`
file is ignored by Git.

Set `EXPO_PUBLIC_ENABLE_HTTP_LOGS=true` only for local development when request
metadata logging is needed. Logs contain method, sanitized URL, status and
duration; they never include headers or request/response bodies.

## Development commands

Run these commands from the repository root:

```powershell
npx nx start mobile
npx nx lint mobile
npx nx test mobile
npx nx export mobile --platform=android
```

`export` verifies that Expo can bundle the Android target; it is not a production
store build.

For Expo Go, start Expo directly in an interactive terminal. Nx may suppress its
QR-code interface:

```powershell
Set-Location apps/mobile
npx expo start
```

Use `npx expo start --tunnel` when the Android device cannot reach the development
machine over the same local network.

## Android Expo Go acceptance flow

1. Run `npx expo start` from `apps/mobile` and scan the displayed QR code.
2. Open the QR code in Expo Go on Android.
3. Confirm that the `KEDR Mobile` root screen opens without console errors.
4. Switch the system light/dark setting and check theme and safe area.
5. Disable the network and confirm the offline message is visible and the app
   remains responsive.
6. Restore the network and restart the app. No hidden retry or persisted offline
   cache is expected in the foundation release.

## Architecture

- Routes in `src/app` stay thin Expo Router adapters.
- App providers, theme, store and offline indicator belong to `@mobile/core/shell`.
- Endpoints belong to domain `data-access` and use `baseApi.injectEndpoints`.
- [API architecture](../../docs/architecture/api/README.md) defines the shared
  Admin/Mobile backend transport and error contract.
