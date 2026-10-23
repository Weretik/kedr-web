# SDD process for Admin React

Create a new feature under `docs/specs/admin/<domain>/<NNN>-<feature-slug>/` according to the [delivery rules](../../standards/shared/delivery-rules.md). Apply React-specific decisions from the [Admin architecture](README.md) in the design.

Admin-specific planning must name the actual Nx projects in `apps/admin` and `libs/admin`, boundaries among `feature/ui/data-access/model`, route impact, RTK Query boundary, browser behavior, and MUI/accessibility risks. Scenarios describe user behavior without these technical labels; technical details belong in design and `TS-*`/`EN-*`.

Choose test level and commands according to the [testing rules](../../standards/shared/testing-rules.md), and readiness and completion according to the [delivery rules](../../standards/shared/delivery-rules.md). Migrate existing Admin specifications gradually without renumbering completed phases or rewriting evidence.
