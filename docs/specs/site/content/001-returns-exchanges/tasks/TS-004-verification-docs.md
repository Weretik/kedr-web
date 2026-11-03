# TS-004 — Integration and documentation

- **Covers:** all scenarios through final evidence.
- **Depends on:** TS-002, TS-003.
- **Paths:** docs/features/site/returns-exchanges.md, docs/features/README.md, docs/specs/README.md, docs/architecture/site/structure/modules.md, docs/architecture/site/platform/seo-architecture.md, this SDD.
- **Test level:** focused content project tests, architecture boundaries, narrow type/config check, documentation links/diff.
- **Work:** compare actual map to plan; integrate implementation packages; update actual feature card and indices; record only performed checks. Preserve pre-existing working tree changes.
- **Evidence:** implemented. Independent changed-area source review found no material issue; see verification/local-review.md. Architecture boundary check passed for 102 projects. Narrow feature and SEO tsc checks exited 0. Feature card, indices, module map and SEO architecture updated; actual map agrees with design. Metadata/sitemap/UI evidence is linked from TS-002/TS-003. Final npm run docs:check passed: 510 Markdown files; task-scoped git diff --check exited 0.
- **Checkpoint:** focused tests and changed boundaries pass; documentation reflects actual code; unrun browser/build/HTML checks explicitly stated.
- **Exception:** documentation has no behavioral Red.
