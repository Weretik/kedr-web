# Frontend engineering rules

This directory contains stable rules for frontend changes. Feature specifications link to these documents instead of duplicating them.

## By application

- **Admin React:** [code organization](admin/admin-code-organization.md), [UI](admin/admin-ui.md), [design system «Кедровий ліс»](admin/design-system.md), [consistent list and detail pages](admin/list-detail-pages.md), [feedback and error messages](admin/feedback-and-errors.md), [architecture and existing modules](../architecture/admin/README.md).
- **Mobile React Native:** [code organization](mobile/mobile-code-organization.md), [UI](mobile/mobile-ui.md), [design system «Пагін»](mobile/design-system.md), [architecture and existing modules](../architecture/mobile/README.md).
- **Site Next.js (public):** [SEO rules](site/seo-rules.md), [design system](site/design-system.md), [architecture and modules](../architecture/site/README.md).
- **Storefront Angular:** [architecture boundaries](../architecture/storefront/README.md), [modules](../architecture/storefront/structure/modules.md), [state and API](../architecture/storefront/runtime/state-and-api.md). React Admin and Mobile rules do not automatically apply to Angular.

## Shared topics

- [API and data rules](shared/api-data-rules.md) — DTOs, mappers, errors, and contracts; account for each client's transport and state stack.
- [Testing rules](shared/testing-rules.md) — selecting checks and recording them against available targets.
- [Security rules](shared/security-rules.md) — access, sessions, data safety, and security review for the application context.
- [Delivery rules](shared/delivery-rules.md) — SDD flow, scope, and definition of done.

Actual versions, projects, and runnable targets are not duplicated in these rules; their current snapshot is in the [frontend inventory](../architecture/frontend-inventory.md). Systemic discrepancies are handled through a remediation SDD rather than left as optional residual risk.
