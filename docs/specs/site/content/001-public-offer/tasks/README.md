# Task graph

Implementation tasks TS-001–TS-006 are verified at their documented automated/source scope. Audit follow-ups TS-007/TS-008 are verified as well. No shared EN prerequisite was needed; browser/HTTP/build/actual-print checks remain unrun.

| Task                                     | One responsibility                                       | Covers                                                         | Depends on                                      | Status   |
| ---------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- | -------- |
| [TS-001](TS-001-source-model.md)         | Complete typed source document                           | SC-002                                                         | none                                            | verified |
| [TS-002](TS-002-document-ui.md)          | Semantic responsive document and contact UI              | SC-001, SC-002, SC-003, SC-005, SC-006, SC-007, SC-012, SC-013 | TS-001                                          | verified |
| [TS-003](TS-003-contents-navigation.md)  | Current-section enhancement of native contents           | SC-003, SC-004, SC-005, SC-006, SC-007                         | TS-002                                          | verified |
| [TS-004](TS-004-print.md)                | Browser print action and isolated print output           | SC-009, SC-010, SC-011, SC-013                                 | TS-002                                          | verified |
| [TS-005](TS-005-route-seo.md)            | Localized route discovery integration                    | SC-001, SC-008, SC-014, SC-015, SC-016                         | TS-001; TS-002 before feature/route composition | verified |
| [TS-006](TS-006-verification-handoff.md) | Focused acceptance evidence and actual architecture docs | SC-001–SC-016                                                  | TS-003, TS-004, TS-005                          | verified |

TS-003 and TS-004 may proceed independently after TS-002: contents files and print/header files have different owners. TS-005 metadata tests can start after TS-001; route integration waits for TS-002. Coordinate additive edits to shared index files and sitemap; never overwrite exports or other pages' entries.

Follow [testing scope](../../../../../standards/shared/testing-rules.md): tests prove the behavior changed by each task. Listed commands are scoped options, not permission for broad suites/builds/browser checks. Record Red → Green → refactor → final affected regression where applicable; detailed results stay in the task's Evidence section. End each task with a bounded responsibility check, not a full audit.

## Focused command patterns

Run from repository root, only for the current changed responsibility:

- Model: `npx nx run site-content-model:vite:test -- --run src/lib/public-offer/public-offer-dictionary.spec.ts`.
- Document: `npx nx run site-content-ui:vite:test -- --run src/lib/public-offer/public-offer-content.spec.tsx`.
- Contents: `npx nx run site-content-ui:vite:test -- --run src/lib/public-offer/public-offer-toc.spec.tsx`.
- Print: `npx nx run site-content-ui:vite:test -- --run src/lib/public-offer/public-offer-print-button.spec.tsx`.
- Metadata/breadcrumbs: `npx nx run site-content-seo:vite:test -- --run src/lib/public-offer-metadata.spec.ts src/lib/public-offer-json-ld.spec.ts`.
- Sitemap: `npx nx run site-content-feature:vite:test -- --run src/lib/content-sitemap.spec.ts`.

Nx resolved all four projects and these target names during SDD preparation. Test files for this page are planned, not already present. For a specific uncovered typing risk, use the affected project's existing typecheck target. No root test-script/config update is needed.

## Architecture audit follow-up

| Task                                      | Responsibility                                                 | Covers                 | Depends on | Status   |
| ----------------------------------------- | -------------------------------------------------------------- | ---------------------- | ---------- | -------- |
| [TS-007](TS-007-audit-corrections.md)     | Scoped import-rule and current-state documentation corrections | AF-001, AF-002         | TS-006     | verified |
| [TS-008](TS-008-dom-observation-scope.md) | Scope current-section observation to its owning page           | AF-003, SC-004, SC-006 | TS-006     | verified |
