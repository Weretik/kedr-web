# Site modules and dependencies

**Baseline checked:** 2026-10-30 with `npx nx show projects` and `npm run architecture:boundaries`.
**Cart source update:** 2026-11-04; new Nx projects and composition verified against current sources. This update makes no deployment, build, HTTP or live-order claim.

All projects were created with Nx generators (`@nx/next:application`, `@nx/react:library`) and then trimmed to the workspace conventions: lint through `@nx/eslint:lint`, tests and typecheck inferred from `vite.config.mts`.

## Projects

| Project                    | Path                            | Tags                                                  | Role                                                                                                                                                                           |
| -------------------------- | ------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `site`                     | `apps/site`                     | `scope:site`, `type:app`                              | Next.js routes, metadata exports, `robots.ts`, `sitemap.ts`, global CSS tokens, fonts                                                                                          |
| `site-core-config`         | `libs/site/core/config`         | `scope:site`, `scope:site-shared`, `type:util`        | `siteConfig` and `createRevalidationConfig` from environment, `COMPANY` name, `CompanyContacts` type, fallback contacts and phone formatting; the only reader of `process.env` |
| `site-core-revalidation`   | `libs/site/core/revalidation`   | `scope:site`, `scope:site-shared`, `type:util`        | Checks the revalidation request (secret, allowed tags) and expires the tags; framework call injected by the route                                                              |
| `site-core-i18n`           | `libs/site/core/i18n`           | `scope:site`, `scope:site-shared`, `type:util`        | Locales, language tags, localized path builders                                                                                                                                |
| `site-core-seo`            | `libs/site/core/seo`            | `scope:site`, `scope:site-shared`, `type:core`        | Metadata, robots, sitemap, and JSON-LD builders                                                                                                                                |
| `site-core-shell`          | `libs/site/core/shell`          | `scope:site`, `scope:site-shared`, `type:shell`       | Header, footer, theme, language switch, shell dictionary                                                                                                                       |
| `site-shared-ui`           | `libs/site/shared/ui`           | `scope:site`, `scope:site-shared`, `type:ui`          | shadcn/ui primitives (`Button`, `Sheet`, `cn`)                                                                                                                                 |
| `site-shared-api-client`   | `libs/site/shared/api-client`   | `scope:site`, `scope:site-shared`, `type:data-access` | Server-only typed catalog GET and separate fixed anonymous no-store order POST                                                                                                 |
| `site-shared-company`      | `libs/site/shared/company`      | `scope:site`, `scope:site-shared`, `type:data-access` | Cached admin-edited company contacts and requisites (`getCompanyContacts`, `getCompanyRequisites`) with code fallbacks                                                         |
| `site-catalog-model`       | `libs/site/catalog/model`       | `scope:site`, `domain:catalog`, `type:model`          | Catalog section and product summary types, locale-free catalog URLs                                                                                                            |
| `site-catalog-data-access` | `libs/site/catalog/data-access` | `scope:site`, `domain:catalog`, `type:data-access`    | Cached category tree and product reads (`'use cache'`), DTO mappers, cache tags                                                                                                |
| `site-catalog-ui`          | `libs/site/catalog/ui`          | `scope:site`, `domain:catalog`, `type:ui`             | Catalog index, product card and grid, price formatting                                                                                                                         |
| `site-product-model`       | `libs/site/product/model`       | `scope:site`, `domain:product`, `type:model`          | Product facts/results/paths/purchase policy                                                                                                                                    |
| `site-product-data-access` | `libs/site/product/data-access` | `scope:site`, `domain:product`, `type:data-access`    | Typed detail/index reads, mapping, bounded paging and cache                                                                                                                    |
| `site-product-ui`          | `libs/site/product/ui`          | `scope:site`, `domain:product`, `type:ui`             | Server detail view, gallery/clipboard leaves and injected purchaseAction slot                                                                                                  |
| `site-product-seo`         | `libs/site/product/seo`         | `scope:site`, `domain:product`, `type:util`           | Metadata and conditional Product/Offer/BreadcrumbList from local input                                                                                                         |
| `site-product-feature`     | `libs/site/product/feature`     | `scope:site`, `domain:product`, `type:feature`        | Page/status/locale/seeds, SEO/sitemap orchestration and server purchase descriptor/callback handoff                                                                            |
| `site-cart-model`          | `libs/site/cart/model`          | `scope:site`, `domain:cart`, `type:model`             | Pure cart/quantity/totals, checkout validation and legacy codec                                                                                                                |
| `site-cart-data-access`    | `libs/site/cart/data-access`    | `scope:site`, `domain:cart`, `type:data-access`       | Server-only private order DTO mapping, response parsing and normalized outcomes                                                                                                |
| `site-cart-ui`             | `libs/site/cart/ui`             | `scope:site`, `domain:cart`, `type:ui`                | Props/callback drawer, header actions, checkout and purchase controls; UK/RU and themes                                                                                        |
| `site-cart-seo`            | `libs/site/cart/seo`            | `scope:site`, `domain:cart`, `type:util`              | Nonpersonal private checkout metadata through core/seo                                                                                                                         |
| `site-cart-feature`        | `libs/site/cart/feature`        | `scope:site`, `domain:cart`, `type:feature`           | Runtime/provider, document store, storage adapter, controllers, server purchase adapter and order action                                                                       |
| `site-home-ui`             | `libs/site/home/ui`             | `scope:site`, `domain:home`, `type:ui`                | Home hero/search, wholesale, company blocks, results, brands, FAQ, section frame and localized copy                                                                            |
| `site-home-seo`            | `libs/site/home/seo`            | `scope:site`, `domain:home`, `type:util`              | Home metadata                                                                                                                                                                  |
| `site-home-feature`        | `libs/site/home/feature`        | `scope:site`, `domain:home`, `type:feature`           | Home page composition and WebSite JSON-LD                                                                                                                                      |
| `site-content-model`       | `libs/site/content/model`       | `scope:site`, `domain:content`, `type:model`          | Typed returns/contacts copy, article query/model and complete existing policy; wholesale copy/details                                                                          |
| `site-content-data-access` | `libs/site/content/data-access` | `scope:site`, `domain:content`, `type:data-access`    | Server-only immutable six-article source and localized slug lookup; approved temporary stage                                                                                   |
| `site-content-ui`          | `libs/site/content/ui`          | `scope:site`, `domain:content`, `type:ui`             | Information pages, article list/reading UI, clipboard and page-size client leaves; wholesale server sections                                                                   |
| `site-content-seo`         | `libs/site/content/seo`         | `scope:site`, `domain:content`, `type:util`           | Localized content metadata and article/breadcrumb JSON-LD through core/seo                                                                                                     |
| `site-content-feature`     | `libs/site/content/feature`     | `scope:site`, `domain:content`, `type:feature`        | Server content-page/article composition and public sitemap descriptors; wholesale catalog composition                                                                          |

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
content/feature -> catalog/{data-access,model,ui}   wholesale server composition only
product/feature -> catalog/model   hidden-root and category-path policy only
cart/feature -> product/model   public product path validation/building for cart view props only
```

Cart client leaves use relative imports of their provider/store and never import data-access or transport. CartRuntime passes a Server Function as submitOrderAction to the client provider. App routes inject generic header ReactNode slots and the server product purchase callback: product owns its normalized serialized descriptor; core and product do not import cart. This app injection adds no feature-to-feature dependency. The later cart audit adds one explicit cart/feature -> product/model flow for dynamic productHref mapping; UI only receives the destination.

Domain libraries carry a `domain:<name>` tag. Only a feature may cross domains, and only through a flow listed in `tools/architecture/project-boundary-rules.mjs`.

Enforced by `@nx/enforce-module-boundaries` in `eslint.config.cjs` (`scope:site` may use only `scope:site` and `scope:shared`; `scope:site-shared` is allowed for app, feature, and shell layers like `scope:admin-shared` in Admin) and by `npm run architecture:boundaries` (no feature-to-feature imports, `core` never imports a domain). The site never imports `libs/storefront/*` or `libs/admin/*`. Site core/shell is also explicitly fenced through scope:site-shared/type:shell in ESLint and the boundary validator; domain components enter only through app-owned slots.

## Planned file-role map

Paths marked **exists** are in the code; the rest are planned by the [migration plan](../../../specs/site/migration/README.md) and are created with `npx nx g @nx/react:library libs/site/<domain>/<layer>`.

| Path                                                               | Role                                                                                                           | Status                                                                         |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `apps/site/src/app/[locale]/layout.tsx`                            | html lang, fonts, ThemeProvider, CartRuntime, generic main/compact shell slots, Organization and root metadata | exists                                                                         |
| `apps/site/src/app/[locale]/page.tsx`                              | Home route: home metadata and `HomePage`                                                                       | exists                                                                         |
| `apps/site/src/proxy.ts`                                           | 404 rewrite for paths without a locale                                                                         | exists                                                                         |
| `apps/site/src/app/[locale]/not-found.tsx`, `global-not-found.tsx` | 404 for `notFound()` calls and for unmatched URLs                                                              | exists                                                                         |
| `apps/site/src/app/robots.ts`, `sitemap.ts`                        | Crawling files from `core/seo` builders                                                                        | exists                                                                         |
| `apps/site/src/app/[locale]/catalog/page.tsx`                      | Catalog hub route                                                                                              | exists (step 3)                                                                |
| `apps/site/src/app/[locale]/catalog/[slug]/page.tsx`               | Category route: static params, metadata, `CategoryPage`                                                        | exists (step 3)                                                                |
| `apps/site/src/app/[locale]/search/page.tsx`                       | Search route (`noindex, follow`)                                                                               | exists (step 3)                                                                |
| `apps/site/src/app/[locale]/error.tsx`                             | 500 inside the site frame when page data fails                                                                 | exists (step 3)                                                                |
| `apps/site/src/app/[locale]/product/[slug]/page.tsx`               | Product route; inject the server cart purchase renderer                                                        | exists (stage4A; cart bridge connected locally)                                |
| `apps/site/src/app/[locale]/delivery-and-payment/page.tsx`         | Static sourced delivery/payment page                                                                           | exists (content)                                                               |
| `apps/site/src/app/[locale]/(content)/returns-exchanges/page.tsx`  | Returns/exchanges metadata and server page                                                                     | exists (content)                                                               |
| `apps/site/src/app/[locale]/(content)/contacts/page.tsx`           | Contacts metadata and server page; existing locale shell                                                       | exists (content)                                                               |
| `apps/site/src/app/[locale]/(content)/requisites/page.tsx`         | Requisites metadata and server page; confirmed config facts, exact clipboard                                   | exists (content); legal publication gate EN-002 open                           |
| `apps/site/src/app/[locale]/(content)/public-offer/page.tsx`       | Complete localized legal document, contents/print leaves and metadata                                          | exists (content)                                                               |
| apps/site/src/app/[locale]/(content)/privacy-policy/page.tsx       | Complete localized privacy document, native contents, configured contact and metadata                          | exists (content)                                                               |
| `apps/site/src/app/[locale]/(content)/wholesale/page.tsx`          | Wholesale offer route: server content, cached real category cards and domain metadata                          | exists (content)                                                               |
| `apps/site/src/app/[locale]/(content)/*/page.tsx`                  | About, delivery, returns, gallery, legal, contacts                                                             | planned (step 6)                                                               |
| `apps/site/src/app/[locale]/(content)/articles/**`                 | List/search/paging and slug reading routes; old-ID 301 map in app config                                       | exists (approved article frontend stage)                                       |
| `apps/site/src/app/[locale]/region/[city]/page.tsx`                | Regional landings                                                                                              | planned (step 6)                                                               |
| `apps/site/src/app/[locale]/checkout/page.tsx`                     | Thin private checkout route; metadata and request-time leaf delegate to cart                                   | exists locally                                                                 |
| `apps/site/src/app/[locale]/(private)/{cabinet,login}`             | noindex, private routes, never shared-cached                                                                   | planned (step 7)                                                               |
| `apps/site/src/app/api/revalidate/route.ts`                        | Protected webhook for backend cache invalidation (`content`, `catalog` tags)                                   | exists (Content 007)                                                           |
| `libs/site/catalog/{model,data-access,ui}`                         | Tree, category, listing URL model, loaders, cards, toolbar, tree, mega menu                                    | exists (steps 2, 3)                                                            |
| `libs/site/catalog/{seo,feature}`                                  | Catalog metadata and JSON-LD; category, hub, search pages, navigation                                          | exists (step 3)                                                                |
| `libs/site/home/{ui,seo,feature}`                                  | Home page blocks, metadata, composition                                                                        | exists (step 2)                                                                |
| `libs/site/product/{model,data-access,seo,ui,feature}`             | Product page/gallery/SEO and its server purchase descriptor/callback boundary                                  | exists (stage4A; cart bridge connected locally)                                |
| `libs/site/cart/{model,data-access,ui,seo,feature}`                | Shared document cart, drawer/checkout, pure legacy codec, anonymous server mutation and private metadata       | exists locally                                                                 |
| `libs/site/content/{model,seo,ui,feature}`                         | Delivery/payment, returns and contacts UI, typed returns/contacts copy, metadata and server composition        | exists (delivery, returns, contacts, articles); other content planned (step 6) |
| `libs/site/account/{data-access,ui,feature}`                       | Sign-in and cabinet (cookie session, client side)                                                              | planned (step 7)                                                               |

## Article frontend stage (2026-11-03)

The [articles SDD](../../../specs/site/content/001-articles/README.md) adds one generated data-access project and uses the existing content model/UI/SEO/feature projects. The owner explicitly approved temporary local source while the provider has no article API. Only data-access contains full localized source; UI never imports it and the size selector receives scalar choices/strings only. Future DB/admin/API remains a separate migration stage.

The [requisites feature](../../../features/site/requisites.md) uses the existing content projects. `shared/company` loads the admin-edited requisites with the `FALLBACK_COMPANY_REQUISITES` fallback from `core/config`, model owns interface labels and exact copy formatting, and only the clipboard leaf is client-side. No new project, alias, boundary exception, global CSS or shell API is added.

## Privacy policy implementation

The [privacy feature](../../../features/site/privacy-policy.md) uses the existing content model/UI/SEO/feature projects. Model owns complete sourced copy and pure public-fact bindings, UI owns native contents and semantic reading blocks, feature binds COMPANY/siteConfig, and SEO delegates to core builders. No new project, data-access, client state, alias, shell API or boundary exception. Both routes are discovered through the existing content sitemap list.

## Gallery frontend stage (2026-11-03)

The [gallery feature](../../../features/site/gallery.md) uses existing content model/data-access/UI/SEO/feature public APIs. Source is a static server-only snapshot of seven channel videos with local real posters. GalleryBrowser owns the client session; MediaImage, MediaViewer and VideoFrame have separate lifecycles. Shared UI also exports Dialog on existing radix-ui. No new project/alias/boundary exception/package/global CSS/core shell changes.

Implemented route: apps/site/src/app/[locale]/(content)/galleria/page.tsx. Domain SEO owns metadata/BreadcrumbList; content-sitemap adds one gallery descriptor. Real photos were explicitly deferred, while the model/UI already supports them.

Product domain stage4A checked 2026-11-03: five Nx projects have inferred vite:test/typecheck/lint and public aliases; app/product/sitemap.ts adds sharded metadata output, app robots supplies URLs to generic core input. That stage4A checkpoint did not include cart. The cart/provider/private checkout and product purchase bridge are now implemented locally (2026-11-04); core still imports no product/cart domain. See the [cart feature](../../../features/site/cart.md) for current source and focused evidence.

Cart audit2026-11-04: five cart cached lint targets include actual root eslint.config.cjs and tools/eslint-rules/**/* inputs. The business owner keeps atomic cart/draft/pending/receipt state; DOM focus eligibility lives in cart/feature/platform. [Audit/evidence](../../../specs/site/cart/001-cart-checkout/code-audit/audit.md).
