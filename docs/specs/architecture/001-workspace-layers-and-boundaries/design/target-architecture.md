# Workspace layers and boundaries — target architecture

## As-is inventory

| Area                       | Actual roles/tools                                                                | Problem        |
| -------------------------- | --------------------------------------------------------------------------------- | -------------- |
| Nx config                  | scopes + partial type constraints; domain tags informational                      | AF-001         |
| Mobile core/model/features | root store in core; model and feature cross-domain edges                          | AF-002, AF-003 |
| Storefront contracts/data  | handwritten `*Dto` used as feature models; HttpClient facade                      | AF-004, AF-006 |
| Mobile data flow           | RTK Query plus local page arrays; partial runtime validation; no tags             | AF-005–AF-007  |
| Public APIs/tree           | all root entry points exist; several barrels expose internals; empty paths remain | AF-008, AF-010 |
| Tests                      | Mobile broad Jest coverage; sparse Admin; no Storefront tests                     | AF-009         |

Full factual snapshot: [frontend inventory](../../../../architecture/frontend-inventory.md).

## Target tree and ownership

```text
apps/
├── admin/                 # React composition only
├── mobile/                # Expo routes + root provider/store composition
└── storefront/            # Angular SSR composition only
libs/
├── admin/
│   ├── core/{auth,shell}/
│   ├── shared/{api-client,config}/
│   └── <domain>/{model,data-access,ui,feature}/
├── mobile/
│   ├── core/{connectivity,shell}/      # no domain imports
│   ├── shared/{api-client,config,model?}/
│   └── <domain>/{model,data-access,ui,feature}/
├── storefront/
│   ├── contracts/         # domain-facing contracts; no generated DTO exports
│   ├── data-access/       # HttpClient, runtime validation, mapping, facades
│   ├── feature/*/
│   ├── shell/
│   ├── ui/
│   └── util/
└── shared/api-contracts/  # generated transport contract only
```

`mobile/shared/model` створюється лише якщо RM-003 підтвердить другий consumer
для neutral sales concept. Інакше status залишається в canonical owning domain.

## Dependency matrix

| Source              | Allowed targets                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| app                 | core, feature, app-specific shared; app composes reducers/providers                              |
| core                | core and app-specific shared; no domain layer                                                    |
| model               | same-domain model and framework-neutral shared model/util                                        |
| ui                  | same-domain model, compatible shared UI/util                                                     |
| data-access         | same-domain model, shared API client/config, generated contracts                                 |
| feature             | model/ui/data-access; documented cross-domain lower layer for one flow; never feature            |
| shell               | shell/shared plus explicitly documented feature composition where client architecture permits it |
| generated contracts | no framework/domain dependency                                                                   |

`domain:*` enforcement must distinguish same-domain dependencies from documented
cross-domain orchestration. If Nx constraints cannot express the exception
without broad permission, RM-001 adds an executable conformance check.

## Approved data flows

```text
Admin/Mobile feature → typed RTK hook → domain endpoint → shared Axios baseApi
  → unknown response → runtime validator → mapper → domain model → UI props

Storefront feature → facade/repository → Angular HttpClient
  → unknown response → runtime validator → mapper → storefront contract/model
```

Admin auth raw Axios remains the ADR-0001 bootstrap exception. Angular logging
`sendBeacon`/`fetch` remains best-effort observability, outside server state.

## Public API target

- root `src/index.ts` only; no file aliases or cross-library relatives;
- API client exports base API and stable error/runtime contracts, not raw client,
  interceptor installers or base-query implementation;
- domain data-access exports hooks/facades/providers needed by consumers, not
  DTO schemas/mappers/storage;
- shell exports application-facing providers/components, not store/storage internals.

## Migration sequence

1. RM-000 completes documentation baseline (done in this change).
2. EN-001 captures behavior and adds focused characterization gaps.
3. EN-002 adds boundary positive/negative fixtures or conformance check.
4. RM-001 changes tags/constraints only after fixtures can fail correctly.
5. RM-002 moves Mobile reducer composition to app without changing routes/state.
6. RM-003 establishes neutral order-sync status ownership.
7. RM-004 repairs Storefront DTO/domain naming and mapping boundary.
8. RM-005 removes duplicated Mobile paged server state.
9. RM-006 completes runtime validation; RM-007 adds cache/tag semantics.
10. RM-008 narrows barrels after consumers use target owners.
11. RM-009 removes dead projects/folders and stale paths.
12. RM-010 runs the final full audit and regression gate.

Each intermediate checkpoint compiles. Compatibility exports, if required,
exist for one task only and are removed by RM-008.

## Behavior preservation

| Contract                                     | Evidence before/after                                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------------------- |
| Admin bootstrap/auth/products                | current app/api-client tests, Admin build and Playwright smoke                          |
| Mobile routes/theme/catalog/cart/orders      | current 17-project Jest aggregate, test typecheck, export; new focused characterization |
| Storefront SSR/catalog/cart/checkout/locales | production build plus EN-003 focused tests                                              |
| API mapping/errors                           | contract check and invalid-payload focused tests                                        |
