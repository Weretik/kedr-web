# Phase 02 — state and data fetching

**Purpose:** orchestrate hooks, stores, providers, caching and data-fetching
responsibilities.

## Planned subphases

- One `TS-*` per state transition or data-fetching behavior.
- Use focused integration tests at the real module boundary with controlled
  external adapters.
- Підтвердити approved client stack: Admin/Mobile RTK Query; Storefront Angular
  `HttpClient` через data-access facade. Direct transport і manual duplicated
  server cache/lifecycle є findings.

## Exit checkpoint

Loading, success, empty, error, retry, cancellation and stale-data risks in
scope have evidence; cache/invalidation owner не дублюється у feature state.
