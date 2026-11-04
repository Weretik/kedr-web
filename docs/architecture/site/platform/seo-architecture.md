# SEO architecture — site

**Checked:** 2026-11-01
**Sources:** `libs/site/core/seo`, `libs/site/core/i18n`, `libs/site/core/config`, `apps/site/src/app/robots.ts`, `apps/site/src/app/sitemap.ts`, `apps/site/next.config.ts`

Site-wide SEO decisions. Feature specifications apply them in their `design/seo.md` and propose changes here through review. Per-feature findings for the current storefront are in the [feature inventory](../../../specs/site/migration/feature-inventory.md).

Cart/checkout source update: 2026-11-04. The private checkout and product purchase bridge are implemented locally; focused automated/source evidence is linked from the [cart feature](../../../features/site/cart.md). This update does not claim a deployment, build, HTTP, browser or live-order check.

## Origin and URL form

- Production origin: `https://classkedr.com.ua` (`SITE_URL`). `metadataBase` makes canonical and alternates absolute.
- Trailing slash: none. `/uk/` → `/uk` and `/` → `/uk` are permanent (308) redirects. `[NEEDS CLARIFICATION: www and http redirects are configured at the hosting level at cutover]`.
- Non-production: indexing is off unless `SITE_ENV=production` and `SITE_INDEXING=true`. Then every page has `noindex, nofollow` and `robots.txt` is `Disallow: /`.

## URL and index policy

| URL type                       | Example                                                                                     | Index                                                           | Canonical             | robots.txt | Sitemap        | Links                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------- | ---------- | -------------- | --------------------------------------------------------------- |
| Home                           | `/uk`                                                                                       | yes                                                             | self                  | allow      | yes            | logo, footer                                                    |
| Old catalog index              | `/uk/categories`                                                                            | no                                                              | —                     | —          | no             | 308 to `/uk`                                                    |
| Former company page            | `/uk/about-company`, `/ru/about-company`                                                    | no                                                              | —                     | —          | no             | 308 to the same-language home; navigation uses `#about-company` |
| Catalog hub                    | `/uk/catalog`                                                                               | yes                                                             | self                  | allow      | yes            | mega menu, home, breadcrumbs                                    |
| Category                       | `/uk/catalog/ruchky`                                                                        | yes                                                             | self                  | allow      | yes            | header, mega menu, tree, breadcrumbs, subcategories             |
| Category page 2+               | `?page=2`                                                                                   | yes                                                             | self with `page`      | allow      | no             | pagination links                                                |
| Filters, sort, view            | `?inStock=true&sort=price-asc&view=table`                                                   | no, `noindex, follow`                                           | category page 1       | allow      | no             | toolbar; `rel="nofollow"` on view links                         |
| Page past the end              | `?page=99`                                                                                  | no, `noindex, follow`                                           | category page 1       | allow      | no             | —                                                               |
| Search                         | `/uk/search?q=…`                                                                            | no, `noindex, follow`                                           | `/uk/search`          | allow      | no             | header and home search forms                                    |
| Old catalog addresses          | `/uk/catalog/{slug}/products`, `/uk/catalog/products?search=`, `/uk/catalog/product/{slug}` | —                                                               | —                     | —          | no             | 308 to the flat addresses                                       |
| Product                        | `/uk/product/{slug}`, `/ru/product/{slug}`                                                  | yes after production gate                                       | self current          | allow      | product shards | existing catalog links and visible breadcrumbs                  |
| Content                        | `/uk/delivery-and-payment`                                                                  | yes                                                             | self                  | allow      | yes            | top bar, footer                                                 |
| Contacts                       | `/uk/contacts`, `/ru/contacts`                                                              | yes after existing production cutover gate                      | self                  | allow      | yes            | existing header/footer                                          |
| Requisites                     | `/uk/requisites`, `/ru/requisites`                                                          | yes after existing production gate; EN-002 release prerequisite | self                  | allow      | yes            | existing footer and page anchors                                |
| Public offer                   | `/uk/public-offer`, `/ru/public-offer`                                                      | yes after existing production gate                              | self                  | allow      | yes            | existing legal footer, home breadcrumb and section anchors      |
| Privacy policy                 | /uk/privacy-policy, /ru/privacy-policy                                                      | yes after existing production gate                              | self                  | allow      | yes            | existing legal footer, home breadcrumb and native contents      |
| Wholesale                      | `/uk/wholesale`, `/ru/wholesale`                                                            | yes after existing production gate                              | self                  | allow      | yes            | shell, home partner block, footer                               |
| Article list                   | `/uk/articles`, `/ru/articles`                                                              | yes after production gate                                       | self                  | allow      | yes            | existing shell/breadcrumb                                       |
| Article list page 2+           | `/uk/articles?page=2`                                                                       | yes with default size and no q                                  | self normalized page  | allow      | no             | real pager links                                                |
| Article search / size          | `/uk/articles?q=ZAMAK&pageSize=20`                                                          | noindex, follow                                                 | self normalized query | allow      | no             | GET search and size selector                                    |
| Article detail                 | `/uk/articles/zamak-chy-aliuminii`                                                          | yes after production gate                                       | self                  | allow      | yes            | real card links                                                 |
| Legacy article ID              | `/uk/articles/3`                                                                            | redirect                                                        | slug destination      | allow      | no             | 301 maintained app map                                          |
| Region landing                 | `/uk/region/kyiv`                                                                           | yes, if unique text                                             | self                  | allow      | yes            | regions menu                                                    |
| Cart, checkout, cabinet, login | `/uk/checkout`                                                                              | no                                                              | —                     | disallow   | no             | `rel="nofollow"`                                                |
| Gallery and video              | /uk/galleria, /ru/galleria                                                                  | yes after existing production gate                              | self                  | allow      | yes            | shell/footer/breadcrumb; filter/viewer are local state          |
| 404                            | any unknown                                                                                 | no                                                              | —                     | —          | no             | —                                                               |

