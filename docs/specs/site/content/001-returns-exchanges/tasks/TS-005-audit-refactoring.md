# TS-005 — Audit and responsibility refactoring

- **Covers:** AF-001…AF-004; preserves SC-001…SC-010.
- **Depends on:** TS-001…TS-004 completed.
- **Paths:** returns dictionary, summary copy and policy mapping in content/model; header/contact/composition in content/ui; model generator configuration; relevant tests/docs.
- **Test level:** existing component baseline/regression, source-policy invariant, source/test types, focused lint and module boundaries.
- **Work:** separate literal copy, typed mapping and assembly; separate header from content and contact panel from notes; trim generated model config; correct import grouping.
- **Evidence:** baseline UI command passed 8 tests. Final regression: 8 UI tests and 2 policy completeness tests passed. Targeted ESLint exit 0; source/test tsc for model/ui/seo/feature and feature source tsc exit 0; boundary check passed for 102 projects. AF-001…AF-004 verified. See code-audit/audit.md for exact commands and final structure review.
- **Checkpoint:** all in-scope findings verified; existing behavior and exact policy retained.
- **Exception:** structural refactoring needs no artificial behavioral Red; existing tests fix observable behavior before moves.
- Documentation checkpoint: check-markdown validated 512 Markdown files; scoped git diff --check exited 0.
