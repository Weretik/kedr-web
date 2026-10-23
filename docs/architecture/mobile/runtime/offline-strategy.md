# Mobile online-first and future offline support

## Current decision

The first release is **online-first**. SQLite and AsyncStorage are not installed or used for the catalog. RTK Query cache exists only in process memory and is not an offline database.

`@mobile/core/connectivity` encapsulates NetInfo and provides normalized network state. It improves UX but does not replace handling actual HTTP errors.

| State                                   | Behavior                                                                          |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| No network before initial load          | offline state and retry button                                                    |
| Network lost during a request           | error state and retry button                                                      |
| Catalog data already displayed, offline | show in-memory data and an unobtrusive offline indicator                          |
| Network restored                        | do not silently reload; the next user action or explicit refresh starts a request |

## Deferred levels

```text
Stage 1 — online-first: NetInfo + RTK Query memory cache
Stage 2 — persistent read cache: separate decision about AsyncStorage
Stage 3 — offline-first: SQLite, local model, sync queue, conflicts
```

Moving to any later level requires a new ADR. It must define data to store, TTL and versioning, invalidation, write queue, idempotency, conflict policy, retries after network recovery, and personal-data protection.

Do not use AsyncStorage for tokens. Tokens for a future session belong in Expo SecureStore.