- URL model owner: `libs/site/catalog/model` (`listing/listing-query.ts`) parses, normalizes, and serializes `page`, `sort`, `inStock`, `isSale`, `isNew`, `priceFrom`, `priceTo`, and `view`; defaults are omitted, so equal choices give one URL. The search term is `q`. Flat category and product addresses are an owner decision of 2026-10-30 ([category page SEO design](../../../specs/site/catalog/001-category-page/design/seo.md)).
- Status codes: unknown slug 404; a former category slug 308 to the current one; product old slug/category target 308, bare missing404; separate410 only after a future API contract; empty filter result 200 with `noindex`; catalog API down 500 inside the site frame; never "not found" with 200.

## Metadata ownership

| Field          | Default (layout)     | Per page                                                                    | Builder                                  |
| -------------- | -------------------- | --------------------------------------------------------------------------- | ---------------------------------------- |
| Title template | `%s \| Class Kedr`   | page title                                                                  | `buildRootMetadata`, `buildPageMetadata` |
| Description    | —                    | required for indexable pages                                                | `buildPageMetadata`                      |
| Canonical      | —                    | self, locale-specific                                                       | `buildCanonicalPath`                     |
| Alternates     | —                    | `uk-UA`, `ru-UA`, `x-default` → `uk`                                        | `buildLanguageAlternates`                |
| Robots         | site policy          | `indexable: false` → `noindex, follow`                                      | `buildRobotsMeta`                        |
| Open Graph     | `siteName`, `locale` | `type`, `url`, `title`, `description`, `alternateLocale`; image per product | `buildPageMetadata` (+ domain `seo`)     |

## Structured data inventory

