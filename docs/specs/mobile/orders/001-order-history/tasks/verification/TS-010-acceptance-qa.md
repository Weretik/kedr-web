# TS-010 — acceptance, regression and device/visual QA

- **Task ID:** TS-010
- **Covers:** SC-001–SC-015
- **Depends on:** TS-004, TS-006, TS-007, TS-008, TS-009
- **Exact paths:** `docs/specs/mobile/orders/001-order-history/traceability.md`;
  `docs/specs/mobile/orders/001-order-history/verification/device-qa.md`;
  `docs/specs/mobile/orders/001-order-history/verification/visual-qa.md`;
  `docs/specs/mobile/orders/001-order-history/checklist/delivery-readiness.md`;
  `docs/specs/mobile/orders/001-order-history/checklist/visual-delivery.md`
- **Test level:** component/integration/manual

## Work

- [x] Run all focused new tests and affected cart/catalog/shell/app regression
      targets; record Red/Green/Refactor/Regression in owning tasks.
- [x] Run `npm run contracts:check`, `npm run test:mobile`,
      `npm run typecheck:tests:mobile`, affected Nx lint targets,
      `npx nx typecheck mobile` and `npx nx export mobile`.
- [ ] Execute available Android/iOS/web matrices for safe areas, keyboard/focus,
      long list/detail, offline/reconnect, light/dark, large text and back gestures.
- [ ] Check TalkBack/VoiceOver where environments allow; use non-production
      fixtures in screenshots/video.
- [x] Update traceability/readiness with actual tests/results, exact blockers and
      residual risks; never label Jest/RNTL evidence as Mobile E2E.
- [x] Review all changed implementation files for cohesive responsibility and
      split any overloaded file at existing architectural boundaries before
      final regression.

## Evidence

- Test/path and observable assertion: linked exact tests in traceability plus
  device/visual matrix results.
- Red command and expected behavioral failure: recorded in TS-001–TS-009 rather
  than manufactured during final verification.
- Green command and result: focused orders/customers/cart/app suites pass;
  `npm run test:mobile` passes all 20 configured projects.
- Refactor note and focused rerun: the customer selector was split into shell,
  list and state components; history orchestration into filter and pagination
  hooks/reducers; list states into separate modules; and detail UI into summary,
  products and metadata sections. Focused tests, lint and typecheck pass.
- Regression command and result: contracts check (six documented warnings),
  affected lint (13 projects), Mobile test typecheck, Mobile app typecheck,
  docs check and Android/iOS/web Expo export all exit 0.
- Manual/visual evidence, if required: 2026-09-17 exported web build was opened
  at 1280×720; five-tab order, history heading, all-clients control and explicit
  network error/retry were visible. Sanitized local capture:
  `dist/order-history-orders-web-smoke.png` (ignored build artifact).
- Deviation or blocker: no `adb` or Android emulator executable is installed in
  this Windows environment; iOS simulator/Xcode is unavailable on Windows.
  Android/iOS safe-area, keyboard, gestures, large text and TalkBack/VoiceOver
  remain assigned to the Mobile team on a configured device environment. The
  feature-scoped Prettier check passes; the repository-wide
  `npm run docs:format:check` remains red on 15 pre-existing/out-of-scope
  Markdown files, which were preserved for their current owners.

## Checkpoint

Every scenario has real automated/manual evidence or an explicit deferred owner,
all required automated commands pass, and delivery/visual checklists are current.
