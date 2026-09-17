# Phase 02 — state and data fetching

**Purpose:** implement customer selection reuse and history query/session/page
orchestration.

## Planned subphases

- `TS-004` migrates active-customer data/search/sheet ownership from cart into
  reusable customer libraries without changing checkout behavior.
- `TS-005` owns session filter identity, page transitions, accumulation,
  deduplication, refresh and retry coordination.

## Exit checkpoint

Filter lifecycle, complete customer search, first/later-page transitions and
preserved data on recoverable failures have focused evidence.
