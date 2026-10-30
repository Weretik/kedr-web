# SEO architecture — site

**Checked:** 2026-10-29
**Sources:** `libs/site/core/seo`, `libs/site/core/i18n`, `libs/site/core/config`, `apps/site/src/app/robots.ts`, `apps/site/src/app/sitemap.ts`, `apps/site/next.config.ts`

Site-wide SEO decisions. Feature specifications apply them in their `design/seo.md` and propose changes here through review. Per-feature findings for the current storefront are in the [feature inventory](../../../specs/site/migration/feature-inventory.md).

## Origin and URL form

- Production origin: `https://classkedr.com.ua` (`SITE_URL`). `metadataBase` makes canonical and alternates absolute.
- Trailing slash: none. `/uk/` → `/uk` and `/` → `/uk` are permanent (308) redirects. `[NEEDS CLARIFICATION: www and http redirects are configured at the hosting level at cutover]`.
- Non-production: indexing is off unless `SITE_ENV=production` and `SITE_INDEXING=true`. Then every page has `noindex, nofollow` and `robots.txt` is `Disallow: /`.

## URL and index policy

| URL type                           | Example                                       | Index                      | Canonical                   | robots.txt | Sitemap   | Links                                  |
| ---------------------------------- | --------------------------------------------- | -------------------------- | --------------------------- | ---------- | --------- | -------------------------------------- |
| Home                               | `/uk`                                         | yes                        | self                        | allow      | yes       | logo, footer                           |
| Old catalog index                  | `/uk/categories`                              | no                         | —                           | —          | no        | 308 to `/uk`                           |
| Category                           | `/uk/catalog/zamki-900002/products`           | yes                        | self (page 1 without query) | allow      | yes       | header, mega menu, footer, breadcrumbs |
| Category page 2+                   | `?page=2`                                     | yes                        | self with `page`            | allow      | no        | pagination links                       |
| Single-value facet landing         | `?inStock=true` is the default; whitelist TBD | whitelist only             | self                        | allow      | whitelist | filter links                           |
| Multi-facet, sort, page size, view | `?sort=PriceAsc&isSale=true`                  | no, `noindex, follow`      | category                    | allow      | no        | `rel="nofollow"` on sort               |
| Search                             | `/uk/catalog/products?search=…`               | no, `noindex, follow`      | `/uk/catalog/products`      | allow      | no        | form only                              |
| Product                            | `/uk/catalog/product/{slug}`                  | yes                        | self                        | allow      | yes       | listings, related                      |
| Content                            | `/uk/delivery-and-payment`                    | yes                        | self                        | allow      | yes       | top bar, footer                        |
| Region landing                     | `/uk/region/kyiv`                             | yes, if the text is unique | self                        | allow      | yes       | regions menu                           |
| Cart, checkout, cabinet, login     | `/uk/checkout`                                | no                         | —                           | disallow   | no        | `rel="nofollow"`                       |
| 404                                | any unknown                                   | no                         | —                           | —          | no        | —                                      |

- URL model owner: `libs/site/catalog/model` (planned) parses, normalizes, and serializes filter query parameters; the names stay as in the current storefront (`search`, `page`, `pageSize`, `sort`, `inStock`, `isSale`, `isNew`, `priceFrom`, `priceTo`).
- Status codes: unknown slug 404; removed product 410 once the API reports it; empty filter result 200 with `noindex`; never "not found" with 200.

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

- One `sitemap.xml` now (home only). From step 3: a sitemap index split by type (`categories`, `products`, `content`) with `generateSitemaps`; each file under 50,000 URLs.
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
