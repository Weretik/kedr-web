# Трасування

| SC     | Tasks                          | Tests / evidence                                | Status                      |
| ------ | ------------------------------ | ----------------------------------------------- | --------------------------- |
| SC-001 | TS-002, TS-003, TS-005         | source + UI + server render; tasks evidence     | verified (automated/source) |
| SC-002 | TS-001, TS-003                 | articles-listing / search form specs            | verified (automated/source) |
| SC-003 | TS-001, TS-003                 | query + page-size interaction specs             | verified (automated/source) |
| SC-004 | TS-001, TS-003, TS-007         | listing + pagination specs                      | verified (automated/source) |
| SC-005 | TS-001, TS-005                 | query invalid/clamp + feature integration       | verified (automated/source) |
| SC-006 | TS-003                         | empty/clear specs                               | verified (automated/source) |
| SC-007 | TS-003, TS-005                 | empty/status + inherited ErrorView source       | verified (automated/source) |
| SC-008 | TS-003                         | sr-only search/current/disabled/focus semantics | verified (automated/source) |
| SC-009 | TS-003, TS-006                 | locale component + theme/responsive source      | verified (automated/source) |
| SC-010 | TS-002, TS-003, TS-005, TS-007 | source + article UI + server output             | verified (automated/source) |
| SC-011 | TS-002, TS-004, TS-005, TS-007 | slug lookup/notFound/config redirect            | verified (automated/source) |
| SC-012 | TS-004, TS-005                 | metadata/JSON-LD + server specs                 | verified (automated/source) |
| SC-013 | TS-005                         | content-sitemap integration spec                | verified (automated/source) |

EN-001 enables source/integration; TS-006 verifies all scope and updates evidence. Detailed results live in [tasks](tasks/README.md) and [verification](verification/results.md).

AF-001/AF-002 → [TS-007](tasks/TS-007-audit-refactor.md) → subject model specs + [source invariants](verification/source-invariants.mjs) → [audit evidence](code-audit/audit.md): verified. Product SC IDs and historical evidence remain stable.
