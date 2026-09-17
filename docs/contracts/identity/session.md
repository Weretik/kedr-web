# Session consumer contract

## Machine contract

- OpenAPI: [`session.openapi.yaml`](../openapi/identity/session.openapi.yaml)
- Consumers: Admin and Storefront auth adapters

| Intent            | Operation           | Current consumers |
| ----------------- | ------------------- | ----------------- |
| Sign in           | `loginSession`      | Admin, Storefront |
| Renew access      | `refreshSession`    | Admin, Storefront |
| Sign out          | `logoutSession`     | Admin, Storefront |
| Read current user | `getCurrentSession` | none              |

Auth adapters import generated request and response types at the HTTP boundary.
Application session state keeps its own model so a provider field change does
not propagate into features.

## Session flow

| Event                    | Client action                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| App bootstrap            | Try refresh once through the central auth initializer                                        |
| Successful login/refresh | Keep the access token in the session adapter and map the response to app session state       |
| Unauthorized request     | Coordinate a single refresh attempt, then retry according to the existing interceptor policy |
| Logout or failed refresh | Clear local session state                                                                    |

Credentials, CSRF behavior and bearer handling remain transport concerns.
Tokens, cookies, authorization headers and request/response bodies must never be
logged. The generated types provide compile-time compatibility only; runtime
auth failures still pass through the existing normalized error path.
