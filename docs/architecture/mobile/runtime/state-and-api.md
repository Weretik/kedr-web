# Mobile state, API, and forms

## Server state and API

- Domain `data-access` may import generated request/response types from `@shared/api-contracts`, built from the versioned OpenAPI snapshot.
- Generated DTOs remain private in `data-access`; a mapper returns Mobile models so feature and UI do not depend directly on the backend schema.
- RTK Query is the sole owner of server state, cache, loading/error states, and invalidation.
- The root Redux store lives in `@mobile/core/shell`.
- `@mobile/shared/api-client` owns one Axios instance, `axiosBaseQuery`, `baseApi`, and error normalization.
- Public `ApiRequest`, `ApiError`, and error codes are aligned with `@admin/shared/api-client` because both clients consume one backend. Mobile does not connect Admin UI code or auth runtime.
- Shared backend error shapes, transport boundaries, and rules for both clients are recorded in the [Admin and Mobile API architecture](../../api/README.md).
- Domain `data-access` declares endpoints only through `baseApi.injectEndpoints` and exports typed hooks.
- DTOs, Zod response validation, and DTO-to-domain-model mapping belong in `data-access`; feature and UI do not receive DTOs.
- The first-release catalog is public. Do not connect `core/auth` or SecureStore to the HTTP client until an authenticated scenario exists.

```text
Catalog feature → useGetProductsQuery → catalog/data-access
                                         ↓
                         shared/api-client/baseApi → Axios → API
```

`EXPO_PUBLIC_API_BASE_URL` contains only a public API base address. Do not pass tokens, passwords, or other secrets through Expo public environment variables.

## Errors and retries

`axiosBaseQuery` does not throw exceptions outward: it returns a typed `ApiError` with `status`, `code`, `message`, and, when needed, `fieldErrors` and `traceId`.

The Mobile normalizer supports ASP.NET Problem Details (`detail`, `title`, `errors`, `traceId`) and the Ardalis validation array—the same backend response shapes as Admin. It also passes the RTK Query `AbortSignal` to Axios.

RTK Query middleware notifies the global notifier only about network, unknown, and 5xx errors. 4xx errors stay in feature so the screen can show an appropriate validation or error state.

- Do not retry 4xx errors automatically.
- Network and 5xx errors show an error state with the action “Спробувати ще раз”.
- The user retries with `refetch`; do not make a hidden infinite automatic attempt.
- Error UI does not show raw Axios or backend messages without normalization.

## Redux state

Keep only long-lived client state needed by multiple screens in a Redux slice. Do not duplicate API data, loading, or error state in a slice. Local search values, an open dialog, and a single-screen selection stay in feature or the component.

## Forms

React Hook Form owns values, touched/error state, and submit state. A Zod schema describes the form at the feature boundary; domain invariants needed by multiple scenarios belong in `model`. A presentational form in `ui` receives values, errors, disabled state, and callbacks through props; it does not call RTK Query or Expo Router.
