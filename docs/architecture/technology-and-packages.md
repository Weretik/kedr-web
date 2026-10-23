# Kedr Web Technologies and Direct npm Dependencies

**Verified:** 2026-10-15. **Package manager:** npm 11.6.2, Node >=24.20 <25.

This reference lists direct dependencies from four manifest files. The version on the left is declared in the manifest; the version on the right comes from the corresponding lockfile. Transitive dependencies are not inventoried here. The status “verify” means that actual package usage has not yet been demonstrated by a specific import or configuration; the table describes the package purpose rather than confirming active use. Exact architecture rules and module boundaries are defined by the [architecture](frontend-inventory.md) and application documents.

## Stack composition

| Client     | Framework and runtime      | UI and navigation                                   | State, API, and forms                                | Build and verification                    |
| ---------- | -------------------------- | --------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| Storefront | Angular 21, SSR, RxJS      | PrimeNG, Tailwind, Angular Router, Transloco        | Angular signals, NgRx Signals, HttpClient            | Nx Angular, Vite/Vitest, production build |
| Admin      | React 19                   | MUI 9, React Router 7                               | Redux Toolkit/RTK Query, Axios, React Hook Form, Zod | Nx React/Vite, Vitest, Playwright         |
| Mobile     | Expo 57, React Native 0.86 | Expo Router, React Native Paper, native UI packages | Redux Toolkit/RTK Query, Axios, React Hook Form, Zod | Nx Expo, Jest, Expo export                |

Check the client composition and actual Nx targets in the [frontend inventory](frontend-inventory.md). Mobile architecture implications are described in its [technology stack](mobile/platform/technology-stack.md) and [UI capabilities](mobile/platform/ui-capabilities.md).

## Manifest and lockfile consistency

- The root `package-lock.json` contains Expo 57.0.24 and React Native 0.86.3, matching the versions declared in the root manifest.
- `apps/mobile/package.json` declares Expo `^57.0.24` and React Native `0.86.3`; after synchronization, `apps/mobile/package-lock.json` pins Expo 57.0.29 and React Native 0.86.3. The difference between Expo 57.0.24 in the root lockfile and 57.0.29 in the mobile lockfile is allowed by the `^57.0.24` range, but both trees should be checked separately for a standalone EAS installation.
- The two library manifest files below do not have their own lockfiles; their resolved versions are taken from the root lockfile. When checking an installation, account for the exact npm workspaces/EAS mode instead of assuming identical dependency trees.

## Architecture decisions by group

- **Storefront:** Angular SSR and hydration form the server and browser runtimes; PrimeNG and Tailwind define the UI layer. Verify changes with the Storefront build and targeted tests; boundaries between `apps/storefront` and `libs/storefront` are described in the [Storefront architecture](storefront/README.md).
- **Admin:** React and MUI provide the browser interface, while React Router handles navigation. RTK Query uses the shared API client and Axios for server state; local forms use React Hook Form and Zod. The auth transport exception is described in the [Admin ADR](admin/README.md).
- **Mobile:** The Expo SDK, Expo Router, and React Native define the native runtime and routes; Paper and additional native UI packages are used in specific scenarios. Native packages require SDK compatibility checks and a development build; see [Mobile architecture](mobile/README.md) for details.
- **Contracts:** `@redocly/cli` validates the OpenAPI snapshot, and `openapi-typescript` generates TS types; the source and workflow are in the [API contract registry](../contracts/README.md).
- **Tooling:** Nx coordinates projects and targets; Angular/Vite/Expo/Jest/Playwright packages operate within their respective clients. Declaring a direct dependency does not by itself guarantee that the corresponding target or test exists.

## Full inventory

The tables list all `dependencies` and `devDependencies` entries. A package repeated across two manifest files is intentional because version ranges and installation methods may differ.

### Root manifest — runtime

