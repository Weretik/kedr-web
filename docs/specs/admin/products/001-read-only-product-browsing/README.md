# 001 — Admin Product Browsing and “Without photo” mode

- **Client:** Admin React (`apps/admin`)
- **Domain:** products
- **Status:** frontend and backend increments implemented; OpenAPI snapshot/generated types synchronized
- **Created:** 2026-10-19
- **Architecture:** [Admin](../../../../architecture/admin/README.md)

This specification extends the implemented `/catalog` list with navigation to an informational product card and a separate mode for products without photos. The current [table SDD](../product-list-data-grid.md) preserves the implementation history for the list and is not being rewritten.

- [Scope](requirements/overview.md) · [Rules and scenarios](requirements/behavior.md)
- [Frontend design](design/frontend.md) · [React and visual interaction](design/react.md)
- [API](contracts/api-contract.md) · [Tasks](tasks/README.md)
- [Traceability](traceability.md) · [SDD readiness](checklist/spec-readiness.md) · [Delivery readiness](checklist/delivery-readiness.md)
- [Local responsibility audit](code-audit/audit.md) · [Consistent Admin style](../../../../standards/admin/list-detail-pages.md)

## Status

The list, detail route, “Без фото” mode, and menu changes are implemented. The 2026-10-19 increment added server search, filtering, and pagination in both Data Grid modes, tri-state feature filters, “На сайті”, and a new card composition. The extended backend OpenAPI describes the new fields and a separate Admin detail operation; the frontend snapshot and generated types were synchronized with commit `8fc8729`.

## Tab correction, 2026-10-19

The list page has a third tab, “На сайті”, after “Без фото”. It uses the ordinary Admin list with the server condition `exportToSite=true`, its own search, sorting, and pagination, and restores after viewing details. The “На сайті” column remains informational, without a separate filter; “Усі товари” does not constrain `exportToSite`. No extra count label is shown below the table: count and navigation are available in Data Grid. This addition replaces the previous column-filter rule for “На сайті” in this document and related scenarios.
