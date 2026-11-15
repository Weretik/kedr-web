# Admin state, API, and forms

## Server state and API

- Transport request/response types come from generated `@shared/api-contracts`, built from the versioned OpenAPI snapshot in `docs/contracts/openapi/`.
- Generated types are used only in the session adapter and domain `data-access`; a mapper and runtime validation separate them from Admin models.
- Feature and UI do not import `@shared/api-contracts`.
- Server state is implemented with RTK Query and belongs to `data-access`.
- The root Redux store is in `apps/admin/src/app/store.ts`.
- The shared API is in `@admin/shared/api-client`; transport details are defined in [ADR-0002](../adr/0002-admin-openapi-fetch-transport.md).
- Each endpoint calls the typed `apiClient` in its `queryFn`: `queryFn: (id, { signal }) => apiCall(apiClient.GET('/api/admin/articles/{id}', { params: { path: { id } }, signal }), mapArticle)`. The path, parameters, body and the mapper input are checked against the contract.
- Backend error shapes and transport rules shared with Mobile are documented in the [Admin and Mobile API architecture](../../api/README.md).
- `admin/core/auth` passes `AuthSessionAdapter` to the API client; the API client does not store tokens or know the session refresh endpoint.
- Each domain declares endpoints in its own `data-access` library through `baseApi.injectEndpoints`.
- Feature uses only exported typed hooks and does not access `baseApi` directly.
- Validate and transform all external data at the `data-access` boundary.

## `@admin/shared/api-client` structure

`@admin/shared/api-client` is shared transport infrastructure. Its root `src/index.ts` contains only stable public exports; internal implementations are grouped by role:

```text
libs/admin/shared/api-client/src/
├── index.ts
├── testing.ts     # stubApiFetch for data-access tests (@admin/shared/api-client/testing)
├── client/        # typed openapi-fetch client, apiCall/apiRequest, formDataBody
├── contracts/     # ApiError and auth contracts
├── csrf/          # CSRF token read from the cookie for unsafe requests
├── errors/        # HttpError and ApiError normalization with tests
├── middleware/    # CSRF header, development logging, 401 redirect
├── rtk-query/     # baseApi (fakeBaseQuery: every endpoint has a queryFn)
└── runtime/       # runtime configuration: session adapter, error notifier
```

- A module does not combine the client, middleware, RTK Query base API, transport contract, and error mapper.
- Middleware does not own global application state; the session adapter and error notifier belong to `runtime` and are configured through the public API.
- Domain `data-access` libraries declare endpoints only through `baseApi.injectEndpoints` with `queryFn` and `apiCall(apiClient...)`; they do not create their own client, call `fetch`, or import internal `api-client` modules.
- Change public transport-layer exports only through a separate compatible decision.
- A transport behavior change includes relevant error-mapping or middleware tests and a check with `npx nx build admin`.

## `@admin/shared/config` structure

`@admin/shared/config` isolates Vite environment access from the rest of Admin. Its public `src/index.ts` exports the ready-to-use `appConfig` and `AppConfig` type; reading `import.meta.env`, parsing values, and assembling configuration remain separate:

```text
libs/admin/shared/config/src/
├── index.ts
├── env/
│   └── environment-reader.ts   # AdminEnvironment type and env reading
└── config/
    └── app-config.ts           # AppConfig type and createAppConfig
```

- Only `env/environment-reader.ts` accesses `import.meta.env` and contains the Vite type reference.
- `config/app-config.ts` is a pure function with explicit environment input; all fallback and parsing rules are concentrated in `env`.
- Consumers import only `appConfig` from `@admin/shared/config`, not Vite env or internal config modules.

## Local and client state

Local state stays in `feature`. Domain client state that must survive unmounting or be shared by multiple pages belongs in `feature/state/<domain>.slice.ts`; the reducer is explicitly exported for store registration. Do not create a slice for data already cached by RTK Query.

## Forms

The form belongs to the feature scenario. `ProductForm` receives data and handlers through props, does not call the API or manage routing; pages call mutations. Move shared controls to `@admin/shared/ui` only after reuse is demonstrated. Choose the form library and validation schema in a separate ADR before the first implementation.