| Page type      | Types                                                                             | Builder                                                                                          | API fields                                                                                         |
| -------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Every page     | `Organization` (+ `ContactPoint`, `PostalAddress`)                                | `buildOrganizationJsonLd`                                                                        | `COMPANY` constants                                                                                |
| Home           | `WebSite` (no `SearchAction`: Google retired the sitelinks search box in 2024)    | `buildWebSiteJsonLd`                                                                             | —                                                                                                  |
| Category       | `BreadcrumbList`, `ItemList`                                                      | planned `libs/site/catalog/seo`                                                                  | `CategoryDetails.breadcrumbs`, `ProductPage.value`                                                 |
| Product        | `Product`, conditional `Offer`, `BreadcrumbList`                                  | `libs/site/product/seo`                                                                          | real id/SKU/name/price/stock/photo/scheme and visible trail; no invented brand/description/reviews |
| Article        | `Article`, `BreadcrumbList`                                                       | `libs/site/content/seo`                                                                          | confirmed local source title/excerpt/image/publication date; no invented author/dateModified       |
| Contacts       | Layout `Organization` + page `BreadcrumbList`; `LocalBusiness` / `Store` deferred | `libs/site/content/seo`; [contacts SDD](../../../specs/site/content/001-contacts/design/seo.md)  | Confirmed COMPANY; street/hours/geo not supplied                                                   |
| Requisites     | Layout `Organization` + page `BreadcrumbList`                                     | `libs/site/content/seo`                                                                          | Visible localized breadcrumbs; banking facts are not structured-data claims                        |
| Public offer   | Layout `Organization` + page `BreadcrumbList`                                     | `libs/site/content/seo`; [offer SDD](../../../specs/site/content/001-public-offer/design/seo.md) | Visible localized home/page labels and configured origin; no invented seller/date                  |
| Privacy policy | Layout Organization + page BreadcrumbList                                         | content/seo; [privacy SDD](../../../specs/site/content/001-privacy-policy/design/seo.md)         | Visible localized home/page labels and configured origin; no invented dates or owner claims        |
| Wholesale      | Layout `Organization` + page `BreadcrumbList`                                     | `libs/site/content/seo`                                                                          | Confirmed COMPANY/copy; category links from existing catalog; no Product/Offer/FAQPage             |

All JSON-LD is rendered on the server with `JsonLd`, which escapes `<`, `>`, and `&`.

Delivery/payment content metadata is owned by `libs/site/content/seo`; the existing `/{locale}/delivery-and-payment` address is preserved and included through `CONTENT_SITEMAP_PAGES` in app sitemap. It uses self canonical, both language alternates, the existing indexing gate and no invented modification date or shipping structured data.

## Locales

| Decision                       | Value                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------- |
| Locales and codes              | `uk` → `uk-UA`, `ru` → `ru-UA`                                                   |
| Default locale and `x-default` | `uk`                                                                             |
| URL scheme                     | path prefix `/uk`, `/ru` on every page                                           |
| Localized slugs                | no: category and product slugs are the same in both languages (from 1C)          |
| Missing translation behavior   | do not list the missing language in alternates; never canonical across languages |
| Root `/` behavior              | permanent redirect to `/uk`, no `Accept-Language` or IP detection                |
| hreflang location              | HTML `<link rel="alternate">` and `xhtml:link` in the sitemap                    |

## Sitemaps and robots

- Root `sitemap.xml` retains home/catalog/migrated content. Product metadata route adds `/product/sitemap/{id}.xml`, bounded to20000 URL and a conservative40 MiB UTF8 budget; app robots supplies absolute root+product URLs through generic core input. Product list has no updatedAt: no invented lastModified or N detail fetches.
- `lastModified`: from the API once it exposes `updatedAt` for products and categories; omitted until then.
- `robots.txt` (indexing on): allow `/`, disallow `/api/` and `/{locale}/checkout|cabinet|login`, `Sitemap:` absolute URL.

## Checkout service metadata

`libs/site/cart/seo` owns localized nonpersonal checkout metadata through `buildRobotsMeta(config, false)`. Its builder adds no customer values, order reference, canonical/alternates or transaction structured data. The app route delegates metadata and rendering to cart; the neutral server heading/Suspense fallback is separate from the request-time leaf awaiting `connection()`. Cart/contact data belongs to the browser document owner and never becomes shared cached page or URL data.

The existing private policy is unchanged: checkout stays outside the public sitemap, `PRIVATE_PATHS` still produces robots disallow, service links use `nofollow`, and metadata remains `noindex`. No checkout-specific allow or indexing-gate change is introduced. This policy does not promise immediate removal of an already known URL from an external index. Cabinet/login remain separate migration work.

