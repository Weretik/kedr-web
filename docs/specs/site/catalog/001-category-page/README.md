# 001 — Site category page, catalog navigation, and search

- **Client:** Next.js public site (`apps/site`)
- **Architecture:** [site architecture](../../../../architecture/site/README.md), [SEO rules](../../../../standards/site/seo-rules.md), [design system](../../../../standards/site/design-system.md)
- **Domains:** catalog (category tree, category page, product listing, search, mega menu)
- **Status:** implemented 2026-11-01, in review
- **Plan step:** 3 of the [migration plan](../../migration/README.md)
- **Backend:** KedrStore spec 005 (stable slugs, slug history, category content and FAQ, public counts) is live; no contract change is needed.

The category page `/{locale}/catalog/{slug}` shows a category's products with the category tree, filters, sorting, grid or table view, pagination with «Показати ще», and the SEO text and FAQ that administrators write in the Admin. The header gets the approved mega menu (variant A) with category search, the catalog hub `/{locale}/catalog` and the search page `/{locale}/search` appear, and the old storefront catalog addresses redirect permanently.

Approved mockups: «Kedr: каталог и мега-меню» canvas (2026-10-30). Owner decisions: [catalog step decisions](#owner-decisions).

- [Requirements and scenarios](requirements/behavior.md)
- [Frontend and Next.js design](design/frontend.md)
- [SEO design](design/seo.md)
- [Tasks](tasks/README.md)
- [Traceability](traceability.md)

## Owner decisions

2026-10-30, from the catalog analysis and mockup review:

- Flat addresses: `/{locale}/catalog/{slug}`, `/{locale}/product/{slug}`, hub `/{locale}/catalog`, search `/{locale}/search?q=` (`noindex`); permanent redirects from the old storefront addresses. Filtered pages are `noindex`.
- All products are shown, products in stock first; a product without stock is «Немає в наявності».
- Category tree panel: only the current path open (changed 2026-11-01 from «all levels expanded»), other branches open on click, state remembered, panel can be hidden. Subcategory chips only on phones; the toolbar is one thin row.
- Mega menu: variant A (left rail with sections, subcategory columns) with category search; doors as a separate rail item.
- No brand or coating filters (1C has no such fields). SKU (the 1C product code) on cards and in the table. 24 per page, «Показати ще», and page numbers.
- No sign-in on the category page; retail prices only.

## Changes

- 2026-11-01 — created; implementation started on the owner's request.
- 2026-11-01 — implemented. Changes from the first draft: the shown range («Показано 1–48 з …») sits under the list next to «Показати ще»; an unavailable API answers 500 inside the site frame instead of a 200 notice; the pluralization helper moved to `site-core-i18n`.
