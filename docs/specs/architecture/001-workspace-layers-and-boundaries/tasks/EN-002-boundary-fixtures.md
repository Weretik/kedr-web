# EN-002 — Executable module-boundary fixtures

- **Enables:** RM-001
- **Depends on:** RM-000
- **Owner:** workspace tooling
- **Exact paths:** `eslint.config.cjs`; new boundary fixture/check under `tools/`
  or repository-approved lint test location; affected `project.json`

## Work

- [x] Prove allowed app/feature/data/model/ui/shared imports.
- [x] Prove rejection of core→domain, model→other-domain/framework and feature→feature.
- [x] Cover explicit cross-domain lower-layer orchestration without broad bypass.

## Evidence

- Replacement: `npm run architecture:boundaries:fixtures` passes five positive and
  negative rule cases.

## Checkpoint

RM-001 can change constraints without relying on manual graph interpretation.
