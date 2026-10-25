# Tasks

1. **TS-001 — Shared UI lib.** Create `admin-shared-ui` with `StatusPill`, `DataGridMessageOverlay`, `AdminPageHeader`, and the `@admin/shared/ui` path. Covers R-002, R-006. Depends on: 001. Test level: component. Evidence: `shared-ui.spec.tsx` 4/4.
2. **TS-002 — Grid theme.** Add Data Grid and tab overrides to the app theme; remove duplicated grid `sx` from products, customers, and orders. Covers R-001. Depends on: none. Test level: typecheck and regression of grid specs.
3. **TS-003 — Product cells.** Boolean pills, photo tile, name weight, add action. Covers R-003, R-005; SC-001. Depends on: TS-001. Test level: component. Evidence: `products-data-grid.spec.tsx` (failed first on pill text, then passed).
4. **TS-004 — Overlays.** Use the shared overlay in products, customers, orders, and drafts. Covers R-002; SC-002. Depends on: TS-001. Test level: component. Evidence: `customers-data-grid.spec.tsx`, `order-list-grid.spec.tsx`.
5. **TS-005 — 1C status.** `OrderStatusChip` in the order list and details. Covers R-004; SC-003; carries the status part of orders TS-015 (the Kyiv time zone part stays open there). Depends on: TS-001. Test level: unit/component. Evidence: `order-status-chip.spec.tsx` (8 codes), `order-list-grid.spec.tsx` (failed first on the label, then passed).
6. **TS-006 — List headers.** `AdminPageHeader` on products, customers, and orders. Covers R-006; SC-004. Depends on: TS-001. Test level: feature regression.
7. **TS-007 — Documentation.** Update the design system standard, feature cards, and specification index. Depends on: TS-001–TS-006.
