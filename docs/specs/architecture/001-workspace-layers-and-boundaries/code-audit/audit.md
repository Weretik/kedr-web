# Initial architecture audit — Kedr workspace

- **SDD:** `docs/specs/architecture/001-workspace-layers-and-boundaries/`
- **Scope:** all frontend apps/libraries, graph, data/public/test boundaries
- **Дата:** 2026-10-02
- **Delivery status:** verified after EN/RM execution

## Baseline completed

- [x] Read repository `docs/AGENTS.md`, all current documentation inventory,
      applicable architecture/standards/specs and Brevi reference templates/SDD.
- [x] Checked dirty worktree; existing Mobile/package and staged audit changes preserved.
- [x] Captured 62-project Nx inventory, targets/tags/graph, aliases, barrels,
      imports, direct transport, DTO consumers, tests/configs and empty paths.
- [x] Confirmed package manager/frameworks and client-specific approved stacks.
- [x] Ran full workspace lint and test TypeScript gates.

## Architecture matrix

| Area               | Actual                                           | Required                               | Finding/task             |
| ------------------ | ------------------------------------------------ | -------------------------------------- | ------------------------ |
| Nx enforcement     | partial scope/type; no domain/model completeness | executable dependency matrix           | AF-001 / EN-002, RM-001  |
| Mobile composition | shell imports orders reducer                     | app composes domain state              | AF-002 / RM-002          |
| Mobile model       | cart model imports orders model                  | neutral/single owner                   | AF-003 / RM-003          |
| Storefront types   | feature imports public `*Dto`                    | domain model after private DTO mapping | AF-004 / RM-004          |
| Mobile pagination  | RTK results copied into local arrays             | one server-state owner                 | AF-005 / RM-005          |
| Runtime boundary   | partial validation                               | all external responses validated       | AF-006 / RM-006          |
| Cache freshness    | no RTK tags/invalidation                         | explicit tested semantics              | AF-007 / RM-007          |
| Public API         | internals exported from several barrels          | minimal stable exports                 | AF-008 / RM-008          |
| Testing            | sparse Admin, absent Storefront tests            | executable characterization            | AF-009 / EN-001, EN-003  |
| Dead tree          | empty project/folders                            | removed or real owner                  | AF-010 / RM-009          |
| Docs               | contradictory stack/rules                        | factual consistent baseline            | AF-011 / RM-000 verified |

## Confirmed compliant areas

- package manager is npm with a committed lockfile;
- every library has root `src/index.ts`; no cross-library deep alias import found;
- no API/transport call found in Admin/Mobile domain `ui` components;
- Admin/Mobile domain requests use RTK Query; Admin auth raw Axios matches ADR-0001;
- Storefront API calls are in Angular data-access; logger fetch is beacon fallback;
- generated `@shared/api-contracts` imports are confined to data-access/transport/auth;
- `ThemePreferenceHeaderControl` owns one cohesive shell interaction and does
  not call storage/API directly; no split finding was created for the supplied file.

## Final verification evidence

- `npx nx run-many -t lint --all`: passed 62 projects.
- `npm run typecheck:tests`: passed Web, Storefront, Mobile and Admin E2E configs.
- `npm run test:web`, `npm run test:storefront` and `npm run test:mobile`: passed.
- `npm run architecture:boundaries` and fixture tests: passed for 63 projects.
- Storefront/Admin production builds and `npx nx export mobile`: passed.
- DTO, pagination, public-import, dead-project and RTK-tag audit searches passed.
- `npm run contracts:check`: passed with the existing Redocly warnings.
- `npm run docs:check`: passed for 353 Markdown files.
- Prettier check for changed/new Markdown: passed. Repository-wide
  `docs:format:check` still reports 14 unchanged pre-existing files, recorded in RM-000.

AF-001–AF-011 are fixed and verified. The repository-wide documentation format
baseline remains the 14 unrelated pre-existing files recorded by RM-000.
