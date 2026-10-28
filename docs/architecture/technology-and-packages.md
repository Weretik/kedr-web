# Kedr Web Technologies

**Package manager:** npm, Node from `.nvmrc`. Exact versions live in the manifests: root `package.json` and `package-lock.json`, and `apps/mobile/package.json` with its own `package-lock.json` for standalone EAS installs. Read them directly instead of copying versions here.

## Stack composition

| Client     | Framework and runtime      | UI and navigation                                   | State, API, and forms                                | Build and verification                    |
| ---------- | -------------------------- | --------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| Storefront | Angular 21, SSR, RxJS      | PrimeNG, Tailwind, Angular Router, Transloco        | Angular signals, NgRx Signals, HttpClient            | Nx Angular, Vite/Vitest, production build |
| Admin      | React 19                   | MUI 9, React Router 7                               | Redux Toolkit/RTK Query, Axios, React Hook Form, Zod | Nx React/Vite, Vitest, Playwright         |
| Mobile     | Expo 57, React Native 0.86 | Expo Router, React Native Paper, native UI packages | Redux Toolkit/RTK Query, Axios, React Hook Form, Zod | Nx Expo, Jest, Expo export                |

Check the client composition and actual Nx targets in the [frontend inventory](frontend-inventory.md). Mobile architecture implications are described in its [technology stack](mobile/platform/technology-stack.md) and [UI capabilities](mobile/platform/ui-capabilities.md).

## Architecture decisions by group

- **Storefront:** Angular SSR and hydration form the server and browser runtimes; PrimeNG and Tailwind define the UI layer. Verify changes with the Storefront build and targeted tests; boundaries between `apps/storefront` and `libs/storefront` are described in the [Storefront architecture](storefront/README.md).
- **Admin:** React and MUI provide the browser interface, while React Router handles navigation. RTK Query uses the shared API client and Axios for server state; local forms use React Hook Form and Zod. The auth transport exception is described in the [Admin ADR](admin/README.md).
- **Mobile:** The Expo SDK, Expo Router, and React Native define the native runtime and routes; Paper and additional native UI packages are used in specific scenarios. Native packages require SDK compatibility checks and a development build; see [Mobile architecture](mobile/README.md) for details.
- **Contracts:** `@redocly/cli` validates the OpenAPI snapshot, and `openapi-typescript` generates TS types; the source and workflow are in the [API contract registry](../contracts/README.md).
- **Tooling:** Nx coordinates projects and targets; Angular/Vite/Expo/Jest/Playwright packages operate within their respective clients. Declaring a direct dependency does not by itself guarantee that the corresponding target or test exists.

## Updates

When a manifest changes, update this page only if the stack composition or a decision above changes. Check native dependencies with Expo Doctor and the relevant build. Declaring a package does not prove it is used; check imports and configuration.
