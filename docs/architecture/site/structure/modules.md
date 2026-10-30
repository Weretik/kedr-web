# Site modules and dependencies

**Checked:** 2026-10-30 with `npx nx show projects` and `npm run architecture:boundaries`.

All projects were created with Nx generators (`@nx/next:application`, `@nx/react:library`) and then trimmed to the workspace conventions: lint through `@nx/eslint:lint`, tests and typecheck inferred from `vite.config.mts`.

## Projects

| Project                    | Path                            | Tags                                                  | Role                                                                                  |
| -------------------------- | ------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `site`                     | `apps/site`                     | `scope:site`, `type:app`                              | Next.js routes, metadata exports, `robots.ts`, `sitemap.ts`, global CSS tokens, fonts |
| `site-core-config`         | `libs/site/core/config`         | `scope:site`, `scope:site-shared`, `type:util`        | `siteConfig` from environment, `COMPANY` facts; the only reader of `process.env`      |
| `site-core-i18n`           | `libs/site/core/i18n`           | `scope:site`, `scope:site-shared`, `type:util`        | Locales, language tags, localized path builders                                       |
| `site-core-seo`            | `libs/site/core/seo`            | `scope:site`, `scope:site-shared`, `type:core`        | Metadata, robots, sitemap, and JSON-LD builders                                       |
| `site-core-shell`          | `libs/site/core/shell`          | `scope:site`, `scope:site-shared`, `type:shell`       | Header, footer, theme, language switch, shell dictionary                              |
| `site-shared-ui`           | `libs/site/shared/ui`           | `scope:site`, `scope:site-shared`, `type:ui`          | shadcn/ui primitives (`Button`, `Sheet`, `cn`)                                        |
| `site-shared-api-client`   | `libs/site/shared/api-client`   | `scope:site`, `scope:site-shared`, `type:data-access` | Server-only typed `fetch` over the public catalog API                                 |
| `site-catalog-model`       | `libs/site/catalog/model`       | `scope:site`, `domain:catalog`, `type:model`          | Catalog section and product summary types, locale-free catalog URLs                   |
| `site-catalog-data-access` | `libs/site/catalog/data-access` | `scope:site`, `domain:catalog`, `type:data-access`    | Cached category tree and product reads (`'use cache'`), DTO mappers, cache tags       |
| `site-catalog-ui`          | `libs/site/catalog/ui`          | `scope:site`, `domain:catalog`, `type:ui`             | Catalog index, product card and grid, price formatting                                |
| `site-home-ui`             | `libs/site/home/ui`             | `scope:site`, `domain:home`, `type:ui`                | Home hero with search, wholesale panel, facts, section frame, home copy               |
| `site-home-seo`            | `libs/site/home/seo`            | `scope:site`, `domain:home`, `type:util`              | Home metadata                                                                         |
| `site-home-feature`        | `libs/site/home/feature`        | `scope:site`, `domain:home`, `type:feature`           | Home page composition and WebSite JSON-LD                                             |

Import aliases are `@site/<path>` from `tsconfig.base.json`, for example `@site/core/seo`. Import only through a library's `src/index.ts`.

## Dependency rules

```text
site (app) -> core/shell, core/seo, core/i18n, shared/ui, <domain>/feature, <domain>/seo
core/shell -> core/config, core/i18n, shared/ui
core/seo   -> core/config, core/i18n                 (type:core may use only type:util and scope:shared)
shared/api-client -> core/config, @shared/api-contracts
<domain>/feature     -> <domain>/{ui,seo,data-access,model}, core/*, shared/ui
<domain>/data-access -> shared/api-client, <domain>/model
<domain>/ui          -> <domain>/model, core/{config,i18n}, shared/ui   (never data-access)
<domain>/seo         -> core/seo, core/i18n                              (tagged type:util)
home/feature -> catalog/{data-access,model,ui}   documented cross-domain flow
```

Domain libraries carry a `domain:<name>` tag. Only a feature may cross domains, and only through a flow listed in `tools/architecture/project-boundary-rules.mjs`.

Enforced by `@nx/enforce-module-boundaries` in `eslint.config.cjs` (`scope:site` may use only `scope:site` and `scope:shared`; `scope:site-shared` is allowed for app, feature, and shell layers like `scope:admin-shared` in Admin) and by `npm run architecture:boundaries` (no feature-to-feature imports, `core` never imports a domain). The site never imports `libs/storefront/*` or `libs/admin/*`.

## Planned file-role map

Paths marked **exists** are in the code; the rest are planned by the [migration plan](../../../specs/site/migration/README.md) and are created with `npx nx g @nx/react:library libs/site/<domain>/<layer>`.

| Path                                                                  | Role                                                                    | Status               |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------- |
| `apps/site/src/app/[locale]/layout.tsx`                               | `<html lang>`, fonts, theme, shell, Organization JSON-LD, root metadata | exists               |
| `apps/site/src/app/[locale]/page.tsx`                                 | Home route: home metadata and `HomePage`                                | exists               |
| `apps/site/src/proxy.ts`                                              | 404 rewrite for paths without a locale                                  | exists               |
| `apps/site/src/app/[locale]/not-found.tsx`, `global-not-found.tsx`    | 404 for `notFound()` calls and for unmatched URLs                       | exists               |
| `apps/site/src/app/robots.ts`, `sitemap.ts`                           | Crawling files from `core/seo` builders                                 | exists               |
| `apps/site/src/app/[locale]/catalog/[categorySlug]/products/page.tsx` | Category listing route                                                  | planned (step 3)     |
| `apps/site/src/app/[locale]/catalog/products/page.tsx`                | All products and search results (`noindex, follow` with a query)        | planned (step 3)     |
| `apps/site/src/app/[locale]/catalog/product/[productSlug]/page.tsx`   | Product page route                                                      | planned (step 4)     |
| `apps/site/src/app/[locale]/(content)/*/page.tsx`                     | About, delivery, returns, gallery, legal, contacts, wholesale           | planned (step 6)     |
| `apps/site/src/app/[locale]/articles/**`, `region/[city]/page.tsx`    | Articles and regional landings                                          | planned (step 6)     |
| `apps/site/src/app/[locale]/(private)/{checkout,cabinet,login}`       | `noindex`, dynamic, never shared-cached                                 | planned (steps 5, 7) |
| `apps/site/src/app/api/revalidate/route.ts`                           | Protected webhook for backend cache invalidation                        | planned (step 8)     |
| `libs/site/catalog/{model,data-access,ui}`                            | Category tree, product summaries, catalog index, product cards          | exists (step 2)      |
| `libs/site/catalog/{seo,feature}`, listings in model and data-access  | Listings, URL filter model, ItemList/Breadcrumb JSON-LD                 | planned (step 3)     |
| `libs/site/home/{ui,seo,feature}`                                     | Home page blocks, metadata, composition                                 | exists (step 2)      |
| `libs/site/product/{model,data-access,seo,ui,feature}`                | Product page, gallery, Product/Offer JSON-LD                            | planned (step 4)     |
| `libs/site/cart/{model,ui,feature}`                                   | Client cart island, quick order form                                    | planned (step 5)     |
| `libs/site/content/{model,seo,ui,feature}`                            | Static content pages, articles, regions                                 | planned (step 6)     |
| `libs/site/account/{data-access,ui,feature}`                          | Sign-in and cabinet (cookie session, client side)                       | planned (step 7)     |