| Package                                     | Declared → lock        | Context             | Purpose                                                      | Code or configuration                              | Status |
| ------------------------------------------- | ---------------------- | ------------------- | ------------------------------------------------------------ | -------------------------------------------------- | ------ |
| `@angular/common`                           | `21.2.22` → `21.2.22`  | Storefront          | Core Angular APIs: directives, pipes, and standard services. | `apps/storefront; libs/storefront; project.json`   | verify |
| `@angular/compiler`                         | `21.2.22` → `21.2.22`  | Storefront          | Runtime compiler for Angular templates.                      | `apps/storefront; libs/storefront; project.json`   | verify |
| `@angular/core`                             | `21.2.22` → `21.2.22`  | Storefront          | Angular components, DI, and reactivity.                      | `apps/storefront; libs/storefront; project.json`   | verify |
| `@angular/forms`                            | `21.2.22` → `21.2.22`  | Storefront          | Angular reactive and template-driven forms.                  | `apps/storefront; libs/storefront; project.json`   | verify |
| `@angular/platform-browser`                 | `21.2.22` → `21.2.22`  | Storefront          | Angular browser rendering and hydration.                     | `apps/storefront; libs/storefront; project.json`   | verify |
| `@angular/platform-server`                  | `21.2.22` → `21.2.22`  | Storefront          | Angular server rendering.                                    | `apps/storefront; libs/storefront; project.json`   | verify |
| `@angular/router`                           | `21.2.22` → `21.2.22`  | Storefront          | Storefront routes and guards.                                | `apps/storefront; libs/storefront; project.json`   | verify |
| `@angular/ssr`                              | `21.2.23` → `21.2.23`  | Storefront          | Angular SSR server integration.                              | `apps/storefront; libs/storefront; project.json`   | verify |
| `@emotion/react`                            | `^11.14.0` → `11.14.0` | Admin               | React styling runtime for MUI.                               | `apps/admin; libs/admin`                           | verify |
| `@emotion/styled`                           | `^11.14.1` → `11.14.1` | Admin               | Styled components engine for MUI.                            | `apps/admin; libs/admin`                           | verify |
| `@expo/metro`                               | `~56.0.2` → `56.0.2`   | Mobile              | Metro bundler integration for Expo.                          | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@expo/metro-runtime`                       | `~57.0.16` → `57.0.16` | Mobile              | Expo runtime bridge for Metro.                               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@expo/vector-icons`                        | `~15.1.0` → `15.1.1`   | Mobile              | Expo/React Native icons.                                     | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@hookform/resolvers`                       | `^5.5.7` → `5.5.7`     | Admin / Mobile      | Connects Zod schemas to React Hook Form.                     | `libs/admin; libs/mobile`                          | verify |
| `@jsverse/transloco`                        | `^8.4.0` → `8.4.0`     | Storefront          | Storefront localization and translation loading.             | `apps/storefront; libs/storefront`                 | verify |
| `@mui/icons-material`                       | `^9.2.0` → `9.4.0`     | Admin               | Material Design icons for Admin.                             | `apps/admin; libs/admin`                           | verify |
| `@mui/material`                             | `^9.2.0` → `9.4.0`     | Admin               | Core MUI components for Admin.                               | `apps/admin; libs/admin`                           | verify |
| `@mui/x-charts`                             | `^9.10.1` → `9.13.0`   | Admin               | MUI X charts.                                                | `apps/admin; libs/admin`                           | verify |
| `@mui/x-data-grid`                          | `^9.10.1` → `9.13.0`   | Admin               | MUI X data grids.                                            | `apps/admin; libs/admin`                           | verify |
| `@ngrx/operators`                           | `^21.1.1` → `21.1.1`   | Storefront          | Operators for NgRx streams.                                  | `apps/storefront; libs/storefront`                 | verify |
| `@ngrx/signals`                             | `^21.1.1` → `21.1.1`   | Storefront          | Signal stores and reactive Storefront state.                 | `apps/storefront; libs/storefront`                 | verify |
| `@primeuix/themes`                          | `^2.0.3` → `2.0.3`     | Storefront          | PrimeNG theme and design tokens.                             | `apps/storefront; libs/storefront; styles`         | verify |
| `@react-native-async-storage/async-storage` | `2.2.0` → `2.2.0`      | Mobile              | Local, unencrypted key-value storage.                        | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@react-native-community/netinfo`           | `^12.0.1` → `12.0.1`   | Mobile              | Device network connectivity status.                          | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@reduxjs/toolkit`                          | `^2.12.0` → `2.12.0`   | Admin / Mobile      | Redux store, RTK Query, and async data cache.                | `apps/admin; apps/mobile; libs/admin; libs/mobile` | verify |
| `@shopify/flash-list`                       | `^2.0.2` → `2.0.2`     | Mobile              | High-performance product list.                               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@tailwindcss/postcss`                      | `^4.3.3` → `4.3.3`     | Storefront / styles | Tailwind PostCSS plugin.                                     | `apps/storefront; apps/storefront; tools/tokens`   | verify |
| `axios`                                     | `^1.18.1` → `1.20.0`   | Admin / Mobile      | HTTP client for Admin/Mobile API adapters.                   | `libs/admin; libs/mobile`                          | verify |
| `expo`                                      | `^57.0.24` → `57.0.24` | Mobile              | Expo SDK and Mobile app runtime.                             | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-image`                                | `~57.0.5` → `57.0.5`   | Mobile              | Optimized image rendering for Expo.                          | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-router`                               | `~57.0.22` → `57.0.22` | Mobile              | File-based routing for Mobile.                               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-splash-screen`                        | `~57.0.9` → `57.0.9`   | Mobile              | Expo splash screen management.                               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-status-bar`                           | `~57.0.1` → `57.0.1`   | Mobile              | Expo status bar management.                                  | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-system-ui`                            | `~57.0.4` → `57.0.4`   | Mobile              | Expo system theme and UI settings.                           | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `express`                                   | `^4.22.2` → `4.22.2`   | Storefront SSR      | Node HTTP server for Angular SSR.                            | `apps/storefront`                                  | verify |
| `ngxtension`                                | `^7.2.0` → `7.3.0`     | Storefront          | Angular utility extensions.                                  | `apps/storefront; libs/storefront`                 | verify |
| `postcss`                                   | `^8.5.22` → `8.5.28`   | Storefront / styles | PostCSS pipeline for processing styles.                      | `apps/storefront; apps/storefront; tools/tokens`   | verify |
| `primeicons`                                | `^7.0.0` → `7.0.0`     | Storefront          | PrimeNG icons.                                               | `apps/storefront; libs/storefront; styles`         | verify |
| `primeng`                                   | `^21.1.9` → `21.1.9`   | Storefront          | PrimeNG components.                                          | `apps/storefront; libs/storefront; styles`         | verify |
| `react`                                     | `19.2.3` → `19.2.3`    | Admin / Mobile      | React components and hooks.                                  | `apps/admin; apps/mobile; libs/admin; libs/mobile` | verify |
| `react-dom`                                 | `19.2.3` → `19.2.3`    | Admin / Mobile      | React DOM rendering or the Mobile web adapter.               | `apps/admin; apps/mobile; libs/admin; libs/mobile` | verify |
| `react-hook-form`                           | `^7.83.0` → `7.83.0`   | Admin / Mobile      | React form field and state management.                       | `libs/admin; libs/mobile`                          | verify |
| `react-native`                              | `0.86.3` → `0.86.3`    | Mobile              | React Native runtime and native components.                  | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-actions-sheet`                | `^0.9.7` → `0.9.8`     | Mobile              | Mobile action sheet.                                         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-gesture-handler`              | `~2.32.0` → `2.32.0`   | Mobile              | Native gesture handling.                                     | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-paper`                        | `^5.15.3` → `5.15.3`   | Mobile              | Material Design components for Mobile.                       | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-reanimated`                   | `4.5.1` → `4.5.1`      | Mobile              | Native animations.                                           | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-reanimated-carousel`          | `^5.1.1` → `5.1.1`     | Mobile              | Carousel built on Reanimated.                                | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-safe-area-context`            | `~5.7.0` → `5.7.0`     | Mobile              | Safe-area insets for Mobile screens.                         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-svg`                          | `15.15.4` → `15.15.4`  | Mobile              | SVG rendering in React Native.                               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-svg-transformer`              | `~1.5.1` → `1.5.3`     | Mobile              | Metro transformer SVG imports.                               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-web`                          | `~0.21.0` → `0.21.2`   | Mobile              | React Native web adapter.                                    | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-worklets`                     | `0.10.1` → `0.10.1`    | Mobile              | Worklets runtime for native animations.                      | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-redux`                               | `^9.3.0` → `9.3.0`     | Admin / Mobile      | React bindings for the Redux store.                          | `apps/admin; apps/mobile; libs/admin; libs/mobile` | verify |
| `react-router-dom`                          | `^7.18.1` → `7.18.3`   | Admin               | Admin browser routes.                                        | `apps/admin`                                       | verify |
| `remixicon`                                 | `^4.9.1` → `4.9.1`     | Storefront          | Alternative UI icon set.                                     | `apps/storefront; libs/storefront; styles`         | verify |
| `rxjs`                                      | `~7.8.2` → `7.8.2`     | Storefront          | Core Observable streams for Angular.                         | `apps/storefront; libs/storefront`                 | verify |
| `tailwindcss`                               | `^4.3.3` → `4.3.3`     | Storefront / styles | Utility CSS framework.                                       | `apps/storefront; apps/storefront; tools/tokens`   | verify |
| `tailwindcss-primeui`                       | `^0.6.1` → `0.6.1`     | Storefront          | Tailwind integration for PrimeNG.                            | `apps/storefront; libs/storefront; styles`         | verify |
| `zod`                                       | `^4.4.3` → `4.5.4`     | Admin / Mobile      | Runtime schemas for validating data and forms.               | `libs/admin; libs/mobile`                          | verify |
| `zone.js`                                   | `0.16.3` → `0.16.3`    | Storefront          | Execution context for Angular change detection.              | `apps/storefront; libs/storefront`                 | verify |

