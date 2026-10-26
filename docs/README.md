# Kedr Web documentation

This directory contains versioned engineering documentation for Kedr Web frontend applications. Documentation is maintained as docs-as-code alongside code changes.

## Frontend SDD

- Architecture describes the actual topology of frontend applications, modules, and layer boundaries; choose the relevant client below.
- [Current frontend inventory](architecture/frontend-inventory.md) — apps, Nx projects/tags/targets, aliases, test gates, and known baseline gaps.
- [Technology and direct npm packages](architecture/technology-and-packages.md) — versions, purposes, and dependency sources.
- [Engineering rules](standards/README.md) — rules index for Admin, Mobile, UI, API, testing, and delivery.
- [Specifications](specs/README.md) — feature specification structure and SDD templates.
- [Implemented feature catalog](features/README.md) — index by application and brief architecture maps for each feature.
- [Feature ideas](ideas/feature-ideas.md) — audit findings and candidate features, not yet accepted.
- [Workspace architecture remediation](specs/architecture/001-workspace-layers-and-boundaries/README.md) — a proposed plan to address confirmed systemic violations.

## Applications

- [Admin](architecture/admin/README.md) — administration application architecture.
- [Mobile](architecture/mobile/README.md) — React Native and Expo mobile application architecture.
- [Storefront](architecture/storefront/README.md) — storefront application architecture.
- [API](architecture/api/README.md) — API contracts and integration agreements.
- [Frontend API contracts](contracts/README.md) — register of operations and frontend projections of backend OpenAPI contracts.

## Placement principle

Stable rules belong in `architecture/` or `standards/`. Decisions, requirements, contracts, tasks, and verification evidence for a specific feature belong in its `specs/` directory.

Before changing Admin or Mobile, read the [AI instructions](../AGENTS.md).
