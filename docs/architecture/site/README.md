# Site architecture (Next.js storefront)

**Code:** `apps/site` and `libs/site/*`
**Status:** shell only (layout, header, footer, themes, languages, SEO baseline, API client). No storefront features yet; the Angular [Storefront](../storefront/README.md) still serves `classkedr.com.ua`.
**Checked:** 2026-10-29 against `apps/site/src/app`, `apps/site/next.config.ts`, `libs/site/*/project.json`, and `next build` output.

## Purpose and boundary

`site` is the new public, search-indexed ClassKedr storefront: door hardware sold wholesale with retail orders. It replaces `apps/storefront` feature by feature under the [migration plan](../../specs/site/migration/README.md) and takes over the domain at the cutover step. It reads the same KedrStore OpenAPI contract as Admin and Mobile, but only public catalog operations and only on the server. Admin stays a private React SPA; nothing from Admin (RTK Query, session guards, MUI) is reused here. The decision is recorded in [ADR-0001](adr/0001-nextjs-public-site.md).

## Overview

```text
apps/site/src/app (thin routes, metadata exports)
  -> libs/site/core/shell (header, footer, theme, language)  -> libs/site/shared/ui
  -> libs/site/core/seo (metadata, robots, sitemap, JSON-LD) -> core/config, core/i18n
  -> [planned] libs/site/<domain>/{feature,seo,ui,data-access,model}
       data-access -> libs/site/shared/api-client (server-only fetch) -> @shared/api-contracts
```

Arrows point from consumer to dependency. Domains are planned; today the route files call only `core`.

## Where to read more

- [Modules and dependencies](structure/modules.md) — projects, tags, allowed imports, and the planned file-role map.
- [Application and routing](runtime/application.md) — composition point, routes, 404 handling, and client islands.
- [Rendering and caching](platform/rendering-and-caching.md) — rendering per route type, data access, invalidation, budgets.
- [SEO architecture](platform/seo-architecture.md) — URL and index policy, metadata ownership, structured data, locales, sitemaps.
- [ADR](adr/0001-nextjs-public-site.md) — why Next.js App Router replaces the Angular storefront.
- Standards: [SEO rules](../../standards/site/seo-rules.md) and [design system](../../standards/site/design-system.md).
- Feature card: [Site shell](../../features/site/shell.md).

## Current and target state

| Area     | Now                                                                               | Target                                                     | Source                                                     |
| -------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| Pages    | `/uk`, `/ru` placeholder home, 404, `robots.txt`, `sitemap.xml`                   | All storefront pages with the same URLs                    | [Migration plan](../../specs/site/migration/README.md)     |
| Indexing | Off everywhere (`SITE_INDEXING` unset): `noindex, nofollow`, robots `Disallow: /` | On only in production after cutover                        | [SEO architecture](platform/seo-architecture.md)           |
| Data     | API client ready, no domain calls                                                 | Catalog and product data from `/api/catalog/{lang}/*`      | [Rendering and caching](platform/rendering-and-caching.md) |
| Hosting  | Not deployed                                                                      | `[NEEDS CLARIFICATION: Vercel or Cloudflare via OpenNext]` | Migration plan, step 0                                     |