Sources: [manifest](../../package.json) (`dependencies`), [lockfile](../../package-lock.json).

### Root manifest — development

| Package                                  | Declared → lock         | Context                    | Purpose                                                  | Code or configuration                                   | Status  |
| ---------------------------------------- | ----------------------- | -------------------------- | -------------------------------------------------------- | ------------------------------------------------------- | ------- |
| `@analogjs/vite-plugin-angular`          | `2.7.2` → `2.7.2`       | Storefront / tests         | Vite plugin for Angular compilation.                     | `apps/storefront; libs/storefront/*/vite.config.*`      | tooling |
| `@analogjs/vitest-angular`               | `2.7.2` → `2.7.2`       | Storefront / tests         | Angular fixtures and Vitest integration.                 | `apps/storefront; libs/storefront/*/vite.config.*`      | tooling |
| `@angular-devkit/core`                   | `21.2.23` → `21.2.23`   | Storefront / tooling       | Angular CLI DevKit: workspace/configuration API.         | `project.json; apps/storefront; nx.json`                | tooling |
| `@angular-devkit/schematics`             | `21.2.23` → `21.2.23`   | Storefront / tooling       | DevKit API for generators and schematics.                | `project.json; apps/storefront; nx.json`                | tooling |
| `@angular-eslint/builder`                | `21.4.0` → `21.4.0`     | Storefront / lint          | Runs the Angular ESLint builder.                         | `eslint.config.cjs`                                     | tooling |
| `@angular-eslint/eslint-plugin`          | `21.4.0` → `21.4.0`     | Storefront / lint          | ESLint rules for Angular TypeScript.                     | `eslint.config.cjs`                                     | tooling |
| `@angular-eslint/eslint-plugin-template` | `21.4.0` → `21.4.0`     | Storefront / lint          | ESLint rules for Angular HTML templates.                 | `eslint.config.cjs`                                     | tooling |
| `@angular-eslint/template-parser`        | `21.4.0` → `21.4.0`     | Storefront / lint          | Angular template parser for ESLint.                      | `eslint.config.cjs`                                     | tooling |
| `@angular/build`                         | `21.2.23` → `21.2.23`   | Storefront / tooling       | Nx/Angular build pipeline.                               | `project.json; apps/storefront; nx.json`                | tooling |
| `@angular/cli`                           | `21.2.23` → `21.2.23`   | Storefront / tooling       | Angular CLI commands.                                    | `project.json; apps/storefront; nx.json`                | tooling |
| `@angular/compiler-cli`                  | `21.2.22` → `21.2.22`   | Storefront / tooling       | Ahead-of-time compilation for Angular.                   | `project.json; apps/storefront; nx.json`                | tooling |
| `@angular/language-service`              | `21.2.22` → `21.2.22`   | Storefront / tooling       | Angular language service for the editor.                 | `project.json; apps/storefront; nx.json`                | tooling |
| `@babel/core`                            | `^7.29.7` → `7.29.7`    | Workspace / build          | Babel core transformation API.                           | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `@babel/preset-react`                    | `^7.29.7` → `7.29.7`    | Workspace / build          | Babel preset for React JSX.                              | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `@eslint/js`                             | `^9.39.5` → `9.39.5`    | Workspace / lint           | Core recommended ESLint rules.                           | `eslint.config.cjs`                                     | tooling |
| `@expo/cli`                              | `^57.0.26` → `57.0.26`  | Mobile                     | CLI for running and building Expo.                       | `apps/mobile; libs/mobile; apps/mobile/app.json`        | verify  |
| `@expo/ngrok`                            | `^4.1.0` → `4.1.3`      | Mobile                     | ngrok tunnel for local Expo development.                 | `apps/mobile; libs/mobile; apps/mobile/app.json`        | verify  |
| `@nx/angular`                            | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for Angular targets and generators.            | `nx.json; project.json; tools`                          | tooling |
| `@nx/devkit`                             | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx API for generators and the project graph.             | `nx.json; project.json; tools`                          | tooling |
| `@nx/docker`                             | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for Docker targets.                            | `nx.json; project.json; tools`                          | tooling |
| `@nx/esbuild`                            | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for esbuild targets.                           | `nx.json; project.json; tools`                          | tooling |
| `@nx/eslint`                             | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx integration for ESLint.                               | `nx.json; project.json; tools`                          | tooling |
| `@nx/eslint-plugin`                      | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx ESLint rules and module boundaries.                   | `nx.json; project.json; tools`                          | tooling |
| `@nx/expo`                               | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for Expo targets.                              | `nx.json; project.json; tools`                          | tooling |
| `@nx/jest`                               | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for Jest targets.                              | `nx.json; project.json; tools`                          | tooling |
| `@nx/js`                                 | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for JavaScript/TypeScript.                     | `nx.json; project.json; tools`                          | tooling |
| `@nx/node`                               | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for Node targets.                              | `nx.json; project.json; tools`                          | tooling |
| `@nx/playwright`                         | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for Playwright targets.                        | `nx.json; project.json; tools`                          | tooling |
| `@nx/react`                              | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for React targets.                             | `nx.json; project.json; tools`                          | tooling |
| `@nx/vite`                               | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for Vite targets.                              | `nx.json; project.json; tools`                          | tooling |
| `@nx/vitest`                             | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for Vitest targets.                            | `nx.json; project.json; tools`                          | tooling |
| `@nx/web`                                | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx plugin for web targets.                               | `nx.json; project.json; tools`                          | tooling |
| `@nx/workspace`                          | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx workspace commands and project graph.                 | `nx.json; project.json; tools`                          | tooling |
| `@playwright/test`                       | `^1.63.0` → `1.63.0`    | Admin E2E / tooling        | Playwright browser E2E runner.                           | `apps/admin-e2e; playwright.config.*`                   | tooling |
| `@react-native/jest-preset`              | `0.86.3` → `0.86.3`     | Mobile                     | React Native Jest preset.                                | `apps/mobile; libs/mobile; apps/mobile/app.json`        | verify  |
| `@redocly/cli`                           | `^2.53.2` → `2.53.2`    | API contracts              | OpenAPI document validation.                             | `tools/contracts; package.json scripts; docs/contracts` | tooling |
| `@rolldown/plugin-babel`                 | `0.2.4` → `0.2.4`       | Workspace / build          | Babel transform plugin for Rolldown.                     | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `@schematics/angular`                    | `21.2.23` → `21.2.23`   | Storefront / tooling       | Angular code generation schematics.                      | `project.json; apps/storefront; nx.json`                | tooling |
| `@swc-node/register`                     | `~1.12.1` → `1.12.1`    | Workspace / build          | SWC registration for Node TS files.                      | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `@swc/core`                              | `~1.15.46` → `1.15.47`  | Workspace / build          | SWC transpiler.                                          | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `@swc/helpers`                           | `~0.5.23` → `0.5.23`    | Workspace / build          | Runtime helpers for generated SWC code.                  | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `@testing-library/dom`                   | `10.4.1` → `10.4.1`     | Workspace / tests          | DOM testing utilities.                                   | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `@testing-library/jest-dom`              | `7.0.1` → `7.0.1`       | Workspace / tests          | DOM matchers for Jest/Vitest.                            | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `@testing-library/react`                 | `16.3.3` → `16.3.3`     | Workspace / tests          | React component testing utilities.                       | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `@testing-library/react-native`          | `~13.2.0` → `13.2.2`    | Workspace / tests          | React Native component testing utilities.                | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `@testing-library/user-event`            | `14.6.7` → `14.6.7`     | Workspace / tests          | User interaction simulation in DOM tests.                | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `@types/express`                         | `^4.17.25` → `4.17.25`  | Workspace / TypeScript     | Type definitions for Express.                            | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `@types/jest`                            | `29.5.14` → `29.5.14`   | Workspace / TypeScript     | Type definitions for Jest.                               | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `@types/node`                            | `24.10.13` → `24.10.13` | Workspace / TypeScript     | Type definitions for Node.js.                            | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `@types/react`                           | `^19.2.17` → `19.2.18`  | Workspace / TypeScript     | Type definitions for React.                              | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `@types/react-dom`                       | `^19.2.3` → `19.2.7`    | Workspace / TypeScript     | Type definitions for React DOM.                          | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `@types/supertest`                       | `^6.0.3` → `6.0.3`      | Workspace / TypeScript     | Type definitions for Supertest.                          | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `@typescript-eslint/eslint-plugin`       | `^8.65.0` → `8.70.0`    | Workspace / TypeScript     | TypeScript ESLint rules.                                 | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `@typescript-eslint/parser`              | `^8.65.0` → `8.70.0`    | Workspace / TypeScript     | TypeScript parser for ESLint.                            | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `@typescript-eslint/utils`               | `^8.65.0` → `8.70.0`    | Workspace / TypeScript     | TypeScript ESLint utility API.                           | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `@vitejs/plugin-react`                   | `6.1.1` → `6.1.1`       | Workspace / build          | Vite plugin for React and Fast Refresh.                  | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `@vitest/coverage-v8`                    | `4.1.11` → `4.1.11`     | Workspace / tests          | Vitest V8 coverage provider.                             | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `@vitest/ui`                             | `4.1.11` → `4.1.11`     | Workspace / tests          | Vitest browser UI.                                       | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `angular-eslint`                         | `21.4.0` → `21.4.0`     | Storefront / lint          | Consistent Angular ESLint configuration.                 | `eslint.config.cjs`                                     | tooling |
| `babel-jest`                             | `~29.7.0` → `29.7.0`    | Workspace / build          | Babel transform in Jest.                                 | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `babel-plugin-react-compiler`            | `^1.0.0` → `1.0.0`      | Workspace / build          | Babel plugin React Compiler.                             | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `babel-preset-expo`                      | `~57.0.12` → `57.0.12`  | Workspace / build          | Babel preset Expo/React Native.                          | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `chroma-js`                              | `^3.2.0` → `3.2.0`      | Storefront / design tokens | Color manipulation in the design token generator.        | `tools/tokens`                                          | tooling |
| `cross-env`                              | `^10.1.0` → `10.1.0`    | Workspace / tooling        | Cross-platform setting of env vars in scripts.           | `.husky; package.json scripts; .prettierrc*`            | tooling |
| `esbuild`                                | `^0.28.1` → `0.28.2`    | Workspace / build          | Fast JS/TS bundler.                                      | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `eslint`                                 | `^9.39.5` → `9.39.5`    | Workspace / lint           | ESLint runner.                                           | `eslint.config.cjs`                                     | tooling |
| `eslint-config-prettier`                 | `^10.1.8` → `10.1.8`    | Workspace / lint           | Disables ESLint style rules that conflict with Prettier. | `eslint.config.cjs`                                     | tooling |
| `eslint-plugin-import`                   | `^2.32.0` → `2.32.0`    | Workspace / lint           | ESLint rules for import statements.                      | `eslint.config.cjs`                                     | tooling |
| `eslint-plugin-jsx-a11y`                 | `6.10.2` → `6.10.2`     | Workspace / lint           | ESLint rules for JSX accessibility.                      | `eslint.config.cjs`                                     | tooling |
| `eslint-plugin-playwright`               | `^1.8.3` → `1.8.3`      | Admin E2E / tooling        | ESLint rules for Playwright tests.                       | `apps/admin-e2e; playwright.config.*`                   | tooling |
| `eslint-plugin-prettier`                 | `^5.5.6` → `5.5.6`      | Workspace / lint           | ESLint integration Prettier.                             | `eslint.config.cjs`                                     | tooling |
| `eslint-plugin-react`                    | `7.37.5` → `7.37.5`     | Workspace / lint           | ESLint rules for React.                                  | `eslint.config.cjs`                                     | tooling |
| `eslint-plugin-react-hooks`              | `5.2.0` → `5.2.0`       | Workspace / lint           | ESLint rules for React hooks.                            | `eslint.config.cjs`                                     | tooling |
| `husky`                                  | `^9.1.7` → `9.1.7`      | Workspace / tooling        | Git hook runner.                                         | `.husky; package.json scripts; .prettierrc*`            | tooling |
| `jest`                                   | `~29.7.0` → `29.7.0`    | Workspace / tests          | Jest test runner.                                        | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `jest-environment-jsdom`                 | `~29.7.0` → `29.7.0`    | Workspace / tests          | Jest DOM environment.                                    | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `jest-environment-node`                  | `~29.7.0` → `29.7.0`    | Workspace / tests          | Jest Node environment.                                   | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `jest-expo`                              | `~57.0.5` → `57.0.5`    | Workspace / tests          | Expo Jest preset.                                        | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `jest-util`                              | `~29.7.0` → `29.7.0`    | Workspace / tests          | Jest utility helpers.                                    | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `jiti`                                   | `2.7.0` → `2.7.0`       | Workspace / lint           | Loads TS/ESM configuration in Node.                      | `eslint.config.cjs`                                     | tooling |
| `jsdom`                                  | `~22.1.0` → `22.1.0`    | Workspace / tests          | DOM emulator for unit tests.                             | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `jsonc-eslint-parser`                    | `^2.4.2` → `2.4.2`      | Workspace / lint           | JSON/JSONC parser for ESLint.                            | `eslint.config.cjs`                                     | tooling |
| `lint-staged`                            | `^16.4.0` → `16.4.0`    | Workspace / tooling        | Runs checks on staged files.                             | `.husky; package.json scripts; .prettierrc*`            | tooling |
| `nx`                                     | `23.2.0` → `23.2.0`     | Workspace / tooling        | Nx workspace commands and project graph.                 | `nx.json; project.json; tools`                          | tooling |
| `openapi-typescript`                     | `^7.13.0` → `7.13.0`    | API contracts              | Generates TypeScript types from OpenAPI.                 | `tools/contracts; package.json scripts; docs/contracts` | tooling |
| `prettier`                               | `~3.9.6` → `3.9.6`      | Workspace / tooling        | Formats Markdown and code.                               | `.husky; package.json scripts; .prettierrc*`            | tooling |
| `react-test-renderer`                    | `19.2.3` → `19.2.3`     | Workspace / tests          | React renderer for snapshot/component tests.             | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `supertest`                              | `^7.2.2` → `7.2.2`      | Workspace / tests          | HTTP assertions for Express tests.                       | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `ts-jest`                                | `^29.4.7` → `29.4.12`   | Workspace / TypeScript     | TypeScript transform for Jest.                           | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `ts-node`                                | `10.9.2` → `10.9.2`     | Workspace / TypeScript     | Runs TypeScript in Node.js.                              | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `tslib`                                  | `^2.8.1` → `2.8.1`      | Workspace / TypeScript     | TypeScript runtime helpers.                              | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `typescript`                             | `5.9.3` → `5.9.3`       | Workspace / TypeScript     | TypeScript compiler.                                     | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `typescript-eslint`                      | `^8.65.0` → `8.70.0`    | Workspace / TypeScript     | Unified TypeScript ESLint configuration.                 | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `vite`                                   | `8.2.2` → `8.2.2`       | Workspace / build          | Vite build/dev/test infrastructure.                      | `vite.config.*; babel.config.*; apps/mobile; nx.json`   | tooling |
| `vitest`                                 | `4.1.11` → `4.1.11`     | Workspace / tests          | Vitest test runner.                                      | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |

