# Архітектурний аудит — товари без фотографій у профілі

- **Feature/SDD:** `docs/specs/mobile/profile/001-products-missing-photos/`
- **Scope:** Mobile Profile route; missing-photo files in
  `mobile-catalog-{data-access,feature,ui}`; reused
  `CatalogPage`/`CatalogProduct` and `CatalogList`/`ProductCard`/footer;
  catalog public barrels, Nx project edges, shared transport and generated API
  contract required by this flow
- **Дата:** 2026-10-05
- **Applicable rules:** `docs/AGENTS.md`, `docs/architecture/frontend-inventory.md`,
  `docs/architecture/mobile/`, `docs/standards/mobile/{mobile-code-organization,mobile-ui}.md; docs/standards/shared/{api-data-rules,testing-rules,delivery-rules}.md`
- **Delivery status:** verified after AF-001–AF-004 remediation; device QA pending

## 00. Inventory і baseline

- [x] Applicable instructions, inventory, architecture, standards, SDD,
      workflow, contracts and code-audit phases reviewed.
- [x] Git status/diff inspected; existing catalog/API refactors are user-owned
      and must be preserved.
- [x] Projects, targets, tags, aliases, Jest configs, providers, source/tests
      and public entry points inspected.
- [x] Approved stack confirmed: Expo Router thin app adapter, catalog feature,
      RTK Query injected endpoint, shared Axios base query, private generated DTO,
      Zod mapping, Paper/RNTL/Jest.

## 01. Architecture matrix

| Project/module               | Actual role/paths                         | Required owner         | Tags                                           | Allowed dependencies                         | Finding/task          |
| ---------------------------- | ----------------------------------------- | ---------------------- | ---------------------------------------------- | -------------------------------------------- | --------------------- |
| `mobile`                     | `apps/mobile/src/app/(tabs)/profile.tsx`  | app composition/router | `scope:mobile,type:app`                        | feature/core public aliases                  | TS-005                |
| `mobile-catalog-feature`     | screens/hooks/components                  | catalog orchestration  | `scope:mobile,domain:catalog,type:feature`     | catalog data-access/ui/model + mobile shared | TS-003/TS-004         |
| `mobile-catalog-ui`          | product list/card/states                  | presentational RN UI   | `scope:mobile,domain:catalog,type:ui`          | catalog model + mobile shared UI only        | AF-001/TS-004         |
| `mobile-catalog-data-access` | RTK endpoint/contracts/mappers/pagination | transport/server state | `scope:mobile,domain:catalog,type:data-access` | catalog model + mobile/shared contracts      | AF-002–003/TS-001–002 |
| `mobile-catalog-model`       | `CatalogProduct`, `CatalogPage`           | pure domain projection | `scope:mobile,domain:catalog,type:model`       | model/util/contracts only                    | —                     |

- [x] Every planned responsibility has one existing owner; no speculative layer
      or profile domain is created.
- [x] ESLint/Nx constraints and `architecture:boundaries` allow the documented
      downward direction and forbid reverse feature/UI transport imports.
- [x] Project names, roots, tags, aliases and folder nesting match the graph.

Focused graph evidence: app → catalog feature; feature → catalog UI/model/data-access;
data-access → catalog model/shared API/shared contracts; UI → model; model → none.
Five executable boundary fixtures cover allowed downward and forbidden
core/domain, cross-domain model, feature/feature and missing-tag cases.

## 02. State, API, DTO і tools

| Flow               | Actual path                                                                     | Approved path                                                       | Forbidden bypass                                                      | Finding/task          |
| ------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------- |
| Missing-photo list | Profile route → catalog feature → catalog data-access → mobile base API → Axios | dedicated generated operation with runtime mapping to `CatalogPage` | direct Axios/UI fetch, client photo filtering, local copied row cache | AF-002–004/TS-001–005 |

- [x] RTK Query is the single owner for server data/loading/error/cache.
- [x] UI receives typed products and callbacks; Router remains in app route.
- [x] Generated DTO remains private; runtime validator/mapper returns existing
      domain models.
- [x] Shared cancellation/error normalization and explicit retry are retained;
      endpoint gets separate cache identity and Catalog tags.
- [x] No direct `fetch`/Axios or parallel manual server cache exists in the
      missing-photo feature/UI flow.
- [x] Runtime schema rejects OpenAPI integer violations; endpoint wiring test
      proves canonical request, mapper transform and isolated list/item tags.
- [x] Runtime schema accepts RFC 3339 offsets emitted by the backend
      `DateTimeOffset` field instead of restricting `date-time` to `Z` only.

## 03. UI і feature orchestration

- [x] Screen is a thin controller/results composition.
- [x] Existing `CatalogList`, `ProductCard` and `CatalogListFooter` remain
      reusable presentation; only context-specific state copy is new.
- [x] Profile route owns navigation; UI and feature remain router-free.
- [x] Screen, controller, results and state view remain separate cohesive files.
- [x] Reused `ProductCard` image frame derives its color from Paper theme; no
      in-scope production UI color literal remains.

