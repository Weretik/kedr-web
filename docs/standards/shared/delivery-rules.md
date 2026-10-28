# Delivery rules

This is the source for frontend feature readiness, traceability, and definition of done. The task graph, feature-specific evidence, and [testing rules](testing-rules.md) determine the execution order.

Prepare an SDD before implementing a new feature or changing the scenarios, UI behavior, or contracts of an existing feature. For an existing feature, update its current specification or add a revision in its directory; do not duplicate the entire SDD. Maintain `R-*`/`SC-*`/`TS-*` and traceability for the changed scope.

For a local internal fix that restores already documented behavior without changing a scenario, contract, or module boundary, a short description of the problem, fix, and focused verification result in the task or report is enough. Open historical SDD revisions only for questions the current specification does not answer.

## Specification readiness

Keep a feature's current scope and navigation status in its `README.md`, rules and scenarios in current requirements, execution evidence in task files, and `traceability.md` as a brief matrix of links and statuses. Revisions and earlier plans are history: link to them from `README.md`, but do not duplicate current status in them or reread them without a specific need.

A feature is ready for implementation when:

- its scope and observable outcome are agreed;
- business rules have stable `R-*` IDs;
- acceptance scenarios have stable `SC-*` IDs and Given/When/Then without component, hook, store, library, or file names;
- open product decisions are marked as blockers rather than invented;
- each scenario has a risk-based test level or justified `n/a`;
- work is divided into `TS-*` tasks with one implementation or verification responsibility and `EN-*` tasks for shared prerequisites;
- each task has `Covers` or `Enables`, `Depends on`, exact paths, test level, `Work`, `Evidence`, and `Checkpoint`;
- `traceability.md` covers the entire scope without orphaned scenarios or tasks;
- the architecture baseline compares actual Nx projects/tags/constraints, dependency graph, aliases/public APIs, approved data stack, and test targets with applicable rules; each discrepancy has an `AF-*` and prerequisite `EN-*`/`RM-*`;
- `design/frontend.md` has a compact planned map of key feature files and directories: exact paths, one role each, existing or planned status, and a decision about splitting affected overloaded files under the [Admin organization rules](../admin/admin-code-organization.md) for an Admin feature.

## Traceability

`traceability.md` contains only the `SC → TS/EN → tests → evidence` links and status. Business rules live in `requirements/`, technical content in task and design files, and detailed results in the relevant task file.

IDs remain stable after acceptance. Do not renumber completed legacy tasks or rewrite historical evidence without a need. When changing an older feature, migrate only the new or changed scope while preserving completed IDs, task files, and historical evidence.

## Execution readiness

A `TS-*` or `EN-*` task is ready when its dependencies are complete, its responsibility does not overlap another task, paths exist or are planned unambiguously, and its checkpoint can be verified with available tooling. A large phase is an orchestration file; it does not replace small task files.

If the user authorizes an entire feature, phase, or set of `SC-*` scenarios, the AI proceeds through all ready task files in that scope. A separate command for each subphase is unnecessary.

## Definition of done

A new feature card in `docs/features/<app>/<module>/` briefly records its route, boundaries, state and data flow, contracts, SDD link, Mermaid diagram of verified relationships, tree of actual directories with their roles, and a “Tests” section with the Nx projects that test it and their focused run commands (or a note that none exist). Add it as one row of the flat [feature catalog](../../features/README.md); do not add per-app or per-area index pages. Update the catalog row and affected card after a substantial change to these facts; do not duplicate requirements or fields from the specification, record environment state, or create a subdirectory for a single page.

- When an SDD status changes, update its row in the [specification index](../../specs/README.md) in the same change.
- When tests for a feature are added, moved, or removed, update the card's “Tests” section.
- A small fix that does not change the card's facts does not touch the card.
- After a backend OpenAPI change, run `npm run contracts:sync -- <path-to-KedrStore>` and commit the snapshot and generated types together.

Scope is complete when:

- all in-scope `SC-*` scenarios are verified or explicitly deferred with a reason and owner;
- all required `TS-*`/`EN-*` tasks pass their checkpoints;
- Red → Green → Refactor → Regression is recorded for new testable behavior;
- contracts, documentation, and actual behavior agree;
- a new implemented feature has a brief architecture page with a Mermaid relationship diagram, a tree of actual directories and key files with their roles, and an entry in the [feature catalog](../../features/README.md); a substantial change to route, state, API, or module boundaries updates the relevant page, diagram, tree, and index;
- the minimum checks for changed parts under the [verification scope rules](testing-rules.md#verification-scope-during-implementation) pass or have a specific blocker; a full project suite, coverage, production build, E2E, and full audit run only at the user's explicit request;
- an infrastructure smoke check is marked as harness verification rather than business scenario evidence;
- `traceability.md` links to actual tests and evidence;
- the delivery report includes scope, changed files, evidence, unrun checks, and real residual risks;
- affected architecture boundaries are reviewed after the final implementation change; a full code audit runs only at the user's explicit request, and confirmed in-scope `AF-*` findings are verified or have a clearly described blocker;
- new and changed feature files are reviewed by responsibility: independent forms, tables, dialogs, state, requests, and mapping have appropriate owners; the planned map is compared with the actual tree on the feature page. File size alone does not require splitting.

An `open`, `blocked`, or `planned` architecture finding blocks delivery. `deferred-approved` is allowed only with explicit approval, an owner, a separate SDD/task, and evidence that the finding is not a prerequisite of the current dependency chain. `fixed` before final regression is not a completed status.
