# 001 — Home page: requirements and scenarios

## Scope

In scope: home page content for `uk` and `ru`, its metadata and structured data, the catalog index and in-stock products from the public API, the redirect from the old `/categories` duplicate, and enabling Cache Components for the whole site.

Out of scope: the mega menu and category pages (step 3), product pages (step 4), cart and the cart counter (step 5), the wholesale page (step 6), search suggestions, and Open Graph images (step 8). Links to these pages are already in their final form; until those steps ship they answer 404 on the preview.

## Rules

- **R-001** The home page states what the business sells (door hardware, wholesale and retail) in its only H1 and opening text, in the page language.
- **R-002** Visitors can search by SKU or name from the first screen; the search goes to the all-products listing with the query.
- **R-003** A wholesale panel lists the partner benefits and leads to the cooperation page and to the phone.
- **R-004** The catalog index shows the top-level categories with their subcategories from the live category tree, in the tree's sort order, all as plain links to category pages. Long subcategory lists show the first eight and a link to the whole category.
- **R-005** The page shows up to eight products in stock with photo, name, retail price (or «price on request»), and a link to the product page.
- **R-006** If the catalog API is unavailable, the page still answers 200 with all static content; the catalog block shows a short notice and a link to all products, and the page retries the data within minutes.
- **R-007** The page is prerendered and cached; catalog data refreshes at least hourly and on the `catalog` tag.
- **R-008** `/{locale}/categories` permanently redirects to `/{locale}`.
- **R-009** Unknown first segments (`/xx`, `/foo/bar`) answer 404 with the site's not-found page, not an empty error document.

## Scenarios

- **SC-001** Given `/uk`, when it is requested, then the HTML has status 200, `lang="uk-UA"`, one H1 «Дверна фурнітура оптом і в роздріб», the title and description from the SEO design, a self canonical, hreflang for `uk-UA`, `ru-UA`, and `x-default`, and WebSite plus Organization JSON-LD. (R-001)
- **SC-002** Given `/ru`, the same holds in Russian with `lang="ru-UA"`. (R-001)
- **SC-003** Given the hero search, when a visitor submits «AGB», then the browser goes to `/{locale}/catalog/products?search=AGB`. (R-002)
- **SC-004** Given the wholesale panel, then it has four benefits, a «Стати партнером» link to `/{locale}/wholesale`, and a `tel:` link. (R-003)
- **SC-005** Given a category tree with a top-level category and twelve children, then the index shows the category link, eight child links in sort order, and a «Усі 12» link to the category. (R-004)
- **SC-006** Given in-stock products, then up to eight cards link to `/{locale}/catalog/product/{slug}`, show the formatted UAH price or «Ціна за запитом», and use a neutral placeholder when the photo is missing or not on the image CDN. (R-005)
- **SC-007** Given the API fails, when the page renders, then status is 200, the catalog block shows the notice and a link to all products, and the failure result is cached for at most a minute before revalidation. (R-006)
- **SC-008** Given the build, then `/uk` and `/ru` are prerendered, catalog data functions use `'use cache'` with `cacheLife('hours')` and the `catalog` tag. (R-007)
- **SC-009** Given `/uk/categories`, then the response is a permanent redirect to `/uk`. (R-008)
- **SC-010** Given `/xx` or `/foo/bar`, then the response is 404 with the not-found heading and `noindex`. (R-009)

## Company concept — owner decision 2026-11-03

- **R-010** Below the existing catalog, both home locales show the approved company overview, four partner support items, six advantages, company results, six original brand logos, and six FAQ answers. Existing hero, catalog, SEO and API failure behavior remain supported.
- **R-011** Results use the Storefront CompanyStats source: 15+ years, 15 000+ units of product, 50 000+ equipped properties, 1 000+ project shipments per year. No dynamic increments or invented figures.
- **R-012** The first FAQ answer is expanded initially; visitors can open and close answers with native keyboard controls, including before JavaScript loads. Manager contact uses the company's configured phone. Disclosure and the plus/minus indicator transition gently over 200 ms; reduced-motion disables transitions. Browsers without the CSS content-slot animation retain native disclosure.
- **SC-011** Given either home language and even an unavailable catalog, when the page loads, then all company sections, six benefits, six brands and the four sourced results appear in that language. Component test.
- **SC-012** Given the FAQ, when the page loads, then all six questions and answers are in the HTML, the first answer is expanded, and the manager call link uses the company phone. Visitors can toggle answers with the native disclosure control. Component markup check; browser behavior is native and requires no custom handler.

## Home as the company page — owner decision 2026-11-03

- **R-013** The home is also the company page. Header, mobile menu and footer company links target the same-language home overview at #about-company. Old localized /about-company addresses redirect permanently (308) to the corresponding home; canonical and sitemap contain only the home URL.
- **SC-013** Given either language and any page, when the visitor follows the company link from the header, phone menu or footer, then it targets that language's home company overview. Component checks for both languages and the anchor target.
- **SC-014** Given /uk/about-company or /ru/about-company, when requested, then the maintained Next.js redirect map resolves permanently to /uk or /ru respectively. No duplicate company route, canonical or sitemap entry exists. Configuration assertions and existing SEO tests.
