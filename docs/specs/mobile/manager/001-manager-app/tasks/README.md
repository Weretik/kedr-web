# Kedr Manager — tasks

Stage numbers match the [stage table](../README.md#stages). Every stage ends with a short structure check of the changed files (split mixed files, group dump folders) and its PR; the next stage starts on the owner's word.

## Stage 0 — specification

- **TS-000 — Spec and standards.** This SDD, design system «Офіс», ADR-0005, ADR-0006, mobile rules and stack updated, specs index; KedrStore spec `platform/004-mobile-offline-sync`. Test level: docs check. Status: done in this PR.

## Stage 1 — shell, design system, sign-in

- **EN-001 — Packages.** Add `react-native-unistyles`, `@gorhom/bottom-sheet`, `expo-local-authentication`, `zustand` with `npx expo install`; run Expo Doctor; record versions in the [technology stack](../../../../../architecture/mobile/platform/technology-stack.md). Checkpoint: `npx nx run mobile:typecheck`. Status: done 2026-11-05; versions in the technology stack (Expo online check unreachable, SDK 58 bundled list used).
- **TS-001 — Tokens and themes.** `libs/mobile/shared/ui/src/theme/*` for «Офіс» light/dark and breakpoints; Unistyles config loaded before the root layout. Covers R-017 (base). Test: unit for token roles. Status: done; `theme/themes.spec.ts` (roles, contrast, breakpoints).
- **TS-002 — Base components.** Button, IconButton, TextField, SearchField, SegmentedControl, Chip, StatusPill, QuantityStepper, Card, ListRow, Avatar, Sheet, StateView in `@mobile/shared/ui`. Test: component. Status: done; `components/shared-ui.spec.tsx`. `AppText`, `Icon`, `BrandMark` added.
- **TS-003 — Shell and gate.** `(work)/_layout.tsx` with `TabBar` (phone) and `NavRail` (tablet), customer gate, `CustomerBar` placeholder until stage 3; orientation per breakpoint. Covers R-002, R-017; SC-003, SC-024 (layout part). Test: component. Status: done; `work-navigation.spec.tsx`, `customer-bar.spec.tsx`, app `work-routes.spec.tsx`. `hasCustomer` is `false` until TS-009.
- **TS-004 — Sign-in and session.** «Офіс» login screen with show-password; 7-day offline window; quick unlock adapter and setting. Covers R-001, R-014; SC-001, SC-002, SC-018, SC-019. Test: unit + component. Status: done; `mobile-auth.spec.ts`, `offline-window.spec.ts`, `login-screen.spec.tsx`, `no-access-screen.spec.tsx`. Temporary cabinet route holds the theme, quick unlock and sign-out until TS-020.
- **TS-005 — Remove the old app parts.** Delete Paper, actions-sheet, «Пагін» theme, Unbounded, Home placeholder, products-without-photos route and feature, Redux store wiring for removed screens; old catalog/cart/orders routes stay only until their stage replaces them, or are removed now if they no longer compile without Paper. Test: `mobile:typecheck`, `mobile:lint`. Status: done; old catalog, cart, orders and customers libraries and routes removed with Paper, Redux, RTK Query and the unused packages.

## Stage 2 — local database and sync

- **EN-002 — Backend sync endpoints** deployed (KedrStore `platform/004`). Status: implemented in KedrStore PR #173; deploys on its merge.
- **TS-006 — Local database.** `@mobile/core/local-db`: connection, Drizzle schema (tables in [design](../design/frontend.md#local-data-model-drizzle-tables)), migrations, wipe. Test: data-access. Status: done 2026-11-05; `local-database.spec.ts` on `better-sqlite3`. Migrations are an ordered SQL list applied by `PRAGMA user_version` (no `drizzle-kit` files, so Metro needs no `.sql` loader); the FTS5 search table comes with stage 4 search. Tags `scope:mobile`, `type:data-access` with no domain, so every domain's data-access may read it.
- **TS-007 — Sync service.** `@mobile/sync`: snapshot clients with zod and ETag, transactional replace, schedule, first-sync progress, `sync_state`, stale strip in the shell. Covers R-014, R-015; SC-020. Test: unit + data-access. Status: done 2026-11-05; `@mobile/sync/{model,data-access,feature}`, strip in the `WorkLayout` slot, `clearDeviceData()` on sign-out. The quick «Оновити дані зараз» button lands with the cabinet (TS-020); `syncStatusActions.requestNow()` is ready for it.
- **TS-008 — Contract snapshot.** Refresh `docs/contracts/openapi` from KedrStore and pass `npm run contracts:check`. Status: done 2026-11-05 from KedrStore `master` 0cf2b67 (PR #173 merged).

## Stage 3 — customers

- **TS-009 — Selected customer.** Zustand store persisted by id, restore on start, `CustomerBar` live. Covers R-002; SC-003, SC-004. Status: done 2026-11-05; `useSelectedCustomerStore` in `customers/data-access` (ids only, AsyncStorage key `kedr.mobile.selected-customer`), `hasCustomer` in `(work)/_layout.tsx` is true only for a customer the synced data knows, sign-out clears the choice. Test: `customers-data-access.spec.tsx`, app `work-routes.spec.tsx`.
- **TS-010 — Customer choice and list.** Search by name/phone/code, recent, A–Я; tablet list + card. Covers R-003; SC-004. Status: done 2026-11-05; `CustomerList` and `CustomerChoice` in `customers/feature`, search in `customers/model`. Picking a row selects the customer; the phone opens `/customer/[counterpartyId]`, the tablet shows the card on the right. Test: `customers-feature.spec.tsx`, `customers-model.spec.ts`.
- **TS-011 — Customer card.** Contacts, price type and rules, debt and balance «—» with the 1C note, orders and drafts tabs from `order-workspace` cached locally. Covers R-004, R-013; SC-005. Status: done 2026-11-05; `CustomerCard` with `CustomerMoney`, `PriceRules`, `OrderRow`, `DraftRow`. Orders and drafts (last 50 each) are kept in one `customer_activity` table per customer instead of `orders_cache`/`drafts_cache`; offline the card shows them with their date. Test: `customers-ui.spec.tsx`, `customers-feature.spec.tsx`, `customers-data-access.spec.tsx`.

## Stage 4 — products

- **TS-012 — Price resolver.** Pure resolver in `catalog/model` with KedrStore cases. Covers R-005; SC-006. Test: unit. Status: done 2026-11-05; `resolvePriceTypeId`/`resolvePriceKopecks` in `catalog/model` (a rule type without a price gives null, as in KedrStore). Test: `catalog-model.spec.ts`.
- **TS-013 — Product list.** FTS search, category tree, «лише в наявності», sort, client price, disabled add when out of stock or without price; tablet table. Covers R-005–R-007; SC-007, SC-008. Status: done 2026-11-05; `ProductList` in `catalog/feature` with in-memory search instead of FTS (see design), category chips with the path, «Лише в наявності», sort chip; the «+» in `ProductRow` appears when stage 5 passes `onAdd`. Test: `catalog-model.spec.ts`, `catalog-feature.spec.tsx`.
- **TS-014 — Product detail and viewer.** Photos and scheme on white, segmented «Фото | Схема», full-screen `ZoomViewer`, tablet side by side. Covers R-008, R-017; SC-009, SC-025. Status: done 2026-11-05; `ProductGallery`, `ProductImage`, `ZoomViewer`/`ZoomableImage` in `catalog/ui`, `ProductDetail` in `catalog/feature`, routes `/products` and `/products/[productId]`; description and characteristics wait for KedrStore to send them. Test: `catalog-ui.spec.tsx`, `catalog-feature.spec.tsx`.
- **TS-015 — Photo cache.** Prefetch of thumbnails and schemes on Wi‑Fi, «Завантажити всі фото». Covers R-008; SC-010. Status: done 2026-11-05; `useEssentialPhotoDownload` (main photo and scheme of every product on Wi‑Fi per catalog version) and `PhotoDownloadCard` in the cabinet. Test: `catalog-data-access.spec.tsx`.

## Stage 5 — calculation, drafts, orders

- **TS-016 — Calculation model.** Per-customer lines, adjustment parse and ≥ 1 ₴ rule, totals in kopecks. Covers R-009; SC-011, SC-012, SC-013. Test: unit. Status: done 2026-11-05; `calculation/model` (`parseAdjustment`, `adjustmentProblem`, `priceLine`, `calculationTotals`, `addProduct`) and tables `calculations`, `calculation_lines` (migration 3). Test: `calculation-model.spec.ts`, `calculation-data-access.spec.ts`.
- **TS-017 — Calculation screen.** Lines, stepper, adjustment field, comment, footer with «Чернетка» and «Відправити в 1С»; tablet side panel. Covers R-009, R-017; SC-011, SC-024. Status: done 2026-11-05; `CalculationPanel` with inline confirm and draft steps, `calculation/ui` rows and footer, «+» and «Додати в розрахунок» in the catalog, side panel on `wide`, tab badges. Test: `calculation-ui.spec.tsx`, `calculation-feature.spec.tsx`, `catalog-feature.spec.tsx`.
- **TS-018 — Send queue.** Outbox runner, backoff, idempotency keys, quote then create, `needs-review`. Covers R-010–R-012; SC-014–SC-017. Test: unit (state machine) + data-access. Status: done 2026-11-05; table `outbox`, `drainOutbox` and `useOutboxRunner` in `calculation/data-access`, started from the working area. Test: `calculation-model.spec.ts`, `calculation-data-access.spec.ts`.
- **TS-019 — Conflict view and orders.** Reasons and changed lines in the calculation; order and draft detail. Covers R-012, R-013; SC-017, SC-005. Status: done 2026-11-05; `ReviewBanner` and outlined lines, `OrdersScreen` (queue, orders, drafts) and `OrderDetailScreen` in `orders/feature`, `/orders/[orderId]`. Test: `orders-feature.spec.tsx`, `orders-data-access.spec.ts`.

## Stage 6 — cabinet

- **TS-020 — Cabinet.** Photo, name; Admin email and password with current password and confirmation; sync time, queue, «Оновити дані зараз», «Завантажити всі фото», theme, quick unlock, sign-out with queue warning. Covers R-016; SC-021–SC-023. Status: done 2026-11-05; `@mobile/profile/{model,data-access,ui,feature}` (`CabinetProfile`, `SignOutSection`), `SyncInfoCard` in `sync/feature`, `QueueSummaryCard` in `calculation/feature`, `updateSessionUser` in `core/auth`; after an e-mail or password change the app signs in again because KedrStore revokes every refresh session. Photo picking adds `expo-image-picker` (new native build). Test: `profile-*.spec.ts(x)`, `sync-feature.spec.tsx`, `calculation-feature.spec.tsx`, `mobile-auth.spec.ts`.

## Stage 7 — tablet pass

- **TS-021 — Layouts.** Check and finish every screen at `phone`, `tablet`, `wide` in both orientations. Covers R-017; SC-024, SC-025.

## Stage 8 — release

- **TS-022 — Distribution.** App name «Кедр Менеджер», icons and splash in «Офіс», EAS profiles for internal distribution (Android APK link, iPhone TestFlight/ad hoc), `expo-updates`.
- **TS-023 — Docs and audit.** Feature map, architecture pages, offline strategy rewritten, final structure audit; device checks with the owner's permission.
