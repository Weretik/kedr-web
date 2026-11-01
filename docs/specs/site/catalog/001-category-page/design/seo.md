# 001 — Category page: SEO design

Site-wide rules: [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md) and [SEO rules](../../../../../standards/site/seo-rules.md).

## URL and index policy

| URL type            | Example                                   | Index             | Canonical           | Sitemap              | Links                                                            |
| ------------------- | ----------------------------------------- | ----------------- | ------------------- | -------------------- | ---------------------------------------------------------------- |
| Category            | `/uk/catalog/ruchky`                      | yes               | self                | yes, with alternates | mega menu, header row, hub, tree, breadcrumbs, subcategory links |
| Category page N     | `/uk/catalog/ruchky?page=2`               | yes               | self with `?page=2` | no                   | pagination                                                       |
| Filters, sort, view | `?inStock=true&sort=price-asc&view=table` | `noindex, follow` | category page 1     | no                   | toolbar (client navigation only)                                 |
| Page past the end   | `?page=99`                                | `noindex`         | —                   | no                   | — (empty state with a link to page 1)                            |
| Catalog hub         | `/uk/catalog`                             | yes               | self                | yes                  | header, home, breadcrumbs                                        |
| Search              | `/uk/search?q=agb`                        | `noindex, follow` | —                   | no                   | header and home search                                           |
| Old category        | `/uk/catalog/zamki-900002/products`       | —                 | —                   | no                   | 308 to `/uk/catalog/zamki-900002`, then 308 to the current slug  |
| Old all products    | `/uk/catalog/products`, `?search=`        | —                 | —                   | no                   | 308 to `/uk/catalog`, `/uk/search?q=`                            |
| Old product         | `/uk/catalog/product/{slug}`              | —                 | —                   | no                   | 308 to `/uk/product/{slug}`                                      |

Slugs are the same in both languages, so `hreflang` alternates use the same path.

## Metadata

|              | uk                                                                                                                      | ru                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Title        | admin SEO title, else `{Назва} — купити оптом і в роздріб`; page N adds ` — сторінка N`                                 | admin SEO title, else `{Название} — купить оптом и в розницу`; ` — страница N` |
| Description  | admin meta description, else `{Назва}: {N} товарів від {min} грн. Опт і роздріб, склад у Харкові, доставка по Україні.` | same in Russian                                                                |
| H1           | admin H1, else the category name                                                                                        | same                                                                           |
| Hub title    | Каталог дверної фурнітури                                                                                               | Каталог дверной фурнитуры                                                      |
| Search title | Пошук: {q}                                                                                                              | Поиск: {q}                                                                     |

## Structured data

| Page     | Types                                  | Builder             | Source                        |
| -------- | -------------------------------------- | ------------------- | ----------------------------- |
| Category | `BreadcrumbList`                       | `@site/catalog/seo` | `CategoryDetails.breadcrumbs` |
| Category | `ItemList` of product URLs on the page | `@site/catalog/seo` | first page of the listing     |

No `FAQPage`: Google shows FAQ rich results only for government and health sites, and the FAQ stays visible text. No `Product` markup on listings (step 4 adds it to product pages).

## Content and performance

- H1, breadcrumbs, subcategory links, tree links, SEO text, and FAQ are in the static HTML; product cards stream in the same response.
- LCP is the first product photo; photos are `next/image` with fixed aspect ratio; only the tree panel, toolbar, «Показати ще», and mega menu are client code.
- The sitemap lists the hub and every category in the tree for both languages.
