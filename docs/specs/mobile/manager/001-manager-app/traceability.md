# Kedr Manager — traceability

Test paths are filled in when each task is implemented.

| Scenario | Rules | Tasks | Test level | Tests | Status |
| --- | --- | --- | --- | --- | --- |
| SC-001 | R-001 | TS-004 | component | `core/auth/src/screens/login-screen.spec.tsx`, `apps/mobile/src/__tests__/work-routes.spec.tsx` | done |
| SC-002 | R-001 | TS-004 | component | `core/auth/src/screens/no-access-screen.spec.tsx` | done |
| SC-003 | R-002 | TS-003, TS-009 | component | `core/shell/src/navigation/work-navigation.spec.tsx`, `apps/mobile/src/__tests__/work-routes.spec.tsx` | done |
| SC-004 | R-002, R-003 | TS-009, TS-010 | component | `customers/feature/src/customers-feature.spec.tsx`, `customers/data-access/src/customers-data-access.spec.tsx`, `customers/model/src/customers-model.spec.ts` | done |
| SC-005 | R-004, R-013 | TS-011, TS-019 | component | `customers/feature/src/customers-feature.spec.tsx`, `customers/ui/src/customers-ui.spec.tsx`, `orders/feature/src/orders-feature.spec.tsx` | done; orders and drafts open from «Замовлення» (TS-019) |
| SC-006 | R-005 | TS-012 | unit | `catalog/model/src/catalog-model.spec.ts`, `catalog/data-access/src/catalog-data-access.spec.tsx`, `catalog/feature/src/catalog-feature.spec.tsx` | done |
| SC-007 | R-006 | TS-013 | component | `catalog/ui/src/catalog-ui.spec.tsx`, `catalog/feature/src/catalog-feature.spec.tsx` | done; the «+» button is wired in stage 5 |
| SC-008 | R-007 | TS-013 | data-access | `catalog/model/src/catalog-model.spec.ts`, `catalog/feature/src/catalog-feature.spec.tsx` | done |
| SC-009 | R-008 | TS-014 | component | `catalog/ui/src/catalog-ui.spec.tsx` (switch, full-screen open, close) | done; pinch and double tap need the device check |
| SC-010 | R-008, R-014 | TS-015 | unit | `catalog/data-access/src/catalog-data-access.spec.tsx`, `catalog/ui/src/catalog-ui.spec.tsx` | done |
| SC-011 | R-009 | TS-016, TS-017 | unit + component | `calculation/model/src/calculation-model.spec.ts`, `calculation/feature/src/calculation-feature.spec.tsx` | done |
| SC-012 | R-009 | TS-016 | unit | `calculation/model/src/calculation-model.spec.ts`, `calculation/ui/src/calculation-ui.spec.tsx` | done |
| SC-013 | R-002, R-009 | TS-016 | unit | `calculation/feature/src/calculation-feature.spec.tsx` | done |
| SC-014 | R-010 | TS-018 | data-access | `calculation/data-access/src/calculation-data-access.spec.ts`, `orders/feature/src/orders-feature.spec.tsx` | done |
| SC-015 | R-011 | TS-018 | unit | `calculation/data-access/src/calculation-data-access.spec.ts`, `calculation/feature/src/calculation-feature.spec.tsx` | done |
| SC-016 | R-011, R-014 | TS-018, EN-002 | unit | `calculation/data-access/src/calculation-data-access.spec.ts`, `calculation/ui/src/calculation-ui.spec.tsx` | done |
| SC-017 | R-012 | TS-018, TS-019 | unit + component | `calculation/data-access/src/calculation-data-access.spec.ts`, `orders/feature/src/orders-feature.spec.tsx` | done |
| SC-018 | R-014 | TS-004 | unit | `core/auth/src/session/mobile-auth.spec.ts`, `offline-window.spec.ts` | done |
| SC-019 | R-014 | TS-004 | unit | `core/auth/src/session/mobile-auth.spec.ts`, `offline-window.spec.ts` | done |
| SC-020 | R-015 | TS-007, EN-002 | unit + data-access | `sync/data-access/src/runner/sync-runner.spec.ts`, `sync/feature/src/sync-feature.spec.tsx`, `core/local-db/src/database/local-database.spec.ts` | done |
| SC-021 | R-016 | TS-020 | component | `profile/ui/src/profile-ui.spec.tsx`, `profile/feature/src/profile-feature.spec.tsx` | done |
| SC-022 | R-016 | TS-020 | component | `profile/ui/src/profile-ui.spec.tsx`, `profile/feature/src/profile-feature.spec.tsx`, `profile/model/src/profile-model.spec.ts` | done |
| SC-023 | R-016 | TS-020 | component | `profile/ui/src/profile-ui.spec.tsx`, `calculation/feature/src/calculation-feature.spec.tsx` | done |
| SC-024 | R-017 | TS-003, TS-017, TS-021 | component | `core/shell/src/navigation/work-navigation.spec.tsx` (tab bar vs rail), `catalog/feature/src/catalog-feature.spec.tsx` (calculation panel) | navigation and panel done; tablet pass in TS-021 |
| SC-025 | R-008, R-017 | TS-014, TS-021 | component | `catalog/ui/src/catalog-ui.spec.tsx`, `catalog/feature/src/catalog-feature.spec.tsx` | done |
