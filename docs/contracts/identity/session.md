# Session consumer contract

## Machine contract

- OpenAPI: [`session.openapi.yaml`](../openapi/identity/session.openapi.yaml)
- Consumers: Admin and Storefront (cookie session), Mobile (bearer tokens)

| Intent            | Operation             | Current consumers         |
| ----------------- | --------------------- | ------------------------- |
| Browser sign in   | `loginCookieSession`  | Admin, Storefront         |
| Browser sign out  | `logoutCookieSession` | Admin, Storefront         |
| Mobile sign in    | `loginMobile`         | Mobile                    |
| Mobile renew      | `refreshMobile`       | Mobile                    |
| Mobile sign out   | `logoutMobile`        | Mobile                    |
| Read current user | `getCurrentSession`   | Admin, Storefront, Mobile |

The earlier `loginSession`, `refreshSession`, and `logoutSession` operations are deprecated and not consumed. Auth adapters import generated request and response types at the HTTP boundary; application session state keeps its own model so a provider field change does not propagate into features.

## Browser session (Admin, Storefront)

| Event             | Client action                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| App bootstrap     | `GET /api/auth/session/me` with credentials; `401` means guest                                                   |
| Sign in           | `POST /api/auth/cookie/login`; the server sets the HttpOnly session cookie and `kedr.csrf`, and returns the user |
| Any non-GET       | Send `X-CSRF-Token` equal to the `kedr.csrf` cookie, otherwise the server answers `400`                          |
| `401` on any call | The session ended (expired, password or role changed, blocked): clear local state and open the login page        |
| `403` on any call | The role does not allow the action: show "no access", do not sign out                                            |
| Sign out          | `POST /api/auth/cookie/logout` with the CSRF header, then clear local state even if the call fails               |

No token is readable by JavaScript in the browser. Never store anything session-related in `localStorage`, `sessionStorage`, Redux, or a URL.

## Mobile session

| Event        | Client action                                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Sign in      | `POST /api/auth/mobile/login`; keep `accessToken` and `refreshToken` in the secure store                                           |
| Each request | `Authorization: Bearer <accessToken>`                                                                                              |
| `401`        | Call `POST /api/auth/mobile/refresh` once (parallel requests share it), save the new pair, repeat the request; on failure sign out |
| Sign out     | `POST /api/auth/mobile/logout` with the refresh token; delete both tokens even when offline                                        |

A refresh token is single-use: every refresh returns a new one. Presenting a rotated token after the 60-second grace period revokes all of the user's sessions.

Tokens, cookies, authorization headers and request/response bodies must never be logged. Runtime auth failures pass through the existing normalized error path.
