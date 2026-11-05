# Admin «SEO сторінок»

**Status:** implemented. Route: `/page-seo` (menu «Сайт» → «SEO сторінок», all staff). Backend: KedrStore Content module, contract [search texts of the site pages](../../contracts/openapi/content/page-seo.openapi.yaml).

- The list shows the eleven site pages that exist once, in menu order (home, catalog, «Співпраця», delivery, returns, contacts, gallery, articles, requisites, offer, privacy) with their address and the Ukrainian title and description an editor set; a page without them says «Тексти сайту».
- The edit icon opens the right side panel: SEO title (up to 120 characters, Google usually shows about 60) and SEO description (up to 300, about 160 shown) in Ukrainian and Russian. Every field may stay empty: the site then keeps the text it has in code. «Змінено: хто, коли» under the fields.
- Categories keep their SEO in [Categories](categories.md), articles use their own title and excerpt; search and checkout are never indexed and are not in the list.

## Site

[site-shared-page-seo](../../../libs/site/shared/page-seo/src/index.ts) reads `GET /api/content/{lang}/page-seo` (`'use cache'`, tags `content`, `content:page-seo`, ten-minute life); a failed read gives no texts. Each route's `generateMetadata` wraps its code metadata in `withPageSeo(locale, page, metadata)`, which replaces only the set title and description, also in Open Graph, and keeps an absolute title absolute. The articles list uses them only for the plain list, not for a search or a later page.

## Code structure

```text
libs/admin/page-seo/
├── model/src/entities/page-seo.ts            # site pages with labels and addresses, texts, limits
├── model/src/validators/page-seo-rules.ts    # length checks; empty is allowed
├── data-access/src/api/admin-page-seo.api.ts # list, save one page (replaces its cached row)
├── data-access/src/{contracts,validators,mappers}/
├── ui/src/list/page-seo-list.tsx             # pages with their texts
├── ui/src/panel/page-seo-panel.tsx           # uk/ru title and description
└── feature/src/                              # pageSeoRoutes, page, error message
libs/site/shared/page-seo/src/lib/            # loader, cache tags, applyPageSeo, withPageSeo
```

## Tests

- `npx nx run admin-page-seo-model:vite:test -- --run` — limits, empty allowed.
- `npx nx run admin-page-seo-data-access:vite:test -- --run` — menu order, unknown pages, trimmed request with null for empty.
- `npx nx run admin-page-seo-ui:vite:test -- --run` — list texts and edit action.
- `npx nx run admin-page-seo-feature:vite:test -- --run` — save from the panel, limit, refusal.
- `npx nx run site-shared-page-seo:vite:test -- --run` — loader and metadata replacement.
