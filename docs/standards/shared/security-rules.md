# Frontend security rules

## Responsibility boundary

The frontend ensures correct session use, safe data rendering, client-side data minimization, and access-control UX. The backend is the sole authority for authentication, authorization, role/permission enforcement, ownership checks, validation, rate limiting, audit trails, CSRF/CORS/cookie attributes, and signed URLs. A hidden button or client-side guard is never an access control.

## Authentication, access, and session

- Admin signs in with the HttpOnly session cookie through `admin/core/auth`; JavaScript never holds a token. The Axios client sends cookies with `withCredentials`, adds `X-CSRF-Token` to non-GET requests, and on `401` calls `onUnauthenticated`, which opens `/login?returnTo=…`. Routes are wrapped in `RequireAdminSession` (guest → login, non-staff → no access) and role-gated sections in `RequireRole`.
- Storefront uses the same cookie session: Angular `SessionStore` holds the user from `/api/auth/session/me`, the credentials/CSRF/unauthorized interceptors handle transport, and `cabinetAuthGuard` protects the cabinet. New protected routes must have a guard, but the backend still checks access.
- Mobile is a staff app: `@mobile/core/auth` keeps the access and refresh tokens only in `expo-secure-store` and memory, `@mobile/shared/api-client` adds the bearer header and refreshes once on `401`, and the root layout shows only the login screen without a session. Do not put tokens in AsyncStorage, Redux, or logs.
- Role/permission availability is determined by the real API contract. Until it exists, do not create fictitious role checks; state `n/a` in the spec with a reason. If roles exist, restrict both routes and each privileged action, showing a neutral unavailable/forbidden state.
- `401` means one controlled refresh where already implemented; on failure, clear the local session and navigate to login without a loop. Do not retry `403` or show it as session expiry: show a safe forbidden state.

## Data, XSS, errors, and logs

- Render external data only with standard React/React Native/Angular binding. `dangerouslySetInnerHTML`, direct `innerHTML`, unsafe URL/style values, and Angular trust bypass are prohibited without a separate security review, an approved sanitizer, and an XSS-payload test.
- Validate API data at the `data-access` boundary, map DTOs to domain models, and do not pass raw API errors to the UI. Show a normalized `ApiError`, field errors, or a safe generic message in the UI; do not show stack traces, request headers, tokens, or backend internals.
- PII, access/refresh tokens, cookies, passwords, authorization headers, CSRF tokens, and secrets must not appear in source, Expo `EXPO_PUBLIC_*`, Vite client env, analytics, telemetry, test fixtures, or console logs. Existing Admin/Mobile HTTP logs are allowed only in development and log method, path, status/duration; new logs must follow the same redaction principle.
- Treat any `EXPO_PUBLIC_*` and Vite client env value as public. In Mobile, `EXPO_PUBLIC_API_BASE_URL` may contain only a public base URL.

## Transport, cookies, and CSRF

- Use HTTPS only in production; do not weaken certificate/transport checks.
- Admin and Storefront use credentialed cookies. Every non-GET request sends the `kedr.csrf` cookie as `X-CSRF-Token`; the backend rejects a cookie request without it. The frontend cannot guarantee `Secure`, `HttpOnly`, `SameSite`, a CORS origin allowlist, or cookie domain by itself; these are backend/infra responsibilities to verify in the contract.
- Mobile does not use cookies or CSRF; it authenticates only with the bearer header.

## Files, export, and dangerous operations

- For uploads, define allowed types, size limit, server-side validation, malware-scanning ownership, failure state, and PII classification in the spec. Do not rely only on client `accept`/MIME; do not display a local file as trusted content.
- Export only data permitted by current server-side authorization. Do not put PII in a URL/query string; use a safe download contract and a clear error state.
- Bulk/destructive actions require a visible scope/count, explicit confirmation, disabled/pending state, consideration of idempotency/duplicate submission, a result summary, and partial-failure handling. The backend confirms permissions and targets; the frontend must not claim irreversible deletion before a confirmed response.

## Proportional security review

Each feature spec includes one status:

- **n/a** — no auth, PII, external input, files, export, or privileged/destructive action; give a brief rationale.
- **basic** — ordinary API/UI flow or a new route/action: check access, `401`/`403`, error/log redaction, XSS-safe output, and applicable transport rules.
- **elevated** — auth/session/roles, PII, upload/download/export, bulk/destructive action, payment, or external/HTML content. Add a short threat model: assets/PII, actors and trust boundaries, abuse cases, controls, residual risks, and backend/infra dependencies. Check security scenarios with tests at a feasible level and manually/through E2E after readiness.
