---
apply: always
---

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

## Project-Specific Rules

- Use only current, officially supported approaches.
- Do not suggest outdated Angular patterns.
- Respect the existing i18n, SEO, and routing structure of the project.
- Do not change public component, service, or route APIs unless explicitly requested.
- Do not change environment files, deployment config, CI/CD, or secrets unless the task is specifically about them.

## Styling Rules

- Follow the styling approach already used in the repository (`SCSS`, `CSS`, Tailwind, PrimeNG patterns, etc.).
- For PrimeNG UI changes, use only template-level styling, bindings, or PrimeNG `pt` configuration.
- Do not use PrimeNG `styleClass`.
- Do not edit component or global CSS files for PrimeNG UI tasks unless explicitly requested.
- Do not replace the existing styling strategy unless explicitly requested.
- Keep styling changes local to the feature whenever possible.
- Avoid changing unrelated layout or styling while solving a functional task.

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

## Output Format

For each task, report in this order:

1. What was changed
2. Which files were modified~~~~
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
