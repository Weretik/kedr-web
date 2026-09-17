# Mobile product details — device verification plan

## Environments

| Platform/device        | Runtime                                           | Build                          | Owner       |
| ---------------------- | ------------------------------------------------- | ------------------------------ | ----------- |
| Android phone/emulator | Expo Go or development runtime selected by EN-002 | implementation commit/build ID | Mobile team |
| iOS phone              | Expo Go on available macOS/device                 | implementation commit/build ID | Mobile team |
| Desktop web            | Expo web in Chromium                              | implementation commit/build ID | Mobile team |

## Checks

| Scenario | Device condition                           | Observable result                                        | Evidence location |
| -------- | ------------------------------------------ | -------------------------------------------------------- | ----------------- |
| SC-002   | long filtered list, open item, system Back | query and list anchor restored                           | TS-008            |
| SC-004   | two valid remote images, touch swipe       | smooth paging, correct index, vertical page stays stable | TS-008            |
| SC-005   | one/both URLs return image error           | failed frame removed or fallback shown                   | TS-008            |
| SC-006   | throttled connection                       | stable skeleton without layout jump                      | TS-008            |
| SC-008   | server/network failure then recovery       | Ukrainian error and successful retry                     | TS-008            |
| SC-009   | airplane/offline then reconnect            | offline copy and successful retry                        | TS-008            |
| SC-010   | repeated add                               | one increment per tap and confirmation                   | TS-008            |
| SC-011   | null price and zero stock                  | visible reason and disabled action                       | TS-008            |

## Constraints

- iOS execution requires macOS/device and remains unverified when unavailable.
- EN-002 decides whether installed package versions require a development build;
  current expectation is Expo Go compatibility.
- No configured Mobile E2E runner exists. Manual device results are not E2E.

## Execution record — 2026-09-15

- Windows host, Expo SDK 56: web production Metro export passed.
- Windows host, Expo SDK 56: Android Hermes production Metro export passed.
- No interactive Android emulator/phone, iOS device/macOS, or browser CUA was
  available, so the checks in the matrix remain deferred.
- `expo-doctor`: 21/22. The sole failure is the known Hermes V1 memory
  regression in Expo 56/RN 0.85; remediation requires the separate Expo 57/RN
  0.86 upgrade.
