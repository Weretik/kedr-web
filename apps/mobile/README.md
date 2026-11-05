# Кедр Менеджер

Expo Router app for Kedr managers: customers, products with customer prices, calculation, drafts and orders to 1C, offline-first. Code lives in `libs/mobile/*`; routes in `src/app` stay thin. See the [mobile architecture](../../docs/architecture/mobile/README.md) and the [feature catalog](../../docs/features/README.md).

## Install

From the repository root:

```powershell
npm ci
```

## Runtime configuration

Tracked `.env.development` and `.env.production` use the same public backend URLs as the corresponding Admin environments. Create `.env.local` only when a local override is needed.

```powershell
Copy-Item .env.example .env.local
```

`EXPO_PUBLIC_API_BASE_URL` is compiled into the application. It must contain only the public backend URL, never a token, password or another secret. Set `EXPO_PUBLIC_ENABLE_HTTP_LOGS=true` only for local development; logs contain method, sanitized URL, status and duration, never headers or bodies.

## Commands

From the repository root:

```powershell
npx nx lint mobile
npx nx typecheck mobile
npx nx test mobile
npm run test:mobile
```

## Run on a device

The app does not run in Expo Go. Install a development build once, then start Metro:

```powershell
cd apps/mobile
npx expo start --dev-client
```

Builds for managers, iPhone, and updates without a new build: [Builds, distribution and updates](../../docs/architecture/mobile/platform/development-build.md).
