# Site architecture (Next.js storefront)

**Code:** `apps/site` and `libs/site/*`
**Status:** shell and migrated home, catalog, product, content and cart domains are implemented locally; see the [feature catalog](../../features/README.md). Domain cutover and deployment are not verified by this local update.
**Shell baseline:** checked 2026-10-29 against `apps/site/src/app`, `apps/site/next.config.ts`, `libs/site/*/project.json`, and `next build` output.
**Cart update:** 2026-11-04, source and focused automated verification; see the [cart feature](../../features/site/cart.md). Build, HTTP, browser and live-order verification were not run for this change.

## Purpose and boundary

`site` is the new public, search-indexed ClassKedr storefront: door hardware sold wholesale with retail orders. It replaces `apps/storefront` feature by feature under the [migration plan](../../specs/site/migration/README.md) and takes over the domain at the cutover step. It uses the same KedrStore OpenAPI contract as Admin and Mobile for public catalog reads and the dedicated anonymous quick-order mutation, through server-only transport. Admin stays a private React SPA; nothing from Admin (RTK Query, session guards, MUI) is reused here. The decision is recorded in [ADR-0001](adr/0001-nextjs-public-site.md).

## Overview

```text
apps/site/src/app (thin routes, metadata exports)
  -> libs/site/core/shell (header, footer, theme, language)  -> libs/site/shared/ui
  -> libs/site/core/seo (metadata, robots, sitemap, JSON-LD) -> core/config, core/i18n
  -> libs/site/{home,catalog,product,content,cart}/feature and domain seo
       data-access -> libs/site/shared/api-client (server-only fetch) -> @shared/api-contracts
```

Arrows point from consumer to dependency. Routes compose implemented domain features. Catalog reads remain cacheable; the fixed anonymous order POST is a separate `no-store` path. CartRuntime wraps the shell with one browser/document owner and injects the main/compact header actions through generic slots; core does not import cart.

## Where to read more

- [Modules and dependencies](structure/modules.md) — actual projects, tags, allowed imports, and remaining planned paths.
- [Application and routing](runtime/application.md) — composition point, routes, 404 handling, and client islands.
- [Rendering and caching](platform/rendering-and-caching.md) — rendering per route type, data access, invalidation, budgets.
- [SEO architecture](platform/seo-architecture.md) — URL and index policy, metadata ownership, structured data, locales, sitemaps.
- [ADR](adr/0001-nextjs-public-site.md) — why Next.js App Router replaces the Angular storefront.
- Standards: [SEO rules](../../standards/site/seo-rules.md) and [design system](../../standards/site/design-system.md).
- Feature cards: [Site shell](../../features/site/shell.md), [cart and checkout](../../features/site/cart.md).

## Current and target state

| Area     | Now                                                                                      | Target                                          | Source                                                     |
| -------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| Pages    | Migrated home/catalog/product/content pages and private checkout are implemented locally | Continue the remaining storefront migration     | [Feature catalog](../../features/README.md)                |
| Indexing | Existing production gates remain; checkout is private/noindex                            | Production indexing only after the cutover gate | [SEO architecture](platform/seo-architecture.md)           |
| Data     | Cached catalog/product reads and a dedicated anonymous no-store order POST               | Extend only through accepted domain contracts   | [Rendering and caching](platform/rendering-and-caching.md) |
| Hosting  | Deployment/cutover not verified by this update                                           | Follow the hosting and cutover decision         | [Migration plan](../../specs/site/migration/README.md)     |
