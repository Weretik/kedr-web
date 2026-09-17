# Mobile product details — task graph

## Planning phases

- [00 — Readiness](00-readiness.md)
- [02 — State and data](02-state-and-data.md)
- [04 — React Native UI](04-react-native-ui.md)
- [06 — Navigation and platform](06-navigation-and-platform.md)
- [07 — API integration](07-api-integration.md)
- [08 — Verification](08-verification.md)

## Task index

| ID     | Responsibility                                  | Covers/enables                        | Depends on     | File                                                   | Status   |
| ------ | ----------------------------------------------- | ------------------------------------- | -------------- | ------------------------------------------------------ | -------- |
| EN-001 | Minimal persistent Mobile cart boundary         | SC-010, SC-011                        | none           | [task](enablers/EN-001-mobile-cart-boundary.md)        | done     |
| EN-002 | Expo-compatible image/gallery packages          | SC-004–SC-006                         | none           | [task](enablers/EN-002-image-gallery-packages.md)      | done     |
| TS-001 | Product detail transport validation and mapping | SC-003, SC-005, SC-007–SC-009         | none           | [task](api/TS-001-product-detail-contract.md)          | done     |
| TS-002 | Product detail query orchestration and states   | SC-003, SC-006–SC-009                 | TS-001         | [task](api/TS-002-product-detail-query.md)             | done     |
| TS-003 | Catalog-to-detail navigation and restoration    | SC-001, SC-002, SC-012                | none           | [task](navigation/TS-003-product-detail-navigation.md) | done     |
| TS-004 | Remote image gallery and fallback               | SC-004, SC-005                        | EN-002, TS-001 | [task](ui/TS-004-product-image-gallery.md)             | done     |
| TS-005 | Product detail content and page states          | SC-003, SC-006–SC-009, SC-011, SC-012 | TS-002, TS-004 | [task](ui/TS-005-product-detail-screen.md)             | done     |
| TS-006 | Add-to-cart action and confirmation             | SC-010, SC-011                        | EN-001, TS-005 | [task](cart/TS-006-add-product-to-cart.md)             | done     |
| TS-007 | Route and component acceptance coverage         | SC-001–SC-012                         | TS-003–TS-006  | [task](verification/TS-007-acceptance-tests.md)        | done     |
| TS-008 | Device and visual verification                  | SC-002–SC-011                         | TS-007         | [task](verification/TS-008-device-visual-qa.md)        | deferred |

Tasks execute by dependency order. Each task owns one responsibility and stores
its own Red/Green/Refactor/Regression or enabler replacement evidence.
