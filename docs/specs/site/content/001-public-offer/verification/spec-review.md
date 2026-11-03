# Specification review

- **Date:** 2026-11-03.
- **Scope:** SDD and captured approved design for `apps/site`, public-offer only.
- **Application implementation:** not started.

## Baseline evidence

Repository/app instructions and accepted design were reused from this chat. Read the current content feature example, delivery/testing rules, relevant module/SEO/rendering docs, four content project/public-index/test configs and direct legal source dependencies. No broad code audit was performed.

Resolved Nx projects with installed Nx 24 entry point, daemon disabled: `site-content-model`, `site-content-ui`, `site-content-seo`, `site-content-feature`. Each exposes `vite:test`, `typecheck` and `lint`; model/UI/SEO/feature tags match their documented roles. This is configuration evidence, not test execution.

Package-lock baseline: Next 16.4.3, React 19.3.0, Tailwind 4.3.3, lucide-react 1.66.0. Matching installed Next layout/page and caching guides were consulted.

## Independent review

The second agent checked the actual Angular template and translations. It confirmed:

- seven sections, 18 numbered paragraphs and the final note are rendered;
- both source languages and configured contact values;
- existing legal links, absent Site offer route and the currently expanded sitemap;
- language switching preserves page path but does not promise section hash;
- the source privacy card is navigation and the privacy page itself remains a separate migration scope.

## Final specification result

Independent SDD review found no material inconsistency or unresolved product blocker. Requirements, source baseline, server/client boundaries, native contents, print isolation, privacy scope, SEO and the R → SC → TS chain agree. The reviewer requested completing this evidence record before handoff; that editorial note is resolved.

Narrow documentation validation passed:

- 20 Markdown files checked (19 new SDD documents plus the specification index).
- 114 local link targets/anchors verified; no missing targets, empty documents or trailing whitespace.
- 10 rules, 16 unique scenarios and 6 task files checked; every scenario has task coverage and a traceability row.
- Both source baselines have seven sections, 18 numbered paragraphs and the final note. The source SHA256 matches `b5f2188e225b7173b685add0d3b9c77e4fb04f08f02577ba7a823397d06279a4`.
- Copied approved PNG and exact imagegen prompt match their originals by SHA256.
- The specification index was compared to its pre-edit text: exactly one new row was inserted and all existing content was preserved.
- `git diff --check -- docs/specs/README.md docs/specs/site/content/001-public-offer` completed with exit code 0. New untracked Markdown files were also checked directly by the narrow documentation validator.

The changed links/formatting and final evidence record were checked after the documentation edit. No application test, browser, manual app/print preview, HTTP server, production build or deployment was run. No runtime scenario is marked verified. Implementation tasks remain ready/planned, as appropriate.