Sources: [manifest](../../package.json) (`devDependencies`), [lockfile](../../package-lock.json).

### Mobile manifest — runtime

| Package                                     | Declared → lock        | Context | Purpose                                        | Code or configuration                              | Status |
| ------------------------------------------- | ---------------------- | ------- | ---------------------------------------------- | -------------------------------------------------- | ------ |
| `@expo/metro`                               | `~56.0.0` → `56.0.2`   | Mobile  | Metro bundler integration for Expo.            | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@expo/vector-icons`                        | `~15.1.0` → `15.1.1`   | Mobile  | Expo/React Native icons.                       | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@hookform/resolvers`                       | `^5.5.7` → `5.5.7`     | Mobile  | Connects Zod schemas to React Hook Form.       | `libs/admin; libs/mobile`                          | verify |
| `@react-native-assets/slider`               | `^11.0.12` → `11.0.12` | Mobile  | Native slider control.                         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@react-native-async-storage/async-storage` | `2.2.0` → `2.2.0`      | Mobile  | Local, unencrypted key-value storage.          | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@react-native-community/netinfo`           | `12.0.1` → `12.0.1`    | Mobile  | Device network connectivity status.            | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `@reduxjs/toolkit`                          | `^2.12.0` → `2.12.0`   | Mobile  | Redux store, RTK Query, and async data cache.  | `apps/admin; apps/mobile; libs/admin; libs/mobile` | verify |
| `@shopify/flash-list`                       | `2.0.2` → `2.0.2`      | Mobile  | High-performance product list.                 | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `axios`                                     | `^1.18.1` → `1.18.1`   | Mobile  | HTTP client for Admin/Mobile API adapters.     | `libs/admin; libs/mobile`                          | verify |
| `expo`                                      | `^57.0.24` → `57.0.29` | Mobile  | Expo SDK and Mobile app runtime.               | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-blur`                                 | `~57.0.3` → `57.0.3`   | Mobile  | Native UI blur effect.                         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-constants`                            | `~57.0.19` → `57.0.22` | Mobile  | Access to Expo configuration and constants.    | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-font`                                 | `~57.0.4` → `57.0.4`   | Mobile  | Loading custom fonts in Expo.                  | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-image`                                | `~57.0.5` → `57.0.5`   | Mobile  | Optimized image rendering for Expo.            | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-linking`                              | `~57.0.10` → `57.0.13` | Mobile  | Deep linking and URL handling in Expo.         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-router`                               | `~57.0.22` → `57.0.27` | Mobile  | File-based routing for Mobile.                 | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-secure-store`                         | `~57.0.4` → `57.0.4`   | Mobile  | Secure storage for device secrets.             | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-splash-screen`                        | `~57.0.9` → `57.0.10`  | Mobile  | Expo splash screen management.                 | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-status-bar`                           | `~57.0.1` → `57.0.1`   | Mobile  | Expo status bar management.                    | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `expo-system-ui`                            | `~57.0.4` → `57.0.4`   | Mobile  | Expo system theme and UI settings.             | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react`                                     | `19.2.3` → `19.2.3`    | Mobile  | React components and hooks.                    | `apps/admin; apps/mobile; libs/admin; libs/mobile` | verify |
| `react-dom`                                 | `19.2.3` → `19.2.3`    | Mobile  | React DOM rendering or the Mobile web adapter. | `apps/admin; apps/mobile; libs/admin; libs/mobile` | verify |
| `react-hook-form`                           | `^7.83.0` → `7.83.0`   | Mobile  | React form field and state management.         | `libs/admin; libs/mobile`                          | verify |
| `react-native`                              | `0.86.3` → `0.86.3`    | Mobile  | React Native runtime and native components.    | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-actions-sheet`                | `^0.9.7` → `0.9.8`     | Mobile  | Mobile action sheet.                           | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-gesture-handler`              | `~2.32.0` → `2.32.0`   | Mobile  | Native gesture handling.                       | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-paper`                        | `^5.15.3` → `5.15.3`   | Mobile  | Material Design components for Mobile.         | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-reanimated`                   | `4.5.1` → `4.5.1`      | Mobile  | Native animations.                             | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-reanimated-carousel`          | `^5.1.1` → `5.2.0`     | Mobile  | Carousel built on Reanimated.                  | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-safe-area-context`            | `~5.7.0` → `5.7.0`     | Mobile  | Safe-area insets for Mobile screens.           | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-screens`                      | `~4.26.0` → `4.26.2`   | Mobile  | Native screen primitives for navigation.       | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-svg`                          | `15.15.4` → `15.15.4`  | Mobile  | SVG rendering in React Native.                 | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-svg-transformer`              | `~1.5.1` → `1.5.3`     | Mobile  | Metro transformer SVG imports.                 | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-tree-multi-select`            | `^3.0.2` → `3.0.6`     | Mobile  | Tree-based multi-select for Mobile.            | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-web`                          | `~0.21.0` → `0.21.2`   | Mobile  | React Native web adapter.                      | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-native-worklets`                     | `0.10.1` → `0.10.1`    | Mobile  | Worklets runtime for native animations.        | `apps/mobile; libs/mobile; apps/mobile/app.json`   | verify |
| `react-redux`                               | `^9.3.0` → `9.3.0`     | Mobile  | React bindings for the Redux store.            | `apps/admin; apps/mobile; libs/admin; libs/mobile` | verify |
| `zod`                                       | `^4.4.3` → `4.4.3`     | Mobile  | Runtime schemas for validating data and forms. | `libs/admin; libs/mobile`                          | verify |

