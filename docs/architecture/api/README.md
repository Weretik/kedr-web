# Admin and Mobile API architecture

**Scope:** `apps/admin`, `apps/mobile`\
**Status:** current\
**Related documents:** [Admin Axios transport ADR](../admin/adr/0001-admin-axios-transport.md), [Admin state and API](../admin/runtime/state-and-api.md), [Mobile state and API](../mobile/runtime/state-and-api.md)

## Purpose

Admin and Mobile consume one backend, so they send API requests, normalize backend errors, and support cancellation in the same way. The clients do not import each other's code: each owns its own `shared/api-client` while implementing this contract.

```text
Admin feature / Mobile feature
             │ RTK Query hook
             ▼
domain data-access ── baseApi.injectEndpoints
             │
             ▼
shared/api-client
  ApiRequest → axiosBaseQuery → Axios → shared backend
                    │                │
                    └─ ApiError ◄────┘
                         │
       ┌─────────────────┴─────────────────┐
       ▼                                   ▼
feature error state              runtime notifier (network/timeout/5xx)
```

`feature` shows its own loading/error/empty states. The global notifier does not replace an error state and does not report validation errors.

## Responsibility boundaries

`@shared/api-contracts` contains only CLI-generated OpenAPI types and is the shared machine contract for Admin, Mobile, and Storefront. It does not contain an HTTP client, state, runtime validation, or domain models. Each client imports it only at the transport boundary and performs its own mapping in domain `data-access`.

| Layer                  | Responsibility                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `shared/api-contracts` | Generated OpenAPI request, response, and schema types                                            |
| `shared/api-client`    | Axios instance, interceptors, `axiosBaseQuery`, `baseApi`, error normalization, runtime notifier |
| Domain `data-access`   | DTOs, runtime validation, mapper, and endpoints through `baseApi.injectEndpoints`                |
| `feature`              | Generated RTK Query hooks, loading/error states, and manual `refetch`                            |
| `ui` / route           | Do not call HTTP or import transport                                                             |

Declare every domain endpoint exclusively through public `baseApi.injectEndpoints`. Do not create a separate Axios instance, deep-import `api-client`, or duplicate RTK Query response/error in a slice.

## Public transport contract

```ts
interface ApiRequest {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}

type ApiErrorCode =
  | 'Unknown'
  | 'Network'
  | 'Timeout'
  | 'Unauthorized'
  | 'Forbidden'
  | 'NotFound'
  | 'Validation'
  | 'Server';

interface ApiError {
  code: ApiErrorCode;
  status?: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
  traceId?: string;
}
```

`axiosBaseQuery` passes the RTK Query `AbortSignal` to Axios and returns only `{ data }` or `{ error: ApiError }`. An Axios exception does not escape into feature.

## Backend errors

| Backend response                | `ApiError`                                |
| ------------------------------- | ----------------------------------------- |
| No response                     | `Network`, `status: 0`                    |
| `ECONNABORTED` / `ETIMEDOUT`    | `Timeout`                                 |
| HTTP 401 / 403 / 404            | `Unauthorized` / `Forbidden` / `NotFound` |
| HTTP 4xx with validation fields | `Validation` and `fieldErrors`            |
| HTTP 5xx                        | `Server`                                  |
| Other transport/client error    | `Unknown`                                 |

### ASP.NET Problem Details

The backend may return `{ detail, title, errors, traceId }`. `detail` takes precedence over `title`; `errors` is converted to `fieldErrors`; `traceId` is retained for diagnostics. Do not log the response body.

### Ardalis validation result

The backend may return an array with `Identifier` / `ErrorMessage` or `identifier` / `errorMessage`. The client groups messages by field in `fieldErrors` and returns `Validation`.

## Error handling

1. For `Validation`, feature shows field errors.
2. For `Network`, `Timeout`, and `Server`, feature offers a manual retry through `refetch`.
3. The runtime notifier reports network, timeout, server, and unknown errors; the specific feature handles 4xx errors.
4. Pass `traceId` to support only through normalized `ApiError`; feature does not parse the backend response itself.

## Observability and security

- The request interceptor may add a correlation ID and measures duration.
- Logs contain only method, sanitized URL without query/fragment, status, and duration.
- Do not log headers, request/response bodies, tokens, or personal data.
- Logging is enabled only by a development opt-in flag: `VITE_ENABLE_HTTP_LOGS` for Admin and `EXPO_PUBLIC_ENABLE_HTTP_LOGS=true` for Mobile.

## Client differences

| Aspect           | Admin                                                                 | Mobile                                                     |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| Base URL         | `@admin/shared/config`                                                | `EXPO_PUBLIC_API_BASE_URL` through `@mobile/shared/config` |
| Authentication   | bearer token, refresh, CSRF, credentials through `AuthSessionAdapter` | Not implemented before a separate auth phase               |
| Runtime notifier | Configured during Admin bootstrap                                     | Registered in `@mobile/core/shell` notification provider   |
| Connectivity     | browser/HTTP failure handling                                         | NetInfo offline indicator, no automatic retry              |

`EXPO_PUBLIC_*` values are included in the Mobile client bundle and therefore must not contain tokens, passwords, or other secrets.

## Verification

- Unit: Problem Details, Ardalis, network, timeout, and 5xx mapping; `AbortSignal` forwarding; logger sanitization.
- Integration: an endpoint through `baseApi.injectEndpoints` returns a domain model, not a DTO.
- Manual: cancel a request during unmount/navigation; on Mobile, disable the network and check the offline indicator without a crash.
