# admin-shared-ui

Presentational building blocks shared by Admin domains, styled only through the Admin theme. See the [Admin design system](../../../../docs/standards/admin/design-system.md).

- `StatusPill` — status label with a soft tone background and a dot.
- `DataGridMessageOverlay` — empty or error state for MUI X Data Grid, with an optional retry.
- `AdminPageHeader` — list page `h1` and actions.
- `AdminDetailHeader`, `SectionCard`, `DetailField`, `DetailFieldList`, `PageLoader` — detail page parts.

Run `npx vitest run --config libs/admin/shared/ui/vite.config.mts` for unit tests.
