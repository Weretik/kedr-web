# AI navigation: Kedr Web

This is a short entry point for working in this frontend repository. The project files define its actual state and rules; read only the documents needed for the specific task.

## Product

Kedr sells door hardware wholesale (with optional retail orders), not services such as fitting or repair. The KedrStore backend owns business rules, the OpenAPI contract, and authorization: Admin and Site use an HttpOnly cookie session, Mobile uses bearer + refresh tokens, and admin APIs require the Manager or Admin role.

## Project context

- [Frontend inventory](docs/architecture/frontend-inventory.md) — applications, tools, and available Nx targets.
- [Architecture decisions (ADR)](docs/architecture/adr/README.md) — workspace decisions and the list of key decisions; a new app, framework, hosting, state or transport approach gets an ADR in the same change, and the full architecture audit reports missing ones.
- Application architecture: [Admin React](docs/architecture/admin/README.md), [Mobile React Native](docs/architecture/mobile/README.md), and [Site Next.js](docs/architecture/site/README.md) (the public site; the old Angular storefront was removed, see its [ADR](docs/architecture/adr/0005-remove-angular-storefront.md)).
- [Standards index](docs/standards/README.md) — stable rules for code, UI, API, testing, security, and delivery.
- [Feature catalog](docs/features/README.md) — one table of current Admin, Mobile, and Site features with routes and cards.

Identify the application from the request and current code. If choosing between React, React Native, and Next.js affects the result and cannot be determined from context, clarify it before creating files. For task-specific context, navigate from the [feature catalog](docs/features/README.md) to the relevant feature card and code; read SDD, architecture, and standards only for the issues involved.

## File size while writing

