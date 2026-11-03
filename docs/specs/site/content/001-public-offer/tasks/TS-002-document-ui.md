# TS-002 — Semantic document UI

- **Status:** verified.
- **Covers:** SC-001, SC-002, SC-003, SC-005, SC-006, SC-007, SC-012, SC-013.
- **Depends on:** TS-001.
- **Test level:** component plus bounded source/style review.
- **Architecture baseline:** [frontend design](../design/frontend.md), [delivery rules](../../../../../standards/shared/delivery-rules.md) and [testing rules](../../../../../standards/shared/testing-rules.md); no AF/EN prerequisite.

## Exact paths

- `libs/site/content/ui/src/lib/public-offer/public-offer-content.tsx`
- `libs/site/content/ui/src/lib/public-offer/public-offer-header.tsx`
- `libs/site/content/ui/src/lib/public-offer/public-offer-document.tsx`
- `libs/site/content/ui/src/lib/public-offer/public-offer-toc.tsx`
- `libs/site/content/ui/src/lib/public-offer/public-offer-contact.tsx`
- `libs/site/content/ui/src/lib/public-offer/public-offer-content.spec.tsx`
- `libs/site/content/ui/src/index.ts`

## Work

- [x] Compose the accepted header/title, desktop rail and document column under the current shell. Implement the whole document beyond the pictured excerpt, including the final source note.
- [x] Render semantic H1/H2/paragraphs and seven unique targets. Create native narrow-screen details/summary contents, closed initially, with the complete legal text outside it.
- [x] Use real anchors and current locale helpers for home, delivery/returns; configure tel/mail links from COMPANY. Place contact after the document on narrow screens and below contents at lg.
- [x] Keep a reusable compact contents UI that TS-003 can enhance. Print action is added by TS-004 in the header; do not add a fake PDF link.
- [x] Apply current tokens, Onest, Lucide, responsive grid, wrapping, visible focus and sticky-header scroll offsets. Review 360/390/768/1440px rules in source; do not run a browser.
- [x] Test both languages, complete legal text/note, heading structure, disclosure markup, valid targets and configured contact destinations; append the public UI export.
- [x] Check the changed implementation files for cohesive responsibility; split independent copy/mapping/rendering/browser lifecycle where needed within existing boundaries. Do not split a cohesive file just for its line count. Record the local keep/split decision.

## Evidence

PO-UI completed. The server composition renders original full name, all clauses, final note, native contents and configured contact links in both languages.

- Valid Red: 8/8 behavioral assertions failed on a working H1-only component. A local test-variable shadowing error was corrected before this valid Red.
- Green: `node node_modules/nx/dist/bin/nx.js run site-content-ui:vite:test --output-style=static -- --run src/lib/public-offer/public-offer-content.spec.tsx`, exit 0, 1 file / 8 tests, cache skipped.
- Source/style review: 32px phone / 48px desktop H1, 16px legal text, current tokens, 16/24px shell gutters, single-column below lg, 17rem rail at lg, 192px/80px anchor margins and desktop sticky top20.
- Responsive contacts share one component in two CSS-exclusive placements; each viewport exposes the appropriate block. Legal text and targets are rendered once.
- Structure: composition, title, complete document, contents and configured contact have separate roles. Final combined UI verification after TS-003/004 passed: 4 files / 28 tests, exit 0.

## Checkpoint

Complete server-renderable document UI follows the accepted layout and remains readable without client behavior; source review records the theme/breakpoint and scroll-offset decisions.
