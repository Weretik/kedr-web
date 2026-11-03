# Public offer — architecture and responsibility audit

- **SDD:** [001-public-offer](../README.md).
- **Date:** 2026-11-03.
- **Scope:** the localized offer route, its model/UI/feature/SEO source, public exports, direct core/shared dependencies, seven tests and actual project graph.
- **Authorization:** the owner requested audit plus fixes. Changes remain local to confirmed findings; unrelated worktree changes are preserved.
- **Delivery status:** verified at the stated automated/source scope.

## Rules and method

Project authority: root and apps/site AGENTS; [Site modules](../../../../../architecture/site/structure/modules.md), [rendering and caching](../../../../../architecture/site/platform/rendering-and-caching.md), [Site design system](../../../../../standards/site/design-system.md), [delivery](../../../../../standards/shared/delivery-rules.md) and [testing](../../../../../standards/shared/testing-rules.md). Actual import rules are `eslint.config.cjs:143–144`; actual dependency validation is `tools/architecture/project-boundary-rules.mjs`. The accepted SDD [file-role plan](../design/frontend.md) supplies this feature's composition boundaries.

Applied the relevant inventory, boundaries, state/data, UI responsibilities, public API/structure, tests and correction-verification checks from the frontend-code-audit workflow. This is an architecture audit of one feature. It is not a repository-wide, visual, security or SEO-policy audit.

## Inventory and baseline

23 feature code/test/style files: 15 production TS/TSX, one CSS module and seven spec files. Model has four production files plus one spec; UI has seven production TS/TSX files, one CSS module and four specs; SEO has two production builders/two specs; feature and route have one entry each. No empty domain layer, alias or compatibility wrapper was added.

The four existing content projects retain `scope:site`, `domain:content` and model/ui/util/feature tags. Existing Vitest, lint and typecheck targets are configured. Source and spec TypeScript configurations exist. A selected-root compiler check using their real spec configurations passes for model (1 spec), UI (4 specs) and SEO (2 specs), with zero diagnostics.

The independent dependency review read the current graph using createProjectGraphAsync. Every internal static edge of the four relevant projects passes the actual validateProjectBoundary function. Six focused positive/negative cases also pass: UI→model, feature→UI and SEO→core allowed; SEO→model, feature→feature and core→domain rejected.

## Architecture matrix

| Owner                | Actual responsibility                                             | Permitted path / result                             |
| -------------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| app route            | Await params, guard locale, call feature and metadata             | Thin server entry; keep                             |
| content/model        | Original legal copy, UI labels, readonly contract and assembly    | Static local source; core locale types only; keep   |
| content/feature      | Select localized document, render UI and escaped breadcrumb graph | Public model/UI/SEO/core APIs; keep                 |
| content/ui           | Semantic server document, responsive frame and help               | Allowed model/core/shared UI dependencies; keep     |
| contents client leaf | Current-section progressive enhancement                           | Seven label/ID props; separate lifecycle hook; keep |
| print client leaf    | Browser print and hydration availability                          | Label/hint props only; separate CSS; keep           |
| content/seo          | Metadata and visible-breadcrumb builders                          | Core config/i18n/SEO only; keep                     |

No API/DTO/server-state/cache/invalidation path exists for this static document. A data-access library or state store would have no role. Current section is local UI state; the complete legal text does not cross a client component boundary. No imperative next/navigation router hook or transport call appears in UI. Declarative Next Link uses real hrefs as required by Site public-link rules.

Only the dictionary getter and the two presentation types are public in model; raw legal/UI copy and mapping remain private. UI exports only the page content entry for this feature. No cross-library deep import, feature-to-feature dependency, cycle or dead compatibility structure was found in scope. Existing article/wholesale graph edges are documented flows and were not introduced by this page.

## Findings

### AF-001 — Import ordering fails the configured lint gate

- **Severity:** low.
- **Status:** verified.
- **Baseline evidence:** `libs/site/content/ui/src/lib/public-offer/public-offer-content.tsx:7` places CSS after the later internal Toc import; `public-offer-print-styles.spec.ts:3,8` misses configured group/require separation.
- **Rule/source:** `eslint.config.cjs:143–144`, import/newline-after-import and import/order.
- **Impact:** the feature fails its scoped lint check despite passing unit tests and source typecheck.
- **Owner/target:** Kedr frontend; reorder imports in those two existing files, preserving runtime behavior.
- **Task/dependency:** [TS-007](../tasks/TS-007-audit-corrections.md), depends on implemented TS-006.
- **Verification:** baseline scoped ESLint exit 1 with three errors; repeat the same scoped command after correction and run the affected UI regression.

### AF-002 — Current-state documentation still describes the pre-implementation state

- **Severity:** low.
- **Status:** verified.
- **Baseline evidence:** SDD `README.md:12–14` labels its baseline “Current state” and says Site has no page or sitemap descriptor. `design/accepted-concept.md:3` still says implementation has not been requested “in this turn”.
- **Rule/source:** delivery rules, Specification readiness: README owns the feature's current scope/status and historical baseline must remain distinguishable.
- **Impact:** a later implementer could mistake the captured starting state for an absent implementation or an unresolved authorization boundary.
- **Owner/target:** Kedr frontend; label the starting snapshot explicitly and record the later implementation authorization.
- **Task/dependency:** [TS-007](../tasks/TS-007-audit-corrections.md).
- **Verification:** compare current route/descriptor/status to corrected wording; check changed local links and diff.

### AF-003 — Current-section observation escapes the owning page DOM

