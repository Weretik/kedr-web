# 002 — Customer Orders and Drafts in Admin Details

- **Client:** React Admin (`apps/admin`)
- **Domain:** clients / orders
- **Status:** implemented in React Admin; targeted checks are listed in [traceability](traceability.md)
- **Verified baseline:** 2026-10-21

Customer details gain two tabs with separate server-backed tables for the customer's orders and drafts. The existing customer information cards remain; the [previous completed SDD](../001-read-only-customers/README.md) is not rewritten.

- [Requirements and scenarios](requirements/behavior.md)
- [Frontend design](design/frontend.md)
- [API](contracts/api-contract.md)
- [Tasks](tasks/README.md)
- [Traceability](traceability.md)
- [2026-10-22 change: customer orders table](revision-2026-10-22.md) — new SDD; code has not been changed yet

Shared screens and table composition are defined by the [orders SDD](../../orders/001-order-workspace/README.md).

- [SDD readiness](checklist/spec-readiness.md)
