# Admin «Переадресації»

**Status:** implemented. Route: `/site-redirects` (menu «Сайт» → «Переадресації», all staff). Backend: KedrStore Content module, spec `content/013-site-redirects`, contract [site redirects](../../contracts/openapi/openapi.json). Delivery: [SEO stage 3](../../specs/site/migration/seo-stage-3-2026-11-26/README.md).

- The table lists old addresses with their new address and who changed them last, newest first, with search in the toolbar and server paging (10/25/50/100, kept in the address).
- «Додати переадресацію» and the pencil open the right panel «Стара адреса» / «Нова адреса». The old address is a site path or a full URL of the site; the panel shows how it is stored (decoded, lower case, no query or trailing slash). The new address is a site path or an `http(s)` URL. `/`, `/uk`, `/ru`, `/api` and `/_next` are refused.
- The server refuses an old address that already has a redirect, a chain (the new address is itself an old one, or another row leads here), more than 2000 rows, and an edit of a row changed meanwhile (the list reloads). Deleting asks first.
- Old regional pages `/{locale}/region/*` go to the home page in the site code, not in this list.

## Site

[site-core-redirects](../../../libs/site/core/redirects/README.md): the site proxy keeps the list for 5 minutes and answers 301; see [site shell](../site/shell.md).

## Code structure

```text
libs/admin/site-redirects/
├── model/src/entities/site-redirect.ts                 # redirect, draft, page, limits
├── model/src/queries/site-redirect-page-params.ts      # page, size, search in the address
├── model/src/validators/site-redirect-rules.ts         # address checks and lookup path
├── data-access/src/api/admin-site-redirects.api.ts     # list, create, update (version), delete
├── data-access/src/{contracts,validators,mappers}/
├── ui/src/tables/                                      # data grid, columns, toolbar
├── ui/src/panels/site-redirect-panel.tsx               # create and edit form
├── ui/src/dialogs/delete-site-redirect-dialog.tsx
└── feature/src/                                        # page, actions hook, error message, routes
```

## Tests

- `npx nx run admin-site-redirects-model:vite:test -- --run` — page params, address checks.
- `npx nx run admin-site-redirects-data-access:vite:test -- --run` — mapping and request body.
- `npx nx run admin-site-redirects-ui:vite:test -- --run` — panel checks and delete dialog.
- `npx nx run admin-site-redirects-feature:vite:test -- --run` — create, edit with version, delete, refusals.
- `npx nx run site-core-redirects:vite:test -- --run` — lookup key, list cache and failures.
