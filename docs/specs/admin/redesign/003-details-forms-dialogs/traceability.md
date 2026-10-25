# Traceability

| Rules               | Scenarios | Tasks          | Evidence                                                                                                                            |
| ------------------- | --------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| R-001, R-003        | SC-001    | TS-001, TS-003 | `libs/admin/products/feature/src/pages/products-navigation.spec.tsx`: back link, card order, pills, links, preview dialog           |
| R-001, R-002, R-005 | SC-002    | TS-001, TS-004 | `customer-details-content.spec.tsx` (article and named regions), `customer-details-page.spec.tsx` (heading focus, back link, retry) |
| R-004               | SC-003    | TS-005         | `libs/admin/orders/ui/src/details/order-document-view.spec.tsx`                                                                     |
| R-006               | SC-004    | TS-002, TS-005 | `order-line-editor.spec.tsx`, `new-order-page.spec.tsx`, orders feature specs; theme code review                                    |

## Evidence 2026-10-25

- `npx vitest run --config libs/admin/<lib>/vite.config.mts` for `shared/ui` 7, `products/ui` 7, `products/feature` 14, `clients/ui` 9, `clients/feature` 7, `orders/ui` 13, `orders/feature` 12, `core/shell` 3, and `apps/admin` 4 tests: all passed.
- `npx tsc --noEmit` for the app and the changed lib and spec configs: passed.
- `npx nx run-many -t lint` for 8 affected projects: passed. `npm run architecture:boundaries`: passed.

Not run: browser or visual review of themes and breakpoints (needs separate permission), full test suite, production build, E2E.
