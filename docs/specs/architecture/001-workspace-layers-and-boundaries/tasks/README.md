# Workspace remediation task graph

| ID     | Responsibility                   | Findings               | Depends on     | Status   |
| ------ | -------------------------------- | ---------------------- | -------------- | -------- |
| RM-000 | align documentation baseline     | AF-011                 | none           | verified |
| EN-001 | characterization baseline        | AF-002, AF-005–AF-009  | RM-000         | verified |
| EN-002 | executable boundary fixtures     | AF-001                 | RM-000         | verified |
| EN-003 | Storefront test harness          | AF-004, AF-006, AF-009 | RM-000         | verified |
| RM-001 | tags and boundary enforcement    | AF-001                 | EN-002         | verified |
| RM-002 | Mobile app store composition     | AF-002, AF-008         | EN-001, RM-001 | verified |
| RM-003 | cross-domain model ownership     | AF-003                 | RM-001         | verified |
| RM-004 | Storefront DTO/domain boundary   | AF-004                 | EN-003, RM-001 | verified |
| RM-005 | Mobile pagination ownership      | AF-005                 | EN-001, RM-001 | verified |
| RM-006 | runtime response validation      | AF-006                 | EN-001, EN-003 | verified |
| RM-007 | RTK cache/invalidation semantics | AF-007                 | EN-001, RM-003 | verified |
| RM-008 | narrow public entry points       | AF-008                 | RM-002–RM-007  | verified |
| RM-009 | dead tree and stale path cleanup | AF-010                 | RM-008         | verified |
| RM-010 | final audit and regression       | AF-001–AF-010          | RM-001–RM-009  | verified |

Tasks виконані за dependency order і підтверджені final verification.
