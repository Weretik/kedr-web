# Mobile testing strategy

## Current test stack

Mobile uses Expo SDK 57, React Native 0.86, Expo Router, Redux Toolkit/RTK Query, and Axios. Tests use Jest 29, `jest-expo` 57, and React Native Testing Library 13. App and library configs are separate `jest.config.cjs` files; platform mocks live only at actual Expo, storage, network, and native UI boundaries.

| Level               | Target                                       | What to check                                                    |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| Unit                | corresponding `*:test`                       | pure functions, Zod validation, mappers, reducers                |
| Focused integration | corresponding `*:test`                       | state, providers, RTK Query/Axios boundary, connectivity         |
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

## Mobile E2E enabler

Detox, Maestro, and Appium are not currently installed, and an Android SDK was not found in the current environment. When a feature needs mobile E2E, create one `EN-*` task to select and run a runner:

1. Record the critical `SC-*`, build type (Expo development build/EAS or local native build), Android/iOS targets, and CI device strategy.
2. Compare runners for compatibility with Expo Router, native modules, Windows/Linux CI, and required permissions/deep links. Do not choose a tool by name alone.
3. Add a minimal smoke test, Nx target, setup/cache/artifact paths, and CI command.
4. Run the test on an Android emulator/device; check iOS only on macOS with Xcode. Record an untested platform as a blocker.
5. After a stable smoke test, create separate `TS-*` tasks for critical journeys and link them through `traceability.md`.

Until the enabler is complete, mobile E2E is `planned`; do not call Jest component tests device E2E evidence.
