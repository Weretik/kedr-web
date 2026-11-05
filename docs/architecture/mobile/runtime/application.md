# Mobile application and routing

## Architecture decision

Mobile uses the same foundational principles as Admin: domain-first libraries, clear `feature` / `data-access` / `model` / `ui` layers, public entry points, and Nx boundary enforcement. This lets the team follow familiar rules and keeps `apps/mobile` from becoming a monolith.

The structure does not copy Admin literally. It is adapted to Expo Router: physical route files must live in `apps/mobile/src/app`, so they act as thin adapters between file-based routing and feature libraries.

## `apps/mobile` responsibilities

The application contains only Expo-specific composition:

- Expo configuration and entry point;
- Expo Router file routes and `_layout.tsx`;
- connection of one `AppProviders` from `@mobile/core/shell`;
- configuration bootstrap and routing redirects.

Do not place HTTP calls, business logic, complex UI, or domain types in a route. A route imports one screen or scenario from a feature library and passes only route parameters.

## Actual routes

```text
apps/mobile/
├── index.ts                         # Unistyles themes first, then Expo Router
├── babel.config.js                  # Unistyles Babel plugin
└── src/app/                         # Expo Router routes and layouts only
    ├── _layout.tsx                  # fonts, providers, session split
    ├── login.tsx
    ├── index.tsx                    # → /customer
    └── (work)/                      # signed-in area: tab bar on phones, rail on tablets
        ├── _layout.tsx              # WorkLayout with the customer gate
        ├── customer/  products/  orders/   # section stacks
        ├── calculation.tsx
        └── cabinet.tsx
```

The group `(work)` is not part of URLs. Its planned routes are in the [Kedr Manager frontend design](../../../specs/mobile/manager/001-manager-app/design/frontend.md#navigation).

## Thin route example

```tsx
import { LoginScreen } from '@mobile/core/auth';

export default function LoginRoute() {
  return <LoginScreen />;
}
```

Feature owns the scenario and screen; the app owns only the URL and Expo Router integration. The route adapter reads a dynamic product parameter and passes it to feature in a typed form.

## Providers

The root `_layout.tsx` connects one `AppProviders` from `@mobile/core/shell`. Themes are not a provider: Unistyles is configured once when `@mobile/shared/ui` is first imported by the app entry. The provider order is:

1. `GestureHandlerRootView`;
2. `SafeAreaProvider`;
3. navigation `ThemeProvider` with colors from the current «Офіс» theme;
4. `BottomSheetModalProvider` for the one `Sheet`;
5. connectivity context, status bar, then the Expo Router navigator.

Feature, UI components, and data-access do not create their own global providers. Small shared UI state (theme choice, later the selected customer) lives in Zustand stores.
