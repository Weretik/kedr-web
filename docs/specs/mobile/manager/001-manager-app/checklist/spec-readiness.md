# Kedr Manager — spec readiness (2026-11-05)

- [x] Goal, scope and out of scope stated by the owner's request of 2026-11-05.
- [x] Owner decisions recorded: design A «Офіс», app identity, devices and distribution, 7-day offline window, photo strategy, order visibility as in the Admin, old app replaced.
- [x] Rules `R-001…R-017` and scenarios `SC-001…SC-025` without component or package names.
- [x] Architecture decisions recorded as ADR-0005 and ADR-0006; standards updated.
- [x] Planned library map with one responsibility each; what stays and what goes.
- [x] Existing API operations verified in KedrStore code (commit f2e3cb3); new operations specified in KedrStore `platform/004-mobile-offline-sync`.
- [x] Tasks per stage with covered rules and test level; traceability for every scenario.
- [ ] Package versions confirmed against Expo SDK 58 — in EN-001 (stage 1) and stage 2.
- [ ] Local database test approach (Jest driver) — decided in TS-006.
- [ ] Apple developer account for iPhone distribution — needed before stage 8.
