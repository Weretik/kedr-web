# Testing rules

This is the single source of stable rules for selecting frontend tests and applying TDD. Feature and task files link here and contain only their specific test level, commands, and evidence.

## Actual repository tooling

| Scope               | Tooling and available targets                                                                                                                                                                                                                                                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin React         | Vitest 4, React Testing Library, `user-event`, jsdom, and `@testing-library/jest-dom`. `npm run test:web` runs the Admin app, shared API client, and products/clients domain tests through their `vite:test` targets; `admin-e2e:e2e` runs a separate Playwright Chromium project.                                                                                         |
| Mobile React Native | Jest 29, `jest-expo` 57, and React Native Testing Library 13. `npm run test:mobile` runs the 21 Nx projects listed in root `package.json` in sequence: app, shell, api-client, and domain libraries. Existing tests include unit, focused integration, storage/native boundary, and component tests; the app suite is infrastructure smoke coverage for Expo Router/RN UI. |
| Storefront Angular  | `npm run test:storefront` runs Vitest for `storefront-data-access`: three spec files with focused contract and mapper tests. `npm run typecheck:tests:storefront` checks test TypeScript; `storefront:lint` and `storefront:build` check code and build. Full application coverage does not yet exist.                                                                     |
| E2E                 | Web: Playwright 1.63, `admin-e2e` project, Chromium only. Mobile: Detox, Maestro, and Appium are absent; mobile E2E requires a separate `EN-*`, a device/build strategy, and an available Android/iOS environment.                                                                                                                                                         |

The package manager is npm with a committed `package-lock.json`. The repository requires Node 24.20.x through `.nvmrc`, `.node-version`, and `engines`. Always verify exact targets with `npx nx show project <project> --json`.

You may recommend a missing tool in an `EN-*` task. Do not add it to dependencies or create configuration without a concrete scenario need and authorized scope.

## Selecting the test level by risk

- **Unit** — pure functions, validation, mappers, normalizers, reducers, and deterministic business rules.
- **Focused integration** — hooks, stores, providers, caching, data fetching, transport/error mapping, and interactions between modules with a controlled external boundary.
- **Component** — React/React Native UI, user interactions, accessibility, and visible `loading`/`empty`/`error`/`offline`/`forbidden` states.
- **Integration** — navigation, deep links, permissions, storage, native and browser adapters, and API contracts at the client boundary.
- **E2E** — only critical user journeys through a running application and integrated environment.

Choose the lowest level that proves the specific risk. Do not turn every `SC-*` into E2E or repeat the full scenario at every level. Several focused tests may support one scenario when each detects a distinct risk.

## Verification scope during implementation

- Implementation order: code and file structure → documentation → one focused automated test run for the changed feature. For documentation-only changes, check only their links and diff. Do not turn code delivery into a separate general testing or visual audit.
- Check light/dark themes, locale, and responsive breakpoints against wiring and styles in code. Do not open a browser. Before any browser, manual, visual, or E2E check, ask the user separately for permission for that specific check and wait for a direct answer.
- By default, run one focused automated test for the changed feature. An additional test or narrow lint/typecheck is needed only for a separate uncovered risk within that feature; do not run all commands listed below as a batch.
- Run a full app or repository test suite, coverage, all lint/typecheck checks, production build, E2E, full architecture audit, or broad regression **only at the user's direct request**. A command appearing in an SDD or checklist is not itself such a request.
- Run an additional check only for a specific risk that the earlier result did not prove. Do not repeat the same targets after a documentation edit or another change that cannot affect their conclusion.
- For documentation-only changes, check only changed links, formatting, and diff; runtime tests are unnecessary. For a contract or generation change, verify that boundary narrowly rather than running all frontend regression.
- In the report, name the minimum checks performed and their limits. Do not mark an unrun full suite as a failure or blocker: it is intentionally outside the current scope until the user requests it.

## Red → Green → Refactor → Regression

For each new or changed testable behavior:

1. **Red** — add the smallest behavioral test, run it, and record the expected failure caused by missing or incorrect behavior.
2. **Green** — implement the smallest complete change that makes the focused test pass.
3. **Refactor** — improve structure within the task and rerun the focused test.
4. **Regression** — after the final change, run the narrowest affected target needed for the risk and record the result; do not duplicate runs after every small edit.

A compilation error, broken fixture, incorrect mock, missing dependency, test setup error, or unrelated failure is not a valid Red result. Restore a working test harness first, using a separate `EN-*` if needed, then obtain a behavioral failure.

## Exceptions for EN-* and documentation work

Red-first may be unsuitable for documentation-only changes, generators, test harness setup, or a platform prerequisite before which behavior cannot be observed. Record the reason, enabled `SC-*`, replacement check, and result. The exception does not remove final verification.

## Evidence

## Verification path

| When                        | Minimum action                                                                                                                                                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local change                | Run one test for the affected Nx project (`npx nx run <project>:vite:test --run` if the target exists). For documentation, check links and run `git diff --check`.                                                                                                                       |
| Boundary or contract change | Add `npm run architecture:boundaries` or `npm run contracts:check` only for the affected boundary; for a validator change, also run `npm run architecture:boundaries:fixtures`.                                                                                                          |
| Full CI                     | The [workflow](../../../.github/workflows/ci.yml) runs every check on pushes to `main`; on PRs, lint, typecheck, tests, e2e and builds run only for projects the change affects ([run-affected](../../../tools/ci/run-affected.mjs)). Rerun the full set locally only on direct request. |

Verify the specific target in `project.json` or with `npx nx show project <name> --json`.

In `TS-*`, record the test name/path, Red failure, Green result, refactor note, and regression command/result. In `EN-*`, record the exception reason and replacement check. `traceability.md` contains only links to this evidence.

The following are available commands, not a mandatory bundle for every feature. Run full suites, coverage, builds, and E2E under the scope rule above. Commands depend on the project target:

- Admin unit/component: `npm run test:web`; separately, `npm run test:web:unit` and `npm run test:web:component`;
- Admin E2E: `npm run test:web:e2e`; Playwright starts `admin:serve` itself;
- Admin coverage: `npm run test:web:coverage`; production regression: `npx nx lint admin`, `npx nx typecheck admin`, `npx nx build admin --configuration=production`;
- Mobile suites: `npm run test:mobile`; coverage: `npm run test:mobile:coverage`;
- test TypeScript: `npm run typecheck:tests` or platform-specific `typecheck:tests:web` / `typecheck:tests:mobile`;
- Mobile production regression: `npx nx lint mobile`, `npx nx typecheck mobile`, `npx nx export mobile`; native Android/iOS checks run only with an available SDK;
- Storefront: `npm run test:storefront`, `npm run typecheck:tests:storefront`, `npx nx lint storefront`, `npx nx build storefront`; for behavior beyond `storefront-data-access`, add focused tests or a separate harness `EN-*`;
- Mobile E2E: do not cite executable evidence until a separate target actually exists;
- For changes to Nx project boundaries: `npm run architecture:boundaries`; for changes to the validator itself, also run `npm run architecture:boundaries:fixtures`. These commands are defined in root `package.json` and complement lint rather than replace it.

Infrastructure smoke proves the runner/setup works but does not cover `R-*` or `SC-*`. Acceptance Given/When/Then is a requirement; executable tests and their results are recorded separately in traceability.

Record a failed or unrun check with its exact command, failure point, impact of the current changes, and next step. Do not mark it as passed.
