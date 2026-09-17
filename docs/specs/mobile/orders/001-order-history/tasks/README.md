# Mobile order history — task graph

## Planning phases

- [00 — Readiness](00-readiness.md)
- [01 — Shared behavior](01-shared-behavior.md)
- [02 — State and data](02-state-and-data.md)
- [04 — React Native UI](04-react-native-ui.md)
- [06 — Navigation and platform](06-navigation-and-platform.md)
- [07 — API integration](07-api-integration.md)
- [08 — Verification](08-verification.md)

## Task index

| ID     | Responsibility                                 | Covers/enables         | Depends on            | File                                                 | Status            |
| ------ | ---------------------------------------------- | ---------------------- | --------------------- | ---------------------------------------------------- | ----------------- |
| EN-001 | Refresh anonymous Sales order-read contract    | SC-001–SC-015          | none                  | [task](enablers/EN-001-sales-order-read-contract.md) | complete          |
| EN-002 | Generate Mobile orders library boundaries      | SC-001–SC-015          | none                  | [task](enablers/EN-002-orders-libraries.md)          | complete          |
| EN-003 | Generate reusable customers library boundaries | SC-003–SC-005, SC-011  | none                  | [task](enablers/EN-003-customers-libraries.md)       | complete          |
| TS-001 | Localized order presentation rules             | SC-002, SC-013         | EN-002                | [task](model/TS-001-order-presentation.md)           | complete          |
| TS-002 | Order history transport and mapping            | SC-001, SC-006–SC-010  | EN-001, EN-002        | [task](api/TS-002-order-history-query.md)            | complete          |
| TS-003 | Order detail transport and mapping             | SC-012, SC-013, SC-015 | EN-001, EN-002        | [task](api/TS-003-order-detail-query.md)             | complete          |
| TS-004 | Reusable customer selection data and sheet     | SC-003, SC-004, SC-011 | EN-001, EN-003        | [task](customers/TS-004-customer-selector.md)        | complete          |
| TS-005 | History filter, pagination and refresh state   | SC-003–SC-010, SC-012  | TS-002, TS-004        | [task](state/TS-005-order-history-controller.md)     | complete          |
| TS-006 | History list, cards and visible states         | SC-001–SC-011          | TS-001, TS-005        | [task](ui/TS-006-order-history-screen.md)            | complete          |
| TS-007 | Read-only order detail screen                  | SC-012–SC-015          | TS-001, TS-003        | [task](ui/TS-007-order-detail-screen.md)             | complete          |
| TS-008 | Orders tab registration and route              | SC-001, SC-005         | TS-006                | [task](navigation/TS-008-orders-tab.md)              | complete          |
| TS-009 | Order detail route and back navigation         | SC-005, SC-012, SC-015 | TS-007, TS-008        | [task](navigation/TS-009-order-detail-route.md)      | complete          |
| TS-010 | Acceptance, regression and device/visual QA    | SC-001–SC-015          | TS-004, TS-006–TS-009 | [task](verification/TS-010-acceptance-qa.md)         | device QA pending |

Tasks execute through `Depends on`; phase files only group responsibilities.
`EN-001` synchronized the clean KedrStore `AllowAnonymous` contract before API
implementation.
