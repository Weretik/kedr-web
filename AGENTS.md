# AI navigation: Kedr Web

This is a short entry point for working in this frontend repository. The project files define its actual state and rules; read only the documents needed for the specific task.

## Project context

- [Frontend inventory](docs/architecture/frontend-inventory.md) — applications, tools, and available Nx targets.
- Application architecture: [Admin React](docs/architecture/admin/README.md), [Mobile React Native](docs/architecture/mobile/README.md), and [Storefront Angular](docs/architecture/storefront/README.md).
- [Standards index](docs/standards/README.md) — stable rules for code, UI, API, testing, security, and delivery.
- [Consistent Admin page style](docs/standards/admin/list-detail-pages.md) — list and detail page composition and return navigation.
- [Feature catalog](docs/features/README.md) — current Admin, Mobile, and Storefront scenarios and entry points to their architecture.

Identify the application from the request and current code. If choosing between React, React Native, and Angular affects the result and cannot be determined from context, clarify it before creating files. For task-specific context, navigate from the [feature catalog](docs/features/README.md) to the relevant feature card and code; read SDD, architecture, and standards only for the issues involved.

## Task routing

| Task                                                          | Skill                                                    | Project documentation                                      |
| ------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| Specify new or changed behavior                               | `$frontend-feature-spec`                                 | [Readiness rules](docs/standards/shared/delivery-rules.md) |
| Implement an accepted specification                           | `$frontend-feature-delivery`                             | [Delivery rules](docs/standards/shared/delivery-rules.md)  |
| Implement with multiple agents at the user's explicit request | `$frontend-feature-orchestrator`                         | [Delivery rules](docs/standards/shared/delivery-rules.md)  |
| Architecture audit / systemic violations                      | `$frontend-code-audit` / `$frontend-remediation-plan`    | [Standards index](docs/standards/README.md)                |
| HTTP and API contracts                                        | `$frontend-api-contract-sync`                            | [Frontend API contracts](docs/contracts/README.md)         |
| Verify changes / hand off for review                          | `$frontend-change-verification` / `$frontend-pr-handoff` | [Testing rules](docs/standards/shared/testing-rules.md)    |
| Differences between code and documentation                    | `$frontend-docs-sync`                                    | [Documentation index](docs/README.md)                      |

For a new Admin feature, apply the [code organization rules](docs/standards/admin/admin-code-organization.md) and [SDD readiness and delivery rules](docs/standards/shared/delivery-rules.md): plan the file-role map first and compare it with actual code before handoff.

For a new or substantially changed feature, update the [feature catalog](docs/features/README.md) under the [delivery rules](docs/standards/shared/delivery-rules.md); small internal changes do not require rewriting its card.

## Process priority

The user's direct request and this repository's rules define the scope of work. For feature specification, implementation, and verification, use the relevant `frontend-*` skills and project documents as the primary process. Apply additional skills only for a needed method; they do not add repeated approval, mandatory agents, a worktree, or a separate TDD cycle on top of the project process. Run checks and tests according to this repository's rules and the task requirements.

## Verification

Work on a feature in this order: code, file structure, and integration with existing themes and locale; then documentation. After implementation, run only automated tests for the changed feature. Check light/dark themes and responsiveness against theme code, components, and breakpoints. Do not open the app in a browser or run browser, visual, manual, or E2E checks without separate explicit user permission obtained after a specific question about that check.

Choose only the minimum checks for changed Nx projects and concrete risks under the [testing rules](docs/standards/shared/testing-rules.md). Run the full project suite, coverage, production build, E2E, or a full audit only at the user's explicit request. Determine available targets from `project.json` or `npx nx show project <name> --json`; the inventory is a snapshot, while current configuration takes precedence.
