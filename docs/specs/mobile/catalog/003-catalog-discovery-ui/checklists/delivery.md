# Delivery checklist: catalog discovery UI

- [x] Залежності встановлені у сумісних версіях та Expo Doctor пройшов.
- [x] Appbar, list/card, sheets, chips і history відповідають spec/visual contract за automated coverage.
- [x] Tests/lint/web export виконані з фактичними результатами (phase 16 evidence нижче).
- [x] Android/iOS/web manual QA завершено або blocker має owner і наступний крок.
- [ ] Light/dark visual evidence зібрано.
- [x] Немає неузгоджених API, theme або route змін.

## Residual risks

| Risk                                                                                                       | Owner         | Next step                                                                          |
| ---------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| Light/dark screenshots for the default catalog and all four sheets were not attached to the specification. | Product owner | Capture and attach or link them when visual evidence is needed for release review. |

## Phase 16 final evidence (2026-08-07)

```powershell
npx nx test mobile --runInBand
npx nx test mobile-catalog-ui --runInBand
npx nx test mobile-catalog-feature --runInBand
npx nx lint mobile --outputStyle=static
npx nx lint mobile-catalog-ui --outputStyle=static
npx nx lint mobile-catalog-feature --outputStyle=static
cd apps/mobile
npx expo export --platform web
```

- Bottom navigation / app routes: 2 suites, 3 tests passed.
- Catalog UI: 6 suites, 10 tests passed. This includes the full-screen search sheet (submit icon, choose/remove/clear history), applied-filter chip close action, category breadcrumbs, and product-card rendering.
- Catalog feature: 5 suites, 22 tests passed.
- Lint passed for `mobile`, `mobile-catalog-ui`, and `mobile-catalog-feature`.
- Web export passed: Metro bundled 1,747 modules and wrote `apps/mobile/dist`.
- The UI-library dependency declaration and import/test hygiene needed for the final lint pass were corrected. No API, route, theme-provider, or native configuration changes were introduced.

## Phase 16 manual-QA status

- Android/iOS/web manual QA is completed by the product owner: compact bottom navigation, safe areas, labels/icons, active and light/dark states, search keyboard/scroll/history controls, product cards and applied chips were checked.
- Visual evidence remains optional release-review material; its absence does not block the completed functional delivery.
