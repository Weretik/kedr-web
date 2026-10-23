# Storefront domains and libraries

## Library roles

| Role          | Location                      | Responsibility                                                                 |
| ------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| `contracts`   | `libs/storefront/contracts`   | DTOs, request and response contracts                                           |
| `data-access` | `libs/storefront/data-access` | HTTP services, repositories, data transformation, and API-related domain state |
| `feature`     | `libs/storefront/feature/*`   | Routes, user scenarios, pages, and feature facades                             |
| `shell`       | `libs/storefront/shell`       | Shared Storefront shell: header and footer                                     |
| `ui`          | `libs/storefront/ui`          | Reusable presentation components                                               |
| `util`        | `libs/storefront/util`        | Infrastructure utilities, including locale handling                            |

## Domains

Feature libraries represent storefront business areas: catalog, categories, cart, checkout, authentication, cabinet, articles, regions, contacts, wholesale, the about-us page, and `not-found`. Do not create a shared feature library for different domains without demonstrated reuse.

`shell` does not duplicate feature scenarios. For example, the header may connect needed public data or cart UI, but checkout remains in `checkout`.

## Public API

Imports between libraries go through their package entry points `@storefront/...` only. Do not use deep imports into internal files. Each library exports a minimal public API through `src/index.ts`.