Sources: [manifest](../../apps/mobile/package.json) (`dependencies`), [lockfile](../../apps/mobile/package-lock.json).

### Mobile manifest — development

| Package                         | Declared → lock       | Context                | Purpose                                                        | Code or configuration                                   | Status  |
| ------------------------------- | --------------------- | ---------------------- | -------------------------------------------------------------- | ------------------------------------------------------- | ------- |
| `@testing-library/react-native` | `~13.2.0` → `13.2.2`  | Mobile / tests         | React Native component testing utilities.                      | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `@react-native/jest-preset`     | `0.86.3` → `0.86.3`   | Mobile / tests         | React Native Jest preset for a compatible native test runtime. | `apps/mobile; jest.config.*`                            | verify  |
| `@types/jest`                   | `29.5.14` → `29.5.14` | Workspace / TypeScript | Type definitions for Jest.                                     | `tsconfig.base.json; tsconfig*.json; eslint.config.cjs` | tooling |
| `jest`                          | `~29.7.0` → `29.7.0`  | Mobile / tests         | Jest test runner.                                              | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |
| `jest-expo`                     | `~57.0.5` → `57.0.6`  | Mobile / tests         | Expo Jest preset.                                              | `apps/*; libs/*; jest.config.*; vite.config.*`          | tooling |

