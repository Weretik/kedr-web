# Traceability

| Rules        | Scenarios | Tasks          | Evidence                                                                                                                        |
| ------------ | --------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| R-003, R-005 | SC-001    | TS-003         | `libs/admin/products/ui/src/tables/products-data-grid.spec.tsx`: «Є», «Новинка», muted «—» named «Ні»                           |
| R-002        | SC-002    | TS-001, TS-004 | `libs/admin/shared/ui/src/lib/shared-ui.spec.tsx`, `customers-data-grid.spec.tsx`, `order-list-grid.spec.tsx` (alert and retry) |
| R-004        | SC-003    | TS-005         | `libs/admin/orders/ui/src/components/order-status-chip.spec.tsx` (7 codes and unknown), `order-list-grid.spec.tsx`              |
| R-001, R-006 | SC-004    | TS-002, TS-006 | Theme code review; `shared-ui.spec.tsx` (header); feature specs for products, customers, orders still pass                      |

## Evidence 2026-10-25

- `npx vitest run --config libs/admin/<lib>/vite.config.mts` for `shared/ui` 4, `products/ui` 7, `clients/ui` 9, `orders/ui` 12, `products/feature` 14, `clients/feature` 7, `orders/feature` 12, `core/shell` 3 tests: all passed.
- `npx tsc --noEmit` for `apps/admin/tsconfig.app.json` and the lib and spec configs of the changed libs: passed.
- `npx nx run-many -t lint` for `admin`, `admin-shared-ui`, and the changed products, clients, and orders projects: passed.
- `npm run architecture:boundaries`: passed for 72 projects.

Not run: browser or visual review of themes and breakpoints (needs separate permission), full test suite, production build, E2E.
