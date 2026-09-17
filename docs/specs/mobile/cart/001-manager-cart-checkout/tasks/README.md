# Mobile manager cart checkout — task graph

## Planning phases

- [00 — Readiness](00-readiness.md)
- [02 — State and data](02-state-and-data.md)
- [04 — React Native UI](04-react-native-ui.md)
- [06 — Navigation and platform](06-navigation-and-platform.md)
- [07 — API integration](07-api-integration.md)
- [08 — Verification](08-verification.md)

## Task index

| ID     | Responsibility                                | Covers/enables                         | Depends on             | File                                           | Status   |
| ------ | --------------------------------------------- | -------------------------------------- | ---------------------- | ---------------------------------------------- | -------- |
| EN-001 | Refresh Sales OpenAPI and consumer projection | SC-006–SC-013                          | none                   | [task](enablers/EN-001-sales-contract-sync.md) | complete |
| EN-002 | Generate the cart UI library boundary         | SC-002–SC-013                          | none                   | [task](enablers/EN-002-cart-ui-library.md)     | complete |
| TS-001 | Cart mutations, totals and stock boundary     | SC-003–SC-005                          | none                   | [task](model/TS-001-cart-calculations.md)      | complete |
| TS-002 | Persistent cart lifecycle and cleanup         | SC-001, SC-003, SC-005, SC-012, SC-013 | TS-001                 | [task](model/TS-002-cart-persistence.md)       | complete |
| TS-003 | Customer list and local name search           | SC-006, SC-007                         | EN-001                 | [task](api/TS-003-customer-selection-data.md)  | complete |
| TS-004 | Admin order transport and idempotency         | SC-009–SC-013                          | EN-001, TS-001         | [task](api/TS-004-admin-order-create.md)       | complete |
| TS-005 | Cart screen and item interactions             | SC-002–SC-005                          | EN-002, TS-001, TS-002 | [task](ui/TS-005-cart-screen.md)               | complete |
| TS-006 | Checkout and customer selector sheets         | SC-006–SC-008                          | EN-002, TS-003         | [task](ui/TS-006-checkout-sheet.md)            | complete |
| TS-007 | Cart tab route and navigation                 | SC-001, SC-002                         | TS-005                 | [task](navigation/TS-007-cart-tab.md)          | complete |
| TS-008 | Checkout submit and success lifecycle         | SC-009–SC-013                          | TS-002, TS-004, TS-006 | [task](flow/TS-008-checkout-flow.md)           | complete |
| TS-009 | Acceptance and device/visual verification     | SC-001–SC-013                          | TS-007, TS-008         | [task](verification/TS-009-acceptance-qa.md)   | complete |

Tasks execute by `Depends on`. Phase files group work but do not impose an
additional sequence.
