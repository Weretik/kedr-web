# Admin code rules

## Libraries and dependencies

- Place domain code in `libs/admin/<domain>/{model,data-access,ui,feature}`.
- `model` contains pure TypeScript types, queries, defaults, and invariants; it does not depend on React, HTTP, or browser APIs.
- `data-access` owns private DTOs, mappers, and RTK Query hooks; it does not contain JSX, routing, or feature-local state.
- `ui` contains presentational components, forms, tables, and states; it does not call the API or router.
- `feature` orchestrates pages, hooks, and local UI state; it passes domain data and callbacks to `ui`.
- Import across libraries only through aliases and the public `src/index.ts`; deep imports are prohibited.

## Structure and state

- Give each file, component, and directory one cohesive responsibility.
- For a new Admin feature, record a concise planned map of key files and roles in the SDD before coding; before delivery, compare it with the actual code and the [delivery rules](../shared/delivery-rules.md). Split by independent roles, not by an arbitrary line limit.
- Group internal code by role: `components`, `pages`, `hooks`, `state`, `forms`, `tables`, `mappers`, and `contracts`.
- Do not create catch-all directories or names such as `common`, `misc`, `helpers`, `utils`, or `types` without a domain purpose.
- RTK Query owns server data, loading, and API errors; do not duplicate them in a reducer.
- Keep simple feature-local state in component state; create a reducer only for related transitions or shared feature state.
- Do not make HTTP requests or hide business rules in JSX.

## Pages and routes

- A page is an orchestrator; split toolbars, tables, complex cells, and feature-only dialogs by independent responsibility.
- Reusable dialogs and forms belong in `ui` and receive values, errors, and callbacks through props.
- Do not change routes, guards, the global store, or theme outside the feature's explicit scope.
