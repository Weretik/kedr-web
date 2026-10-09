# TS-005 — Compose Profile route and optional details navigation

- **Task ID:** TS-005
- **Covers:** SC-008, SC-009
- **Depends on:** TS-004
- **Exact paths:** `apps/mobile/src/app/(tabs)/profile.tsx`;
  `apps/mobile/src/__tests__/profile-route.spec.tsx`;
  `libs/mobile/catalog/feature/src/index.ts`;
  `apps/mobile/jest.config.cjs` only if a new public alias mock is required
- **Test level:** integration
- **Architecture baseline:** Mobile app is the Expo Router composition root;
  route imports a public feature screen and owns Router calls

## Work

- [x] Replace the current Profile placeholder adapter with the exported
      missing-photo products screen while preserving the existing tab Appbar and
      theme header control.
- [x] If TS-001 confirms `productSlug`, pass a callback that pushes
      `/product/[productSlug]`; otherwise omit the callback and test the
      non-interactive contract.
- [ ] Verify native Back returns to the Profile tab and the feature uses cached
      list data without a custom duplicate route or new details screen.
- [x] Add an app route integration test for composition and the confirmed
      navigation branch; do not count infrastructure smoke as full scenario proof.
- [x] Update the code audit and rerun public/deep import checks.
- [x] Verify changed implementation files each retain one cohesive
      responsibility; keep parameter/navigation adaptation in the route and all
      query/UI behavior in the feature.

## Evidence

- Test/path and observable assertion: `profile-route.spec.tsx` proves public
  screen composition and either exact existing-route push or absence of a
  navigation callback, according to EN-001.
- Red command and expected behavioral failure:
  `npx nx test mobile --runInBand --testPathPattern=profile-route.spec.tsx`;
  current route renders only `ThemePreferenceScreen`.
- Green command and result: same focused command; 1 test passed.
- Refactor note and focused rerun: route contains only public feature
  composition and route parameter adaptation; focused test passed.
- Regression command and result: `npx nx test mobile --runInBand`; 5 suites /
  10 tests passed.
- Manual/visual evidence, if required: Back/tab/scroll preservation remains
  blocked in TS-007.
- Deviation or blocker: required `productSlug` selected the supported branch;
  native Back restoration requires device/runtime evidence.

## Checkpoint

The Profile route remains a thin adapter and automated evidence proves the
supported detail push; native Back restoration remains assigned to TS-007.
