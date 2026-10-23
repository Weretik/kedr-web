# Expo Go and Development Build

**Status:** current workflow for `apps/mobile`\
**Related documents:** [technology stack](technology-stack.md), [testing](../workflow/testing.md), [apps/mobile README](../../../../apps/mobile/README.md)

## Current mode: Expo Go

As long as the app does not need a custom native runtime, daily development stays in Expo Go.

```powershell
cd apps/mobile
npx expo start
```

Scan the QR code with Expo Go on Android. The `npx nx start mobile` command from the workspace root also starts Metro, but use the interactive `npx expo start` for the QR code: Nx may hide Expo's QR interface.

Expo Go is sufficient for screens, styles, React/TypeScript, RTK Query, ordinary JavaScript dependencies, and Fast Refresh.

## When a Development Build is needed

Switch to a Development Build when you need to run code not included in Expo Go's native runtime, or when native configuration changes:

- a library with native code is added or updated;
- `app.json`/app config, Android permissions, a config plugin, or native build configuration changes;
- Expo SDK is updated;
- a custom native capability needs to be checked on a device.

Do not create a new binary after an ordinary screen, style, RTK Query, or TypeScript change: Metro and Fast Refresh deliver these changes to the installed Development Build.

## One-time move to Android Development Build

This repository already contains `apps/mobile/eas.json` with a `development` profile: `developmentClient: true` and `distribution: internal`. Do not run `eas build:configure` unless this configuration needs to change.

1. Check native dependencies before the first binary:

   ```powershell
   cd apps/mobile
   npx expo-doctor
   ```

2. Install the development client in the mobile application:

   ```powershell
   npx expo install expo-dev-client
   ```

3. Sign in to Expo and submit a cloud build. If EAS CLI is not installed globally, use `npx`:

   ```powershell
   npx eas-cli@latest login
   npx eas-cli@latest build --profile development --platform android
   ```

4. When EAS Build finishes, open the Expo link or QR code provided and install the internal Android build on a device. This is the app's custom development client, not Expo Go.

EAS Build creates the Android binary in the cloud; Android Studio is not needed for this cloud workflow. Android Studio is needed only for a local native build with `npx expo run:android`.

## Daily work after installation

```powershell
cd apps/mobile
npx expo start --dev-client
```

Scan the QR code with the device camera or open the link in the installed Development Build. The app connects to the local Metro server and updates with Fast Refresh.

## When to rebuild the binary

Repeat EAS Build only after a native runtime change: native library, permissions, app/native config, config plugin, or Expo SDK. A new cloud binary is not needed for UI, domain logic, HTTP client, RTK Query, or TypeScript changes.

## Cost and limits

EAS Build has a free plan, but available build credits, queue speed, and terms can change. Check current Expo limits before regular cloud builds; do not record a number of free builds in a feature spec as a guarantee.

## Sources

- [Expo: Introduction to development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo: Switch from Expo Go to a development build](https://docs.expo.dev/develop/development-builds/expo-go-to-dev-build/)
- [Expo: Configure EAS Build with eas.json](https://docs.expo.dev/build/eas-json/)
- [Expo pricing](https://expo.dev/pricing)
