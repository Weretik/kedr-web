# 001 — Category page: requirements and scenarios

## Scope

In scope: the category page, the catalog hub, the search page, the header mega menu and category links from the live tree, catalog redirects from the old addresses, metadata, structured data, and category entries in the sitemap.

Out of scope: the product page (step 4; product links already use `/{locale}/product/{slug}` and answer 404 until then), the cart and «У кошик» buttons (step 5), facet counts for «Акція» and «Новинки» (the API has none), brand and coating filters, the revalidation webhook (step 8).

## Rules

- **R-001** `/{locale}/catalog/{slug}` shows the category named by its current slug: breadcrumbs, the H1 (the admin H1 or the category name), the product count, and links to its direct subcategories with counts.
- **R-002** A former slug permanently redirects to the current one; a deleted category with an active ancestor permanently redirects to that ancestor; an unknown slug answers 404.
- **R-003** Products of the category and its descendants are listed 20 per page by default (20, 50, or 100 by the visitor's choice; default changed from 50 to 20 by the owner on 2026-11-01), products in stock first; each shows photo, SKU, name, stock state, badges «Акція» and «Новинка», and the retail price or «Ціна за запитом».
- **R-004** Visitors can filter by «Тільки в наявності», «Акція», «Новинки», and a price range, sort (in stock first, cheaper, more expensive, newest, A→Я), and switch grid and table view. Every choice lives in the URL; an empty result says so and offers to reset filters.
- **R-005** Page numbers and the page-size choice (20 / 50 / 100) are plain links under the list with «Показано X–Y з N»; «Показати ще» was removed (owner decision 2026-11-01).
- **R-006** Under the H1 the page shows category chips: the subcategories, or, for a category without them, its siblings with the current one marked. There is no tree panel; main sections are in the header (owner decision 2026-11-01, following the concept design; replaces the tree panel).
- **R-007** Below the list the page shows the administrator's SEO text and FAQ for the page language; without content the block is absent.
- **R-008** The header «Каталог» button opens the mega menu: a left rail with top-level sections (doors last, separated), the hovered or focused section's subcategories in columns with their children, a «Усі товари розділу» link, the wholesale panel, and a category search over the whole tree. Every link is in the server HTML.
- **R-009** The header category row and the phone menu list the live top-level sections; if the API is unavailable they fall back to the built-in list.
- **R-010** `/{locale}/catalog` lists every section with its subcategories; `/{locale}/search?q=` lists matching products with the same filters, sorting, and pagination and is never indexed. The header and home search go to the search page.
- **R-011** Old addresses redirect permanently: `/{locale}/catalog/{slug}/products` → `/{locale}/catalog/{slug}`, `/{locale}/catalog/products` → `/{locale}/catalog` (with `search` → `/{locale}/search?q=`), `/{locale}/catalog/product/{slug}` → `/{locale}/product/{slug}`.
- **R-012** If the API is unavailable the category page answers 500 with the site frame, a short notice, and a retry button; the failed read is cached for at most a minute. A listing that fails after the category loaded shows a notice in place of the products.

## Scenarios

- **SC-001** Given `/uk/catalog/ruchky`, then the HTML has status 200, breadcrumbs Головна › Каталог › Ручки, one H1, the count, category chips, the filter column, and 20 product cards, in stock first. (R-001, R-003, R-006)
- **SC-002** Given a former slug, then the response is a permanent redirect to the current slug; given a deleted category whose parent is active, a permanent redirect to the parent; given an unknown slug, 404 with the site's not-found page. (R-002)
- **SC-003** Given «Тільки в наявності» and «Акція» checked, sort «Дешевші», then the URL is `?inStock=true&isSale=true&sort=price-asc` and the list shows only matching products cheapest first. (R-004)
- **SC-004** Given page 1 of 3, when the visitor picks «100», then the URL has `perPage=100`, page 1 shows 100 products, the summary says «Показано 1–100 з …», and the page is not indexed; page links stay plain links. (R-005)
- **SC-005** Given the table view, then rows show SKU, name, stock, and price, and the URL has `view=table`. (R-004)
- **SC-006** Given a category without subcategories under «Завіси», then its chips are the other «Завіси» subcategories with the current one marked. (R-006)
- **SC-007** Given administrator content, then the SEO text and the FAQ items render below the list; without it nothing renders. (R-007)
- **SC-008** Given the mega menu open, when the visitor types «завіс», then matching categories at any depth are listed as links; when the search is empty, hovering «Замки» shows its subcategories. (R-008)
- **SC-009** Given `/uk/catalog/zamki-900002/products`, then the response is a permanent redirect to `/uk/catalog/zamki-900002`, which then redirects to the current slug. (R-011, R-002)
- **SC-010** Given `/uk/search?q=AGB`, then matching products are listed and the page has `noindex, follow`. (R-010)
- **SC-011** Given the API fails, then the category page answers 500 with the site frame and a retry button; the header falls back to the built-in sections. (R-009, R-012)
