# 001 — Redesign: design system «Пагін»

- **Client:** Mobile React Native (`apps/mobile`, `libs/mobile/*`)
- **Domain:** core / shell theme, shared UI, all screens
- **Status:** implemented (stages 1–6 and docs sync); deferred items listed in [tasks](tasks/README.md)
- **Verified baseline:** 2026-10-26

The product owner asked for a full redesign of the manager app: the current design is hard to read and some components break. On 2026-10-26 they chose direction C «Пагін» from the [concept page](https://claude.ai/artifact/Bt5JEczChkmo4dsAJWWzDL): keep all functionality and the brand colors (`#3FA435`, `#0F110F`), replace the visual style and the components that break. This SDD fixes the design rules and the rollout plan; the owner asked to document first and implement later, then approved the implementation the same day.

- [Requirements and scenarios](requirements/behavior.md)
- [Frontend design](design/frontend.md)
- [Tasks](tasks/README.md)
- [Traceability](traceability.md)
- Standard: [Mobile design system «Пагін»](../../../../standards/mobile/design-system.md)

## Rollout stages

Each stage is one PR and is merged only on the owner's OK.

| Stage | Scope                                                                                                             |
| ----- | ----------------------------------------------------------------------------------------------------------------- |
| 1     | Theme tokens, fonts, `useKedrTheme`, `@mobile/shared/ui` base (StatusPill, QuantityStepper, StateView, KedrSheet) |
| 2     | Shell: pill tab bar, hero and screen headers, theme choice moved to profile                                       |
| 3     | Catalog: hero search, category rail, filter chips, product tiles, filters and sort sheets                         |
| 4     | Product detail: stage, gallery, variant chips, action bar                                                         |
| 5     | Cart and checkout: total card, line items, customer selection, checkout sheet                                     |
| 6     | Orders: bento summary, order rows, order detail                                                                   |
| 7     | Motion polish, reduced motion, states pass, documentation sync                                                    |
