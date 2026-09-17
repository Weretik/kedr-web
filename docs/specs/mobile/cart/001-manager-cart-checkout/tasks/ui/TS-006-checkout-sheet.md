# TS-006 — Checkout and customer selector sheets

- **Task ID:** TS-006
- **Status:** complete
- **Covers:** SC-006–SC-008
- **Depends on:** EN-002, TS-003
- **Exact paths:** `libs/mobile/cart/ui/src/`; sheet component specs;
  `libs/mobile/cart/feature/src/`; form/controller specs
- **Test level:** component

## Work

- [x] Reuse the existing ActionSheet pattern for checkout and nested customer
      selection; use Paper Searchbar, FlashList and existing theme tokens.
- [x] Connect React Hook Form with Zod for required customer and optional
      trimmed comment up to 1000 characters; show inline accessible errors.
- [x] Render customer loading, complete search, no-match, empty, offline and
      retryable error states while preserving current selection and keyboard focus.
- [x] Перевірити змінені implementation-файли на цілісність відповідальності;
      розділити лише файл, що поєднав незалежні відповідальності.

## Evidence

See [delivery evidence](../../verification/delivery-evidence.md#behavioral-evidence).

- Test/path and observable assertion: component/controller specs cover search,
  selection, clearing, errors, validation and focus-relevant labels.
- Red command and expected behavioral failure: affected cart UI/feature tests fail before sheets exist.
- Green command and result: cart UI/feature suites passed selector, form and validation behavior.
- Refactor note and focused rerun: ActionSheet/Paper/FlashList remain presentational; passed.
- Regression command and result: `npm run test:mobile`; passed all 13 projects.
- Manual/visual evidence, if required: keyboard and screen-reader checks in TS-009.
- Deviation or blocker: no new dropdown/form package is allowed without a new enabler.

## Checkpoint

The manager can find one client from the complete local collection and produce
a locally valid checkout form using installed controls only.
