# TS-004 — reusable customer selection data and sheet

- **Task ID:** TS-004
- **Covers:** SC-003, SC-004, SC-011
- **Depends on:** EN-001, EN-003
- **Exact paths:** `libs/mobile/customers/model/src/lib/customer.ts`;
  `libs/mobile/customers/model/src/lib/customer-search.ts`;
  `libs/mobile/customers/data-access/src/api/customers.api.ts`;
  `libs/mobile/customers/data-access/src/lib/customer-pages.ts`;
  `libs/mobile/customers/ui/src/lib/customer-selector-sheet.tsx`;
  `libs/mobile/customers/ui/src/lib/customer-selector-list.tsx`;
  `libs/mobile/customers/ui/src/lib/customer-selector-state.tsx`;
  adjacent `*.spec.ts(x)` files; `libs/mobile/cart/{model,data-access,ui,feature}/src/`
- **Test level:** focused integration/component

## Work

- [x] Move active customer model, complete page loading/deduplication, local
      case-insensitive search and selector sheet into customers domain libraries.
- [x] Add optional «Усі клієнти» selection for history while keeping checkout's
      required-one-customer behavior configurable through props/domain callbacks.
- [x] Preserve loading, empty/no-match, safe error and retry states plus
      Ukrainian accessible names and keyboard/focus behavior.
- [x] Migrate cart imports through root customer public APIs and prove its
      existing checkout behavior remains unchanged.
- [x] Avoid PII persistence and avoid duplicate `/api/admin/customers` endpoint
      ownership/cache entries.
- [x] Review changed implementation files for cohesive responsibility; keep
      generic sheet presentation separate from data/search orchestration.

## Evidence

- Test/path and observable assertion: customer model/data-access specs prove all
  pages/search/deduplication; UI specs prove all-option, required selection,
  states and callbacks; cart regression specs stay green.
- Red command and expected behavioral failure: new customer targets fail because
  ownership/public APIs do not exist; cart behavior is green before migration.
- Green command and result: customer model 3/3, data-access 3/3 and UI 3/3
  focused tests pass.
- Refactor note and focused rerun: sheet orchestration, selectable list and
  loading/error/empty presentation are separate components in the customers
  domain; cart consumes the public APIs and focused customer/cart suites pass.
- Regression command and result: customer targets, all cart targets and
  `npm run test:mobile`; all 20 Mobile project targets pass.
- Manual/visual evidence, if required: keyboard/focus in `TS-010`.
- Deviation or blocker: none; the generated `getAdminCustomers` contract remains
  the data-access boundary.

## Checkpoint

Cart and orders use one tested customer query/model/sheet boundary, with an
orders-only all-clients option and no cart dependency from orders.