Never let a giant file appear: plan the split before creating a file. A component stays under 150 lines and a hook, model, or other module under 200; when a file nears the limit, or a component renders several independent blocks, split it at once into one component per block, a controller hook for state and actions, and pure functions in `model/`, each with its own spec. Do not wait for CI. Before handoff run `npm run architecture:structure` and fix every new violation in the files you touched; an exception is allowed only for content that cannot be split (for example a long list of required parameters or a static dictionary), never for anything that can become several files or components, and it needs a written reason in the known deviations; never add a baseline entry for splittable code ([code organization](docs/standards/shared/code-organization.md#one-responsibility-per-file)).

## Context search order

1. Feature catalog → feature card → the code in its “Code structure” and the tests in its “Tests”.
2. Search code in `libs/` and `apps/` first; search `docs/` only for the relevant section.
3. Open `docs/specs/**` only for decisions or history of that feature; do not read old task files, revisions, or research by default. Paths in completed task files may be outdated.
4. Take package versions from `package.json` and `apps/mobile/package.json`, not from documentation.

## Commands

- Admin and Site tests (Vitest): `npx nx run <project>:vite:test -- --run`; all site libraries: `npm run test:site`.
- Mobile tests (Jest): `npx nx run <project>:test`.
- Project lint or typecheck: `npx nx run <project>:lint`, `npx nx run <project>:typecheck`.
- Documentation: `npm run docs:check`. Contract: `npm run contracts:sync` (from KedrStore `master`), `npm run contracts:check`, `npm run contracts:drift`. Structure and boundaries: `npm run architecture:structure`, `npm run architecture:boundaries`.
- Scaffold with console generators, not hand-written configs: `npx nx g @nx/react:library`, `npx nx g @nx/next:application`, `npx shadcn@latest add <component>` and similar. Then trim generator output to the repository's conventions (no deprecated executors, `resolve.tsconfigPaths` in Vite configs, project tags).
- Feature cards list the exact projects. Do not run `test:web`, `test:mobile`, `run-many`, builds, or E2E unless asked; they are slow and CI runs them.

A small fix that restores documented behavior needs no SDD, file-role map, or audit: fix it, run the focused test, and describe the change briefly.

## Task routing

| Task                                                          | Skill                                                    | Project documentation                                              |
| ------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| Specify new or changed behavior                               | `$frontend-feature-spec`                                 | [Readiness rules](docs/standards/shared/delivery-rules.md)         |
| Implement an accepted specification                           | `$frontend-feature-delivery`                             | [Delivery rules](docs/standards/shared/delivery-rules.md)          |
| Implement with multiple agents at the user's explicit request | `$frontend-feature-orchestrator`                         | [Delivery rules](docs/standards/shared/delivery-rules.md)          |
| Architecture audit / systemic violations                      | `$frontend-code-audit` / `$frontend-remediation-plan`    | [Standards index](docs/standards/README.md)                        |
| HTTP and API contracts                                        | `$frontend-api-contract-sync`                            | [Frontend API contracts](docs/contracts/README.md)                 |
| Admin list or detail page                                     | `$mui-admin-ui`                                          | [List and detail pages](docs/standards/admin/list-detail-pages.md) |
| Verify changes / hand off for review                          | `$frontend-change-verification` / `$frontend-pr-handoff` | [Testing rules](docs/standards/shared/testing-rules.md)            |
| Differences between code and documentation                    | `$frontend-docs-sync`                                    | [Documentation index](docs/README.md)                              |

**API contract:** KedrStore generates its OpenAPI from code; `docs/contracts/openapi/openapi.json` is a copy of it from the backend `master`, never edited here. `npm run contracts:sync` refreshes it and the types in `@shared/api-contracts`; CI (`contracts:drift`) fails while it lags the backend, and a daily workflow opens the sync pull request. The branch syncs the contract itself before merge, without waiting for drift or asking the owner ([automatic synchronization](docs/contracts/README.md#automatic-synchronization)). Admin calls the API only through the typed `openapi-fetch` client: `queryFn: (arg, { signal }) => apiCall(apiClient.GET('/api/...', { params, signal }), mapper)` in domain `data-access`, never raw `fetch` or Axios ([contracts](docs/contracts/README.md), [ADR-0004](docs/architecture/adr/0004-contract-follows-backend-and-typed-client.md)).

**Repeated submits:** every mutation has a pending lock; a mutation whose backend takes an `Idempotency-Key` (orders, drafts, the site quick order, anything that sends a message) makes one key per attempt, reuses it on retry and renews it after success or a change; offline queues store it with the entry ([idempotency rules](docs/standards/shared/idempotency-rules.md)).

For any new or changed Admin, Mobile, or Site code, apply the [code organization rules](docs/standards/shared/code-organization.md) (role folders, one responsibility per file, at most six production files per folder and never files mixed with subfolders, tests first; the structure check fails on new violations) and [SDD readiness and delivery rules](docs/standards/shared/delivery-rules.md): plan the file-role map first and compare it with actual code before handoff.

For a new or substantially changed feature, update the [feature catalog](docs/features/README.md) under the [delivery rules](docs/standards/shared/delivery-rules.md); small internal changes do not require rewriting its card.

**Branch names:** `<type>/<short-kebab-description>` in English, 3-6 words, types `feat fix hotfix refactor perf docs test chore`, e.g. `feat/site-order-1c-link`; the same name in every repository of one feature; no `claude`, hashes, or dates. The `Branch name` workflow fails a pull request otherwise ([rules](docs/standards/shared/delivery-rules.md#branch-names)).

## Process priority

The user's direct request and this repository's rules define the scope of work. For feature specification, implementation, and verification, use the relevant `frontend-*` skills and project documents as the primary process. Apply additional skills only for a needed method; they do not add repeated approval, mandatory agents, a worktree, or a separate TDD cycle on top of the project process. Run checks and tests according to this repository's rules and the task requirements.

## Verification

Work in this order: code, file structure, integration with existing themes and locale, then documentation. Run only focused automated tests for changed Nx projects under the [testing rules](docs/standards/shared/testing-rules.md); the full suite, coverage, production build, E2E, or a repository-wide audit only at the user's explicit request. After a feature is implemented, its full feature audit is mandatory ([delivery rules](docs/standards/shared/delivery-rules.md#full-audit-after-the-feature)). Check light/dark themes and responsiveness against theme code, components, and breakpoints. Do not open the app in a browser or run browser, visual, manual, or E2E checks without separate explicit user permission obtained after a specific question about that check.
