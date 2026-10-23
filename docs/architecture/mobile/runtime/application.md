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

## Actual routes and target structure

Current route files in `apps/mobile/src/app` include the `(tabs)` group with `index`, `catalog`, `cart`, `orders`, and `profile`, as well as `product/[productSlug]` and `orders/[orderId]`. The [module map](../structure/modules.md) lists current libraries. The diagram below shows a possible future organization of authenticated routes; it does not describe the current file tree.

```text
apps/mobile/
├── app.json
├── project.json
└── src/
    ├── app/                         # Expo Router routes and layouts only
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   ├── (auth)/
    │   │   ├── _layout.tsx
    │   │   └── sign-in.tsx
    │   └── (app)/
    │       ├── _layout.tsx
    │       └── catalog/
    │           ├── index.tsx
    │           └── [productId].tsx
```

Route groups `(auth)` and `(app)` are not included in URLs. They separate the unauthenticated and authenticated shells. The first demo release may omit `(auth)` if the catalog does not require a session.

## Thin route example

```tsx
import { CatalogScreen } from '@mobile/catalog/feature';

export default function CatalogRoute() {
  return <CatalogScreen />;
}
```

Feature owns the scenario and screen; the app owns only the URL and Expo Router integration. The route adapter reads a dynamic product parameter and passes it to feature in a typed form.

## Providers

The root `_layout.tsx` connects one `AppProviders` from `@mobile/core/shell`. `core/shell` is the single place to configure global providers, Redux store, and the corporate Paper theme. Their order is:

1. `SafeAreaProvider`;
2. Redux `Provider`;
3. `PaperProvider` with the theme;
4. global error notifier;
5. `Slot` or Expo Router navigator.

Feature, UI components, and data-access do not create their own global providers.
