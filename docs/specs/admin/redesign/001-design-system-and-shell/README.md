# 001 — Redesign: design system and shell

- **Client:** React Admin (`apps/admin`)
- **Domain:** core / shell, app theme
- **Status:** implemented; targeted checks are listed in [traceability](traceability.md)
- **Verified baseline:** 2026-10-25

First stage of the full Admin redesign. The product owner chose direction A «Кедровий ліс» from the [concept canvas](https://claude.ai/artifact/3zFMpNFF4cNAL56csqFUPY) on 2026-10-25: keep all functionality and the brand colors, replace the visual style. This stage delivers the theme (design system) and the shell; tables, detail pages, and the dashboard follow in later stages under the same design system.

- [Requirements and scenarios](requirements/behavior.md)
- [Frontend design](design/frontend.md)
- [Tasks](tasks/README.md)
- [Traceability](traceability.md)
- Standard: [Admin design system «Кедровий ліс»](../../../../standards/admin/design-system.md)

## Planned later stages

| Stage | Scope                                                 |
| ----- | ----------------------------------------------------- |
| 002   | Tables and lists: products, customers, orders, drafts |
| 003   | Detail pages, forms, dialogs                          |
| 004   | Dashboard                                             |
| 005   | Motion polish, states, documentation pass             |

Each stage gets its own SDD in this directory when it starts.
