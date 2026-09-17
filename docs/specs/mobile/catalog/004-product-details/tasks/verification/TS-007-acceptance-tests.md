# TS-007 — Route and component acceptance coverage

- **Task ID:** TS-007
- **Covers:** SC-001–SC-012
- **Depends on:** TS-003, TS-004, TS-005, TS-006
- **Exact paths:** affected specs under `apps/mobile/src/__tests__/`, `libs/mobile/catalog/**/src/` and `libs/mobile/cart/**/src/`
- **Test level:** component and integration

## Work

- [x] Close scenario gaps with risk-based Jest/RNTL tests; reuse existing
      catalog/product-card setup and avoid duplicating mapper assertions at UI level.
- [x] Run contract check, affected lint/tests/type checks and Mobile Expo export;
      record exact results here.

## Evidence

- Test/path and observable assertion: mapper/request specs cover transport;
  model/storage specs cover cart and media candidates; RNTL specs cover
  navigation, gallery, all content/states and cart action.
- Red command and expected behavioral failure: initial generated placeholders
  and missing screens caused focused tests to fail before implementation.
- Green command and result: focused data-access/model/UI/feature/route suites pass.
- Refactor note and focused rerun: Nx boundaries were corrected with a thin
  cart feature export and app-owned connectivity/router adapters.
- Regression command and result: `npm run test:mobile` passes 12 projects;
  affected lint and `nx typecheck mobile --skipNxCache` pass; Expo web and
  Android production exports pass.
- Manual/visual evidence, if required: linked from TS-008.
- Deviation or blocker: `expo-doctor` is 21/22 only because of the known
  pre-existing Expo 56 Hermes V1 regression; physical device QA is TS-008.

## Checkpoint

Every SC row points to a passing automated assertion or an explicit manual-only
device risk, with no Jest smoke mislabeled as E2E.
