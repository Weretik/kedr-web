# Traceability

| Rules               | Scenario | Tasks                             | Tests / evidence                                                                                                               | Status   |
| ------------------- | -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- |
| R-001, R-010        | SC-001   | EN-001 → TS-001 → TS-003 → TS-004 | UI localized rendering; feature composition; [TS-001](tasks/TS-001-delivery-ui.md), [TS-003](tasks/TS-003-page-integration.md) | verified |
| R-003, R-004, R-010 | SC-002   | EN-001 → TS-001 → TS-004          | UI UK/RU shipping qualifications; [TS-001](tasks/TS-001-delivery-ui.md)                                                        | verified |
| R-005, R-006, R-010 | SC-003   | EN-001 → TS-001 → TS-004          | UI UK/RU payment qualifications; [TS-001](tasks/TS-001-delivery-ui.md)                                                         | verified |
| R-002               | SC-004   | EN-001 → TS-001 → TS-004          | UI four ordered instructions; [TS-001](tasks/TS-001-delivery-ui.md)                                                            | verified |
| R-007, R-008, R-010 | SC-005   | EN-001 → TS-001 → TS-004          | UI exact related terms; [TS-001](tasks/TS-001-delivery-ui.md)                                                                  | verified |
| R-009               | SC-006   | EN-001 → TS-001 → TS-003 → TS-004 | UI offer/contact URLs; [TS-001](tasks/TS-001-delivery-ui.md), [TS-003](tasks/TS-003-page-integration.md)                       | verified |
| R-011               | SC-007   | EN-001 → TS-001 → TS-003 → TS-004 | UI semantics and source token/breakpoint audit; [TS-004](tasks/TS-004-documentation-audit.md)                                  | verified |
| R-012               | SC-008   | EN-001 → TS-002 → TS-003 → TS-004 | Metadata unit and sitemap integration; [TS-002](tasks/TS-002-delivery-seo.md), [TS-003](tasks/TS-003-page-integration.md)      | verified |

Architecture repair [AF-001](code-audit/audit.md) → [TS-005](tasks/TS-005-architecture-audit.md); AF-001 verified; product scenarios SC-001–SC-008 unchanged, focused SSR regression passed (3 tests), lint and all three spec typechecks passed.
