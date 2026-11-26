# 001 — «Завантажити роздрібні ціни» from the 1C price file

- **Client:** React Admin (`apps/admin`)
- **Domain:** retail prices (new Admin domain `retail-prices`), shown on the products page «Каталог товарів»
- **Backend:** KedrStore spec `catalog/010-retail-prices-from-file` (contract source of truth, KedrStore PR #277)
- **Status:** Accepted by the owner 2026-11-26 («делай» in the project thread); implemented 2026-11-26 (branch `claude/project-thread-najphy`)
- **Source:** owner request of 2026-11-26: until 1C sends prices in their currency, the site's retail price «Розница халтмаг 30%» (type 11) is loaded from the 1C price list exported to Excel, and 1C must not overwrite the prices that came in the file

## Goal and scope

Given the owner has `Цены_26.11.xlsx`, when they press «Завантажити роздрібні ціни» on «Каталог товарів», choose the file and keep «Не оновлювати з 1С ціни, завантажені файлом» on, then the site's retail prices of the products in the file change, the panel says how many changed and which codes were not used, and the 1C sync leaves those prices alone until the owner presses «Повернути ціни під 1С».

**Out of scope:** editing one price, other price types, a history of uploads (the staff activity journal records each upload), the public site (it already shows the retail type the backend sets).

## Rules

- **R-001.** «Каталог товарів» has a header action «Завантажити роздрібні ціни» (upload icon) that opens one right panel (`AdminEditPanel`, title «Роздрібні ціни з файлу», subtitle the retail type's name). The action is shown to the roles that pass `CanManageProducts` (everyone who sees «Каталог товарів»).
- **R-002.** The panel first shows the status (`GET /api/admin/retail-prices`): «Ціни на сайті: тип «<name>»», and when prices are locked «З 1С не оновлюються N цін (останнє завантаження <date, Kyiv>)» with the outlined action «Повернути ціни під 1С»; with none locked only the type line. No «all OK» badge.
- **R-003.** The upload block: a file picker that accepts `.xlsx` (shows the chosen file name), the checkbox «Не оновлювати з 1С ціни, завантажені файлом» (on by default), a hint «Потрібні колонки «Код» і «<name>»; змінюється лише цей тип ціни», and the contained «Завантажити». «Завантажити» is disabled without a file and while a request runs; the panel cannot be closed while a request runs.
- **R-004.** After a successful upload the panel shows the result: «Змінено: N», «Без змін: N», and, when present, a warning `Alert` «Не знайдено товарів: N» with the codes (up to 50, then «і ще N») and «Без ціни: N» with its codes; the status refreshes from the answer; the chosen file is cleared so a second press needs a new choice. The admin products list refetches so its prices are current.
- **R-005.** Errors: 400 shows the server's Ukrainian message (for example «Це не файл Excel (.xlsx)…» or the missing columns); 409 shows the server detail («Ціни саме оновлюються з 1С…»); 413 shows «Файл завеликий: до 10 МБ.»; anything else «Не вдалося завантажити ціни. Спробуйте ще раз.».
- **R-006.** «Повернути ціни під 1С» asks for confirmation in a short dialog («Повернути N цін під 1С? Ціни зміняться при наступній синхронізації з 1С.»), then calls `POST /api/admin/retail-prices/unlock`, shows «Ціни повернуто під 1С» and the new status.
- **R-007.** Repeats: the upload is an upsert by product code on the server (the same file again reports «Без змін»), the unlock is a state check; both buttons are locked while pending, no request key ([idempotency rules](../../../../standards/shared/idempotency-rules.md)).
- **R-008.** The staff activity report names the area «Роздрібні ціни» (server area `RetailPrices`).

## Scenarios

| ID         | Scenario                                                                                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SC-001** | «Каталог товарів» shows «Завантажити роздрібні ціни»; it opens the panel with the status line of the retail type.                                                       |
| **SC-002** | With locked prices the status shows the count, the Kyiv date and «Повернути ціни під 1С»; without, only the type.                                                       |
| **SC-003** | «Завантажити» is disabled without a file; choosing `Цены_26.11.xlsx` enables it; the upload sends `file` and `protectFromOneC` (true by default, false when unchecked). |
| **SC-004** | A result with 2 changed, 1 unchanged, 1 not found and 1 without price shows the numbers and both warnings with the codes; the file is cleared.                          |
| **SC-005** | 400 / 409 / 413 / other errors show their messages; the panel stays open.                                                                                               |
| **SC-006** | Unlock asks first, then sends the request and shows the notice and the new status.                                                                                      |
| **SC-007** | The activity report shows «Роздрібні ціни» for the area `RetailPrices`.                                                                                                 |

## Design

New Admin domain generated with `npx nx g @nx/react:library` and trimmed to the repository conventions and tags (`scope:admin`, `domain:retail-prices`), like `site-refresh`:

```text
libs/admin/retail-prices/
├── data-access/src/
│   ├── api/admin-retail-prices.api.ts        typed openapi-fetch: getAdminRetailPriceStatus, importAdminRetailPrices
│   │                                         (formDataBody: file, protectFromOneC), unlockAdminRetailPrices; tag RetailPriceStatus
│   └── contracts/retail-prices.contract.ts   RetailPriceStatusDto, RetailPriceImportResultDto from @shared/api-contracts
└── feature/src/
    ├── components/retail-prices-button.tsx   header action + panel open state (SC-001)
    ├── components/retail-prices-panel.tsx    AdminEditPanel composition: status, upload, result
    ├── components/retail-price-status.tsx    status line and «Повернути ціни під 1С» with its confirm (SC-002, SC-006)
    ├── components/retail-price-upload.tsx    file picker, checkbox, hint, «Завантажити» (SC-003)
    ├── components/retail-price-result.tsx    numbers and warnings (SC-004)
    ├── hooks/use-retail-prices-panel.ts      controller: file, flag, mutations, result, notice, errors
    └── model/retail-price-text.ts            pure texts: status, code lists («і ще N»), error messages (SC-005)
libs/admin/products/feature/src/products.routes.tsx   existing: option `productListActions` passed to the page header
libs/admin/products/feature/src/pages/products-page.tsx existing: renders the actions in `ProductsPageToolbar`
apps/admin/src/app/router/app-router.tsx               existing: passes <RetailPricesButton />
libs/admin/work/model/src/entities/work-activity-labels.ts existing: + RetailPrices
```

The products domain does not import the new domain: the app passes the action, as it passes `renderSiteModel`. After a successful upload the button invalidates the admin products list tag through the shared `baseApi` (`invalidatesTags` on the mutation with the products list tag name). Every folder stays ≤ 6 production files, components < 150 lines, every file with its spec next to it (tests first).

**Contract.** `npm run contracts:sync -- --ref claude/project-thread-najphy` from the KedrStore PR #277 branch for this PR; after that PR merges, `npm run contracts:sync` from `master` gives the same document, and `contracts:drift` stays red until then (merge the backend first).

**Architecture answers.** Goal and user: above. Speed: the upload waits for the server (about 1 600 rows, under 10 s, KedrStore spec); system defaults otherwise. Access: `CanManageProducts`, checked by the backend. Double submit: R-007. Personal data: none. E2E: `apps/stack-e2e/src/admin/retail-prices.spec.ts`, run by CI (audit AF-002).

## Tasks

| ID         | Task                                                                                                      | Depends on |
| ---------- | --------------------------------------------------------------------------------------------------------- | ---------- |
| **EN-001** | Contract sync from the KedrStore PR branch                                                                | PR #277    |
| **TS-001** | Generate `data-access` and `feature`; specs first for the api, texts, controller and components           | EN-001     |
| **TS-002** | Implement data-access, model texts, controller, components (SC-001…SC-006)                                | TS-001     |
| **TS-003** | Wire the action into «Каталог товарів» and the app; activity label (SC-001, SC-007)                       | TS-002     |
| **TS-004** | Feature card, feature catalog, contracts docs; `architecture:structure`, `architecture:boundaries`, audit | TS-003     |

## Evidence

- Tests: `admin-retail-prices-data-access` 3, `admin-retail-prices-feature` 24, `admin-products-feature` 26, `admin-work-model`, `admin-shared-api-client` and the admin app pass; lint and typecheck of each pass; `stack-e2e` lint and typecheck pass.
- `npm run architecture:structure` (0 deviations), `npm run architecture:boundaries` (160 projects), `npm run docs:check` pass.
- Card: [retail prices from a file](../../../../features/admin/retail-prices.md); contract: [admin retail prices](../../../../contracts/catalog/admin-retail-prices.md); final audit: [code-audit/audit.md](code-audit/audit.md).
