# Mobile order history — device verification plan

## Environments

| Platform/device        | Runtime                             | Build              | Owner                |
| ---------------------- | ----------------------------------- | ------------------ | -------------------- |
| Android phone/emulator | unavailable (`adb`/emulator absent) | exported candidate | Mobile team          |
| iPhone/simulator       | unavailable on Windows              | exported candidate | Mobile team          |
| Responsive web         | Chromium, 1280×720                  | exported candidate | completed 2026-09-17 |

## Checks

| Scenario               | Device condition                             | Observable result                                                   | Evidence location |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------- | ----------------- |
| SC-001, SC-006         | Long history, safe areas, portrait/landscape | Cards/footer remain reachable; tab order and scroll are stable      | TS-010 evidence   |
| SC-003, SC-004, SC-011 | Keyboard open in customer sheet              | Search/results remain visible; close restores filter focus          | TS-010 evidence   |
| SC-005                 | Tab/detail transitions then cold restart     | Filter survives runtime navigation and resets only after cold start | TS-010 evidence   |
| SC-007, SC-008, SC-010 | Offline/reconnect and slow network           | Existing data is preserved where required; explicit retry works     | TS-010 evidence   |
| SC-002, SC-009, SC-013 | Light/dark, large text, screen reader        | Text/chips/totals remain readable and semantically announced        | TS-010 evidence   |
| SC-012–SC-015          | Long detail/comment and optional sections    | One scroll owner; no edit controls; back/retry remain reachable     | TS-010 evidence   |

## Constraints

- Android/iOS SDK/device availability must be recorded at execution time.
- No new native dependency or binary rebuild is expected.
- TalkBack/VoiceOver and final safe-area/keyboard evidence are manual because no
  Mobile device E2E/accessibility runner is installed.

## Execution result — 2026-09-17

- `npx nx export mobile` produced Android, iOS and web bundles successfully.
- The exported web build rendered the five tabs in the agreed order and opened
  «Замовлення» with its heading, «Усі клієнти» control and recoverable network
  error/retry state. Capture: `dist/order-history-orders-web-smoke.png`.
- Android device checks are pending because `adb` and `emulator` are unavailable.
- iOS checks are pending because this runner is Windows and has no Xcode/simulator.
- TalkBack/VoiceOver, physical safe areas, keyboard/focus, system back gestures,
  large text and real-API long data remain manual Mobile-team checks.
