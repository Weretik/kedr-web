# 001 — Delivery and payment

- **Client:** Next.js public site (`apps/site`), variant `nextjs`.
- **Domain:** `content`.
- **Created / updated:** 2026-11-03.
- **Status:** implemented and verified 2026-11-03; requested architecture audit completed, AF-001 repaired and verified.
- **Owner:** frontend coordinator; UI and SEO delegated as independent packages.
- **Authorization:** the owner accepted the raster concept and requested SDD plus implementation in this chat. No further concept approval is required.
- **Blockers:** none within scope. Pickup is excluded until the owner supplies its conditions.

Visitors can read the actual delivery, payment, order and related terms in Ukrainian or Russian at `/{locale}/delivery-and-payment`, inside the existing SiteShell. The accepted [raster concept](design/concept.png) defines the visual structure. Text comes from the Angular delivery dictionary; raster spelling and decorative labels never override source facts.

## Scope

Deliver the static page, localized metadata, sitemap inclusion, component and metadata tests, feature documentation and a scoped audit. Preserve existing home/company navigation, search, catalog, header, themes, locale controls and uncommitted work. No checkout, payment processing, new API, pickup promises, new redirects, other content pages or deployment.

## Navigation

- [Product rules and scenarios](requirements/behavior.md)
- [Frontend design and file-role map](design/frontend.md)
- [Next.js design](design/nextjs.md)
- [SEO design](design/seo.md)
- [Task graph](tasks/README.md)
- [Traceability](traceability.md)
- [Specification readiness](checklist/spec-readiness.md)
- [Delivery readiness](checklist/delivery-readiness.md)

## Sources

- [Site architecture](../../../../architecture/site/README.md), [module boundaries](../../../../architecture/site/structure/modules.md).
- [Design system](../../../../standards/site/design-system.md), [SEO rules](../../../../standards/site/seo-rules.md), [delivery rules](../../../../standards/shared/delivery-rules.md), [testing rules](../../../../standards/shared/testing-rules.md).
- [Angular feature card](../../../../features/storefront/content/about-us.md), [delivery translations](../../../../../apps/storefront/src/app/localization/translations/delivery-payment.translation.ts), [delivery template](../../../../../libs/storefront/feature/about-us/src/lib/pages/delivery-and-payment/delivery-and-payment.html).

Original accepted raster: `C:\Users\Віталій\.codex\generated_images\01a19e81-203f-76a3-87cb-f6cd0caa04e5\exec-45796e02-92df-41d5-ac1e-63fd0823e97e.png`; copied unchanged to `design/concept.png`.

- [Architecture and responsibility audit](code-audit/audit.md) — AF-001 and post-implementation verification.
