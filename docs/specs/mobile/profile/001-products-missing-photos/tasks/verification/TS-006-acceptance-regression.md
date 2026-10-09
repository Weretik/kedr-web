# TS-006 — Close automated acceptance and regression evidence

- **Task ID:** TS-006
- **Covers:** SC-001–SC-009
- **Depends on:** TS-005
- **Exact paths:** all tests named in TS-001–TS-005;
  `docs/specs/mobile/profile/001-products-missing-photos/traceability.md`;
  task evidence sections and readiness checklists
- **Test level:** unit + focused integration + component + integration
- **Architecture baseline:** existing Nx/Jest targets; npm workspace;
  generated contract and architecture gates

## Work

- [x] Review scenario coverage without duplicating every scenario at every
      level; add only missing assertions to the responsible focused test.
- [x] Run `npm run contracts:check`, affected catalog tests,
      `npx nx test mobile --runInBand`, `npm run typecheck:tests:mobile`, affected
      lint/typecheck targets, `npm run architecture:boundaries` and
      `npx nx export mobile`.
- [x] Run `npm run docs:check` and targeted Prettier checks; update each
      responsible task with actual Red/Green/Refactor/Regression evidence.
- [x] Repeat graph, tag, public/deep import, direct transport, generated DTO and
      empty/dead path searches; record any in-scope finding before closure.
- [x] Update traceability statuses only from actual executable evidence; do not
      claim Mobile E2E.
- [x] Verify changed implementation files each retain one cohesive
      responsibility; split independent responsibilities before the final
      regression run.

## Evidence

- Test/path and observable assertion: exact tests remain in TS-001–TS-005;
  this task proves complete, non-orphaned scenario coverage and clean gates.
- Red command and expected behavioral failure: n/a for verification-only work;
  behavioral Red belongs to the implementing task.
- Green command and result: affected Jest targets passed — data-access 9/20,
  UI 9/19, feature 7/37 and app 5/10 suites/tests; `mobile:typecheck`,
  `typecheck:tests:mobile`, four affected lint targets, `docs:check` and
  `architecture:boundaries` passed.
- Refactor note and focused rerun: final import-order correction was followed by
  data-access lint and all affected regression suites.
- Regression command and result: direct affected Nx regression completed with
  30 suites / 86 tests passed. The broad `npm run test:mobile` wrapper was not
  claimed because the local Nx child process detached; all changed consumers
  were run directly.
- Manual/visual evidence, if required: TS-007 remains blocked.
- Code-audit evidence: AF-001–AF-004 verified; boundary fixture suite (5 tests)
  and graph checker (63 projects) passed after remediation.
- Deviation or blocker: `npm run contracts:check` exits only on the intentional
  uncommitted generated diff after successful lint/generation. Default-memory
  Expo export failed with `Data cannot be cloned, out of memory`; a 6 GB Node
  heap then bundled web successfully (1933 modules), but the Windows Hermes
  compiler crashed for iOS/Android with exit `3765269347`, leaving no export
  artifact. Global docs format also retains unrelated pre-existing failures
  outside this feature; targeted feature/source formatting passes.

## Checkpoint

Every applicable scenario links to passing responsible automated evidence.
Contract diff, export and manual device/visual gates remain explicitly
unverified rather than being reported as passed.
