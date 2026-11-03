# 001 — Site home page

- **Client:** Next.js public site (`apps/site`)
- **Architecture:** [site architecture](../../../../architecture/site/README.md), [SEO rules](../../../../standards/site/seo-rules.md), [design system](../../../../standards/site/design-system.md)
- **Domains:** home, catalog (category tree and product list data)
- **Status:** implemented; company concept added 2026-11-03, evidence in [TS-008](tasks/TS-008-company-concept.md); original [SEO verification](verification/seo-verification.md)
- **Plan step:** 2 of the [migration plan](../../migration/README.md)

The localized home page `/uk` and `/ru` replaces the shell placeholder with the approved concept: a heading with search, a wholesale panel, a catalog index from the live category tree, company overview and support, advantages, sourced results, brands, and FAQ. Products are not shown on the home (owner decision 2026-11-01). It also switches the site to Cache Components, so every later step uses `'use cache'`, `cacheTag`, and `cacheLife` instead of the previous fetch cache model.

- [Requirements and scenarios](requirements/behavior.md)
- [Frontend and Next.js design](design/frontend.md)
- [SEO design](design/seo.md)
- [Tasks](tasks/README.md)
- [Traceability](traceability.md)

## Changes

- 2026-10-30 — created; owner decisions: hosting on Cloudflare (OpenNext), use the current Next.js caching model.

- 2026-11-03 — owner-supplied concept implemented below the current catalog; Ukrainian/Russian copy, native FAQ and original Storefront results/logos.

- [Post-implementation audit](code-audit/audit.md) — scope, findings, fixes and verification for the company concept.

- 2026-11-03 — home also serves as the company page: localized navigation to #about-company and permanent redirects from the old company URLs; [TS-009](tasks/TS-009-company-home.md).
