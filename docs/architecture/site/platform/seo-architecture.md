# SEO architecture — site

**Checked:** 2026-11-01
**Sources:** `libs/site/core/seo`, `libs/site/core/i18n`, `libs/site/core/config`, `apps/site/src/app/robots.ts`, `apps/site/src/app/sitemap.ts`, `apps/site/next.config.ts`

Site-wide SEO decisions. Feature specifications apply them in their `design/seo.md` and propose changes here through review. Per-feature findings for the current storefront are in the [feature inventory](../../../specs/site/migration/feature-inventory.md).

## Origin and URL form

- Production origin: `https://classkedr.com.ua` (`SITE_URL`). `metadataBase` makes canonical and alternates absolute.
- Trailing slash: none. `/uk/` → `/uk` and `/` → `/uk` are permanent (308) redirects. `[NEEDS CLARIFICATION: www and http redirects are configured at the hosting level at cutover]`.
- Non-production: indexing is off unless `SITE_ENV=production` and `SITE_INDEXING=true`. Then every page has `noindex, nofollow` and `robots.txt` is `Disallow: /`.

## URL and index policy

| URL type                       | Example                                                                                     | Index                 | Canonical        | robots.txt | Sitemap | Links                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------- | --------------------- | ---------------- | ---------- | ------- | --------------------------------------------------- |
| Home                           | `/uk`                                                                                       | yes                   | self             | allow      | yes     | logo, footer                                        |
| Old catalog index              | `/uk/categories`                                                                            | no                    | —                | —          | no      | 308 to `/uk`                                        |
| Catalog hub                    | `/uk/catalog`                                                                               | yes                   | self             | allow      | yes     | mega menu, home, breadcrumbs                        |
| Category                       | `/uk/catalog/ruchky`                                                                        | yes                   | self             | allow      | yes     | header, mega menu, tree, breadcrumbs, subcategories |
| Category page 2+               | `?page=2`                                                                                   | yes                   | self with `page` | allow      | no      | pagination links                                    |
| Filters, sort, view            | `?inStock=true&sort=price-asc&view=table`                                                   | no, `noindex, follow` | category page 1  | allow      | no      | toolbar; `rel="nofollow"` on view links             |
| Page past the end              | `?page=99`                                                                                  | no, `noindex, follow` | category page 1  | allow      | no      | —                                                   |
| Search                         | `/uk/search?q=…`                                                                            | no, `noindex, follow` | `/uk/search`     | allow      | no      | header and home search forms                        |
| Old catalog addresses          | `/uk/catalog/{slug}/products`, `/uk/catalog/products?search=`, `/uk/catalog/product/{slug}` | —                     | —                | —          | no      | 308 to the flat addresses                           |
| Product                        | `/uk/product/{slug}`                                                                        | yes                   | self             | allow      | yes     | listings, related                                   |
| Content                        | `/uk/delivery-and-payment`                                                                  | yes                   | self             | allow      | yes     | top bar, footer                                     |
| Region landing                 | `/uk/region/kyiv`                                                                           | yes, if unique text   | self             | allow      | yes     | regions menu                                        |
| Cart, checkout, cabinet, login | `/uk/checkout`                                                                              | no                    | —                | disallow   | no      | `rel="nofollow"`                                    |
| 404                            | any unknown                                                                                 | no                    | —                | —          | no      | —                                                   |

- URL model owner: `libs/site/catalog/model` (`listing/listing-query.ts`) parses, normalizes, and serializes `page`, `sort`, `inStock`, `isSale`, `isNew`, `priceFrom`, `priceTo`, and `view`; defaults are omitted, so equal choices give one URL. The search term is `q`. Flat category and product addresses are an owner decision of 2026-10-30 ([category page SEO design](../../../specs/site/catalog/001-category-page/design/seo.md)).
- Status codes: unknown slug 404; a former category slug 308 to the current one; removed product 410 once the API reports it; empty filter result 200 with `noindex`; catalog API down 500 inside the site frame; never "not found" with 200.

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

| Page type  | Types                                                                                 | Builder                         | API fields                                         |
| ---------- | ------------------------------------------------------------------------------------- | ------------------------------- | -------------------------------------------------- |
| Every page | `Organization` (+ `ContactPoint`, `PostalAddress`)                                    | `buildOrganizationJsonLd`       | `COMPANY` constants                                |
| Home       | `WebSite` (no `SearchAction`: Google retired the sitelinks search box in 2024)        | `buildWebSiteJsonLd`            | —                                                  |
| Category   | `BreadcrumbList`, `ItemList`                                                          | planned `libs/site/catalog/seo` | `CategoryDetails.breadcrumbs`, `ProductPage.value` |
| Product    | `Product` + `Offer` (`price`, `priceCurrency: UAH`, `availability`), `BreadcrumbList` | planned `libs/site/product/seo` | `ProductDetails` (needs SKU, description, brand)   |
| Article    | `Article`                                                                             | planned `libs/site/content/seo` | static content                                     |
| Contacts   | `LocalBusiness` / `Store`                                                             | planned                         | address and hours (owner to provide)               |

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

- One `sitemap.xml` now includes home, catalog hub/categories and the migrated delivery/payment and returns content pages in both languages. From step 3: a sitemap index split by type (`categories`, `products`, `content`) with `generateSitemaps`; each file under 50,000 URLs.
- `lastModified`: from the API once it exposes `updatedAt` for products and categories; omitted until then.
- `robots.txt` (indexing on): allow `/`, disallow `/api/` and `/{locale}/checkout|cabinet|login`, `Sitemap:` absolute URL.

## Monitoring

Google Search Console domain property for `classkedr.com.ua` (owner to confirm access), Core Web Vitals field data from CrUX in Search Console, reviewed after each migration step and weekly for a month after cutover.

## Backend requirements

From KedrStore for full SEO (record each in the matching feature SDD and the [contracts](../../../contracts/README.md)):

1. Product SKU (артикул), description, characteristics, brand, and several photos in `ProductDetails`.
2. `updatedAt` for products and categories (sitemaps, `dateModified`).
3. "Removed" status for products (410) and a redirect target when a slug changes.
4. Category description and SEO text per locale.
5. Revalidation webhook calls on catalog import and product or category changes.

Returns/exchanges metadata is owned by content/seo. The preserved `/{locale}/returns-exchanges` route uses the same self canonical, reciprocal language alternates and indexing gate, and is listed in CONTENT_SITEMAP_PAGES. The shell already links to the route; complete policy text remains server HTML.