- **Severity:** medium.
- **Status:** verified.
- **Baseline evidence:** `libs/site/content/ui/src/lib/public-offer/use-public-offer-section.ts:17` resolves target nodes through global document.getElementById. Installed Next layout-router retains inactive Activity page trees; a hidden prior document can have the same stable section IDs.
- **Rule/source:** Site server/client ownership and the SDD's current-section lifecycle boundary; the client enhancement belongs to its own page and must not bind to a cached sibling tree.
- **Impact:** a focused regression with a retained hidden duplicate selects offer-final instead of the active offer-general and observes the wrong seven elements.
- **Owner/target:** Kedr frontend; pass a local ref from Toc to the lifecycle hook and resolve sections under its nearest data-public-offer/document root only. Preserve native anchors, IDs and all public props.
- **Task/dependency:** [TS-008](../tasks/TS-008-dom-observation-scope.md); no shared/systemic prerequisite.
- **Verification:** valid behavioral Red: 10 passed / 1 failed on the working existing implementation; run the focused Toc test and final UI regression after correction.

No high finding or systemic remediation prerequisite was identified.

## Responsibility and structure decisions

| Area                                | Decision      | Reason and evidence                                                                                                                                              |
| ----------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model source/UI copy/types/assembly | keep separate | Four existing roles already have independent owners; the snapshot test checks every source heading/paragraph/order/title/note                                    |
| PublicOfferContent                  | keep          | Server layout composition; no API, rules, browser lifecycle or legal-copy mutation                                                                               |
| PublicOfferHeader                   | keep          | Cohesive breadcrumb/title/action placement; print lifecycle already belongs to its leaf                                                                          |
| PublicOfferContact                  | keep          | One responsive support block: related terms links and configured contact card. This is the explicit SDD role; it has no independent states/resources to split    |
| Server dictionary props             | keep          | Type-only contract in server components; only narrow label/anchor props reach client leaves, so there is no client payload or public DTO leak                    |
| Contents UI + lifecycle hook        | keep separate | Responsive contents share one current-section owner; browser lifecycle is outside rendering. AF-003 adds an explicit local ref to scope DOM lookup to that owner |
| Print leaf + CSS                    | keep separate | Browser action and print media have separate owners; the longer CSS is cohesive page-print behavior with retained-Activity regression coverage                   |
| public-offer feature folders        | keep          | Approved Site domain/layer plus feature grouping. No Admin/Mobile topology or numeric size threshold is imposed on Site                                          |
| Test placement                      | keep          | Colocated tests exercise source fidelity, server/native markup, client lifecycle, browser-print calls and compiled CSS selectors                                 |

There is no confirmed mixed component requiring further splitting. The contact/header keep decisions were independently reviewed against their approved file roles. Smaller files alone would not improve a verified responsibility boundary.

## Verification and limits

Baseline scoped lint: three import errors in two files. Selected-root spec TypeScript checks: all seven files pass. Actual graph and six positive/negative boundary cases pass. Original source SHA256 still matches the frozen baseline: b5f2188e225b7173b685add0d3b9c77e4fb04f08f02577ba7a823397d06279a4.

## Final result

| Severity | Verified           | Open / blocked |
| -------- | ------------------ | -------------- |
| Medium   | 1 (AF-003)         | 0              |
| Low      | 2 (AF-001, AF-002) | 0              |

All three findings are verified. AF-003 was reproduced with a valid behavioral regression before correction; its local-ref dependency now limits every observed section to the owning page/document. Public props, source text, native links, IDs and server/client boundaries are preserved.

Fresh checks after the final runtime change:

- Scoped ESLint: exit 0, no errors/warnings. Initial AF-001 baseline had three errors; no global lint/configuration change was needed.
- Combined affected UI: `node node_modules/nx/dist/bin/nx.js run site-content-ui:vite:test --output-style=static -- --run src/lib/public-offer/`, exit 0, 4 files / 29 tests, cache skipped.
- Spec typecheck: selected roots under the actual model/UI/SEO tsconfig.spec configurations, exit 0: 1 + 4 + 2 files, zero diagnostics. The exact local inspection command was `node "C:/Users/Віталій/.codex/visualizations/2026/11/03/01a19ef1-da0b-7a33-902b-0b23ad152488/audit-offer-test-types.mjs"`.
- Actual project-graph imports and six positive/negative boundary cases passed. The ref correction changes no internal dependency direction, tag, alias or public export; final scoped lint rechecks current imports.
- AF-002 wording was checked against the existing route and sitemap descriptor; the starting snapshot is now explicit and later authorization is recorded.
- Changed Markdown links, source formatting and diff were checked. Original source fingerprint remains unchanged.
- Repeated keep/split review: layout/header/support remain cohesive; server document, source model, contents renderer, browser lifecycle and print adapter are separate. There is no unresolved mixed-responsibility component in scope.

Exact executed lint scope:

```powershell
node node_modules/eslint/bin/eslint.js 'libs/site/content/ui/src/lib/public-offer/**/*.{ts,tsx}' 'libs/site/content/model/src/lib/public-offer/*.ts' libs/site/content/seo/src/lib/public-offer-metadata.ts libs/site/content/seo/src/lib/public-offer-metadata.spec.ts libs/site/content/seo/src/lib/public-offer-json-ld.ts libs/site/content/seo/src/lib/public-offer-json-ld.spec.ts libs/site/content/feature/src/lib/public-offer-page.tsx 'apps/site/src/app/[locale]/(content)/public-offer/page.tsx'
```

Browser/manual/visual/actual print preview, production build and whole-app tests remain unrun. Those limits do not turn source/component evidence into runtime geometry proof. No high/systemic finding or unresolved in-scope finding remains.