## 04. Public API і structure

- [x] Cross-library imports use existing `@mobile/catalog/*` aliases and root
      `src/index.ts` entry points.
- [x] DTO/schema/mapper/request builder remain private to data-access.
- [x] No cycle, deep import, duplicate owner or tracked empty project/folder.
      Local `feature/src/test-mocks` is untracked and has no repository role.

## 05. Testing і executable tooling

- [x] Confirmed inferred `lint`/`test` targets for catalog libraries and
      `mobile:{lint,test,typecheck,export}` plus `typecheck:tests:mobile`.
- [x] Executable mapper/schema unit, endpoint/controller focused integration,
      state/screen component and app route integration tests cover the claimed
      levels.
- [x] Affected source/test TypeScript configs execute successfully.
- [x] `npm run architecture:boundaries` and the positive/negative fixture suite
      provide executable boundary evidence; Mobile E2E is absent and not
      claimed.

Final regression: data-access 9 suites/20 tests; UI 9/19; feature 7/37; app
5/10 — 30 suites/86 tests passed. Affected lint, app source typecheck,
data-access/UI test typecheck and architecture checks passed. Existing unrelated
`CatalogScreen` async `act(...)` warnings remain non-failing.

## Findings

| ID     | Severity | Rule                                  | Owner                      | Evidence                                                                    | Task           | Depends on | Exact paths                                                      | Verification                                                  | Target state                                     | Status   |
| ------ | -------- | ------------------------------------- | -------------------------- | --------------------------------------------------------------------------- | -------------- | ---------- | ---------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------ | -------- |
| AF-001 | medium   | `mobile-ui.md#components-and-theme`   | Mobile catalog UI          | image frame used `#ffffff`; theme-token component assertion was Red         | TS-004         | none       | `catalog/ui/src/components/products/product-card.{tsx,spec.tsx}` | focused ProductCard spec, UI regression, local-color search   | image frame derives color from Paper theme       | verified |
| AF-002 | high     | `api-data-rules.md#contracts-and-dto` | Mobile catalog data-access | OpenAPI integer `id/page*` accepted fractional values; mapper spec Red      | TS-001         | EN-001     | missing-photo schema and mapper spec                             | invalid-payload test, data-access regression, test typecheck  | parser rejects non-integer transport values      | verified |
| AF-003 | medium   | `testing-rules.md#evidence`           | Mobile catalog data-access | separate unit tests did not directly prove endpoint declaration wiring      | TS-002, TS-006 | TS-001     | `catalog/data-access/src/api/catalog.api.{ts,spec.ts}`           | endpoint request/transform/tag assertion plus full regression | endpoint boundary has direct executable evidence | verified |
| AF-004 | high     | `api-data-rules.md#contracts-and-dto` | Mobile catalog data-access | `.NET DateTimeOffset` value with `+00:00` caused the RTK transform to throw | TS-001, TS-006 | EN-001     | missing-photo schema and mapper spec                             | offset timestamp test, data-access regression, test typecheck | parser accepts contract-valid RFC 3339 offsets   | verified |

AF-001, AF-002 and AF-004 have valid behavioral Red → Green evidence. AF-003
is a test-gap finding: after correcting the initial test harness, its
replacement test passed against the implementation and is not misreported as
behavioral Red. No system-wide finding was introduced or reopened, so a new
remediation SDD is not required; the completed workspace remediation remains
authoritative.

## File decisions

| Path/area                                  | Roles                         | Decision                         | Target owner/path   | Reason                                                                    | Evidence               |
| ------------------------------------------ | ----------------------------- | -------------------------------- | ------------------- | ------------------------------------------------------------------------- | ---------------------- |
| `catalog.api.ts`                           | endpoint registration         | keep, add endpoint test          | catalog data-access | established injected API owner                                            | endpoint wiring test   |
| new missing-photo contracts/mapper/request | transport boundary            | add separate cohesive files      | catalog data-access | diagnostics and authoritative image fallback differ from ordinary catalog | TS-001/TS-002          |
| existing product list/card/footer          | reusable product presentation | keep/reuse; repair theme token   | catalog UI          | current UX satisfies hierarchy/fallback; AF-001 removed local color       | component regression   |
| new missing-photo state                    | context-specific copy         | add focused state file           | catalog UI          | generic catalog empty/error wording is misleading                         | state component test   |
| Profile route                              | route composition/navigation  | replace placeholder adapter only | `apps/mobile`       | app owns Expo Router                                                      | route integration test |

## 06. Remediation і final gate

- [x] AF-001–AF-004 are `verified`; no finding is `open`, `blocked` or `planned`.
- [x] Tree, graph, tags/constraints, aliases/barrels, DTO/transport, manual
      lifecycle, local-color, deep-import and dead-folder searches repeated.
- [x] Focused Red/Green and regression evidence is linked to TS-001, TS-002,
      TS-004 and TS-006.

Manual TS-007 device QA, the pre-commit generated-contract diff guard and the
Windows Hermes export failure remain documented delivery-environment checks;
they are not architecture findings and are not marked passed.
