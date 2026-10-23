# ADR-0002: Axios transport for Mobile RTK Query

**Status:** Accepted\
**Date:** 2026-07-27

## Context

Mobile uses RTK Query for server state. The team agreed on Axios so the transport model matches Admin and HTTP handling is not duplicated across domains.

## Decision

`@mobile/shared/api-client` owns the Axios instance, `axiosBaseQuery`, `baseApi`, and `ApiError` normalization. Each domain `data-access` extends `baseApi` through `injectEndpoints`; feature uses only typed hooks.

## Consequences

- Do not duplicate the RTK Query cache in a Redux slice.
- Do not call Axios directly from feature or UI.
- Axios base query returns `{ data }` or `{ error }`; it does not let a transport exception escape.
