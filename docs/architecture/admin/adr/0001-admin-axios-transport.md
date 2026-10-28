# ADR-0001: Axios transport for Admin RTK Query

**Status:** Accepted\
**Date:** 2026-07-22

## Context

Admin uses RTK Query for server state, caching, loading states, and invalidation. The application needs a single transport boundary for authorization headers, logging, token refresh, and HTTP error normalization. Domain libraries do not call Axios directly.

## Decision

- `@admin/shared/api-client` owns one Axios instance, `axiosClient`.
- `baseApi` uses `axiosBaseQuery`; each endpoint returns `ApiRequest` and does not call Axios directly.
- `axiosBaseQuery` passes `AbortSignal` to Axios and converts errors to the public `ApiError` contract.
- The request interceptor sends credentials and adds `X-CSRF-Token` to non-GET requests (cookie session; see the update below).
- The response interceptor handles `401` once per request; concurrent `401` responses share a refresh promise.
- `admin/core/auth` owns sign-in, the current user, and logout; during bootstrap it configures the API client and reads `/api/auth/session/me`.
- HTTP logs contain only method, URL, status, and duration; `VITE_ENABLE_HTTP_LOGS` enables them.

## Integration contract

The auth feature passes `AuthSessionAdapter` through `configureApiClient`. Since the cookie-session rollout (2026-10) the adapter has only `onUnauthenticated`: there is no access token or refresh in the browser, and a `401` outside `/api/auth/` opens the login page. Sign-in calls use a separate raw Axios client.

## Consequences

- Domain `data-access` extends `baseApi` through `injectEndpoints` and does not use the Axios API.
- `feature` consumes only generated RTK Query hooks and domain models.
- DTO-to-model mapping and response validation remain the responsibility of domain `data-access`.
- Public `ApiError` contains `code`, `status`, `message`, and, when needed, `fieldErrors` and `traceId`.
