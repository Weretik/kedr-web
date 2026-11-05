# Builds, distribution and updates

Kedr Manager uses native modules (Unistyles with Nitro, SQLite, SecureStore, local authentication, image picker), so it does **not** run in Expo Go. Every device runs an EAS build: a development client for daily work, or an internal build for managers.

## Identity

| Setting                         | Value                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Name                            | «Кедр Менеджер»                                                                                                          |
| Android package / iOS bundle id | `com.classkedr.mobile` (kept, so installed apps update)                                                                  |
| EAS project                     | `d4dbe4f7-f294-4be1-9081-44aa05f48ab8`, slug `mobile`                                                                    |
| Version                         | `version` in `apps/mobile/app.json`; build numbers are kept by EAS (`appVersionSource: remote`, `autoIncrement`)         |
| Icons and splash                | `apps/mobile/assets/images`: green «К» on brand green `#3FA435`; splash on the «Офіс» ground (`#F5F6F3`, dark `#0F110F`) |

## EAS profiles (`apps/mobile/eas.json`)

| Profile       | For                       | Result                                                                  | Update channel |
| ------------- | ------------------------- | ----------------------------------------------------------------------- | -------------- |
| `development` | the developer's own phone | development client (`expo-dev-client`) that loads JavaScript from Metro | `development`  |
| `simulator`   | iOS simulator on a Mac    | development client for the simulator                                    | `development`  |
| `preview`     | managers                  | Android APK by link, iPhone ad hoc build; internal distribution         | `preview`      |
| `production`  | a future store release    | Android App Bundle, iOS store build                                     | `production`   |

## Build for managers

From `apps/mobile`:

```powershell
npx eas-cli@latest login
npx eas-cli@latest build --profile preview --platform android
```

When the build finishes, EAS shows a link and a QR code. A manager opens the link on the phone and installs the APK (Android asks to allow installs from the browser once). The new app replaces the old one because the package name is the same.

iPhone: `--platform ios` with the same profile needs a paid Apple Developer account. Each iPhone must first be registered with `npx eas-cli@latest device:create`; EAS then builds an ad hoc app those phones can install by link. TestFlight needs the `production` profile and `eas submit`.

## Updates without a new build

`expo-updates` is on: `runtimeVersion` follows the app version, the app checks for an update on start and applies it on the next start. After a JavaScript-only change (screens, logic, texts):

```powershell
npx eas-cli@latest update --channel preview --message "Що змінилося"
```

Managers get it the next time they open the app twice. A **new build** is needed instead when a native part changes: a library with native code, permissions, `app.json`, a config plugin, icons or splash, or the Expo SDK. Then raise `version` in `app.json`, so old builds stop taking updates meant for the new one.

## Daily development

Install a `development` build once (`--profile development --platform android`), then:

```powershell
cd apps/mobile
npx expo start --dev-client
```

Open the link or QR code in the installed development client; Metro and Fast Refresh deliver code changes.

## Cost and limits

EAS Build and Update have a free plan, but build credits, queue speed and update limits can change. Check current Expo limits before regular builds; do not record a number of free builds as a guarantee.

## Sources

- [Expo: Internal distribution](https://docs.expo.dev/build/internal-distribution/)
- [Expo: Configure EAS Build with eas.json](https://docs.expo.dev/build/eas-json/)
- [Expo: EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Expo: Runtime versions](https://docs.expo.dev/eas-update/runtime-versions/)
- [Expo pricing](https://expo.dev/pricing)
