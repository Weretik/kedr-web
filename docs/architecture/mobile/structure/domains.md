# Mobile domains and library structure

## Target boundaries and actual modules

The current `catalog`, `cart`, `orders`, `customers`, `core`, and `shared` are listed in the [map of existing modules](modules.md). The diagram below and the following `catalog` example show the principle for assigning responsibility; they are not a complete list of implemented libraries.

```text
libs/mobile/
├── core/
│   ├── shell/
│   ├── auth/
│   └── connectivity/
├── shared/
│   ├── api-client/
│   ├── config/
│   ├── ui/
│   └── util/
└── catalog/
    ├── feature/
    ├── data-access/
    ├── model/
    └── ui/
```

Create new libraries only when their responsibility appears; do not create them in advance. `orders` already has its own libraries; the current map has no separate `profile` feature project.

## `mobile/core`

`shell` contains the mobile shell: global providers, Redux store, corporate Paper theme mapping, safe-area `AppScreen`, tab/stack composition, shared headers, and navigation configurations that do not belong to a specific domain. `auth` owns session lifecycle and the Expo SecureStore adapter. `connectivity` encapsulates NetInfo and provides normalized online/offline state to the app.

`core` does not contain products, orders, or other domain logic.

`shared/ui` contains only reusable presentational components and does not own the theme, store, safe-area shell, or global providers.

## Business domains

A domain exposes its public API only through its root `src/index.ts`. Deep imports into another domain's internal modules are prohibited.

| Layer         | Responsibility                                                                | Must not contain                                            |
| ------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `feature`     | Mobile scenario, screen, orchestration, local state                           | HTTP details, shared UI primitives, Expo Router route files |
| `data-access` | RTK Query endpoints, DTOs, mapping, response validation, cache tags           | JSX, routes, Paper components                               |
| `model`       | Domain types, invariants, pure transformations, Zod schemas when domain-owned | React, HTTP, Expo APIs                                      |
| `ui`          | Reusable domain presentation components based on React Native Paper           | API, router, server state                                   |

A small scenario may start with `feature` and `data-access`. Extract `model` and `ui` when types/logic or components begin to be reused. This is the same evolutionary model as Admin.

## Example domain structure: `catalog`

```text
libs/mobile/catalog/
├── feature/src/
│   ├── index.ts
│   ├── screens/
│   │   ├── catalog-screen.tsx
│   │   └── product-details-screen.tsx
│   ├── components/
│   └── hooks/
├── data-access/src/
│   ├── index.ts
│   ├── api/
│   ├── contracts/
│   ├── mappers/
│   └── validators/
├── model/src/
│   ├── index.ts
│   ├── entities/
│   └── queries/
└── ui/src/
    ├── index.ts
    ├── components/
    └── states/
```

`CatalogScreen` composes search, list, loading/empty/error states, and navigation. `data-access` returns domain models, not API DTOs. `ProductCard` belongs in `catalog/ui` if it is used in more than one screen in the domain.

## Code shared between clients

Do not move code to root `libs/shared` only because it is called “shared”. Keep it in `libs/mobile` or `libs/admin` first. A shared library is allowed only for pure TypeScript contracts, DTOs, Zod schemas, or utilities actually used by at least two clients and without dependencies on React DOM, MUI, React Native, Expo, or browser APIs.

UI, navigation, auth storage, and HTTP runtime configuration remain platform-specific even if they play similar roles on web and mobile.
