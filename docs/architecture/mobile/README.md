# Mobile architecture

**Scope:** the existing `apps/mobile` application in the KEDR Nx monorepo.

**Approach:** domain-first architecture aligned with Admin, with Expo Router as a thin routing layer and shared TypeScript contracts where appropriate.

## Purpose

This section defines the mobile application architecture contract. The [map of existing modules](structure/modules.md) shows the current code; other documents may also describe target boundaries and future capabilities. Check them against the actual repository state before implementation.

The mobile application is a separate client. It does not reuse React Admin or Angular Storefront UI code, but it may use the same backend APIs and shared domain contracts.

## Selected architecture

Mobile follows the Admin **domain-first** approach: each business domain is isolated, and its code is divided into `feature`, `data-access`, `model`, and `ui`. This does not mean reusing web code: Mobile has its own React Native/Expo UI and platform adapters.

```text
apps/mobile/src/app/                 Expo Router: routes and layouts
              │
              ▼
libs/mobile/<domain>/feature/        screen and user flow
       ├──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼
     ui/        data-access/       model/     mobile/shared/
  presentation   RTK Query/API    pure TS     Axios, config, UI
```

```text
libs/mobile/
├── core/                            shell, connectivity
├── shared/                          api-client, config, model
├── catalog/                         feature, data-access, model, ui
├── cart/                            feature, data-access, model, ui
├── orders/                          feature, data-access, model, ui
└── customers/                       data-access, model, ui
```

`apps/mobile/src/app` is the Expo Router technical layer. Route files contain no HTTP or business logic; they connect to public screens from domain `feature` libraries. Across libraries, only aliases and `src/index.ts` are allowed. DTOs stay inside `data-access`, and `ui` does not depend on the API or router.

## Document map

### Structure and dependencies

- [Existing modules and routes](structure/modules.md)
- [Domains and library structure](structure/domains.md)
- [Dependency rules](structure/dependencies.md)
- [Nx contract and public API](structure/nx-contract.md)

### Application runtime

- [Application and routing](runtime/application.md)
- [State, API, and forms](runtime/state-and-api.md)
- [Online-first and future offline support](runtime/offline-strategy.md)

### Expo platform and devices

- [Technology stack and responsibility boundaries](platform/technology-stack.md)
- [UI and platform capabilities catalog](platform/ui-capabilities.md)
- [Expo Go and Development Build](platform/development-build.md)

### Process and decisions

- [Testing strategy](workflow/testing.md)
- [SDD process](workflow/sdd-process.md)
- [Mobile ADRs](adr/)

Related standards:

- [Frontend rules index](../../standards/README.md)
- [Mobile code organization](../../standards/mobile/mobile-code-organization.md)
- [Mobile UI](../../standards/mobile/mobile-ui.md)
- [API and data rules](../../standards/shared/api-data-rules.md)
- [Testing rules](../../standards/shared/testing-rules.md)
- [Delivery rules](../../standards/shared/delivery-rules.md)
