# TS-001 — Complete source model

- **Status:** verified.
- **Covers:** SC-002.
- **Depends on:** none.
- **Test level:** unit.
- **Architecture baseline:** [frontend design](../design/frontend.md), [delivery rules](../../../../../standards/shared/delivery-rules.md) and [testing rules](../../../../../standards/shared/testing-rules.md); no AF/EN prerequisite.

## Exact paths

- `libs/site/content/model/src/lib/public-offer/public-offer-types.ts`
- `libs/site/content/model/src/lib/public-offer/public-offer-source-copy.ts`
- `libs/site/content/model/src/lib/public-offer/public-offer-ui-copy.ts`
- `libs/site/content/model/src/lib/public-offer/public-offer-dictionary.ts`
- `libs/site/content/model/src/lib/public-offer/public-offer-dictionary.spec.ts`
- `libs/site/content/model/src/index.ts`

## Work

- [x] Read the frozen source-baseline.json and compare its source fingerprint to the current Storefront source; inspect any source drift before copying. Do not silently update accepted legal text.
- [x] Copy both localized source documents literally, including seven complete headings, 18 numbered paragraphs and the final note. Preserve 1.2.1, 3.1.2 and the Angular wording as text.
- [x] Separate legal literals from short H1/controls/contents labels; create readonly mapping with the stable IDs in data-model.md and a public dictionary getter.
- [x] Add an independent baseline test that compares every legal value/order, paragraph counts, original full title and final note. Case/layout differences in display headings may be normalized; contract sentences may not.
- [x] Append only the necessary public model exports; keep all existing content models.
- [x] Check the changed implementation files for cohesive responsibility; split independent copy/mapping/rendering/browser lifecycle where needed within existing boundaries. Do not split a cohesive file just for its line count. Record the local keep/split decision.

## Evidence

PO-01 completed. The model exposes the agreed readonly dictionary/section types and preserves both full localized contracts against the independent frozen source baseline.

- Red: working getter stub, 7 behavioral test failures (zero sections and missing title/note/labels); earlier fixture URL/cwd errors were corrected before valid Red and are not counted as behavior evidence.
- Green/final affected regression: `node node_modules/nx/dist/bin/nx.js run site-content-model:vite:test --output-style=static -- --run src/lib/public-offer/public-offer-dictionary.spec.ts`, exit 0, 1 file / 7 tests, cache skipped.
- Structure/refactor: literal source, UI labels, mapping, types and test remain separate cohesive files; Prettier passed. No runtime Angular or documentation import.
- Source baseline: seven headings, paragraph groups 4/3/3/2/4/1/1 and final note in each locale; original 1.2.1 and 3.1.2 retained.

## Checkpoint

Both dictionaries preserve the frozen source and expose seven stable sections without importing Storefront/Angular or documentation data at runtime.
