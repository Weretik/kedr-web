# 001 — Admin Customer Browsing

- **Client:** Admin React (`apps/admin`)
- **Domain:** clients
- **Status:** frontend increment implemented; server sorting connected in Admin on 2026-10-20
- **Created:** 2026-10-19
- **Architecture:** [Admin](../../../../architecture/admin/README.md)

The customer page is in the side navigation and uses MUI Data Grid with one search field in the table toolbar, server sorting by name, phone, or ID, server pagination, and an informational customer card. Server search covers ID, name, and phone; this screen has no column filters. The backend Sales contract supports broader filters for other consumers. The versioned OpenAPI snapshot already included `sort`; its provenance is recorded in [SOURCE.md](../../../../contracts/openapi/SOURCE.md).

- [Scope](requirements/overview.md) · [Rules and scenarios](requirements/behavior.md)
- [Frontend design](design/frontend.md) · [React and visual interaction](design/react.md)
- [API](contracts/api-contract.md) · [Tasks](tasks/README.md)
- [Traceability](traceability.md) · [SDD readiness](checklist/spec-readiness.md) · [Delivery readiness](checklist/delivery-readiness.md)
- [Local audit of customer feature responsibilities](code-audit/audit.md)
