# Workspace layers and boundaries — findings і requirements

## Мета та межі

- **Мета:** узгодити graph, owners, state/data paths, DTO boundary, public API,
  test gates і physical tree з project-specific Kedr architecture.
- **У межах implementation:** `eslint.config.cjs`, `nx.json`,
  `tsconfig.base.json`, affected `project.json`, apps composition, affected
  Admin/Mobile/Storefront libraries, tests і docs.
- **Поза межами:** нова business behavior, redesign, backend/schema changes,
  dependency upgrades і device E2E runner без окремого рішення.
- **Зберігаємо:** routes, visible states, catalog/cart/checkout/order behavior,
  Admin auth/products behavior, Storefront SSR/localization і API semantics.

## Architecture requirements

- **AR-001:** graph реалізує app → core/feature/shared; core не залежить від
  domain; feature не залежить від feature; model не залежить від framework/data;
  scope/domain/type rules enforceable — `docs/architecture/*/dependencies.md`,
  `admin/nx-contract.md`, `mobile/nx-contract.md`.
- **AR-002:** Mobile cross-domain user flow може оркеструвати public lower layers
  лише з explicit design; shared domain concept має neutral owner —
  `docs/architecture/mobile/structure/dependencies.md`.
- **AR-003:** Admin/Mobile server state належить RTK Query; Storefront — Angular
  data-access facade. Duplicated manual server cache/lifecycle заборонений —
  `docs/standards/shared/api-data-rules.md`.
- **AR-004:** generated DTO залишаються private transport types; runtime
  validation і mapper повертають domain/application model —
  `docs/standards/shared/api-data-rules.md`.
- **AR-005:** cache key/tag/invalidation semantics належать approved data layer —
  `docs/standards/shared/api-data-rules.md`, client `state-and-api.md`.
- **AR-006:** cross-library imports використовують exact alias/root `src/index.ts`;
  private DTO, mapper, client, interceptor, parser і storage не exported — client
  `nx-contract.md` та code-audit phase 04.
- **AR-007:** source і tests мають executable gates; empty suite/package не є
  evidence, structural moves мають characterization —
  `docs/standards/shared/testing-rules.md`.
- **AR-008:** empty/dead projects/folders, duplicate owners і stale docs
  видаляються після consumer check — `docs/standards/*-code-organization.md`.
- **AR-009:** delivery потребує `verified` для всіх in-scope findings —
  `docs/standards/shared/delivery-rules.md`.

## Findings

