# TS-003 — Orchestrate retry, refresh and pagination

- **Task ID:** TS-003
- **Covers:** SC-001, SC-004, SC-005, SC-006, SC-007
- **Depends on:** TS-002
- **Exact paths:**
  `libs/mobile/catalog/feature/src/hooks/use-missing-photo-products-controller.ts`;
  `libs/mobile/catalog/feature/src/hooks/use-missing-photo-products-controller.spec.tsx`
- **Test level:** focused integration
- **Architecture baseline:** feature controller consumes one data-access hook;
  RTK Query retains server/cache ownership

## Work

- [x] Derive first-load, success, empty, refresh, terminal error and optional
      next-page states directly from the query result without copying response rows
      into component/reducer state.
- [x] Expose explicit retry and refresh callbacks; refresh resets/replaces the
      full result according to the confirmed cache contract while preserving
      visible rows during the request.
- [x] If paginated, expose load-next/retry-next only when more results exist and
      no conflicting fetch is active; otherwise expose no pagination behavior.
- [x] Add focused hook tests for transitions, repeated retry, retained rows
      during refresh/next-page failure and unpaginated absence of load-more.
- [x] Update the code audit and confirm query data/loading/error are not
      duplicated in local state.
- [x] Verify changed implementation files each retain one cohesive
      responsibility; separate pure pagination transitions only if the confirmed
      contract makes them independently testable.

## Evidence

- Test/path and observable assertion:
  `use-missing-photo-products-controller.spec.tsx` proves observable state and
  callback transitions against a controlled query hook.
- Red command and expected behavioral failure:
  `npx nx test mobile-catalog-feature --runInBand --testPathPattern=use-missing-photo-products-controller.spec.tsx`;
  controller behavior is absent.
- Green command and result: same focused command; 3 tests passed.
- Refactor note and focused rerun: controller retains only current page; RTK
  Query remains the row/status owner; focused tests passed.
- Regression command and result:
  `npx nx test mobile-catalog-feature --runInBand`; 7 suites / 37 tests passed.
- Manual/visual evidence, if required: n/a.
- Deviation or blocker: none; page-based pagination was confirmed by EN-001.

## Checkpoint

Each query lifecycle transition and allowed action is proven without a second
owner for server rows or request status.
