# Site product details

**Route:** [product/[slug]/page.tsx](../../../apps/site/src/app/[locale]/product/[slug]/page.tsx), `/{locale}/product/{slug}`. [SDD](../../specs/site/product/001-product-details/README.md). **Status:** independent migration stage 4A implemented 2026-11-03; shared cart purchase (stage4B) connected2026-11-04 via the approved cart SDD.

**Model page (2026-11-06, [SDD 002](../../specs/site/product/002-site-models/README.md)).** The same route first asks `GET /api/catalog/{lang}/model/{slug}` ([model-page.tsx](../../../libs/site/product/feature/src/lib/model/model-page.tsx)). An accepted model renders the chosen product's page under the model name: the product name below the H1, the short model text, switchers as plain links (`?{axis}={value}`, [model-selection.ts](../../../libs/site/product/model/src/lib/model/model-selection.ts): the first axis shows all values, each next one only values that exist with the choice before it; no query or an unknown value gives the main product), «Є в наявності: …» with up to three in-stock variants when the choice is out of stock, the cart-owned table of all variants with a quantity each and «Додати вибране в кошик», the full model text and characteristics, and «Інші моделі в категорії» (four in-stock model cards from the catalog). Canonical is the model address without the query; title and description come from «Вітрина сайту» (else the model name and short text). A product inside an accepted model and a former model slug answer 308 to the model with the product's values; a product shown as a model of its own (`isAccepted` false) and an unknown slug keep the product page below. The page reads `searchParams`, so it renders per request on cached data.

The server renders the real product name, 1C SKU, category trail, retail UAH price or price-on-request, stock state and informational pack. The gallery (every linked photo from `photos` in order, then the scheme; `photo` alone from an older backend), inline zoom and honest SKU clipboard feedback are client leaves. Product facts and service sections follow the approved light/dark UK/RU design; the existing Site shell is reused. The layout stacks below viewport `lg=1024`, uses two columns above it, and does not add a sticky purchase bar.

Stock and price are independent. No stock leads to the manager availability contact; unknown price leads to the price contact. Both facts remain visible when both are missing. For an available priced product, ProductPage builds a serialized descriptor and executes an app-injected server renderer. The cart purchase island owns quantity1–1000 and adds through the shared document cart. Rejection keeps quantity and never displays a false success; product has no second cart or order transport. See [cart feature](cart.md).

## Data, routing and SEO