Sources: [manifest](../../apps/mobile/package.json) (`devDependencies`), [lockfile](../../apps/mobile/package-lock.json).

### Mobile catalog feature — runtime

| Package                                     | Declared → lock   | Context | Purpose                               | Code or configuration                            | Status |
| ------------------------------------------- | ----------------- | ------- | ------------------------------------- | ------------------------------------------------ | ------ |
| `@react-native-async-storage/async-storage` | `2.2.0` → `2.2.0` | Mobile  | Local, unencrypted key-value storage. | `apps/mobile; libs/mobile; apps/mobile/app.json` | verify |

Sources: [manifest](../../libs/mobile/catalog/feature/package.json) (`dependencies`), [lockfile](../../package-lock.json).

### Mobile catalog UI — runtime

| Package                          | Declared → lock        | Context | Purpose                             | Code or configuration                            | Status |
| -------------------------------- | ---------------------- | ------- | ----------------------------------- | ------------------------------------------------ | ------ |
| `@react-native-assets/slider`    | `^11.0.12` → `11.0.12` | Mobile  | Native slider control.              | `apps/mobile; libs/mobile; apps/mobile/app.json` | verify |
| `@shopify/flash-list`            | `2.0.2` → `2.0.2`      | Mobile  | High-performance product list.      | `apps/mobile; libs/mobile; apps/mobile/app.json` | verify |
| `react-native-actions-sheet`     | `^0.9.7` → `0.9.8`     | Mobile  | Mobile action sheet.                | `apps/mobile; libs/mobile; apps/mobile/app.json` | verify |
| `react-native-tree-multi-select` | `^3.0.2` → `3.0.6`     | Mobile  | Tree-based multi-select for Mobile. | `apps/mobile; libs/mobile; apps/mobile/app.json` | verify |

Sources: [manifest](../../libs/mobile/catalog/ui/package.json) (`dependencies`), [lockfile](../../package-lock.json).

## Updates

When any `package.json` or lockfile changes, recheck all six tables, actual imports/config/scripts, and applicable client documents. For a package marked `verify`, find an import or configuration, identify the decision owner, and only then change its status. Also check native dependencies with Expo Doctor and the relevant build. Do not keep `npm ls` output in the documentation as a source of truth.
