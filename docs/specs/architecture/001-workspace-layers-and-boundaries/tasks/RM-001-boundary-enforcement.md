# RM-001 — Enforce the dependency matrix

- **Findings:** AF-001
- **Requirements:** AR-001, AR-002
- **Depends on:** EN-002
- **Owner:** workspace tooling
- **Exact paths:** `eslint.config.cjs`; `apps/storefront/project.json`; affected
  `apps/**/project.json`, `libs/**/project.json`; boundary fixture/check

## Before evidence

Current lint passes while graph contains core/domain and cross-domain model edges.

## Work

- [x] Add missing app/model/core/domain enforcement and explicit flow exceptions.
- [x] Normalize only project tags/names required for an unambiguous matrix.
- [x] Keep positive imports passing; reject each negative fixture.

## Verification

Boundary fixture/check; `npx nx run-many -t lint --all`; regenerated graph review.

## Checkpoint

AF-001 becomes verified when config rejects every forbidden direction and all
current allowed edges are explicit.
