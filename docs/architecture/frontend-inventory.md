# Current frontend inventory

**Captured:** 2026-10-01; test targets rechecked 2026-10-15
**Admin update:** 2026-10-19; the new `clients` domain, product/customer routes, and 67 projects were confirmed by `npm run architecture:boundaries`.
**Auth update:** 2026-10-28; the `users` domain (`libs/admin/users/*`) and `libs/mobile/core/auth` were added, 78 projects confirmed by `npm run architecture:boundaries`. Other sections retain the date of their previous audit.
**Sources:** `package.json`, lockfile, `nx.json`, `eslint.config.cjs`,
`tsconfig.base.json`, all `project.json` files, `npx nx show projects --json`, and
`npx nx graph --file=<temporary-json>`.

See the [technology and npm packages catalog](technology-and-packages.md) for the stack and package decisions; exact versions are in the manifests.

This document records the current workspace; it does not declare violations acceptable. Known discrepancies have `AF-*` entries in the [workspace remediation SDD](../specs/architecture/001-workspace-layers-and-boundaries/README.md).

## Package manager and frameworks

| Area            | Fact                                                                                |
| --------------- | ----------------------------------------------------------------------------------- |
| Package manager | npm 11.6.2, `package-lock.json`, Node 24.20.x                                       |
| Workspace       | Nx 23.2, 67 projects including the root npm project (checked 2026-10-19)            |
| Storefront      | Angular 21, standalone components, SSR, PrimeNG, signals/RxJS, Angular `HttpClient` |
| Admin           | React 19, Vite 8, MUI 9, Redux Toolkit/RTK Query, Axios                             |
| Mobile          | Expo 57, React Native 0.86, Expo Router, Paper, Redux Toolkit/RTK Query, Axios      |
| Contracts       | OpenAPI snapshot → `openapi-typescript` → `@shared/api-contracts`                   |

## Applications and library groups

| Application  | Composition root  | Main libraries                                                                                 |
| ------------ | ----------------- | ---------------------------------------------------------------------------------------------- |
| `storefront` | `apps/storefront` | `libs/storefront/{contracts,data-access,feature/*,shell,ui,util}` plus Angular `libs/shared/*` |
| `admin`      | `apps/admin`      | `libs/admin/{core/*,dashboard/feature,products/*,clients/*,users/*,shared/*}`                  |
| `mobile`     | `apps/mobile`     | `libs/mobile/{core/*,shared/*,catalog/*,cart/*,orders/*,customers/*}`                          |

All libraries have a root `src/index.ts`; cross-library imports found during baseline search use aliases from `tsconfig.base.json`. No deep alias imports were found. Some barrels expose internal transport/mappers/storage; this is AF-008, not an approved public contract.

## Actual project graph

Key edges that determine remediation:

```text
storefront -> storefront feature/shell/data-access + Angular shared
admin -> admin core/features/shared
mobile -> shell + mobile-core-auth + catalog/cart/orders features

mobile-core-auth -> shell + mobile-shared/api-client + mobile-shared/config + mobile-shared/ui

shell -> mobile-core-connectivity + mobile-shared/api-client + mobile-orders/model
mobile-cart-model -> mobile-orders-model
mobile-catalog-feature -> catalog lower layers + cart data-access/model
mobile-cart-feature -> cart lower layers + customers data-access/model/ui
mobile-orders-feature -> orders lower layers + customers data-access/model/ui
```

The first three cross-domain feature edges correspond to implemented user flows but need an explicit orchestration policy. `core -> orders/model` and `cart/model -> orders/model` conflict with the documented direction.

## Tags and enforcement

The workspace uses `scope:*`, `domain:*`, and `type:*`. Current `@nx/enforce-module-boundaries` checks scopes and some type directions, but:

- the Storefront app has only `scope:storefront`, without `type:app`;
- there is no general constraint for `type:model`;
- `domain:*` tags do not participate in constraints;
- `type:feature` may depend on another `type:feature`;
- Mobile composition and core rules cannot both explain a domain reducer in `@mobile/core/shell`.

Therefore, a passing lint is necessary but insufficient evidence for boundaries.

## State and API baseline

| Client     | Approved server path                                                                             | Local/client state                                              |
| ---------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Admin      | domain RTK Query endpoint → `@admin/shared/api-client` → Axios; auth raw Axios only per ADR-0001 | component state, React Hook Form; Redux for shared client state |
| Mobile     | domain RTK Query endpoint → `@mobile/shared/api-client` → Axios                                  | component/reducer, React Hook Form; root Redux store            |
| Storefront | data-access repository/facade → Angular `HttpClient`                                             | Angular signals/RxJS/domain stores                              |

No direct API calls were found in presentation `ui`. Generated DTO imports remain in transport/data-access and the Admin auth adapter. Exceptions and violations:

- Storefront public `@storefront/contracts` names domain-facing models `*Dto`, and feature imports them directly;
- catalog and order-history controllers copy paged query results into local arrays;
- RTK Query endpoints do not declare tag/invalidation semantics;
- runtime validation exists for Admin products, Mobile orders/customers/cart, and one product-details flow, but is missing for Mobile catalog list/categories and Storefront responses.

## Test and typecheck baseline

| Surface        | Runnable gates                                                                                                                             | Gap                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Admin          | inferred `typecheck`/`vite:test`, `npm run test:web`, Playwright `admin-e2e:e2e`, `typecheck:tests:web`                                    | only the app and shared API client have executable specs; generated empty suites are not characterization |
| Mobile         | app `typecheck`, `npm run test:mobile` for 21 Nx projects (app, shell, api-client, and domain libraries), `typecheck:tests:mobile`, export | no mobile E2E target                                                                                      |
| Storefront     | `storefront:lint`, production `storefront:build`, `npm run test:storefront` for `storefront-data-access`, `typecheck:tests:storefront`     | focused specs cover only data-access, not the whole app                                                   |
| Contracts/docs | `contracts:*`, `docs:check`, `docs:format:check`                                                                                           | contract generation changes generated source and runs only in API scope                                   |

Baseline 2026-10-01: `npx nx run-many -t lint --all --parallel=4` passed for 62 projects; Nx marked `admin-products-data-access:lint` flaky. `npm run typecheck:tests` passed for Web, Mobile, and Admin E2E configs.

## Empty/dead candidates

- `libs/admin/core/permissions` removed: the empty project had no consumers or production responsibility.
- `apps/mobile/src/components`;
- `libs/mobile/{catalog/feature,orders/{data-access,feature,ui}}/src/{test-mocks|lib}`;
- `libs/shared/auth/src/lib/guards`;
- `libs/storefront/feature/{articles,cabinet}/src/lib/sections`;
- `apps/storefront/public/assets/i18n`.

Deletion happens only in RM-009 after checking generated/runtime consumers; the inventory itself does not delete anything.
