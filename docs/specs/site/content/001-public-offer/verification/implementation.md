# Implementation verification

Date: 2026-11-03. Scope: public-offer SDD TS-001–TS-006, Kedr Next.js Site.

## Completed code and package evidence

| Scope                  | Behavioral Red                                                      | Green / affected result                                          |
| ---------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Complete model/source  | 7 failed on working getter stub                                     | 1 file / 7 tests passed                                          |
| Server document UI     | 8 failed on working H1-only stub                                    | 1 file / 8 tests passed before interactive integration           |
| Contents lifecycle     | 8 failed / 1 passed; later localized-label case 1 failed / 9 passed | 1 file / 10 tests passed                                         |
| Print action           | 6 failed on working Button stub                                     | 1 file / 6 tests passed                                          |
| Metadata / breadcrumbs | 5 failed / 3 passed on working builders                             | SEO library: 12 files / 61 tests passed, including 8 offer tests |
| Sitemap                | 1 failed / 5 passed: offer URLs absent                              | 1 file / 6 tests passed; other content preserved                 |

Detailed commands and Red/Green/structure notes are in the task Evidence sections. Infrastructure/fixture errors before valid Red are not counted as behavior evidence.

Type boundary check: `node node_modules/nx/dist/bin/nx.js run site-content-feature:typecheck --output-style=static`, exit 0; existing feature, UI/model and SEO source contracts compile. No new project/package/configuration is introduced.

## Integration and source review

- App route awaits locale params, applies the existing locale guard, and calls public feature/metadata exports.
- The full document is a Server Component. Only contents and print are client leaves; they receive anchor descriptors or labels, not the legal dictionary.
- Literal copy, presentation labels, mapping, semantic rendering, current-section lifecycle, printing and metadata have separate owners/files. No overloaded source file or in-scope architecture finding remains.
- Native mobile contents defaults closed; legal text stays outside details. All seven targets are unique. The same source paragraphs/note are rendered once.
- Both screen themes use current tokens and Onest. 360/390/768/1440px behavior is checked from breakpoints, flexible widths, wrapping and current 192px/80px header offsets.
- Desktop/mobile contact placements are CSS-exclusive instances of one component. Contacts come from COMPANY; related links keep locale.
- The observer/hash/passive-scroll lifecycle uses a stable descriptor-value key, updates for locale labels/section IDs and cleans up observers, listeners and pending animation frames. It does not alter history, focus or scroll position.
- Print starts disabled in server markup, becomes ready on hydration and invokes browser print once per activation; no submit/download or success claim.
- All 30 print CSS selectors require local .page. Installed Next pure/local and scope transforms passed; no global @page. Shop-frame hiding is limited to direct body header/footer and does not hide the page's own title.
- Full contract, original numbering and final note remain for print. Actual printer pagination is not demonstrated.
- Metadata stays in content/seo with core-only dependencies. Root Organization is not duplicated; BreadcrumbList matches visible home/page navigation. Preview indexing stays off, and no modification date is invented.
- Sitemap preserves delivery, returns, contacts, requisites, wholesale and articles while adding two offer URLs.

## Final affected integration

Final affected UI integration passed: `node node_modules/nx/dist/bin/nx.js run site-content-ui:vite:test --output-style=static -- --run src/lib/public-offer/`, exit 0, 4 files / 28 tests, cache skipped (8 document, 10 contents, 6 print action, 4 compiled CSS/retained-page cases).

Fresh model (7), SEO library (61, including 8 offer tests) and sitemap (6) results were reused. The feature typecheck passed. Formatting-only adjustments to two new SEO tests do not change the test assertions and did not cause an unrelated rerun.

Narrow validation checked 21 feature/spec Markdown documents plus this feature's additions in 5 shared docs, their local link/anchor targets, all 16 scenario rows, all 23 new code/test/CSS files and the original source fingerprint. Formatting, import boundaries and source completeness passed. The changed-path `git diff --check` passed. Final status/link records are checked again after this documentation-only closure.

## Limits

No running app, browser, manual/visual check, real print preview, HTTP response inspection, production build, E2E, whole app suite or deployment was performed. Component mocks/source review do not prove browser geometry, actual printed page breaks or production HTTP metadata. Those checks require their separate repository authorization.

## CSS module validation

Final retained-page regression: installed Next 16.4.3 layout-router preserves inactive segments in hidden React Activity trees. A root-presence guard alone incorrectly selected the shop frame and cached offer while another route was active. The selectors now exclude hidden hosts and ancestors ([hidden] and normalized/compact inline display:none).

`node node_modules/vitest/vitest.mjs run --config libs/site/content/ui/vite.config.mts src/lib/public-offer/public-offer-print-styles.spec.ts`: valid Red 3 failed / 1 passed; Green exit 0, 4 tests passed. This test uses the installed Next pure/local and scope transforms, then matches their actual compiled selectors against active and hidden-page DOM. Top-level lists use the PostCSS comma parser, including commas inside :not(). The earlier inline pure-transform check is superseded by this repeatable regression.

Final integrated UI after the Activity correction: exit 0, 4 files / 28 tests passed. The narrow link/format/source validation also passed: 21 feature/spec Markdown documents, additions in 5 shared docs, 91 local links/anchors, 16 scenario records and 23 new feature files. No browser or app server was started.

## Architecture audit follow-up

The requested [architecture audit](../code-audit/audit.md) verified AF-001–AF-003. Import hygiene/current-state documentation were corrected, and contents observation is now scoped by a local ref to its owning document. Final affected verification: 4 files / 29 UI tests, scoped lint and seven spec typechecks passed. Earlier 28-test counts above describe the original implementation checkpoint; the audit evidence is current.
