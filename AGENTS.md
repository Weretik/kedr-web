# AGENTS.md

## Project Context

- Stack: Angular
- This repository contains only the frontend application.
- Use the package manager already configured in the repository (`npm`, `pnpm`, or `yarn`).
- Follow the existing project structure, naming conventions, and architectural boundaries.
- Do not introduce new architectural patterns unless explicitly requested.

## Core Working Rules

- Work strictly within the requested task.
- Make the smallest possible change that solves the task.
- Do not perform unrelated refactoring.
- Do not rewrite working code when a targeted fix is enough.
- Preserve existing UI behavior unless the task explicitly requires changing it.
- Reuse existing services, utilities, components, facades, and state mechanisms before creating anything new.
- First analyze the current implementation, then propose or apply changes.
- For non-trivial changes: briefly plan -> implement -> verify -> report risks.
- Do not leave TODO/FIXME placeholders unless explicitly requested; if unavoidable, document exact follow-up in the final report.
- Keep commits and changes reviewable: one task-focused change set, no hidden side effects.

## Frontend Architecture Rules

- Keep business logic out of components whenever possible.
- Components should focus on presentation, interaction binding, and orchestration.
- Put API access in dedicated services, facades, or data-access layers, not directly in components.
- Put reusable UI into shared or presentational components only when reuse is clear.
- Respect existing boundaries such as `core`, `shared`, `features`, `ui`, `data-access`, and `util` if they already exist in the project.
- Do not move files or reorganize folders unless required for the task.
- Do not change routing, guards, resolvers, interceptors, or global error-handling patterns unless explicitly required.

## Angular Conventions

- Prefer the existing project style first. Do not mix paradigms unnecessarily.
- If the project uses standalone components, continue using standalone components.
- If the project uses Signals, continue with Signals.
- If the project uses RxJS, store, or facades, follow that existing approach.
- Do not introduce a new state management library without explicit request.
- Use strict typing.
- Avoid `any` unless there is no practical alternative, and explain why in the final report.
- Keep templates simple.
- Avoid complex inline expressions and duplicated logic in templates.
- Avoid direct DOM manipulation unless there is no Angular-native alternative.
- For new components or pages, prefer consistency with existing UI patterns over personal preference.
- Prefer typed reactive forms where forms are already reactive in the feature.
- Ensure subscriptions are lifecycle-safe (`async` pipe, `takeUntilDestroyed`, signals interop, or existing project pattern).
- Keep change detection strategy and rendering approach consistent with the local feature architecture.

## Project-Specific Rules

- Use only current, officially supported approaches.
- Do not suggest outdated Angular patterns.
- Respect the existing i18n, SEO, and routing structure of the project.
- Do not change public component, service, or route APIs unless explicitly requested.
- Do not change environment files, deployment config, CI/CD, or secrets unless the task is specifically about them.
- Preserve analytics, logging, and tracking hooks already present in the feature; do not silently remove telemetry calls.

## Styling Rules

- Follow the styling approach already used in the repository (`SCSS`, `CSS`, Tailwind, PrimeNG patterns, etc.).
- Use PrimeNG as the primary UI component library for this project when a ready-made component is needed.
- Prefer standard HTML and CSS for simple UI primitives when they solve the task cleanly and do not reduce accessibility, maintainability, or consistency with the existing UI.
- Use PrimeNG for complex UI components or business UI patterns such as tables, dialogs with state, dropdowns/selects, multiselects, date pickers, menus, sidebars/drawers, toasts, confirmations, forms, filtering, pagination, overlays, and other interactive components where PrimeNG saves implementation time and reduces risk.
- Do not introduce another visual/component library when PrimeNG or standard HTML/CSS is enough.
- When choosing between native HTML/CSS and PrimeNG, keep the main emphasis on consistency with existing PrimeNG-based UI patterns.
- For PrimeNG UI changes, use only template-level styling, bindings, or PrimeNG `pt` configuration.
- Do not use PrimeNG `styleClass`.
- Do not edit component or global CSS files for PrimeNG UI tasks unless explicitly requested.
- Do not replace the existing styling strategy unless explicitly requested.
- Keep styling changes local to the feature whenever possible.
- Avoid changing unrelated layout or styling while solving a functional task.
- New UI states must include hover/focus/disabled/error states where applicable and follow existing design tokens.

