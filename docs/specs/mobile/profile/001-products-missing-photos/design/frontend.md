# Товари без фотографій у профілі — frontend design

## Affected clients and boundaries

- Client/project: `mobile` (`apps/mobile`), React Native/Expo.
- Variant: [React Native design](react-native.md) і
  [visual interaction](visual-interaction.md).
- Affected existing Nx projects: `mobile`, `mobile-catalog-model`,
  `mobile-catalog-data-access`, `mobile-catalog-ui`, `mobile-catalog-feature`.
- `apps/mobile/src/app/(tabs)/profile.tsx` лишається thin route adapter: він
  передає product press у Expo Router і рендерить public feature screen.
- Catalog `data-access` володіє operation, generated DTO reference, runtime
  validation, mapping, cache і pagination semantics; DTO не виходить назовні.
- Catalog `feature` володіє orchestration, retry/refresh/load-more; catalog `ui`
  володіє presentational list/cards/states без API або router imports.
- Новий profile Nx domain не створюється: поведінка є catalog product view,
  змонтованим app composition root у вкладці «Профіль».

## Architecture baseline

| Area                | Actual evidence                                                                                       | Applicable rule                                                 | Required target                                                                               | Finding/prerequisite                   |
| ------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------- |
| Projects/tags/graph | `apps/mobile/project.json`; `libs/mobile/catalog/*/project.json`; `npx nx show project mobile --json` | `docs/architecture/mobile/{README,nx-contract,dependencies}.md` | app → catalog feature; feature → data-access/ui/model; data-access → model/shared; ui → model | —                                      |
| Layers/owners       | `profile.tsx`; catalog `screens/`, `hooks/`, `components/`, `api/`, `contracts/`, `mappers/`          | `docs/standards/mobile-code-organization.md`                    | thin route, controller-owned query orchestration, private DTO, presentational UI              | —                                      |
| Public API          | `tsconfig.base.json`; catalog `src/index.ts` barrels                                                  | Mobile aliases and root barrels only                            | export one profile-mounted screen from feature and only required hook/model/UI primitives     | —                                      |
| Data/test tools     | `baseApi`; project Jest configs; `package.json`                                                       | `docs/architecture/mobile/state-and-api.md`; testing rules      | RTK Query/Axios, Zod boundary, Jest/jest-expo/RNTL                                            | `EN-001` for absent operation contract |

The current graph already has the required downward dependency direction. The
feature must not move product data into `core/shell` merely because the tab is
named «Профіль»: `shell` is domain-neutral and cannot own catalog data.

## State and data fetching

- RTK Query is the sole owner of response, cache, loading, fetching and error
  lifecycle. No reducer duplicates server rows.
- A dedicated endpoint/hook is injected into the existing catalog `baseApi`.
  It does not reuse `getAdminProducts` and does not client-filter that result.
- The response is accepted as the authoritative missing-photo set, validated at
  runtime and mapped to a Mobile domain projection only after `EN-001` confirms
  exact generated types.
- First load, empty, terminal error, refresh and next-page error are separate
  render states. Refresh retains visible data; a next-page failure retains rows
  and uses a footer retry.
- Cache serialization/merge is contract-driven. When paginated, reuse the
  proven page merge/deduplication pattern without sharing the ordinary catalog
  cache key. When unpaginated, no synthetic page state or load-more control is
  added.
- Retry is explicit `refetch`; cancellation continues through the shared Axios
  base query. Raw errors never reach visible copy.

## Navigation and deep links

- Entry is the existing `/(tabs)/profile`; no new route is added for the list.
- Existing detail route is `/product/[productSlug]` and already accepts a
  non-empty `productSlug` through app-owned `router.push`.
- The catalog feature emits a selected domain product; the profile route owns
  the Router callback, matching `/(tabs)/catalog`.
- Product press is enabled only if `EN-001` confirms a valid field that maps to
  the existing route. Missing support produces non-interactive content, not a
  guessed slug or a new details screen.
- Back from details must return to the mounted Profile tab and its RTK Query
  data; no custom deep link or redirect is introduced.

## Platform adapters and permissions

- No permission, storage or new native adapter is needed.
- Existing `FlashList`, React Native Paper, safe-area and Expo Router stack are
  sufficient. No new package or binary rebuild is expected.
- Expo Go remains sufficient because the plan changes TypeScript, RTK Query and
  existing UI only.

## API integration

- Contract: [feature API contract](../contracts/api-contract.md).
- Current snapshot commit `364b5f12d18cddb6efc800263581b23d25b6e484`
  has no `/api/admin/products/missing-photos` path or generated operation.
- `EN-001` must synchronize provider OpenAPI, establish stable `operationId`,
  add the registry/consumer projection, generate types and resolve request,
  response, pagination, access and error semantics before behavioral code.
- Generated types stay in catalog data-access. Feature/UI receive a mapped
  domain model and normalized safe errors.

## Test design

- Unit: runtime schema/mapper and conditional page merge behavior after the
  contract is known.
- Focused integration: RTK Query request, cache key, refresh, conditional
  pagination, deduplication, cancellation and error retention.
- Component: loading/empty/error/success, retry, refresh, load-more footer,
  non-interactive fallback and accessibility.
- Route integration: Profile composition and existing product detail push when
  supported.
- Existing inferred targets: `mobile:test`, `mobile-catalog-model:test`,
  `mobile-catalog-data-access:test`, `mobile-catalog-ui:test`,
  `mobile-catalog-feature:test`, plus `mobile:lint`, `mobile:typecheck` and
  `mobile:export`. `npm run typecheck:tests:mobile` covers test TypeScript.
- Mobile E2E tooling is absent. The journey is adequately covered by focused
  Jest/RNTL plus Android/iOS/web manual QA; no E2E enabler is justified.
