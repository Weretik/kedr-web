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

Contacts update (2026-11-02): three generated libraries use the existing domain rules and public aliases. `site-content-ui` (`libs/site/content/ui`, `scope:site`, `domain:content`, `type:ui`) owns contact blocks and copy; `site-content-seo` (`libs/site/content/seo`, same scope/domain, `type:util`) owns metadata and JSON-LD; `site-content-feature` (`libs/site/content/feature`, same scope/domain, `type:feature`) owns composition and the sitemap path. Aliases are `@site/content/{ui,seo,feature}`. No new cross-domain flow or data-access layer is introduced. See the [contacts feature](../../../features/site/contacts.md) for actual files and tests.

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

| Path                                                               | Role                                                                        | Status                |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------- | --------------------- |
| `apps/site/src/app/[locale]/layout.tsx`                            | `<html lang>`, fonts, theme, shell, Organization JSON-LD, root metadata     | exists                |
| `apps/site/src/app/[locale]/page.tsx`                              | Home route: home metadata and `HomePage`                                    | exists                |
| `apps/site/src/proxy.ts`                                           | 404 rewrite for paths without a locale                                      | exists                |
| `apps/site/src/app/[locale]/not-found.tsx`, `global-not-found.tsx` | 404 for `notFound()` calls and for unmatched URLs                           | exists                |
| `apps/site/src/app/robots.ts`, `sitemap.ts`                        | Crawling files from `core/seo` builders                                     | exists                |
| `apps/site/src/app/[locale]/catalog/page.tsx`                      | Catalog hub route                                                           | exists (step 3)       |
| `apps/site/src/app/[locale]/catalog/[slug]/page.tsx`               | Category route: static params, metadata, `CategoryPage`                     | exists (step 3)       |
| `apps/site/src/app/[locale]/search/page.tsx`                       | Search route (`noindex, follow`)                                            | exists (step 3)       |
| `apps/site/src/app/[locale]/error.tsx`                             | 500 inside the site frame when page data fails                              | exists (step 3)       |
| `apps/site/src/app/[locale]/product/[slug]/page.tsx`               | Product page route                                                          | planned (step 4)      |
| `apps/site/src/app/[locale]/contacts/page.tsx`                     | Contacts route, metadata through content/seo                                | exists (step 6 slice) |
| `apps/site/src/app/[locale]/(content)/*/page.tsx`                  | About, delivery, returns, gallery, legal, wholesale                         | planned (step 6)      |
| `apps/site/src/app/[locale]/articles/**`, `region/[city]/page.tsx` | Articles and regional landings                                              | planned (step 6)      |
| `apps/site/src/app/[locale]/(private)/{checkout,cabinet,login}`    | `noindex`, dynamic, never shared-cached                                     | planned (steps 5, 7)  |
| `apps/site/src/app/api/revalidate/route.ts`                        | Protected webhook for backend cache invalidation                            | planned (step 8)      |
| `libs/site/catalog/{model,data-access,ui}`                         | Tree, category, listing URL model, loaders, cards, toolbar, tree, mega menu | exists (steps 2, 3)   |
| `libs/site/catalog/{seo,feature}`                                  | Catalog metadata and JSON-LD; category, hub, search pages, navigation       | exists (step 3)       |
| `libs/site/home/{ui,seo,feature}`                                  | Home page blocks, metadata, composition                                     | exists (step 2)       |
| `libs/site/product/{model,data-access,seo,ui,feature}`             | Product page, gallery, Product/Offer JSON-LD                                | planned (step 4)      |
| `libs/site/cart/{model,ui,feature}`                                | Client cart island, quick order form                                        | planned (step 5)      |
| `libs/site/content/{seo,ui,feature}`                               | Contacts metadata, blocks, and server composition                           | exists (step 6 slice) |
| `libs/site/content/model`                                          | Content entities for future articles/regions                                | planned when needed   |
| `libs/site/account/{data-access,ui,feature}`                       | Sign-in and cabinet (cookie session, client side)                           | planned (step 7)      |
