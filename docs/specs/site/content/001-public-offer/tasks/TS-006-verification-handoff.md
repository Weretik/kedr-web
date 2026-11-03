# TS-006 — Acceptance evidence and documentation

- **Status:** verified.
- **Covers:** SC-001–SC-016.
- **Depends on:** TS-003, TS-004, TS-005.
- **Test level:** documentation plus final affected automated/source evidence.
- **Architecture baseline:** [frontend design](../design/frontend.md), [delivery rules](../../../../../standards/shared/delivery-rules.md) and [testing rules](../../../../../standards/shared/testing-rules.md); no AF/EN prerequisite.

## Exact paths

- `docs/features/site/public-offer.md`
- `docs/features/README.md`
- `docs/specs/README.md`
- `docs/architecture/site/structure/modules.md`
- `docs/architecture/site/platform/seo-architecture.md`
- `docs/specs/site/migration/README.md`
- `docs/specs/site/content/001-public-offer/traceability.md`
- `docs/specs/site/content/001-public-offer/checklist/delivery-readiness.md`
- `docs/specs/site/content/001-public-offer/tasks/TS-006-verification-handoff.md`

## Work

- [x] Compare the planned file-role map to the final feature files and public imports; verify local server/client boundaries and the complete frozen-source contract, including the final note.
- [x] Review light/dark tokens, 360/390/768/1440px rules, sticky-header offsets, keyboard semantics, mobile disclosure and page-scoped print selectors in source. Separate source evidence from actual browser/print behavior.
- [x] Use the focused commands already recorded by the implementation tasks. Repeat or broaden only for final changes, failures or a specific uncovered risk; do not rerun a passing target for documentation edits.
- [x] Create the actual feature card with a Mermaid structure diagram, real file tree, source/state flow and focused test commands. Add the implemented-catalog row and narrowly update architecture, migration progress and SDD status.
- [x] Record every scenario's evidence and remaining limit in traceability and delivery checklist. Browser/manual/visual/print-preview/HTTP/build checks remain unrun unless specifically authorized; listing a command here does not authorize execution.
- [x] Check changed documentation links/formatting and diff. Do not mark another content page or all migration step 6 complete.
- [x] Check the changed implementation files for cohesive responsibility; split independent copy/mapping/rendering/browser lifecycle where needed within existing boundaries. Do not split a cohesive file just for its line count. Record the local keep/split decision.

## Evidence

Coordinator TS-006 completed at the repository's automated/source verification scope.

- Final integrated UI command: `node node_modules/nx/dist/bin/nx.js run site-content-ui:vite:test --output-style=static -- --run src/lib/public-offer/`; exit 0, 4 files / 28 tests (8 document, 10 contents, 6 print action, 4 retained-page CSS cases), cache skipped.
- Fresh package evidence reused without redundant reruns: model 7 tests; content SEO library 61 tests including 8 offer tests; sitemap 6 tests. Feature typecheck passed.
- Planned/actual file map compared: 23 new code/test/CSS files, with 15 production TS/TSX files. Literal data, mapping, server rendering, browser lifecycle, print and metadata remain separate. Public aliases/tags/boundary rules were reused without configuration change.
- Source import/structure check found no runtime Angular/Storefront/docs import, client legal-body boundary or disallowed SEO dependency. XSS-sensitive content is plain JSX text; JSON-LD uses the existing escaping component. Interactive props remain narrow and no API/personal-state flow was added.
- Light/dark, locale, 360/390/768/1440px layout rules, header offsets, focus/reduced-motion and print isolation were reviewed against source. Controlled component mocks are not real viewport/print-preview evidence.
- Actual feature card/catalog, module/SEO documentation, partial migration progress and SDD/index/traceability are updated. Other worktree changes, exports and sitemap descriptors were retained.
- Documentation/format validation: 21 feature/spec Markdown documents plus the public-offer additions in 5 shared docs; 91 local targets/anchors checked. All 23 new feature files pass Prettier. Source baseline fingerprint matches both complete source documents.
- `git diff --check` for the changed feature/integration/docs paths passed after removal of an EOF blank introduced by the migration note. A later docs-only status/evidence update does not change application test conclusions.
- Red-first is n/a for this documentation/integration-review task; replacement evidence is the focused final UI check, source/import review, links/format and diff checks.
- Browser/manual/visual/real-print-preview/HTTP/production build/E2E/whole app tests and deployment remain unrun. No actual browser geometry or printed page count is claimed.

## Checkpoint

Every in-scope scenario has specific evidence or an explicit unresolved limit, actual architecture docs match the code, and the report distinguishes automated/source results from unrun runtime checks.

The retained-Activity print issue was found and resolved within TS-004 / SC-013 with a new four-case CSS/DOM regression. Final combined UI after this correction is recorded in verification/implementation.md.
