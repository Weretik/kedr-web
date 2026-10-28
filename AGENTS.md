# AI navigation: Kedr Web

This is a short entry point for working in this frontend repository. The project files define its actual state and rules; read only the documents needed for the specific task.

## Product

Kedr sells door hardware wholesale (with optional retail orders), not services such as fitting or repair. The KedrStore backend owns business rules and the OpenAPI contract; backend authorization is not enforced yet.

## Project context

- [Frontend inventory](docs/architecture/frontend-inventory.md) — applications, tools, and available Nx targets.
- Application architecture: [Admin React](docs/architecture/admin/README.md), [Mobile React Native](docs/architecture/mobile/README.md), and [Storefront Angular](docs/architecture/storefront/README.md).
- [Standards index](docs/standards/README.md) — stable rules for code, UI, API, testing, security, and delivery.
- [Feature catalog](docs/features/README.md) — one table of current Admin, Mobile, and Storefront features with routes and cards.

Identify the application from the request and current code. If choosing between React, React Native, and Angular affects the result and cannot be determined from context, clarify it before creating files. For task-specific context, navigate from the [feature catalog](docs/features/README.md) to the relevant feature card and code; read SDD, architecture, and standards only for the issues involved.

## Context search order

1. Feature catalog → feature card → the code in its “Code structure” and the tests in its “Tests”.
2. Search code in `libs/` and `apps/` first; search `docs/` only for the relevant section.
3. Open `docs/specs/**` only for decisions or history of that feature; do not read old task files, revisions, or research by default. Paths in completed task files may be outdated.
4. Take package versions from `package.json` and `apps/mobile/package.json`, not from documentation.

## Commands

- Admin and Storefront tests (Vitest): `npx nx run <project>:vite:test -- --run`.
- Mobile tests (Jest): `npx nx run <project>:test`.
- Project lint or typecheck: `npx nx run <project>:lint`, `npx nx run <project>:typecheck`.
- Documentation: `npm run docs:check`. Contract snapshot: `npm run contracts:check`.
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

For a new Admin feature, apply the [code organization rules](docs/standards/admin/admin-code-organization.md) and [SDD readiness and delivery rules](docs/standards/shared/delivery-rules.md): plan the file-role map first and compare it with actual code before handoff.

For a new or substantially changed feature, update the [feature catalog](docs/features/README.md) under the [delivery rules](docs/standards/shared/delivery-rules.md); small internal changes do not require rewriting its card.

## Process priority

The user's direct request and this repository's rules define the scope of work. For feature specification, implementation, and verification, use the relevant `frontend-*` skills and project documents as the primary process. Apply additional skills only for a needed method; they do not add repeated approval, mandatory agents, a worktree, or a separate TDD cycle on top of the project process. Run checks and tests according to this repository's rules and the task requirements.

## Verification

Work in this order: code, file structure, integration with existing themes and locale, then documentation. Run only focused automated tests for changed Nx projects under the [testing rules](docs/standards/shared/testing-rules.md); the full suite, coverage, production build, E2E, or a full audit only at the user's explicit request. Check light/dark themes and responsiveness against theme code, components, and breakpoints. Do not open the app in a browser or run browser, visual, manual, or E2E checks without separate explicit user permission obtained after a specific question about that check.
