# ADR-0001: Axios transport for Admin RTK Query

**Status:** Accepted  
**Date:** 2026-07-22

## Context

Admin uses RTK Query for server state, caching, loading states, and invalidation. The application
requires one transport boundary for authorization headers, request logging, token refresh, and
normalization of HTTP failures. Domain libraries must not call Axios directly.

## Decision

- `@admin/shared/api-client` owns a single Axios instance, `axiosClient`.
- `baseApi` uses `axiosBaseQuery`; every RTK Query endpoint returns an `ApiRequest` object and never
  calls Axios directly.
- `axiosBaseQuery` forwards RTK Query's `AbortSignal` to Axios and converts all thrown errors to the
  public `ApiError` contract.
- Request interceptors add the bearer token supplied by `AuthSessionAdapter` and send requests with
  credentials, matching the storefront's session-cookie flow.
- A response interceptor handles `401` once per request. Concurrent `401` responses share one
  refresh promise and retry after a successful refresh.
- `admin/core/auth` owns token storage, the refresh endpoint, and logout behavior. At application
  bootstrap it calls `configureApiClient({ authSession })` and refreshes the access token before
  rendering the application.
- HTTP logs contain only method, URL, status, and duration. They are controlled by
  `VITE_ENABLE_HTTP_LOGS`; headers, tokens, and payloads are never logged.

## Integration contract

The future auth feature supplies this adapter:

```ts
configureApiClient({
  authSession: {
    getAccessToken: () => session.accessToken,
    refreshAccessToken: () => refreshSessionWithRawAxios(),
    onUnauthenticated: () => authFacade.signOut(),
  },
});
```

`refreshAccessToken` uses `POST /api/auth/session/refresh` with `withCredentials: true` and copies
the `kedr.csrf` cookie to the `X-CSRF-Token` header. It must use a separate raw Axios call or another
client without the refresh interceptor. Calling `axiosClient` from this function could recursively
trigger refresh handling.

## Backend error contract

The adapter normalizes the same backend formats used by storefront:

- ASP.NET Core `ProblemDetails` / `ValidationProblemDetails`, including `detail`, `title`, `traceId`,
  and `errors: Record<string, string[]>`;
- Ardalis validation arrays with `identifier`/`errorMessage` or
  `Identifier`/`ErrorMessage` fields.

The public `ApiError` contains `code`, `status`, `message`, optional `fieldErrors`, and optional
`traceId`. Validation errors are only produced for a 4xx response with recognized field errors.

## Consequences

- Domain `data-access` libraries extend `baseApi` through `injectEndpoints` and consume no Axios APIs.
- `feature` libraries consume only generated RTK Query hooks and domain models.
- Refresh-token endpoint, token persistence, and logout UI remain an `admin/core/auth` task; this
  transport does not invent those backend contracts.
- API response validation and DTO-to-model mapping remain the responsibility of each domain
  `data-access` library.
- Admin and storefront use the same production API origin. API paths are absolute from that origin;
  domain Admin endpoints therefore include their `/admin/...` prefix explicitly.
