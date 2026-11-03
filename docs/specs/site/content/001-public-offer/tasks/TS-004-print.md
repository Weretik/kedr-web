# TS-004 — Print action and output

- **Status:** verified.
- **Covers:** SC-009, SC-010, SC-011, SC-013.
- **Depends on:** TS-002.
- **Test level:** component plus print stylesheet/source review.
- **Architecture baseline:** [frontend design](../design/frontend.md), [delivery rules](../../../../../standards/shared/delivery-rules.md) and [testing rules](../../../../../standards/shared/testing-rules.md); no AF/EN prerequisite.

## Exact paths

- `libs/site/content/ui/src/lib/public-offer/public-offer-print-button.tsx`
- `libs/site/content/ui/src/lib/public-offer/public-offer-print-button.spec.tsx`
- `libs/site/content/ui/src/lib/public-offer/public-offer-print.module.css`
- `libs/site/content/ui/src/lib/public-offer/public-offer-print-styles.spec.ts`
- `libs/site/content/ui/src/lib/public-offer/public-offer-header.tsx`
- `libs/site/content/ui/src/lib/public-offer/public-offer-content.tsx`

## Work

- [x] Add a narrow client leaf invoking window.print once per activation; do not navigate, submit data, generate PDF or show a fabricated success message.
- [x] Keep the action disabled before hydration and provide a localized noscript hint for the browser print command. Place the outlined control according to the approved title layout.
- [x] Add page-root-scoped print rules that hide shop header/footer, contents, contact CTA and interactive controls while printing the full title, all legal sections and final note once.
- [x] Force readable black-on-white print even for a dark screen theme. Remove sticky/column constraints, keep paragraphs and headings sensible across pages, and avoid making the entire document unbreakable.
- [x] Review that shell-hiding selectors require the offer page marker and cannot affect another route if its CSS stays loaded. Test print invocation and fallback; inspect complete markup against print selectors.
- [x] Check the changed implementation files for cohesive responsibility; split independent copy/mapping/rendering/browser lifecycle where needed within existing boundaries. Do not split a cohesive file just for its line count. Record the local keep/split decision.

## Evidence

PO-PRINT completed. Print action uses the existing hydration pattern and separate page-scoped media rules.

- Red: direct focused Vitest, 6 expected assertion failures on a working Button stub (SSR incorrectly enabled and no print callback).
- Green/final affected verification: `node node_modules/vitest/vitest.mjs run --config libs/site/content/ui/vite.config.mts src/lib/public-offer/public-offer-print-button.spec.tsx`, exit 0, 1 file / 6 tests.
- Tests cover UA/RU disabled SSR/hint, hydration without mismatch or automatic print, pointer/keyboard activations and no submit/download/navigation/status claim.
- CSS source/compiler review: all 30 selectors require local .page, no @page; installed Next pure/local and scope PostCSS transforms passed. Only direct-body shop header/footer are hidden; page title and full legal DOM stay intact.
- Grid/height/overflow constraints are removed for print, colors are black-on-white, paragraphs/headings have bounded break rules. Structure remains split into print leaf/CSS and server header/composition.
- Actual browser application, print preview and pagination are unrun. See the [exact executed CSS-module command](../verification/implementation.md#css-module-validation).

### Retained Activity correction

Final retained-page regression: installed Next 16.4.3 layout-router preserves inactive segments in hidden React Activity trees. A root-presence guard alone incorrectly selected the shop frame and cached offer while another route was active. The selectors now exclude hidden hosts and ancestors ([hidden] and normalized/compact inline display:none).

New public-offer-print-styles.spec.ts compiles the real CSS with installed Next pure/scope plugins and tests actual selector matching. Valid Red: 1 passed / 3 failed (8 nodes incorrectly targeted in each hidden case). Green: 1 file / 4 tests passed, exit 0. A DOM test-engine selector-length limit was handled by parsing top-level selector lists with postcss.list.comma; that harness error is not behavioral evidence. No new production dependency or JavaScript is needed.

## Checkpoint

Print behavior and scoped styles are implemented with honest automated/source evidence; actual printer pagination or print preview is not claimed without a separately authorized check.
