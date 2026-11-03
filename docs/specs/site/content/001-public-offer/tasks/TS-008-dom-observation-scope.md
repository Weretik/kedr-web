# TS-008 — Scope contents observation to its owning document

- **Status:** verified.
- **Covers:** AF-003, SC-004, SC-006.
- **Depends on:** TS-006.
- **Test level:** focused component regression, spec/source types and scoped lint.

## Exact paths

- `libs/site/content/ui/src/lib/public-offer/public-offer-toc.tsx`
- `libs/site/content/ui/src/lib/public-offer/use-public-offer-section.ts`
- `libs/site/content/ui/src/lib/public-offer/public-offer-toc.spec.tsx`
- `docs/specs/site/content/001-public-offer/code-audit/audit.md`

## Work

- [x] Reproduce the wrong current-section state with a hidden prior document containing the same section IDs.
- [x] Keep the existing public Toc props; create a local ref in the client leaf and pass that ownership to the lifecycle hook.
- [x] Resolve section nodes only inside the nearest owning page/document root; never fall back to a global ID lookup.
- [x] Preserve native anchors, IDs, focus/history behavior, SSR markup and observer cleanup.
- [x] Complete final affected UI/lint/type checks and record AF-003 verified.
- [x] Keep rendering and browser lifecycle in separate existing files; no new layer or shared abstraction is needed.

## Evidence

Valid behavioral Red: `node node_modules/vitest/vitest.mjs run --config libs/site/content/ui/vite.config.mts src/lib/public-offer/public-offer-toc.spec.tsx`, exit 1, 10 passed / 1 failed. The hidden duplicate caused aria-current to select offer-final rather than the active offer-general.

The same command after the scoped-ref fix: exit 0, 1 file / 11 tests passed. The new assertion also proves that every observed element belongs to the current page and that scrolling uses its own geometry. The fixture models actual page/document markers and hidden retained DOM.

Final combined UI: 4 files / 29 tests, exit 0; all seven selected spec files typecheck with zero diagnostics; final scoped lint exits 0. AF-003 is verified; complete commands and scope are in the audit. Public aliases, model copy, routes and SEO are unchanged.

## Checkpoint

AF-003 is verified with the retained-page regression and final affected checks. No browser or real navigation/geometry evidence is inferred from the controlled DOM test.
