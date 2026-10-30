# 001 — Home page: SEO design

Site-wide rules: [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md) and [SEO rules](../../../../../standards/site/seo-rules.md).

## URL and index policy

| URL type      | Example          | Index                                    | Canonical | robots.txt            | Sitemap              | Links                         |
| ------------- | ---------------- | ---------------------------------------- | --------- | --------------------- | -------------------- | ----------------------------- |
| Home          | `/uk`, `/ru`     | index after cutover (preview: `noindex`) | self      | allow (after cutover) | yes, with alternates | header logo, footer, 404 page |
| Old duplicate | `/uk/categories` | —                                        | —         | —                     | no                   | permanent redirect to `/uk`   |
| Bare root     | `/`              | —                                        | —         | —                     | no                   | 308 to `/uk` (step 1)         |
| Unknown       | `/xx`            | `noindex`                                | —         | —                     | no                   | 404                           |

## Metadata

|                           | uk                                                                                                               | ru                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Title (≤ 60 chars)        | Дверна фурнітура оптом і в роздріб — Class Kedr                                                                  | Дверная фурнитура оптом и в розницу — Class Kedr                                                                 |
| Description (≤ 160 chars) | Завіси, замки, ручки, циліндри та міжкімнатні механізми оптом і в роздріб. Склад у Харкові, доставка по Україні. | Петли, замки, ручки, цилиндры и межкомнатные механизмы оптом и в розницу. Склад в Харькове, доставка по Украине. |
| H1                        | Дверна фурнітура оптом і в роздріб                                                                               | Дверная фурнитура оптом и в розницу                                                                              |

- Canonical and alternates from `buildPageMetadata` (`/uk` and `/ru` both exist, `x-default` → `/uk`).
- Open Graph: `type: website`, locale `uk_UA`/`ru_UA`, title, description, url, site name; image comes with step 8.
- Robots: the root policy (`noindex` until `SITE_ENV=production` and `SITE_INDEXING=true`).

## Structured data

| Page       | Types          | Builder                               | Source      |
| ---------- | -------------- | ------------------------------------- | ----------- |
| Home       | `WebSite`      | `@site/core/seo` `buildWebSiteJsonLd` | site config |
| Every page | `Organization` | `@site/core/seo` (layout)             | `COMPANY`   |

No `SearchAction`: Google retired the sitelinks search box in 2024 and the search page is `noindex`. No `ItemList` for the in-stock block: it is not the page's main content.

## Internationalization

Both locales always exist; each page links to the other through the language switch and hreflang. No translation is missing.

## Content and performance

- H1, lead text, wholesale benefits, catalog index, and product names are server HTML in the first response.
- Internal links: every top-level category and up to eight subcategories each (the strongest internal-link block of the site), up to eight product pages, the wholesale page, and all products.
- LCP is the H1 text; product photos are lazy `next/image` with fixed aspect ratio (no CLS). No client JavaScript is added by this page.
- Budget: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75.
