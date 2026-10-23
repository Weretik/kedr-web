# Storefront state, API, and forms

## Server data and HTTP

- The API service uses generated transport types from `@shared/api-contracts`, built from the versioned OpenAPI snapshot.
- Generated request/response types do not become a Storefront contract or domain model: repository mappers return types from `@storefront/contracts` to feature.
- Feature and UI do not import `@shared/api-contracts`.
- Make HTTP requests only in `data-access` through Angular `HttpClient`.
- `provideStorefrontHttp` configures `fetch` and the interceptor chain: base URL, credentials, CSRF, authorization, unauthorized-response handling, logging, and errors.
- An API service or repository accepts and returns types from `contracts`, converts transport DTOs to the model needed by feature, and does not pass HTTP details to UI.
- Session initialization is centralized through `AUTH_INIT_PROVIDER`; a feature must not duplicate access-token refresh during startup.

## Client state

Storefront does not have one global store. Keep local component state in the component. State needed by multiple components or requiring its own actions and derived values is implemented in a domain `Store` or facade with Angular signals and `computed`.

Current examples: `CartStore` keeps cart state, `CartUiFacade` keeps whether the cart UI is open, and checkout feature uses signal state and `rxMethod` for its asynchronous scenario. Do not add a new global store or third-party state library without a separate ADR.

## Forms

A form belongs to a feature scenario. The form component handles input, validation, and displaying errors; submission is delegated to a feature facade or `data-access` service. Move a reusable control to `ui` only after actual reuse. Use Transloco keys, not component literals, for all user-visible text.

## Localization

Transloco is configured at application level. The currently supported locales are `uk` and `ru`; `uk` is the default and fallback locale. `LocaleNavigationService` manages URLs and locale switching; a feature must not build localized URLs manually.
