# Товари без фотографій у профілі — task graph

Tasks execute by `Depends on`; phase files only group responsibilities.

## Planning phases

- [00 — Readiness](00-readiness.md)
- [02 — State and data](02-state-and-data.md)
- [04 — React Native UI](04-react-native-ui.md)
- [06 — Navigation and platform](06-navigation-and-platform.md)
- [07 — API integration](07-api-integration.md)
- [08 — Verification](08-verification.md)

## Task index

| ID     | Responsibility                                        | Covers/enables                | Depends on | File                                                   | Status  |
| ------ | ----------------------------------------------------- | ----------------------------- | ---------- | ------------------------------------------------------ | ------- |
| EN-001 | Synchronize missing-photo API contract                | SC-001–SC-009                 | none       | [task](enablers/EN-001-sync-missing-photo-contract.md) | done    |
| TS-001 | Validate and map the confirmed response               | SC-002, SC-003, SC-007–SC-009 | EN-001     | [task](api/TS-001-missing-photo-contract-mapping.md)   | done    |
| TS-002 | Implement dedicated query/cache lifecycle             | SC-001–SC-007                 | TS-001     | [task](api/TS-002-missing-photo-query.md)              | done    |
| TS-003 | Orchestrate retry, refresh and pagination             | SC-001, SC-004–SC-007         | TS-002     | [task](state/TS-003-missing-photo-controller.md)       | done    |
| TS-004 | Render accessible Profile section states/list         | SC-001–SC-007, SC-009         | TS-003     | [task](ui/TS-004-profile-product-section.md)           | done    |
| TS-005 | Compose Profile route and optional details navigation | SC-008, SC-009                | TS-004     | [task](navigation/TS-005-profile-route-navigation.md)  | done    |
| TS-006 | Close automated acceptance and regression evidence    | SC-001–SC-009                 | TS-005     | [task](verification/TS-006-acceptance-regression.md)   | done    |
| TS-007 | Verify device and visual contract                     | SC-001–SC-009                 | TS-006     | [task](verification/TS-007-device-visual-qa.md)        | blocked |

`EN-001` is a prerequisite, not permission to change backend behavior. If the
canonical backend does not yet publish the operation, the API owner updates it
outside this frontend feature and the frontend only synchronizes the result.
