# 001 — «Замовлення з сайту» in the Admin and a longer wait on the site

- **Clients:** React Admin (`apps/admin`), public site (`apps/site`)
- **Domain:** site orders (new Admin domain `site-orders`), site cart
- **Backend:** KedrStore spec `sales/009-site-orders-in-admin` (contract source of truth)
- **Status:** Implemented 2026-11-24 (site fix in kedr-web #145, Admin page in the next PR); audit: [code-audit/audit.md](code-audit/audit.md)
- **Source:** owner request in the project thread of 2026-11-24: a buyer saw «Підтвердження не отримано» and the order did not reach Telegram

## Goal and scope

Managers and the owner open «Замовлення з сайту» in the «Продаж» menu block, see every order sent from the site, open one to see who ordered what, and see when Telegram did not get it and why; a failed delivery can be sent again. The site waits long enough for the API that a cold start does not turn a saved order into «Підтвердження не отримано».

**Out of scope:** handling statuses, editing or deleting a site order, converting it to a 1C order, a menu badge, changes to the site checkout UI or texts, mobile.

## Rules

- **R-001.** A new menu item «Замовлення з сайту» in the «Продаж» block after «Замовлення», route `/site-orders`, visible to roles that pass `CanManageOrders` (as «Замовлення»).
- **R-002.** The list is a server-paged Data Grid (newest first): «Дата» (Kyiv time), «Ім’я», «Телефон», «Товарів», «Сума, грн», «Telegram», «Дії» (eye). The toolbar has search (name or phone) and a switch «Лише з проблемою». No checkbox column. Search, page and the switch live in the URL.
- **R-003.** The «Telegram» column is empty for a delivered order (no «всё ОК» badge); a waiting order with an error shows a warning chip «Не надіслано» with the error in the tooltip; a failed order shows an error chip «Не надіслано» with the reason.
- **R-004.** The eye opens the read-only detail page `/site-orders/:id` (`AdminDetailHeader` «Деталі замовлення з сайту», back link keeps the list state): a main card (date, name, phone as a `tel:` link, total, order id), the problem `Alert` with the error text when delivery has a problem, and a lines table (code, name, price, quantity, sum). Nothing is editable, so there is no «Редагувати» and no edit panel.
- **R-005.** A failed order shows «Надіслати в Telegram ще раз» in the detail header. It is locked while pending; 202 refreshes the order and the list and shows «Замовлення поставлено в чергу на відправку»; 409 shows the server's Ukrainian detail and refreshes; 404 shows «Замовлення не знайдено». The backend checks the state, so no request key is sent (state transition, [idempotency rules](../../../../standards/shared/idempotency-rules.md)).
- **R-006.** Loading, empty («Замовлень з сайту ще немає» / «Нічого не знайдено»), and error states with «Повторити» follow the [list and detail standard](../../../../standards/admin/list-detail-pages.md); light and dark themes and phone widths use the Admin theme only.
- **R-008.** Site: the order request uses only fetch options the Cloudflare Workers runtime accepts (`redirect: 'manual'`, no `credentials`); a 3xx answer is «unavailable»; every failed request is logged with the error name and message and no order data. Root cause of 2026-11-24: `redirect: 'error'` threw in the Worker before the request left, so no site order ever reached the API.
- **R-007.** Site: `siteApiCreateQuickOrder` waits 25 s instead of 10 s before reporting «unavailable»; the backend now keeps the order even when the site stops waiting (backend R-002), and the existing idempotency key makes a repeat safe.

## Scenarios

| ID         | Scenario                                                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SC-001** | The menu shows «Замовлення з сайту» under «Продаж»; `/site-orders` renders the list.                                                                       |
| **SC-002** | The list maps the contract rows; a delivered order has an empty «Telegram» cell, a waiting-with-error and a failed order show their chips with the reason. |
| **SC-003** | Typing a search and turning on «Лише з проблемою» sends `search` and `delivery=problem` and resets the page to 1; the URL keeps them.                      |
| **SC-004** | Empty, loading and error states; «Повторити» refetches.                                                                                                    |
| **SC-005** | The detail page shows the main card, the lines with sums and the total; a problem order shows the `Alert`; unknown id shows «Замовлення не знайдено».      |
| **SC-006** | Resend: the button only for failed orders; locked while pending; 202 refreshes and shows the success text; 409 shows the server detail.                    |
| **SC-007** | Site: the order request uses a 25 s timeout.                                                                                                               |

## Design

New Admin domain generated with `npx nx g @nx/react:library` (then trimmed to repository conventions and tags), following the [code organization rules](../../../../standards/shared/code-organization.md) and the `clients` domain as the closest example:

```text
libs/admin/site-orders/
├── model/src/            entities/site-order.ts (list item, detail, delivery state), queries/site-order-page-params.ts (URL ↔ params)
├── data-access/src/      api/admin-site-orders.api.ts (typed openapi-fetch: getAdminQuickOrders, getAdminQuickOrderById,
│                         resendAdminQuickOrderToTelegram), mappers/, validators/ (zod), contracts/
├── ui/src/               tables/ (data grid, toolbar, Telegram cell), components/ (main card, lines table, problem alert)
└── feature/src/          site-orders.routes.tsx, pages/ (list page, detail page), hooks/ (resend mutation controller)
libs/admin/core/shell/src/navigation/navigation-groups.tsx   existing: + menu item
apps/admin routes                                             existing: + domain routes
libs/site/shared/api-client/src/lib/site-order-api.ts         existing: timeout 25 s
```

Each folder stays at ≤ 6 production files, components < 150 lines, hooks/models < 200 lines, every file with its spec. The contract comes from `npm run contracts:sync` after the KedrStore PR is merged to `master`; until then the frontend branch waits (contract first).

## Tasks

| ID         | Task                                                                                                                              | Depends on     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **TS-001** | Site timeout 25 s with its spec (SC-007)                                                                                          | —              |
| **TS-002** | Contract sync from KedrStore `master`                                                                                             | backend merged |
| **TS-003** | Specs first, then model and data-access (SC-002, SC-003)                                                                          | TS-002         |
| **TS-004** | UI and pages, menu and routes (SC-001…SC-006)                                                                                     | TS-003         |
| **TS-005** | Feature card `docs/features/admin/site-orders.md`, feature catalog, frontend inventory if needed                                  | TS-004         |
| **TS-006** | Architecture audit of the feature (`frontend-code-audit`), `architecture:structure`, `architecture:boundaries`; fix every finding | TS-005         |

## Verification plan

`npx nx run <each site-orders project>:vite:test -- --run`, lint and typecheck of the changed projects, site api-client tests, `npm run architecture:structure`, `npm run architecture:boundaries`, `npm run docs:check`, `npm run contracts:check`. No browser or E2E without the owner's separate permission.

## Implementation evidence (2026-11-24)

| Task   | Evidence                                                                                                                                                                                                           |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TS-001 | Merged in #145: `site-order-api.spec.ts` asserts the 25 s timeout, `redirect: 'manual'`, no `credentials`, the 3xx answer and the failure log.                                                                     |
| TS-002 | `npm run contracts:sync` from KedrStore `master` e77a0f5 (in #145); `contracts:drift` and `contracts:check` pass.                                                                                                  |
| TS-003 | `model`: URL state, delivery rules, formats (9 tests); `data-access`: mappers and validation (4 tests).                                                                                                            |
| TS-004 | `ui`: grid, chips, toolbar switch, detail content (7 tests); `feature`: list page URL, detail states, resend (12 tests); menu item in `admin-navigation.spec.tsx`.                                                 |
| TS-005 | [Feature card](../../../../features/admin/site-orders.md), feature catalog row, [consumer contract](../../../../contracts/sales/admin-site-orders.md), operation registry rows.                                    |
| TS-006 | [Audit](code-audit/audit.md): `architecture:structure` (0 deviations), `architecture:boundaries` (158 projects), lint and typecheck of the changed projects pass; one finding fixed, three deferred outside scope. |
