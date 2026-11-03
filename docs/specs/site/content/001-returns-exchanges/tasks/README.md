# Tasks

| ID                                     | Responsibility                                                | Depends on                       |
| -------------------------------------- | ------------------------------------------------------------- | -------------------------------- |
| [TS-001](TS-001-content-foundation.md) | Generate content projects and typed source dictionaries       | —                                |
| [TS-002](TS-002-returns-ui.md)         | Implement approved responsive UI and behavior tests           | TS-001                           |
| [TS-003](TS-003-seo-route.md)          | Metadata, sitemap and thin route                              | TS-001; integration after TS-002 |
| [TS-004](TS-004-verification-docs.md)  | Integrate, check affected boundaries and update documentation | TS-002, TS-003                   |

TS-002 and the SEO portion of TS-003 may run concurrently in non-overlapping paths after TS-001. Coordinator owns configuration, shared documentation, evidence and status.

- [TS-005 — Audit and responsibility refactoring](TS-005-audit-refactoring.md): AF-001…AF-004; retains existing scenarios.
