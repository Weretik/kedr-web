# TS-004 — Render the accessible Profile product section

- **Task ID:** TS-004
- **Covers:** SC-001, SC-002, SC-003, SC-004, SC-005, SC-006, SC-007, SC-009
- **Depends on:** TS-003
- **Exact paths:**
  `libs/mobile/catalog/feature/src/screens/missing-photo-products-screen.tsx`;
  `libs/mobile/catalog/feature/src/components/missing-photo-products-content.tsx`;
  `libs/mobile/catalog/feature/src/components/missing-photo-products-results.tsx`;
  `libs/mobile/catalog/feature/src/screens/missing-photo-products-screen.spec.tsx`;
  `libs/mobile/catalog/ui/src/states/missing-photo-products-state.tsx`;
  `libs/mobile/catalog/ui/src/states/missing-photo-products-state.spec.tsx`;
  catalog UI public entry point
- **Test level:** component
- **Architecture baseline:** feature composes controller + presentational
  catalog UI; UI imports model/callbacks only and reuses existing product list
  primitives where contract-compatible

## Work

- [x] Render one «Товари без фотографій» section and context-specific loading,
      positive empty and safe error states.
- [x] Reuse `CatalogList`, `ProductCard` and `CatalogListFooter` where their
      confirmed model/semantics fit; extend narrowly via props or a focused
      presentation component rather than cloning a full catalog screen.
- [x] Keep current rows visible during refresh and next-page failure; show a
      load-more/retry footer only for confirmed pagination.
- [x] Make cards buttons only when an `onProductPress` action is actually
      supplied; otherwise expose readable non-interactive content without a false
      role. Preserve 48dp actions, heading order, non-color signals and Ukrainian
      labels.
- [x] Add RNTL cases for every visible state, retry, refresh, footer behavior,
      item uniqueness, dynamic text wrapping semantics and interactive versus
      non-interactive cards.
- [x] Update the code audit and confirm UI has no router, API hook, generated
      DTO or nested vertical `ScrollView` dependency.
- [x] Verify changed implementation files each retain one cohesive
      responsibility; keep screen, state selection and presentational state/list
      responsibilities separate.

## Evidence

- Test/path and observable assertion: screen/state specs assert heading and
  state copy, roles, retry, refresh, retained rows, pagination footer, fallback
  image behavior and product press.
- Red command and expected behavioral failure:
  `npx nx test mobile-catalog-feature --runInBand --testPathPattern=missing-photo-products-screen.spec.tsx` and
  `npx nx test mobile-catalog-ui --runInBand --testPathPattern=missing-photo-products-state.spec.tsx`;
  section and context states are absent.
- Green command and result: focused state spec 3 tests passed; focused screen
  spec 6 tests passed.
- Refactor note and focused rerun: screen, results selection, content layout and
  context state remain separate; both focused suites passed.
- Regression command and result:
  `npx nx test mobile-catalog-feature --runInBand` (7 suites / 37 tests) and
  `npx nx test mobile-catalog-ui --runInBand` (9 suites / 19 tests); passed.
- Code-audit finding: AF-001 verified. A focused component assertion was Red
  against the hardcoded image-frame color and Green after switching to
  `theme.colors.surface`; local-color search is empty for in-scope production UI.
- Manual/visual evidence, if required: blocked in TS-007 pending a runnable
  Android/iOS/Expo web environment.
- Deviation or blocker: automated UI evidence is complete; device visual and
  assistive-technology evidence remains TS-007.

## Checkpoint

RNTL proves all visible states/actions and correct accessibility semantics with
one list scroll owner and no catalog-specific misleading copy.
