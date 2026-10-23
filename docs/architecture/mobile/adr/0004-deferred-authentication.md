# ADR-0004: Deferred authentication

**Status:** Accepted\
**Date:** 2026-07-27

## Context

The first Mobile increment shows a public catalog. An authentication scenario and refresh-token contract are not yet part of the agreed scope.

## Decision

Do not create login, protected routes, a token interceptor, or SecureStore persistence in the first release. Do not generate `core/auth` in advance.

## Consequences

- The catalog uses a public API or controlled mocks.
- When a session is added, create a separate ADR covering SecureStore, refresh/logout, protected route groups, and cache clearing during logout.
