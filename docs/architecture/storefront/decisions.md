# Storefront decisions in effect

The decisions below are already implemented in code. Record a new disputed or long-term decision in a separate ADR under `docs/architecture/storefront/adr/` before implementation.

| Decision                                   | Rationale and consequence                                                         |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| Standalone Angular and `ApplicationConfig` | Compose the application without NgModule; keep providers centralized.             |
| SSR and incremental hydration              | Public pages are safe for server rendering; browser APIs require explicit guards. |
| Localized `/uk` and `/ru` routes           | Locale is part of the URL; fallback and 404 remain consistent.                    |
| Signals for client state                   | Keep domain state alongside its domain without a global store.                    |
| `HttpClient` + interceptors                | Handle authorization, CSRF, logging, and errors centrally.                        |
| Transloco for UI text                      | Avoid duplicating localization in feature components.                             |
