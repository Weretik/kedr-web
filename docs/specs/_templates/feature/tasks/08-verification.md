# Phase 08 — component, integration and E2E verification

**Purpose:** orchestrate acceptance and regression checks left after behavioral
implementation tasks.

## Planned subphases

- One `TS-*` per distinct verification responsibility.
- Add E2E only for critical journeys; missing E2E infrastructure is a scoped
  `EN-*`, never a claimed pass.
- Do not duplicate the complete scenario at every test level.
- Повторити code audit, graph, boundary lint, public/deep import, direct
  transport, generated DTO і empty/dead searches після останньої зміни.

## Exit checkpoint

Every in-scope scenario has evidence, affected regression targets are recorded,
all findings verified, and delivery readiness is complete.