| ID     | Severity | Violates       | Owner                    | Evidence                                                                                                                                                                                        | Impact                                                                      | Task / dependencies     | Exact paths                                                                         | Verification                                                           | Target state                                                               |
| ------ | -------- | -------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| AF-001 | blocker  | AR-001         | workspace architecture   | `eslint.config.cjs:142-303`; Storefront lacks `type:app`, no general `type:model`/domain constraints, `type:feature` permits feature                                                            | green lint cannot prove documented direction                                | RM-001 / EN-002         | `eslint.config.cjs`; affected `project.json`                                        | boundary fixtures + full lint + graph                                  | constraints encode effective matrix and reject reverse/domain violations   |
| AF-002 | high     | AR-001         | Mobile composition       | graph: `shell → mobile-orders-model`; import at `libs/mobile/core/shell/src/state/app-store.ts:1`                                                                                               | core owns domain reducer composition despite `core → shared` rule           | RM-002 / EN-001, RM-001 | `apps/mobile/src`; `libs/mobile/core/shell/src/state`                               | shell graph has no domain edge; app/store tests                        | app composition owns reducer assembly; core is domain-neutral              |
| AF-003 | high     | AR-001, AR-002 | Mobile model             | graph: `mobile-cart-model → mobile-orders-model`; `order-sync-status.ts:5`                                                                                                                      | domain model owner is ambiguous and domain constraint cannot be enforced    | RM-003 / RM-001         | `libs/mobile/cart/model`; `libs/mobile/orders/model`; new neutral owner if approved | model unit tests + graph/import search                                 | shared sales status has one neutral owner; models do not cross domains     |
| AF-004 | high     | AR-004         | Storefront catalog       | `product-page.ts:7` and `product-list.ts:6` import `Product*Dto`; `@storefront/contracts` exposes `*Dto`                                                                                        | transport/domain meaning conflated and DTO contract reaches feature         | RM-004 / EN-001, RM-001 | `libs/storefront/{contracts,data-access,feature/catalog}`                           | build + DTO import search + mapper tests                               | feature consumes domain names/models; generated DTO private to data-access |
| AF-005 | high     | AR-003         | Mobile catalog/orders    | `use-catalog-controller.ts:19-43`; `use-order-history-pages.ts:10-25` copy RTK results into local `items`                                                                                       | cache/result ownership duplicated; reset/merge races possible               | RM-005 / EN-001, RM-001 | two hooks and pagination state/tests                                                | focused pagination tests + manual-lifecycle search                     | RTK/data layer owns paged server data; feature owns query intent only      |
| AF-006 | high     | AR-004         | data-access owners       | runtime schema absent for Mobile catalog list/categories and Storefront catalog/checkout responses; search finds schemas only for Mobile orders/customers/cart/details                          | external unknown payload can enter domain as typed data                     | RM-006 / EN-001         | Mobile catalog contracts/mappers; Storefront catalog/checkout API                   | invalid-payload tests + runtime validation search                      | every consumed response validates unknown before mapping                   |
| AF-007 | medium   | AR-005         | Admin/Mobile data-access | search for `tagTypes`, `providesTags`, `invalidatesTags` returns no production matches                                                                                                          | mutations cannot declare cross-screen freshness; refetch policy is implicit | RM-007 / EN-001, RM-003 | both shared base APIs and domain endpoint files                                     | cache/invalidation focused tests + tag search                          | query/mutation freshness is explicit and tested                            |
| AF-008 | high     | AR-006         | library owners           | `mobile/shared/api-client/src/index.ts` exports Axios client/interceptors/base query; domain data-access barrels export mappers/contracts/storage; shell barrel exports store/storage internals | consumers can bypass intended layer contracts                               | RM-008 / RM-002–RM-007  | affected `src/index.ts`, aliases, consumers                                         | public export/import inventory + lint/build/tests                      | minimal stable barrels expose only supported domain/application APIs       |
| AF-009 | high     | AR-007         | test tooling             | Admin graph exposes Vitest targets for 8 libraries but specs exist only in app/api-client; `test:web` runs only those two; Storefront has no test target/files/test typecheck                   | moves lack executable characterization; empty targets look like coverage    | EN-001, EN-003, RM-010  | Admin/Mobile/Storefront test configs, scripts, affected specs                       | executable focused tests + test typecheck + affected regressions       | every moved responsibility has real tests; unavailable levels explicit     |
| AF-010 | medium   | AR-008         | workspace maintenance    | empty `admin/core/permissions/src/index.ts`; empty source dirs listed in inventory                                                                                                              | dead topology and generated placeholders misstate owners                    | RM-009 / RM-008         | paths in `frontend-inventory.md#emptydead-candidates`                               | consumer search + empty-dir/project scan + graph                       | dead projects/dirs removed or assigned verified responsibility             |
| AF-011 | medium   | AR-009         | docs                     | former `testing.md` said Expo/RN 56/0.85; root README Node 24.15; blanket RTK rule contradicted Storefront; Mobile core/store rules conflicted                                                  | AI could reproduce wrong stack and ownership                                | RM-000 / none           | `README.md`; architecture/standards/templates changed with this SDD                 | `npm run docs:check`; `npm run docs:format:check`; version/path search | one consistent project-specific baseline                                   |

AF-001–AF-011 are `verified` by the completed implementation, focused tests,
boundary audits, typechecks, production builds and Mobile export.
