# 001 — Kedr Manager: rebuild of the mobile app

- **Client type:** React Native (Expo)
- **App:** `apps/mobile` (Nx project `mobile`), libraries `libs/mobile/*`
- **Architecture source:** [Mobile architecture](../../../../architecture/mobile/README.md), [ADR-0005 offline-first](../../../../architecture/mobile/adr/0005-offline-first-local-database.md), [ADR-0006 own UI](../../../../architecture/mobile/adr/0006-own-ui-on-unistyles.md), [design system «Офіс»](../../../../standards/mobile/design-system.md)
- **Domain:** whole app (auth, customers, catalog, calculation, orders, profile, sync)
- **Status:** stages 1–4 implemented; stage 5 (calculation, drafts, orders) next
- **Owner:** Виталий (product owner)
- **Created:** 2026-11-05
- **Updated:** 2026-11-05

The owner asked (2026-11-05) to rebuild the mobile app almost from scratch as a working tool for managers: every job starts from a customer, prices are that customer's prices as in the Kedr Admin, the manager builds a calculation with discount or markup, saves a draft or sends the order to 1C, and all of it works on a tablet and with no network. Product photos and the product scheme must be large and clearly visible. Design direction A «Офіс» was chosen on 2026-11-05 from the [design canvas](https://claude.ai/artifact/7tcWwjg6KXeDuZLCuYRaks); audit and plan: [Kedr Manager audit and plan](https://claude.ai/artifact/JPTXQXg99JwL5GDx3DXS8T).

**In scope:** sign-in, cabinet, customer choice and customer gate, customer list and card with a debt placeholder, products with search/filters/categories, product detail with photos and scheme, calculation with per-unit discount/markup, drafts, sending to 1C, order history per customer, offline mode, tablet layouts, distribution to Android and iPhone.

**Out of scope:** SEO texts, storefront features, real debt and settlement data (1C does not send them yet; the card keeps a placeholder), editing products, products without photos (the old profile screen is removed; the Admin has it).

## Status

- Specification: ready for stage 1 (2026-11-05)
- Implementation: stage 1 (shell, «Офіс» UI, sign-in) done 2026-11-05
- Verification: focused Jest suites, typecheck and lint for the mobile projects; no device run yet
- Blockers: the app's sync needs KedrStore `platform/004-mobile-offline-sync` (PR #173) deployed

## Owner decisions (2026-11-05)

| Question | Decision |
| --- | --- |
| Design | A «Офіс» as drawn, no mix with B or C |
| App identity | Keep `com.classkedr.mobile` and the EAS project so installed apps update; name «Кедр Менеджер» |
| Devices and distribution | Managers mostly on Android, some on iPhone; any quick way: EAS internal distribution (Android APK link; iPhone through TestFlight or ad hoc, needs the Apple developer account) |
| Offline sign-in | Up to 7 days without network since the last successful refresh |
| Photos offline | Thumbnails of all products and all schemes ahead of time; large photos on first open; «Завантажити всі фото» in the cabinet |
| Who sees which orders | As in the Admin |
| Old app | Not needed; it is replaced in place, no parallel app |

## Documents

- [Rules and scenarios](requirements/behavior.md)
- [Frontend design](design/frontend.md)
- [API contract](contracts/api-contract.md)
- [Tasks and stages](tasks/README.md)
- [Traceability](traceability.md)
- [Spec readiness](checklist/spec-readiness.md)

## Stages

Each stage is one PR per affected repository, followed by a short structure check of the changed files; merge only on the owner's «сливай».

| Stage | Result | Repositories |
| --- | --- | --- |
| 0 | This spec, design system «Офіс», ADR-0005/0006, backend sync spec | kedr-web, KedrStore |
| 1 | Shell: themes, fonts, `@mobile/shared/ui` base, phone tabs and tablet rail with the customer gate, sign-in and session with offline unlock; old Paper screens removed | kedr-web |
| 2 | Sync: local database, sync service, «дані від» state; backend snapshot endpoints | KedrStore, kedr-web |
| 3 | Customers: choice, list, card with debt placeholder, orders and drafts of the customer | kedr-web |
| 4 | Products: list, search, categories, filters, client price; detail with gallery, scheme and zoom; photo cache | kedr-web |
| 5 | Calculation and orders: lines, discount/markup, quote, drafts, send to 1C, send queue and conflicts | kedr-web (KedrStore only if a gap appears) |
| 6 | Cabinet: photo, name; Admin email and password; sync, queue, theme, quick unlock, sign-out | kedr-web |
| 7 | Tablet pass on all screens in both orientations | kedr-web |
| 8 | Release: offline and conflict checks, EAS builds and distribution, docs and feature map, final audit | kedr-web |

Stages 3 and 4 may run in parallel after stage 2; stage 5 needs both.

## Change history

- 2026-11-05 — created after the owner chose design A and answered the plan questions.
