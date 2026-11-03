# TS-003 — Contents navigation enhancement

- **Status:** verified.
- **Covers:** SC-003, SC-004, SC-005, SC-006, SC-007.
- **Depends on:** TS-002.
- **Test level:** focused component interaction.
- **Architecture baseline:** [frontend design](../design/frontend.md), [delivery rules](../../../../../standards/shared/delivery-rules.md) and [testing rules](../../../../../standards/shared/testing-rules.md); no AF/EN prerequisite.

## Exact paths

- `libs/site/content/ui/src/lib/public-offer/public-offer-toc.tsx`
- `libs/site/content/ui/src/lib/public-offer/use-public-offer-section.ts`
- `libs/site/content/ui/src/lib/public-offer/public-offer-toc.spec.tsx`

## Work

- [x] Enhance only the contents leaf; accept anchor descriptors and labels, never full legal copy. Keep native links and disclosure markup available in initial HTML.
- [x] Resolve an initial valid hash, ordinary hash navigation and observed current section; mark the applicable link with aria-current=location and the approved token highlight.
- [x] Keep navigation keyboard-native. Scrolling must not steal focus, rewrite the route or force animation contrary to reduced motion.
- [x] Handle unavailable observer APIs without hiding content or breaking anchors. Clean up observers/listeners on unmount and locale changes.
- [x] Test initial hash, all seven destinations, section change, hash change, fallback and cleanup with deterministic observer/browser mocks; do not substitute a browser test.
- [x] Check the changed implementation files for cohesive responsibility; split independent copy/mapping/rendering/browser lifecycle where needed within existing boundaries. Do not split a cohesive file just for its line count. Record the local keep/split decision.

## Evidence

PO-03 completed. Native contents is progressively enhanced with current-section state and cleanup while legal text stays on the server.

- Initial Red on working static contents: 9 tests, 1 passed / 8 failed.
- Additional locale-lifecycle Red: 10 tests, 9 passed / 1 failed because observation was not refreshed for translated labels with the same IDs; corrected by a stable descriptor-value key.
- Green/final affected regression: `node node_modules/nx/dist/bin/nx.js run site-content-ui:vite:test --output-style=static -- --run src/lib/public-offer/public-offer-toc.spec.tsx`, exit 0, 1 file / 10 tests, cache skipped.
- Tests cover initial hash, hash changes, scroll/observer updates, computed offsets, unavailable observer, stable/replaced descriptors, cleanup and native server disclosure.
- Structure/import review: client UI, lifecycle hook and tests are separated; no legal/model/docs runtime import, history change, focus movement or scrollTo call. Real geometry remains outside component/source evidence.

## Checkpoint

Current-section highlighting is a small progressive enhancement and all wayfinding remains usable without it.
