# Frontend design

## File roles

| Path                                                                                                                                                                                           | Status  | Role                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------- |
| `libs/admin/shared/ui/` (`admin-shared-ui`, tags `scope:admin`, `scope:admin-shared`, `type:ui`)                                                                                               | new     | Presentational parts shared by Admin domains                              |
| `libs/admin/shared/ui/src/lib/status-pill.tsx`                                                                                                                                                 | new     | `StatusPill`: label with tone background and dot                          |
| `libs/admin/shared/ui/src/lib/data-grid-message-overlay.tsx`                                                                                                                                   | new     | `DataGridMessageOverlay`: empty or error overlay with optional retry      |
| `libs/admin/shared/ui/src/lib/admin-page-header.tsx`                                                                                                                                           | new     | `AdminPageHeader`: list page `h1` and actions                             |
| `apps/admin/src/app/theme/components.ts`                                                                                                                                                       | changed | `MuiDataGrid`, `MuiTabs`, `MuiTab` overrides                              |
| `libs/admin/products/ui/src/tables/cells/`                                                                                                                                                     | changed | Boolean pills, photo tile, name weight, add action                        |
| `libs/admin/products/ui/src/tables/products-data-grid.tsx`, `libs/admin/clients/ui/src/tables/customers-data-grid.tsx`                                                                         | changed | Shared overlay; local grid `sx` removed                                   |
| `libs/admin/products/ui/src/states/*`, `libs/admin/clients/ui/src/tables/customers-grid-message.tsx`                                                                                           | removed | Replaced by the shared overlay                                            |
| `libs/admin/orders/ui/src/components/order-status-chip.tsx`                                                                                                                                    | new     | 1C code → label and tone, per orders R-021                                |
| `libs/admin/orders/ui/src/tables/order-list-grid.tsx`, `libs/admin/orders/ui/src/details/order-document-view.tsx`                                                                              | changed | Status chip; error and empty overlays instead of the alert above the grid |
| `libs/admin/products/feature/src/components/products-page-toolbar.tsx`, `libs/admin/clients/feature/src/pages/customers-page.tsx`, `libs/admin/orders/feature/src/components/order-tables.tsx` | changed | `AdminPageHeader`                                                         |

## Decisions

- A shared lib, not copies per domain: `scope:admin-shared` is already allowed for every Admin domain by the module boundary rules, and the parts hold no domain data.
- Grid styling moves into the theme so later lists get it without local `sx`. Phone pagination uses `theme.breakpoints` inside the override.
- Cell focus keeps an outline on `:focus` (now brand colored) so keyboard navigation inside the grid stays visible.
- The 1C mapping follows the existing orders specification instead of the Mobile vocabulary, so list and details use the labels already agreed for Admin.
