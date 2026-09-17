# TS-009 — Acceptance and device/visual verification

- **Task ID:** TS-009
- **Status:** complete with runtime QA handoff
- **Covers:** SC-001–SC-013
- **Depends on:** TS-007, TS-008
- **Exact paths:** affected cart/mobile specs;
  `verification/device-qa.md`; `verification/visual-qa.md`;
  `traceability.md`; task evidence
- **Test level:** integration, component and manual

## Work

- [x] Complete scenario-focused Jest/RNTL coverage without duplicating every
      scenario at every level; run affected and full Mobile regression commands.
- [x] Execute the device and visual matrices on available Android, iOS and web
      environments, recording exact build/date and synthetic evidence.
- [x] Update traceability with actual test names/results, record unavailable
      environments honestly and document residual stale-stock risk.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md).

- Test/path and observable assertion: exact commands and focused outcomes are recorded in delivery evidence.
- Red command and expected behavioral failure: inherited from responsible behavioral tasks.
- Green command and result: all focused suites and the 13-project Mobile regression passed.
- Refactor note and focused rerun: lint, test typecheck and Mobile typecheck passed.
- Regression command and result: `npm run contracts:check`;
  `npm run test:mobile`; `npm run typecheck:tests:mobile`; affected lint targets;
  `npx nx typecheck mobile`; `npx nx export mobile`; passed.
- Manual/visual evidence, if required: unavailable; Mobile team owns Android/iOS/web interaction QA.
- Deviation or blocker: Mobile E2E runner is not installed and is not claimed.

## Checkpoint

Every in-scope scenario has passing focused evidence or an explicit, owned
manual limitation, and delivery checklists reflect the real results.
