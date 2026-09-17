# Mobile order history — visual QA plan

## Automated checks

| Scenario               | Risk                               | Test level            | Planned test/target                                                 |
| ---------------------- | ---------------------------------- | --------------------- | ------------------------------------------------------------------- |
| SC-001, SC-006–SC-010  | History/list/footer states         | component             | orders UI presentation and feature controller specs                 |
| SC-002                 | Localized card/status presentation | unit/component        | model formatter specs and `orders/ui` order-card spec               |
| SC-003, SC-004, SC-011 | Customer sheet/search/states       | component             | `libs/mobile/customers/ui/src/lib/customer-selector-sheet.spec.tsx` |
| SC-012–SC-015          | Navigation/read-only detail states | component/integration | orders UI presentation and `orders-routes.spec.tsx`                 |

## Manual matrix

| Scenario               | Platform/viewport | Input mode            | Observable result                                  | Evidence    |
| ---------------------- | ----------------- | --------------------- | -------------------------------------------------- | ----------- |
| SC-001, SC-006         | Android/iOS phone | touch                 | Card hierarchy, load-more and safe bottom spacing  | TS-010 task |
| SC-003, SC-011         | Android/iOS phone | touch/keyboard        | Sheet search, state transitions and restored focus | TS-010 task |
| SC-002, SC-009, SC-013 | Android/iOS/web   | large text/light/dark | No clipping; theme/status remain readable          | TS-010 task |
| SC-001–SC-015          | Android/iOS phone | TalkBack/VoiceOver    | Named controls, cards, statuses and async states   | TS-010 task |
| SC-012–SC-015          | compact/landscape | touch/system back     | Detail scroll/back/error actions remain operable   | TS-010 task |

## Visual evidence

- Record build/runtime, platform, theme and date.
- Capture only states needed to prove the listed risks.
- Use fixtures without production customer PII or secrets.
- Store actual results in `TS-010`; traceability links that evidence.

## Actual web evidence

- 2026-09-17, Chromium 1280×720, exported production web bundle.
- Confirmed the five-tab composition and the orders initial/recoverable-error
  layout; capture is `dist/order-history-orders-web-smoke.png`.
- Device-only rows remain pending for the exact environment blockers recorded in
  [device QA](device-qa.md#execution-result--2026-09-17).
