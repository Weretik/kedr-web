# Mobile technology stack

## Status

Current baseline: Expo SDK 58, React Native 0.88, and React 19.3. The [Kedr Manager rebuild](../../../specs/mobile/manager/001-manager-app/README.md) changes the UI, state and on-device data rows below by [ADR-0005](../adr/0005-offline-first-local-database.md) and [ADR-0006](../adr/0006-own-ui-on-unistyles.md); the UI and client-state rows are in the code since stage 1, the local database from stage 2. Exact versions are defined in `package.json`/lockfile; native packages are added through the compatible Expo installer and checked with Expo Doctor.

## Core stack

| Area                 | Choice                                                                    | Usage rule                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo             | Nx                                                                        | The mobile app is a separate project in the existing workspace. Nx manages tasks, caching, and shared libraries.                                        |
| Native platform      | React Native                                                              | One codebase for Android and iOS; UI is built from React Native components, not Admin web components.                                                   |
| Framework            | Expo                                                                      | Default way to run, build, and access native capabilities. Expo Go is allowed for initial work; production features use a development build.            |
| React Native runtime | New Architecture                                                          | Use the standard architecture for the compatible Expo SDK; do not disable it. Check native dependency compatibility with Expo Doctor before adding one. |
| Navigation           | Expo Router                                                               | File-based routing. Create new routes in `src/app`; do not duplicate navigation in a separate React Navigation configuration.                           |
| Language             | TypeScript                                                                | Strict mode is enabled. Public APIs, request data, and forms must have explicit types.                                                                  |
| UI                   | Own components on `react-native-unistyles` (replacing React Native Paper) | Components in `@mobile/shared/ui` by the design system «Офіс»; themes and breakpoints from Unistyles (ADR-0006).                                        |

The [UI and platform capabilities catalog](ui-capabilities.md) lists approved UI, gesture, and device packages, their scenarios, and conditional-use rules. Do not install packages from it in advance.

## State, API, and forms

| Area         | Choice                                                     | Usage rule                                                                                                    |
| ------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Client state | Zustand (replacing Redux Toolkit)                          | Small UI state shared by screens: selected customer, filters. Keep local state in the component.              |
| Server state | Local SQLite database + sync service (replacing RTK Query) | Screens read the local database; the sync service and the send queue are the only network writers (ADR-0005). |
| Forms        | React Hook Form                                            | Manages form values, errors, and submit state.                                                                |
| Validation   | Zod                                                        | Describes data schemas and form validation; connects to React Hook Form through a resolver.                   |

## On-device data and network

| Area                      | Choice                      | Usage rule                                                                                                            |
| ------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Secrets                   | Expo SecureStore            | Sensitive data only: session tokens and other credentials. Do not use for large API responses or catalogs.            |
| Network state             | NetInfo                     | Detects online/offline state for UX, retries, and offline scenarios. Does not replace handling actual request errors. |
| Small non-sensitive cache | AsyncStorage                | Persisted Zustand stores only (theme choice, later the selected customer id). No tokens or personal data.             |
| Full offline support      | `expo-sqlite` + Drizzle ORM | Local database, sync snapshots and the send queue (ADR-0005).                                                         |

## Fixed boundaries

- React Admin is a reference for functionality and API, but its MUI components and tabular UI are not reused in React Native.
- Render the mobile catalog as a native list and cards on phones; the `wide` tablet layout may show table columns (design system «Офіс»).
- Contracts, DTOs, Zod schemas without UI dependencies, and pure utilities may be shared between clients. Shared domain libraries must not depend on React DOM, MUI, React Native, or Expo.
- Offline-first by ADR-0005: the app signs in offline for 7 days after the last server confirmation (stage 1) and reads a local database (from stage 2).

## Current decisions

- The app's Nx project is `mobile` in `apps/mobile`.
- Rebuilt as Kedr Manager by the [SDD](../../../specs/mobile/manager/001-manager-app/README.md); stage 1 (2026-11-05) delivered the «Офіс» UI, the shell with the customer gate, sign-in with the offline window and quick unlock. The old catalog, cart and order screens were removed.
- Data source: versioned Kedr OpenAPI contract; from stage 2 through the sync service into the local database.
- Unistyles 3 needs Nitro Modules, so the app runs in a Development Build, not in Expo Go.

## Versions added in stage 1 (EN-001)

Expo's online version check was not reachable from the build environment, so versions were taken from `expo/bundledNativeModules.json` of SDK 58 where listed and from the latest releases otherwise; Expo Doctor runs on the next device build.

| Package                      | Version   | Source                      |
| ---------------------------- | --------- | --------------------------- |
| `react-native-unistyles`     | `^3.8.1`  | latest 3.x, needs RN ≥ 0.85 |
| `react-native-nitro-modules` | `^0.37.2` | Unistyles peer              |
| `@gorhom/bottom-sheet`       | `^5.2.14` | latest 5.x                  |
| `zustand`                    | `^5.0.16` | latest 5.x                  |
| `expo-local-authentication`  | `~58.0.2` | SDK 58 bundled version      |
| `expo-screen-orientation`    | `~58.0.3` | SDK 58 bundled version      |

- Device/E2E coverage remains a feature-level decision; an unavailable runner must not be represented as completed device verification.
