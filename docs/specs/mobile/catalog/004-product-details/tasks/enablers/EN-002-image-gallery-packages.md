# EN-002 — Expo-compatible image and gallery packages

- **Task ID:** EN-002
- **Enables:** SC-004, SC-005, SC-006
- **Depends on:** none
- **Exact paths:** `package.json`; `package-lock.json`; Mobile Jest mocks/config only if required by real imports
- **Test level:** focused integration

## Work

- [x] Run `npx expo install expo-image react-native-reanimated-carousel` from
      the Mobile workspace context; do not select versions manually.
- [x] Verify installed peers against Expo SDK 56, React Native 0.85,
      Reanimated 4, Worklets 0.8 and Gesture Handler 2, then run `npx expo-doctor`.
- [x] Add the smallest Jest mocks needed for gallery component tests and run an
      Expo Go/web smoke; do not wrap or reproduce package gesture engines.

## Evidence

- Why behavioral Red is not meaningful: this task establishes third-party
  runtime/test compatibility before gallery behavior exists.
- Replacement command/check: `npx expo-doctor`, package tree, focused import
  smoke in `mobile-catalog-ui:test` and `npx nx export mobile`.
- Result: `expo-image@56.0.12` and
  `react-native-reanimated-carousel@5.1.1` installed by Expo CLI; focused Jest
  imports, web export and Android export pass.
- Enabled task IDs: TS-004
- Deviation or blocker: `expo-doctor` passes 21/22 checks; its only failure is
  the known Hermes V1 memory regression in the existing Expo 56/RN 0.85 line.
  The suggested Expo 57/RN 0.86 upgrade is outside this feature.

## Checkpoint

Expo-selected packages import in Mobile tests and export successfully without a
custom native build requirement.