- `getPublicProductBySlug`, `GET /api/catalog/{lang}/product/{productSlug}`, public price type11; [Site consumer projection](../../contracts/catalog/public-products.md#site-product-details-and-discovery). Generated aliases and unknown response parsing stay private in data-access `contracts/`; normalization stays in mappers.
- Shared typed GET, success `cacheLife('hours')`, short failure lifetime, `catalog`/`catalog:products`/product SKU/slug tags; no cookies, session or cart in the shared cache.
- Current URL renders the product; old slug permanently redirects, category redirect body permanently redirects to the category, bare missing is 404, unavailable data throws to the existing error frame. Resolution precedes streaming; `instant=false` follows the category route.
- Prerender uses real first-page candidates and at most five detail verifications per locale; there is no fake placeholder. If no real seed can be confirmed, preparation fails explicitly.
- Feature filters hidden catalog roots and resolves category destinations through the allowed `product-feature -> catalog-model` flow. One visible trail feeds UI and BreadcrumbList; ready `categoryHref` passes through the server view to identity, with no category URL policy in UI.
- Product SEO owns self canonical, confirmed same-SKU locale alternates, OG and Product/Offer/BreadcrumbList. Price-query omits Offer; there are no invented descriptions, brands or ratings. Existing JsonLd renderer escapes untrusted values.
- `/product/sitemap/{id}.xml` lists model addresses from `GET /api/catalog/{lang}/models` (name order, 100 per page; addresses that answer 308 are not listed) through a bounded best-effort index ( maximum 1000 pages per locale, one inconsistency retry), no N detail calls and no fabricated `lastModified`. Shards are at most 20,000 URL and below a conservative 40 MiB UTF-8 budget. `robots.txt` lists one product sitemap index (`/product/sitemap-index.xml`, [route](../../../apps/site/src/app/product/sitemap-index.xml/route.ts)) that enumerates the shards on request and answers 503 with `Retry-After` when the API is down, so `robots.txt` itself stays static; preview remains blocked and skips that enumeration. Root `/sitemap.xml` remains intact.

- Page body: breadcrumbs, gallery, identity (SKU with copy, stock, category), price in the site-wide format (`1 245 грн`), cart action, wholesale note, short delivery/payment/returns links, and help with the phone. The former «Про товар» tab row, facts table, and repeated delivery/returns sections were removed 2026-11-04 because they repeated the same data. On phones a buy bar with the price and one-tap «У кошик» ([product-sticky-bar.tsx](../../../libs/site/product/ui/src/lib/purchase/product-sticky-bar.tsx)) appears once the purchase panel has scrolled off screen; the app supplies it through `renderStickyPurchaseAction`.

## Architecture

```mermaid
flowchart LR
  Route["app product route"] --> Feature["product/feature"]
  Route --> Cart["cart/feature server purchase renderer"]
  Feature --> Descriptor["server callback: serialized product descriptor"]
  Feature --> Data["product/data-access"] --> Api["shared/api-client"]
  Data --> Model["product/model"]
  Feature --> Ui["product/ui: server view + small client leaves"] --> Model
  Feature --> Seo["product/seo: local input"] --> CoreSeo["core/seo"]
  Feature --> CatalogModel["catalog/model: root/path policy only"]
  Feature --> CatalogList["catalog/data-access + ui: other models in the category"]
  Route --> CartBulk["cart/feature: variants table renderer"]
  Sitemap["app/product/sitemap.ts"] --> Feature
  Robots["app/robots.ts"] --> Feature
  Robots --> CoreSeo
```

## Actual structure

```text
apps/site/src/app/
├── [locale]/product/[slug]/page.tsx   # thin product entry
├── product/sitemap.ts               # thin sharded metadata entry
└── robots.ts                        # passes product discovery URLs to core
libs/site/product/
├── model/src/lib/                   # entities (product, site model), result unions, paths, purchase rules,
│                                    # model/ (variant choice, switchers, in-stock alternatives, query)
├── data-access/src/lib/
│   ├── contracts/                  # private generated aliases and unknown-body parser
│   ├── loaders/, mappers/           # typed detail and model GET, domain normalization, model index page
│   ├── crawling/                    # index page transport, walker and cache
│   └── cache-tags.ts
├── ui/src/lib/
│   ├── detail/, identity/, details/ # server composition, SKU leaf, facts
│   ├── gallery/                     # selection/failure/zoom + real image
│   ├── purchase/, service/          # price/action slot, conditions/contact
│   ├── model/                       # switchers, in-stock alternatives, texts/characteristics, section
│   └── i18n/                        # typed UK/RU copy
├── seo/src/lib/                     # input, metadata, JSON-LD and URL helpers
└── feature/src/lib/
    ├── detail/product-purchase-descriptor.ts # server renderer handoff
    ├── detail/, mapping/, routing/  # page/crumbs, category/SEO mapping, identity/status/seeds
    ├── model/                       # ModelPage, 308/fallback, switch links and variant rows, model SEO input
    └── crawling/                    # entries, XML budget/shards, server orchestration
```

The shared cart runtime/provider/checkout belong to cart; app composition injects the server purchase renderer, without product→cart imports. The contract snapshot is unchanged.

## Tests

From repository root, one focused target for the changed owner:

```powershell
npx nx run site-product-model:vite:test -- --run
npx nx run site-product-data-access:vite:test -- --run
npx nx run site-product-ui:vite:test -- --run
npx nx run site-product-seo:vite:test -- --run
npx nx run site-product-feature:vite:test -- --run
```

Installed direct `vitest.cmd run --config libs/site/product/<layer>/vite.config.mts` was used for the same scoped configs during delivery, avoiding repeated full Nx graph startup. Results: model33, data55, UI19, SEO9, feature42 — **158 product tests**. Modified core crawling tests: 5 passed; boundary fixtures:27 passed. Scoped source/test/app type checking, ESLint and architecture boundaries passed; see [implementation evidence](../../specs/site/product/001-product-details/verification/implementation.md).

Browser/visual/manual, live HTTP, production build, E2E and full app suite were not run. Responsive/theme conclusions are source/component evidence, not rendered browser inspection. Stage4B cart connection is complete; release/live/browser checks remain unrun.

Architecture follow-up: [scoped audit and fixes](../../specs/site/product/001-product-details/code-audit/audit.md) — AF-001/002/003. Fresh targeted checks: data55, UI detail3, feature mapping/SSR6 (64 tests); type projection24 roots, scoped ESLint and boundaries108 projects. The original158-test delivery result above is historical; no full suite was repeated.

Cart4B follow-up2026-11-04: descriptor7 + page8 (15 tests) passed; the shared cart runtime2 tests connect product → both headers → drawer → checkout → confirmed receipt. These are fresh scoped checks; the full historical product suite above was not repeated. [Cart evidence](../../specs/site/cart/001-cart-checkout/verification/implementation.md).
