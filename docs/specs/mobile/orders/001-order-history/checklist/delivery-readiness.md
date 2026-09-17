# Delivery readiness

- [x] All in-scope `SC-*` have automated evidence or explicit device-QA ownership.
- [x] `EN-001` proves the anonymous provider contract and clean generation.
- [x] Orders/customers Nx boundaries and targets are verified after generation.
- [ ] All required `TS-*`/`EN-*` checkpoints passed (TS-010 device rows pending).
- [x] New behavior has Red → Green → Refactor → Regression evidence.
- [x] Contracts, consumer projection, documentation and implementation agree.
- [x] Changed implementation files retain one cohesive responsibility.
- [x] Generated transport types remain inside data-access boundaries.
- [x] Affected lint/test, Mobile test/typecheck/export and contract checks passed.
- [x] Android/iOS/web status is recorded without claiming Mobile E2E.
- [x] `traceability.md` links actual tests and task evidence.
- [x] Unfinished checks have an exact blocker and owner.
- [x] Residual risks and differences from the reference are recorded.
- [x] Unrelated working-tree changes are preserved.

The feature-scoped Markdown format check passes. The repository-wide format
check still reports 15 unrelated files outside this feature; they were not
rewritten in the existing dirty worktree.
