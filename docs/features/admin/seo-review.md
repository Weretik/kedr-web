# Admin «SEO-огляд»

**Status:** implemented. Route: `/seo-review` (menu «Сайт» → «SEO-огляд», all staff). Backend: KedrStore spec `platform/010-seo-review`, `GET /api/admin/catalog/seo-review` (Seo, Admin) and `GET /api/admin/content/seo-review` (all staff). Delivery: [SEO stage 3](../../specs/site/migration/seo-stage-3-2026-11-26/README.md).

- One table of site pages that need work, one row per page and language: categories shown on the site, accepted models in them, and published articles. Issues: «Немає тексту», «Немає опису», «Довгий заголовок» (over 70), «Довгий опис» (over 160), «Однаковий заголовок».
- Filters: kind of page and one issue chip with its count; both stay in the address (`?kind=&issue=`), so returning from an editor keeps them.
- The pencil opens the editor: a category's page, a model's page, or the article editor.
- A manager sees only articles: the catalog review needs the catalog edit right, and its request is not sent.
- The list is asked again on every visit; nothing is cached between visits.

## Code structure

```text
libs/admin/seo-review/
├── model/src/entities/seo-review-item.ts            # kinds, issues, labels
├── model/src/queries/seo-review-filter.ts           # filter, order, counts, editor path
├── model/src/queries/seo-review-filter-params.ts    # filter in the address
├── data-access/src/api/admin-seo-review.api.ts      # catalog and content reviews
├── data-access/src/{contracts,validators,mappers}/
├── ui/src/tables/                                   # table, columns, filters
└── feature/src/                                     # page, merge hook, createSeoReviewRoutes
```

## Tests

- `npx nx run admin-seo-review-model:vite:test -- --run` — order, filters, counts, editor paths, address.
- `npx nx run admin-seo-review-data-access:vite:test -- --run` — unknown kinds, languages and issues.
- `npx nx run admin-seo-review-ui:vite:test -- --run` — row issues, edit action, retry, chips.
- `npx nx run admin-seo-review-feature:vite:test -- --run` — merge, manager without catalog, filter from the address.
