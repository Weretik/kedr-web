# Mobile state, API, and forms

## Where state lives

| State                                          | Owner                                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Catalog, customers, calculations, send queue   | Local SQLite database (`@mobile/core/local-db`, Drizzle), read through domain `data-access` hooks |
| Selected customer, theme choice, sync status   | Small Zustand stores in the owning domain or `core/shell`                                         |
| Session and tokens                             | `@mobile/core/auth` with Expo SecureStore                                                         |
| Screen-only values (search text, an open step) | The component                                                                                     |

Screens re-read local data after a sync through `useLocalDataVersion()`. Do not copy database rows into a store.

## API

- `@mobile/shared/api-client` owns one Axios instance (`apiClient`), the bearer and refresh interceptor (`configureMobileAuth`) and error normalization (`toApiError`).
- Domain `data-access` calls `apiClient`, validates responses with zod and maps DTOs to Mobile models; feature and UI never receive DTOs. Generated request/response types from `@shared/api-contracts` may be used inside `data-access`.
- Network writes go through the send queue (`calculation/data-access`); the few online-only calls (profile, order and draft detail) live in their domain's `data-access`.
- Public `ApiError` and error codes stay aligned with `@admin/shared/api-client`; shared backend error shapes are in the [Admin and Mobile API architecture](../../api/README.md).

`EXPO_PUBLIC_API_BASE_URL` contains only a public API base address. Do not pass tokens, passwords, or other secrets through Expo public environment variables.

## Errors

`toApiError` returns a typed `ApiError` with `status`, `code`, `message`, and, when needed, `fieldErrors` and `traceId`. It reads ASP.NET Problem Details (`detail`, `title`, `errors`, `traceId`) and the Ardalis validation array, the same shapes as Admin. Each domain turns errors into its own messages (for example `profileErrorMessage`); the send queue sorts them into retry, pause or return-to-calculation (see the [offline strategy](offline-strategy.md)).

## Forms

Forms are small controlled components in `ui`. Validators live in the domain `model` (`validators/`), so the same rule serves the screen and the tests. A form receives values, errors, disabled state and callbacks through props; it does not call the API or the router.
