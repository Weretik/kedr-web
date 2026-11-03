# TS-007 — Audit corrections

- **Status:** verified.
- **Covers:** AF-001, AF-002; existing UI scenarios retain their existing regression protection.
- **Depends on:** TS-006.
- **Test level:** scoped lint, selected-root test TypeScript, existing UI component/CSS regression and documentation.

## Exact paths

- `libs/site/content/ui/src/lib/public-offer/public-offer-content.tsx`
- `libs/site/content/ui/src/lib/public-offer/public-offer-print-styles.spec.ts`
- `docs/specs/site/content/001-public-offer/README.md`
- `docs/specs/site/content/001-public-offer/design/accepted-concept.md`
- `docs/specs/site/content/001-public-offer/code-audit/audit.md`
- `docs/specs/site/content/001-public-offer/tasks/README.md`
- `docs/specs/site/content/001-public-offer/traceability.md`
- `docs/features/site/public-offer.md`

## Work

- [x] Correct the three configured import-order/grouping errors in the two feature files.
- [x] Distinguish the captured starting state and concept acceptance from current implemented/authorized status.
- [x] Recheck the actual dependency boundaries and confirm the keep/split decisions against the accepted file-role map.
- [x] Run scoped lint and the affected UI regression; retain the complete source document and existing behavior.
- [x] Update audit statuses, feature card, task navigation and traceability; check changed links/diff.
- [x] Review changed files for cohesive responsibility; retain the already separated server/client/copy/print roles.

## Evidence

AF-001/AF-002 verified. Scoped lint goes from three import errors to exit 0. Starting-state wording and later authorization match the existing route/descriptor. Changed links/format/diff pass; all seven spec roots typecheck without diagnostics. The final affected UI run after the separate TS-008 correction passes 4 files / 29 tests. See the [audit](../code-audit/audit.md#final-result) for exact scope/commands. Import/documentation corrections are nonbehavioral, so artificial business Red is n/a.

## Checkpoint

Both low findings are verified with fresh scoped evidence; no high/medium or unresolved in-scope finding remains. No unnecessary component split, package, project, API or shared configuration change is introduced.