## Code Quality Rules

- Do not add dead code, commented-out code, or speculative abstractions.
- Do not perform broad refactoring while solving a local task.
- Do not rename public APIs unless explicitly requested.
- Prefer readable code over clever code.
- Use professional, descriptive naming for variables, parameters, functions, and types.
- Choose names by intent and domain meaning, not by brevity.
- Avoid vague names such as `tmp`, `data`, `obj`, `deps`, or `cfg` unless there is a strong local reason.
- Keep imports clean and remove unused code after changes.
- Preserve backward compatibility for public-facing contracts where possible.
- Always preserve correct UTF-8 encoding when reading or writing files.
- Verify that no mojibake or corrupted Cyrillic characters are introduced.
- For user-facing strings, use normal readable UTF-8 text directly.
- Do not use Unicode escape sequences unless explicitly requested.
- Any non-obvious decision should be documented in code with a short, useful comment (why, not what).

## Accessibility Rules (A11y)

- Do not break keyboard navigation, focus order, or visible focus indication.
- For icon-only controls, ensure an accessible name (`aria-label` or equivalent existing pattern).
- Use semantic HTML first; add ARIA only when semantics are insufficient.
- For dynamic validation or async UI states, ensure screen-reader-friendly announcements if this pattern already exists nearby.

## Security and Data Handling

- Treat all external/user-provided data as untrusted; do not bypass Angular sanitization patterns used in the project.
- Do not introduce secrets/tokens into source code, templates, logs, or test fixtures.
- Do not log sensitive user data (PII, auth tokens, session identifiers).
- Keep auth/permission checks consistent with existing guards/interceptors/service contracts.

## Performance Rules

- Keep bundle impact minimal: avoid adding dependencies unless clearly justified and requested.
- Prefer lazy loading and existing code-splitting boundaries; do not collapse lazy boundaries.
- Avoid heavy template computations; move expensive logic to memoized selectors/signals/services per existing style.
- Prevent avoidable re-renders and duplicate HTTP calls by reusing existing caching/state/facade patterns.

## Change Policy

- Do not update Angular, dependencies, or tooling versions unless explicitly requested.
- Do not introduce breaking UI or API assumptions without explicit instruction.
- Do not modify large template or style sections when a small targeted fix is enough.
- Do not replace existing utilities, facades, or patterns just because another approach is possible.

## Testing and Verification

Before finishing a task, run what is relevant and available in this repository.

### 1. Install dependencies if needed

- `npm ci`
- or the repository’s existing install command

### 2. Static checks

- Run relevant lint targets for the changed project(s) before finishing.
- Examples:
  - `npx nx lint storefront`
  - `npx nx lint admin`

### 3. Unit tests

- Run relevant tests if they exist for the changed area.
- Prefer running targeted tests first, then broader suites if the change touches shared modules.

### 4. Build

- Run a relevant build for the changed application.
- Examples:
  - `npx nx build storefront`
  - `npx nx build admin`

### 5. If verification cannot be completed

Explicitly report:

- which command was run
- what failed
- whether the failure is related to the change or is pre-existing

## Pull Request Quality Gate (for non-trivial tasks)

- Scope is minimal and task-focused.
- No unrelated file churn.
- Lint passes for changed project(s).
- Relevant tests pass or documented why missing/unavailable.
- Build passes for affected app(s) or failure is documented.
- Potential user-visible risks are listed with manual check steps.

## Output Format

For each task, report in this order:

1. What was changed
2. Which files were modified
3. What was verified
4. What could not be verified
5. Risks / what should be checked manually

## Definition of Done

The task is done when:

- The requested frontend behavior is implemented.
- The change is minimal and localized.
- Existing architecture and project patterns are respected.
- Relevant lint, tests, and build steps were run when available, or the reason they were not run is clearly stated.
- No obvious unrelated regressions were introduced.
