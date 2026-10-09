# Товари без фотографій у профілі — device verification plan

## Environments

| Platform/device                              | Runtime                              | Build                          | Owner                 |
| -------------------------------------------- | ------------------------------------ | ------------------------------ | --------------------- |
| Android phone, compact and large text        | Expo Go                              | implementation commit/build ID | Mobile QA             |
| iOS phone, compact and large text            | Expo Go on macOS/device              | implementation commit/build ID | Mobile QA/macOS owner |
| Expo web, narrow and tablet/desktop viewport | supported browser via `mobile:serve` | implementation commit/build ID | Mobile QA             |

## Checks

| Scenario | Device condition                                 | Observable result                                                                     | Evidence location                                                            |
| -------- | ------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| SC-001   | cold open Profile, slow controlled response      | heading precedes stable loading state; no layout jump into false empty                | [TS-007 evidence](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-002   | enough fixture items to scroll; large text       | unique cards remain readable, fallback is explicit, bottom nav does not cover content | [TS-007 evidence](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-003   | successful empty fixture                         | positive empty copy is centered/readable and not announced as error                   | [TS-007 evidence](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-004   | offline/network and controlled 5xx fixture       | safe error is announced; 48dp retry repeats request once                              | [TS-007 evidence](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-005   | pull-to-refresh on a scrolled list               | current rows stay visible; indicator and refreshed result are correct                 | [TS-007 evidence](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-006   | paginated contract only; next-page delay/failure | footer stays reachable; rows survive retry and append without duplicates              | [TS-007 evidence](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-007   | unpaginated contract only                        | no footer/action suggests more results                                                | [TS-007 evidence](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-008   | supported slug; open details then native Back    | correct detail opens and Back restores Profile list position/data                     | [TS-007 evidence](../tasks/verification/TS-007-device-visual-qa.md#evidence) |
| SC-009   | unsupported identifier branch                    | screen reader does not announce card as button/link                                   | [TS-007 evidence](../tasks/verification/TS-007-device-visual-qa.md#evidence) |

## Constraints

- Unavailable environment: iOS execution requires macOS/Xcode or a physical
  iOS device; assign an owner and keep planned if unavailable.
- Required binary rebuild: none expected; only existing JS/Expo-supported
  dependencies are used.
- Manual-only risk and reason: actual safe-area, pull gesture, dynamic type,
  screen reader order and Back/scroll preservation need device/runtime evidence.
- Execute only the pagination/navigation branch confirmed by `EN-001`; record
  the other as not applicable, not passed.

## Current result — 2026-10-05

- Android: blocked; no emulator/physical device session is available to this
  implementation environment. Owner: Mobile QA.
- iOS: blocked; macOS/Xcode or a physical iOS device is unavailable. Owner:
  Mobile QA/macOS owner.
- Expo web: bundle verified with a 6 GB Node heap (1933 modules), but no live
  browser/visual session was available. The aggregate export subsequently
  failed in the Windows Hermes compiler for iOS/Android and emitted no final
  artifact. Owner: Mobile QA or a runnable Expo host.
- No manual screenshot, gesture, Back restoration, screen-reader or large-text
  result is claimed. Automated RNTL accessibility and interaction evidence is
  linked from traceability.
