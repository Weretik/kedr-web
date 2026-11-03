# 001 — Home page: traceability

| Rule         | Scenarios      | Tasks                                     | Evidence                                                                |
| ------------ | -------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| R-001        | SC-001, SC-002 | TS-004, TS-005, TS-006                    | home seo and ui tests; `curl` of `/uk`, `/ru`                           |
| R-002        | SC-003         | TS-004                                    | home ui test                                                            |
| R-003        | SC-004         | TS-004                                    | home ui test                                                            |
| R-004        | SC-005         | TS-002, TS-003                            | mapper and catalog index tests                                          |
| R-005        | SC-006         | TS-001…TS-003                             | mapper and product card tests                                           |
| R-006        | SC-007         | TS-002, TS-006                            | data-access and feature tests; `curl` with the API unreachable          |
| R-007        | SC-008         | EN-001, TS-002                            | build route table; data-access tests                                    |
| R-008        | SC-009         | TS-006                                    | `curl`                                                                  |
| R-009        | SC-010         | EN-001                                    | `curl`                                                                  |
| R-010, R-011 | SC-011         | [TS-008](tasks/TS-008-company-concept.md) | home-page.spec.tsx company concept (uk/ru); passed                      |
| R-012        | SC-012         | [TS-008](tasks/TS-008-company-concept.md) | native FAQ markup and manager phone; passed                             |
| R-013        | SC-013, SC-014 | [TS-009](tasks/TS-009-company-home.md)    | localized shell/home tests and Next redirect helper; passed; see TS-009 |
