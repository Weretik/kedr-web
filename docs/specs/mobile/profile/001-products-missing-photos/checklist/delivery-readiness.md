# Delivery readiness

- [x] All in-scope `SC-*` are verified or explicitly pending device evidence.
- [ ] EN-001 and all required `TS-*` have passed their checkpoints.
- [x] New behavior has Red → Green → Refactor → Regression evidence.
- [x] Contract, documentation and implementation agree.
- [x] Final code audit has no open in-scope finding.
- [x] Changed implementation files have cohesive responsibilities.
- [ ] `npm run contracts:check` passes and generated types remain private to
      data-access.
- [ ] Relevant lint, typecheck, test, architecture and export targets pass.
- [x] Required Android/iOS/web checks have evidence or explicit owner/blocker.
- [x] `traceability.md` links actual tests and evidence.
- [x] Residual risks and unavailable checks are recorded.
- [x] Graph, aliases/barrels, forbidden transport/DTO/deep-import and dead-path
      searches were repeated after the last change.
- [x] Unrelated working-tree changes were preserved.
