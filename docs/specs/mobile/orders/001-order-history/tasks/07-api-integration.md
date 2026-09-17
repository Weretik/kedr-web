# Phase 07 — API integration

**Purpose:** implement validated list/detail transport only after provider
contract synchronization.

## Planned subphases

- `EN-001` provides stable generated operations and consumer projection.
- `TS-002` owns list request args, page envelope validation and summary mapping.
- `TS-003` owns detail path args, validation, mapping and safe not-found/error
  distinction.

## Exit checkpoint

`npm run contracts:check` passes; generated types stay in data-access; focused
tests prove list/detail mapping, pagination metadata and safe errors.
