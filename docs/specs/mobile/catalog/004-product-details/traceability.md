# Mobile product details — traceability

| Scenario | Rules        | Tasks/enablers         | Test level                    | Planned tests                                                             | Evidence                                                                | Status   |
| -------- | ------------ | ---------------------- | ----------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------- |
| SC-001   | R-001        | TS-003, TS-007         | integration                   | `start-route.spec.tsx::opens the selected catalog slug`                   | [TS-003](tasks/navigation/TS-003-product-detail-navigation.md#evidence) | verified |
| SC-002   | R-002        | TS-003, TS-008         | integration/manual            | root Stack preserves mounted catalog; physical Back/anchor check deferred | [TS-008](tasks/verification/TS-008-device-visual-qa.md#evidence)        | deferred |
| SC-003   | R-003        | TS-001, TS-002, TS-005 | unit/component                | `product-details-view.spec.tsx::shows all public contract data`           | [TS-005](tasks/ui/TS-005-product-detail-screen.md#evidence)             | verified |
| SC-004   | R-004        | EN-002, TS-004         | component/manual              | `product-image-gallery.spec.tsx::uses the carousel`                       | [TS-004](tasks/ui/TS-004-product-image-gallery.md#evidence)             | verified |
| SC-005   | R-004, R-005 | TS-001, TS-004         | unit/component                | gallery specs remove one/all failed frames and fall back                  | [TS-004](tasks/ui/TS-004-product-image-gallery.md#evidence)             | verified |
| SC-006   | R-005        | TS-002, TS-005         | component                     | `product-details-screen.spec.tsx::shows loading`                          | [TS-005](tasks/ui/TS-005-product-detail-screen.md#evidence)             | verified |
| SC-007   | R-005        | TS-002, TS-005         | focused integration/component | `product-details-screen.spec.tsx::shows not found`                        | [TS-005](tasks/ui/TS-005-product-detail-screen.md#evidence)             | verified |
| SC-008   | R-005        | TS-002, TS-005         | focused integration/component | `product-details-screen.spec.tsx::retries a transport error`              | [TS-005](tasks/ui/TS-005-product-detail-screen.md#evidence)             | verified |
| SC-009   | R-005        | TS-002, TS-005, TS-008 | component/manual              | offline component state verified; physical reconnection deferred          | [TS-008](tasks/verification/TS-008-device-visual-qa.md#evidence)        | deferred |
| SC-010   | R-006        | EN-001, TS-006         | unit/component                | cart model increments; screen adds and confirms one unit                  | [TS-006](tasks/cart/TS-006-add-product-to-cart.md#evidence)             | verified |
| SC-011   | R-007        | EN-001, TS-005, TS-006 | unit/component                | screen spec disables null-price and zero-stock actions                    | [TS-006](tasks/cart/TS-006-add-product-to-cart.md#evidence)             | verified |
| SC-012   | R-001, R-005 | TS-003, TS-005         | integration/component         | invalid slug is skipped; array route parameter is normalized              | [TS-003](tasks/navigation/TS-003-product-detail-navigation.md#evidence) | verified |

No Mobile E2E target exists. Device evidence is recorded in `TS-008`; it must
not be relabeled as automated E2E.
