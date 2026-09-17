# Mobile manager cart checkout — visual QA plan

## Automated checks

| Scenario      | Risk                                             | Test level                    | Planned test/target                               |
| ------------- | ------------------------------------------------ | ----------------------------- | ------------------------------------------------- |
| SC-002–SC-005 | Empty/list/quantity/total hierarchy              | component                     | `mobile-cart-ui:test`                             |
| SC-006–SC-008 | Selector search, empty/error and form validation | component                     | `mobile-cart-ui:test`, `mobile-cart-feature:test` |
| SC-009–SC-013 | Pending/error/success and cleanup warning        | component/focused integration | `mobile-cart-feature:test`                        |

## Manual matrix

| Scenario      | Platform/viewport              | Input mode                   | Observable result                                | Evidence |
| ------------- | ------------------------------ | ---------------------------- | ------------------------------------------------ | -------- |
| SC-003–SC-005 | Android/iOS small and standard | touch/screen reader          | Controls remain reachable and totals do not clip | TS-009   |
| SC-006–SC-008 | Android/iOS small and standard | keyboard/touch/screen reader | Search/form scroll correctly above keyboard      | TS-009   |
| SC-009–SC-013 | Android/iOS/web                | touch/keyboard               | Pending, error and receipt match corporate theme | TS-009   |

## Visual evidence

- Record build/runtime and date.
- Capture populated, empty, customer search, validation, pending, safe error and
  success receipt only.
- Use synthetic customer/order data without production PII.
- Store results in `TS-009` and link them from traceability.

## Result — 2026-09-17

The component and integration tests passed and the three-platform Expo export
completed. No interactive renderer or device was available, so screenshots,
keyboard layout, safe-area behavior and TalkBack/VoiceOver remain assigned to
the Mobile team. No visual claim is inferred from bundle generation.
