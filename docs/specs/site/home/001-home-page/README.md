# 001 — Site home page

- **Client:** Next.js public site (`apps/site`)
- **Architecture:** [site architecture](../../../../architecture/site/README.md), [SEO rules](../../../../standards/site/seo-rules.md), [design system](../../../../standards/site/design-system.md)
- **Domains:** home, catalog (category tree and product list data)
- **Status:** implemented 2026-10-30; evidence in [SEO verification](verification/seo-verification.md)
- **Plan step:** 2 of the [migration plan](../../migration/README.md)

The localized home page `/uk` and `/ru` replaces the shell placeholder with the approved concept: a heading with search, a wholesale panel, a catalog index from the live category tree, products in stock, and company facts. It also switches the site to Cache Components, so every later step uses `'use cache'`, `cacheTag`, and `cacheLife` instead of the previous fetch cache model.

- [Requirements and scenarios](requirements/behavior.md)
- [Frontend and Next.js design](design/frontend.md)
- [SEO design](design/seo.md)
- [Tasks](tasks/README.md)
- [Traceability](traceability.md)

## Changes

- 2026-10-30 — created; owner decisions: hosting on Cloudflare (OpenNext), use the current Next.js caching model.
