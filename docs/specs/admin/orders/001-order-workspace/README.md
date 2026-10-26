# 001 — Admin Orders and Drafts

- **Client:** React Admin (`apps/admin`)
- **Domain:** orders
- **Status:** implemented in React Admin; focused automated checks are listed in [traceability](traceability.md)
- **Baseline checked:** 2026-10-21

“Замовлення” appears in the side navigation, with two tabs for submitted orders and saved drafts, detail views, draft editing, and a checkout page with a temporary set of products. Products can be added from the product list and detail view. All new screens belong to Admin React only.

- [Rules and scenarios](requirements/behavior.md)
- [Frontend design](design/frontend.md)
- [API and state](contracts/api-contract.md)
- [Tasks](tasks/README.md)
- [Traceability and readiness](traceability.md)
- [Code responsibility audit](code-audit/audit.md)
- [Structural remediation](../002-order-structure-remediation/README.md)
- [Change 2026-10-22: cart, date, customer selection, and checkout dialogs](revision-2026-10-22.md) — frontend TS-007/TS-008 implemented; provider snapshot synchronized with `c03118d`
- [Change 2026-10-22: draft from order, product selection, and clearer details](revision-2026-10-22-order-detail-and-draft-picker.md) — SDD before implementation
- [Change 2026-10-26: shared product picker, saved checkout customer, and button fixes](revision-2026-10-26-catalog-picker-and-ui-fixes.md) — simplified correction, implemented

The current list/detail design follows the [Admin standard](../../../../standards/admin/list-detail-pages.md). Customer detail extensions are covered by a [separate SDD](../../clients/002-customer-orders/README.md).

- [SDD readiness](checklist/spec-readiness.md)
