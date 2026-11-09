# Mobile testing strategy

## Current test stack

Mobile uses Expo SDK 58, React Native 0.88, Expo Router, Zustand, TanStack Query, Drizzle over `expo-sqlite`, and Axios. Tests use Jest 30, `jest-expo` 58, and React Native Testing Library 14. App and library configs are separate `jest.config.cjs` files; platform mocks live only at actual Expo, storage, network, and native UI boundaries.

| Level               | Target                                       | What to check                                                    |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| Unit                | corresponding `*:test`                       | pure functions, Zod validation, mappers, reducers                |
| Focused integration | corresponding `*:test`                       | state, providers, TanStack Query/Axios boundary, connectivity    |
| Component           | `mobile:test`, domain `*:test`, `shell:test` | screens, accessible roles/names, and user actions                |
| Integration         | corresponding `*:test`                       | Expo Router boundary, storage, connectivity, and native adapters |
| Mobile E2E          | unavailable                                  | critical journey on a built app after a separate enabler         |

Primary commands:

```text
npm run typecheck:tests:mobile
npm run test:mobile
npm run test:mobile:coverage
npx nx export mobile
```

`apps/mobile/src/__tests__/` contains an infrastructure component smoke test for the Expo Router/RN harness. It proves the setup works, but it is not evidence for a business scenario.

## Feature test rules

- Check pure logic and validation at unit level.
- Check hooks, state, providers, and data fetching with focused integration tests.
- Check screens and user actions at component level.
- Check navigation, deep links, permissions, storage, and native adapters with integration tests.
- Use E2E only for a critical journey; do not duplicate every `SC-*` at each level.
- Place route-file tests in `apps/mobile/src/__tests__`, and library tests beside the code outside `apps/mobile/src/app`.

For new behavior, follow Red → Green → Refactor → Regression in the [testing rules](../../../standards/shared/testing-rules.md). Compilation/setup failure is not a valid Red.

## Speed checks

Speed is judged only in release mode. The development client and Expo Go run debug JavaScript with dev checks and are several times slower, so a slow screen there is not a finding and a fast one is not proof.

- **Quick check while developing:** `npx expo start --dev-client --no-dev --minify` runs the same JavaScript as a release build in the installed development client.
- **Check before a merge that touches lists, the local database, sync, theme or navigation:** an EAS `preview` build (`eas build --profile preview`, an installable APK) on a real Android phone and, for layout changes, a tablet.
- Walk the same path every time and write the result in the PR: open the app cold; open the catalog; type a search; switch the customer; scroll the catalog and the customer list fast; change a quantity in a calculation of 20 lines; switch the theme; run «Оновити дані». Each step should answer within about 300 ms and never freeze the screen; a sync may take longer but the screens stay usable.
- A step that is slow on the preview build is a bug with its own task, measured again after the fix on the same device.

## Mobile E2E enabler

Detox, Maestro, and Appium are not currently installed, and an Android SDK was not found in the current environment. When a feature needs mobile E2E, create one `EN-*` task to select and run a runner:

1. Record the critical `SC-*`, build type (Expo development build/EAS or local native build), Android/iOS targets, and CI device strategy.
2. Compare runners for compatibility with Expo Router, native modules, Windows/Linux CI, and required permissions/deep links. Do not choose a tool by name alone.
3. Add a minimal smoke test, Nx target, setup/cache/artifact paths, and CI command.
4. Run the test on an Android emulator/device; check iOS only on macOS with Xcode. Record an untested platform as a blocker.
5. After a stable smoke test, create separate `TS-*` tasks for critical journeys and link them through `traceability.md`.

Until the enabler is complete, mobile E2E is `planned`; do not call Jest component tests device E2E evidence.
