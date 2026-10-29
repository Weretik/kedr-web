# Mobile technology stack

## Status

Current baseline: Expo SDK 58, React Native 0.88, and React 19.3. Exact versions are defined in `package.json`/lockfile; native packages are added through the compatible Expo installer and checked with Expo Doctor.

## Core stack

| Area                 | Choice             | Usage rule                                                                                                                                              |
| -------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo             | Nx                 | The mobile app is a separate project in the existing workspace. Nx manages tasks, caching, and shared libraries.                                        |
| Native platform      | React Native       | One codebase for Android and iOS; UI is built from React Native components, not Admin web components.                                                   |
| Framework            | Expo               | Default way to run, build, and access native capabilities. Expo Go is allowed for initial work; production features use a development build.            |
| React Native runtime | New Architecture   | Use the standard architecture for the compatible Expo SDK; do not disable it. Check native dependency compatibility with Expo Doctor before adding one. |
| Navigation           | Expo Router        | File-based routing. Create new routes in `src/app`; do not duplicate navigation in a separate React Navigation configuration.                           |
| Language             | TypeScript         | Strict mode is enabled. Public APIs, request data, and forms must have explicit types.                                                                  |
| UI                   | React Native Paper | Primary library for ready-made mobile components and theme. Use standard React Native components for simple layout.                                     |

The [UI and platform capabilities catalog](ui-capabilities.md) lists approved UI, gesture, and device packages, their scenarios, and conditional-use rules. Do not install packages from it in advance.

## State, API, and forms

| Area         | Choice          | Usage rule                                                                                                                                               |
| ------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client state | Redux Toolkit   | Only for global state needed by multiple screens or services. Keep local state in the component.                                                         |
| Server state | RTK Query       | The single place for HTTP requests, caching, invalidation, and API loading states. Do not duplicate its data in a Redux slice without a separate reason. |
| Forms        | React Hook Form | Manages form values, errors, and submit state.                                                                                                           |
| Validation   | Zod             | Describes data schemas and form validation; connects to React Hook Form through a resolver.                                                              |

## On-device data and network

| Area                      | Choice                  | Usage rule                                                                                                                   |
| ------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Secrets                   | Expo SecureStore        | Sensitive data only: session tokens and other credentials. Do not use for large API responses or catalogs.                   |
| Network state             | NetInfo                 | Detects online/offline state for UX, retries, and offline scenarios. Does not replace handling actual request errors.        |
| Small non-sensitive cache | AsyncStorage (optional) | Add only for a concrete scenario not covered by RTK Query. Do not store tokens or personal data without a separate decision. |
| Full offline support      | SQLite (optional)       | Not in the first stage. Add through a separate ADR after defining synchronization, conflicts, and local data volume.         |

## Fixed boundaries

- React Admin is a reference for functionality and API, but its MUI components and tabular UI are not reused in React Native.
- Render the mobile catalog as a native list and cards, not a horizontal table.
- Contracts, DTOs, Zod schemas without UI dependencies, and pure utilities may be shared between clients. Shared domain libraries must not depend on React DOM, MUI, React Native, or Expo.
- Do not implement offline mode in the first stage; the app must report network loss correctly.

## Current decisions

- The app's Nx project is `mobile` in `apps/mobile`.
- Implemented verticals: catalog/product details, cart/checkout, and order history.
- Data source: versioned Kedr OpenAPI contract through the Mobile RTK Query stack.
- Device/E2E coverage remains a feature-level decision; an unavailable runner must not be represented as completed device verification.
