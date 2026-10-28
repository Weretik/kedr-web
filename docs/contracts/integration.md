# Frontend integration rules

**Machine source:** [`openapi/openapi.yaml`](openapi/openapi.yaml), provenance in [`openapi/SOURCE.md`](openapi/SOURCE.md)

## Contract pipeline

The sync, generation, and check workflow is in the [contract registry](README.md#contract-workflow). Pages under `docs/contracts/<module>/` describe only consumer mapping, behavior, and known compatibility constraints; they do not duplicate schemas.

This page projects shared backend conventions for the frontend and is authoritative for frontend transport implementation. Backend OpenAPI is a reference when available; frontend owners are not responsible for finding, access to, or updating it.

## Contract boundary

- Import generated request/response types only in transport, session/auth adapters, or domain `data-access`.
- Do not export generated types as application/domain models or import them into feature or UI.
- Keep runtime validation at boundaries where a response arrives as external/unknown data; code generation does not replace it.
- `data-access` owns private DTOs, query serialization, runtime parsing, and mapping to the domain model.
- Features, UI components, and routes consume the domain model and normalized `ApiError`; they do not depend on OpenAPI DTO names or raw HTTP responses.
- A feature links to the page in this registry and may link to the backend OpenAPI file as a reference when available.

## Shared HTTP rules

- JSON properties use camelCase.
- A paged response has `{ pagedInfo, value }`; `pagedInfo` contains `pageNumber`, `pageSize`, `totalPages`, and `totalRecords`.
- For operations with these parameters, send `page >= 1` and `pageSize` from 1 to 100.
- A `400` validation response is an Ardalis validation-error array. Do not show it to users or use localized backend error text in application logic.
- `404` has no response body; `409` returns an array of conflict messages; `401` and `403` retain their usual meaning as authentication and authorization errors.

## Error normalization and handling

`shared/api-client` is the only place where raw Axios/backend errors are converted to `ApiError`. `data-access` returns normalized errors through RTK Query; feature and UI do not parse `error.response.data` or create their own Axios instance.

```ts
interface ApiError {
  code:
    | 'Unknown'
    | 'Network'
    | 'Timeout'
    | 'Unauthorized'
    | 'Forbidden'
    | 'NotFound'
    | 'Validation'
    | 'Server';
  status?: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
  traceId?: string;
}
```

### Canonical backend validation response shapes

The backend may return either of two shapes. Both map to `ApiError { code: 'Validation', fieldErrors }`.

**ASP.NET Problem Details**

```json
{
  "title": "Помилка валідації",
  "detail": "Перевірте поля форми.",
  "errors": {
    "priceFrom": ["Значення не може бути від'ємним."]
  },
  "traceId": "illustrative-trace-id"
}
```

**Ardalis validation-error array**

```json
[
  {
    "identifier": "priceFrom",
    "errorMessage": "Значення не може бути від'ємним."
  }
]
```

PascalCase keys `Identifier` and `ErrorMessage` are also allowed in the Ardalis array. Example messages are not a stable API: the UI must not compare them or branch on backend error text.

### Transport and HTTP error mapping

| Source                        | Normalized `ApiError`                           | Feature/UI behavior                                                      |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| No response                   | `Network`, `status: 0`                          | Show offline/network state and make retry available.                     |
| `ECONNABORTED` or `ETIMEDOUT` | `Timeout`                                       | Show timeout state and make retry available.                             |
| `401`                         | `Unauthorized`                                  | Pass to the existing session/auth flow; do not show validation UI.       |
| `403`                         | `Forbidden`                                     | Show an access-denied state without retrying the same action.            |
| `404`                         | `NotFound`                                      | Show a not-found state or feature-specific fallback.                     |
| `4xx` with `fieldErrors`      | `Validation`, `fieldErrors`, possible `traceId` | Map errors to form fields; for query/filter, show a clear local message. |
| `5xx`                         | `Server`, possible `traceId`                    | Preserve existing data, show an error state, and offer retry.            |
| Other client/HTTP error       | `Unknown`                                       | Show a safe generic error; do not show the raw response.                 |

### Display and diagnostics rules

1. For `Validation`, pass `fieldErrors` to the form or relevant control. Do not show the raw backend body or use a global toast in place of local field errors.
2. For `Network`, `Timeout`, `Server`, and `Unknown`, the feature preserves previous successful data if available and offers manual retry through `refetch`.
3. The runtime notifier is for network/timeout/server/unknown errors. It does not replace the feature error state; the feature handles `4xx`.
4. `traceId` may be passed through `ApiError` for support/diagnostics, but do not log the response body, Authorization header, token, cookie, or PII.

## Authentication and security

Protected operations use the existing frontend session adapter and Bearer token flow. Security declared in OpenAPI and backend authorization are authoritative. In particular, do not assume a currently anonymous admin route is safe to access outside the internal frontend surface.