## Monitoring

Google Search Console domain property for `classkedr.com.ua` (owner to confirm access), Core Web Vitals field data from CrUX in Search Console, reviewed after each migration step and weekly for a month after cutover.

## Backend requirements

From KedrStore for full SEO (record each in the matching feature SDD and the [contracts](../../../contracts/README.md)):

1. Optional future description/characteristics/brand/additional photos; current ProductDetails already supplies id as SKU and photo/scheme. These optional fields do not block stage4A.
2. `updatedAt` for products and categories (sitemaps, `dateModified`).
3. "Removed" status for products (410) and a redirect target when a slug changes.
4. Category description and SEO text per locale.
5. Revalidation webhook calls on catalog import and product or category changes.

Returns/exchanges metadata is owned by content/seo. The preserved `/{locale}/returns-exchanges` route uses the same self canonical, reciprocal language alternates and indexing gate, and is listed alongside delivery in CONTENT_SITEMAP_PAGES. The shell already links to the route; complete policy text remains server HTML.

Contacts are implemented at `/{locale}/contacts`: domain metadata delegates to core/seo, the layout owns Organization and the page adds a localized BreadcrumbList. Both URLs are expanded from one CONTENT_SITEMAP_PAGES descriptor without a fabricated lastModified; preview indexing remains off.

Article list/detail are implemented by the [approved frontend stage](../../../specs/site/content/001-articles/design/seo.md). Search runs before paging over the complete temporary localized source. Nonempty q omits hreflang because localized search results may differ; it still uses a normalized self canonical. Nondefault page sizes are noindex with self canonical. Source dates are publication dates only; no modification dates are fabricated. Sitemap adds list plus six slug paths in both locales; IDs/query variants stay out. This does not change the site-wide preview indexing gate.

Wholesale is implemented at `/{locale}/wholesale`: server offer, real hardware category cards and manager contact, with a meaningful fallback when the catalog is unavailable. [Wholesale SEO design](../../../specs/site/content/001-wholesale/design/seo.md) applies existing canonical/alternates/gate and adds one sitemap descriptor, without invented terms or modification dates.

Public-offer metadata is owned by content/seo. The preserved `/{locale}/public-offer` address has self canonical, reciprocal HTML/sitemap alternates and the existing preview indexing gate. Its complete original legal text and final note are server markup. BreadcrumbList matches visible navigation; Organization stays in the layout. The additive content descriptor has no invented modification date.

Requisites preserve `/{locale}/requisites`, with domain metadata through core/seo, reciprocal HTML alternates/x-default, one sitemap descriptor and no fabricated date. The page adds only BreadcrumbList; WebSite remains on home. Owner-confirmed administration facts are not declared payment details for every seller/order. [Requisites SEO](../../../specs/site/content/001-requisites/design/seo.md) records local evidence and the EN-002 gate for related legal destinations.

Privacy-policy metadata is owned by content/seo. The preserved /{locale}/privacy-policy address has complete server-rendered UK/RU text, self canonical, reciprocal HTML/sitemap alternates and the unchanged preview gate. BreadcrumbList matches visible navigation; Organization remains in the layout. CONTENT_SITEMAP_PAGES adds one descriptor without fabricated lastModified. [Verification](../../../specs/site/content/001-privacy-policy/verification/seo-verification.md) separates unit/server-render results from unrun HTTP/browser/build checks.

Product stage4A (2026-11-03) uses confirmed same-SKU locale lookups, self canonical and conditional Offer. No success/data card is emitted for missing/unavailable outcomes. Source/automated checks passed; live status/HTML/validators are unrun. At that checkpoint shared cart purchase remained an explicit external prerequisite and preview indexing stayed off.

The cart integration added locally on 2026-11-04 now connects the product's injected server purchase callback to the shared document cart and private checkout. The historical stage4A evidence is retained; this later connection does not change product indexing gates or establish fresh build/HTTP/browser/live-order evidence. See the [current cart feature](../../../features/site/cart.md).
