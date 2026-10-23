# Admin domains and feature structure

## Target structure

```text
libs/admin/
├── core/{shell,auth,permissions}/
├── shared/{ui,api-client,contracts,config,util,testing}/
├── products/{feature,data-access,model,ui}/
├── orders/{feature,data-access,model,ui}/
├── clients/{feature,data-access,model,ui}/
└── dashboard/{feature,data-access,ui}/
```

Place new code according to this structure. Move existing code only as a separate task.

## `admin/core`

`shell` contains the application frame, navigation, layout, and route area; `auth` contains the session and authentication; `permissions` checks access. `core` does not contain rules for specific domains.

Group new `core` code by responsibility; the `src` root is not a place for internal implementations. Target structures for new or substantially changed code:

```text
libs/admin/core/
├── shell/src/
│   ├── index.ts
│   ├── layout/             # layout composition and content area
│   ├── navigation/         # nav config, sidebar, mobile drawer
│   ├── components/         # top bar and menus; breadcrumbs have been removed
│   └── hooks/              # shell-specific React hooks
├── auth/src/
│   ├── index.ts
│   ├── api/                # auth transport / RTK Query, if introduced
│   ├── session/            # session model, provider, lifecycle
│   └── hooks/              # useAuth / useSession and other public hooks
└── permissions/src/
    ├── index.ts
    ├── policies/           # permission rules and pure predicates
    ├── guards/             # route/action guards
    └── hooks/              # usePermission and derived hooks
```

Create a folder only when its responsibility exists. Do not mass-move existing flat code; split it together with a change to the relevant functionality or in a separate task.

## Business domains

A domain is isolated and exposes a public API only through its root `src/index.ts`. Deep imports into another domain's internal modules are prohibited.

| Layer         | Responsibility                                    | Must not contain              |
| ------------- | ------------------------------------------------- | ----------------------------- |
| `feature`     | Screen, user scenario, route entry, orchestration | HTTP and shared UI primitives |
| `data-access` | API, query/mutation hooks, DTO mapping, cache     | JSX and routes                |
| `model`       | Types, invariants, pure transformations           | React, HTTP, browser API      |
| `ui`          | Reusable domain presentation components           | API, router, server state     |

Create `model` only when there is shared logic or shared types. A small domain can start with `feature`; add layers when a new responsibility or reuse appears.

## Internal domain-library structure

Each library's `src/index.ts` is only its public API. Do not place internal code beside it “temporarily” or let it accumulate in a large file. Use the following folders when the corresponding role exists:

```text
libs/admin/<domain>/
├── data-access/src/
│   ├── index.ts
│   ├── api/                # injectEndpoints, hooks, endpoint definitions
│   ├── contracts/          # private transport DTO/request-response shapes
│   ├── mappers/            # DTO <-> domain/query transformations
│   ├── models/             # data-access-owned technical query/cache types
│   └── validators/         # response/query validation at the API boundary
├── model/src/
│   ├── index.ts
│   ├── entities/           # domain entities and value types
│   ├── queries/            # domain query types/defaults/invariants
│   ├── mappers/            # pure domain transformations
│   └── validators/         # pure domain validation where needed
├── ui/src/
│   ├── index.ts
│   ├── components/         # reusable presentational components
│   ├── tables/             # table shells, columns and cells
│   ├── forms/              # presentational forms and fields
│   └── states/             # loading/empty/error presentational states
└── feature/src/
    ├── index.ts
    ├── <domain>.routes.tsx
    ├── pages/              # route/page composition
    ├── components/         # feature-only composition controls
    ├── hooks/              # feature orchestration hooks
    └── state/              # local reducer/actions or durable client state
```

This does not require creating every folder in advance. It requires keeping roles separate: an endpoint does not contain a DTO parser, a mapper does not contain a React component, and a table does not contain server state or routing. When an Nx boundary prohibits `data-access -> model`, data-access-owned types stay in `data-access/models`; do not weaken global module-boundary rules for a local task.

### Example: products

The `products` domain keeps the product model, types, query invariants, and paginated list result in `products/model`; `products/data-access` owns the endpoint, API DTO, and mappers.

```text
libs/admin/products/
├── model/src/
│   ├── entities/admin-product-list-item.ts
│   └── queries/
│       ├── products-list-page.ts
│       └── products-list-query.ts
└── data-access/src/
    ├── api/admin-products.api.ts
    ├── contracts/admin-products-list.contract.ts
    └── mappers/
```

## Internal feature structure

Group internal modules by scenario purpose:

```text
libs/admin/products/feature/src/
├── index.ts
├── products.routes.tsx
├── pages/
├── components/
├── hooks/
└── state/
```

Create folders only when the corresponding code exists. If a page becomes an independent business boundary, split it into a separate feature only through a separate architecture decision.

## `admin/shared`

`admin/shared` contains only code shared by multiple domains: UI primitives, API client, transport contracts, config, util, and testing. It does not depend on domains. Do not move code needed by one domain to shared in advance.
