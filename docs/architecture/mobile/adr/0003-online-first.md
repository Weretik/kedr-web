# ADR-0003: Online-first strategy for the first release

**Status:** Accepted\
**Date:** 2026-07-27

## Context

The first scenario is a catalog demonstration. There is no confirmed requirement to use the catalog or make changes completely offline.

## Decision

The application is online-first: RTK Query keeps data in memory only, NetInfo is used for UX, and SQLite and AsyncStorage are not added.

## Consequences

- Screens implement offline/error states and an explicit request retry.
- Data is not guaranteed to remain after restarting the application.
- SQLite, persistent cache, sync queue, and conflicts require a separate ADR.
