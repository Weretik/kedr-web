# Frontend security rules

## Responsibility boundary

The frontend ensures correct session use, safe data rendering, client-side data minimization, and access-control UX. The backend is the sole authority for authentication, authorization, role/permission enforcement, ownership checks, validation, rate limiting, audit trails, CSRF/CORS/cookie attributes, and signed URLs. A hidden button or client-side guard is never an access control.

## Authentication, access, and session

- Admin currently keeps the access token in memory through `admin/core/auth`, adds it to `Authorization: Bearer` with an Axios interceptor, sends cookies with `withCredentials`, and performs refresh/retry once on `401`. Concurrent refresh requests are deduplicated. Do not move the token to localStorage/sessionStorage, a URL, Redux, or logs.
- Storefront uses Angular `SessionStore`, auth/credentials/CSRF/unauthorized interceptors, `withCredentials`, and `cabinetAuthGuard` for the protected cabinet. New protected routes must have a guard, but the backend still checks access.
- The Mobile catalog is currently public: `@mobile/shared/api-client` is not connected to auth or SecureStore. Do not invent client auth for a new feature; first align the API/session contract and document secure storage, token refresh, protected routes/actions, and logout UX.
- Role/permission availability is determined by the real API contract. Until it exists, do not create fictitious role checks; state `n/a` in the spec with a reason. If roles exist, restrict both routes and each privileged action, showing a neutral unavailable/forbidden state.
- `401` means one controlled refresh where already implemented; on failure, clear the local session and navigate to login without a loop. Do not retry `403` or show it as session expiry: show a safe forbidden state.

## Data, XSS, errors, and logs

- Render external data only with standard React/React Native/Angular binding. `dangerouslySetInnerHTML`, direct `innerHTML`, unsafe URL/style values, and Angular trust bypass are prohibited without a separate security review, an approved sanitizer, and an XSS-payload test.
- Validate API data at the `data-access` boundary, map DTOs to domain models, and do not pass raw API errors to the UI. Show a normalized `ApiError`, field errors, or a safe generic message in the UI; do not show stack traces, request headers, tokens, or backend internals.
- PII, access/refresh tokens, cookies, passwords, authorization headers, CSRF tokens, and secrets must not appear in source, Expo `EXPO_PUBLIC_*`, Vite client env, analytics, telemetry, test fixtures, or console logs. Existing Admin/Mobile HTTP logs are allowed only in development and log method, path, status/duration; new logs must follow the same redaction principle.
- Treat any `EXPO_PUBLIC_*` and Vite client env value as public. In Mobile, `EXPO_PUBLIC_API_BASE_URL` may contain only a public base URL.

## Transport, cookies, and CSRF

- Use HTTPS only in production; do not weaken certificate/transport checks.
- Admin and Storefront use credentialed cookies. The refresh POST sends the `kedr.csrf` cookie as `X-CSRF-Token`; new cookie-authenticated state-changing endpoints must have an aligned backend CSRF contract. The frontend cannot guarantee `Secure`, `HttpOnly`, `SameSite`, a CORS origin allowlist, or cookie domain by itself; these are backend/infra responsibilities to verify in the contract.
- Mobile does not use browser cookies in the current public catalog flow. For future auth, do not carry over web cookie/CSRF assumptions without a separate mobile session design.

## Files, export, and dangerous operations

- For uploads, define allowed types, size limit, server-side validation, malware-scanning ownership, failure state, and PII classification in the spec. Do not rely only on client `accept`/MIME; do not display a local file as trusted content.
- Export only data permitted by current server-side authorization. Do not put PII in a URL/query string; use a safe download contract and a clear error state.
- Bulk/destructive actions require a visible scope/count, explicit confirmation, disabled/pending state, consideration of idempotency/duplicate submission, a result summary, and partial-failure handling. The backend confirms permissions and targets; the frontend must not claim irreversible deletion before a confirmed response.

## Proportional security review

Each feature spec includes one status:

- **n/a** — no auth, PII, external input, files, export, or privileged/destructive action; give a brief rationale.
- **basic** — ordinary API/UI flow or a new route/action: check access, `401`/`403`, error/log redaction, XSS-safe output, and applicable transport rules.
- **elevated** — auth/session/roles, PII, upload/download/export, bulk/destructive action, payment, or external/HTML content. Add a short threat model: assets/PII, actors and trust boundaries, abuse cases, controls, residual risks, and backend/infra dependencies. Check security scenarios with tests at a feasible level and manually/through E2E after readiness.
