# SEO stage 3: redirects and SEO review

**Status:** implemented 2026-11-26. Backend: KedrStore specs `content/013-site-redirects` and `platform/010-seo-review`. Stage 1 is kedr-web #151, stage 2 kedr-web #153.

## Owner decisions (2026-11-26)

- «Переадресації»: the admin keeps a list of old addresses that answer 301 to a new one. The old regional pages `/{locale}/region/*` go to the home page of the same language.
- «SEO-огляд»: one admin page lists site pages without text, without description, with a long title or a repeated title, as in Brevi.

## Requirements

| ID   | Requirement                                                                                                                                                                                                                                                                                                  | Where |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| R-01 | Admin «Переадресації» (`/site-redirects`, menu «Сайт», all staff): a server-paged table with search, «Додати переадресацію», the pencil and the delete icon. Create and edit in the right panel; deleting asks first.                                                                                        | Admin |
| R-02 | The panel checks the old address (a site path or a full URL of the site, not `/`, `/uk`, `/ru`, `/api`, `/_next`) and the new one (a site path or an `http(s)` URL) before sending, shows how the old address is stored, and shows the server's Ukrainian refusals (taken, chain, limit, changed meanwhile). | Admin |
| R-03 | Every save has a pending lock; editing sends the row version and a 409 reloads the list.                                                                                                                                                                                                                     | Admin |
| R-04 | The site proxy answers 301 for a stored old address. It keeps the list from `GET /api/content/redirects` in memory for 5 minutes, answers a stale copy at once while a new one loads, keeps the last copy when the API fails, and waits at most 1.5 s for the first load.                                    | Site  |
| R-05 | The lookup matches the backend key: decoded, lower case, no query, no trailing slash; a redirect back to the same address is ignored.                                                                                                                                                                        | Site  |
| R-06 | `/{locale}/region/*` → `/{locale}` and `/region/*` → `/uk`, both 301, in `next.config.mjs`.                                                                                                                                                                                                                  | Site  |
| R-07 | Admin «SEO-огляд» (`/seo-review`, menu «Сайт», all staff): one table of categories, models and articles per language with their issues; a filter by kind and by issue (chips with counts) kept in the address; the pencil opens the page's editor.                                                           | Admin |
| R-08 | Catalog pages are reviewed only for Seo and Admin (backend `CanManageSiteCatalog`); a manager sees articles only, and the catalog request is not sent.                                                                                                                                                       | Admin |
| R-09 | Unknown kinds, languages and issues from a newer backend are skipped, not shown as broken rows.                                                                                                                                                                                                              | Admin |

## Repeated submits

Redirect create, edit and delete are reference data with a natural key (the old address, unique index on the backend): a second create is refused with «Ця стара адреса вже має переадресацію», an edit carries the row version, a delete is idempotent. The client lock while pending is enough; no idempotency key ([idempotency rules](../../../../standards/shared/idempotency-rules.md)).

## File-role map

| Role                    | Files                                                                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Redirects: model        | `libs/admin/site-redirects/model/src/{entities/site-redirect.ts,queries/site-redirect-page-params.ts,validators/site-redirect-rules.ts}`                                                        |
| Redirects: data access  | `libs/admin/site-redirects/data-access/src/{contracts,validators,mappers,api}`                                                                                                                  |
| Redirects: UI           | `libs/admin/site-redirects/ui/src/{tables/site-redirects-*.tsx,panels/site-redirect-panel.tsx,dialogs/delete-site-redirect-dialog.tsx}`                                                         |
| Redirects: feature      | `libs/admin/site-redirects/feature/src/{pages/site-redirects-page.tsx,hooks/use-site-redirect-actions.ts,errors/site-redirect-error-message.ts,site-redirects.routes.tsx}`                      |
| SEO review: model       | `libs/admin/seo-review/model/src/{entities/seo-review-item.ts,queries/seo-review-filter.ts,queries/seo-review-filter-params.ts}`                                                                |
| SEO review: data access | `libs/admin/seo-review/data-access/src/{contracts,validators,mappers,api}`                                                                                                                      |
| SEO review: UI          | `libs/admin/seo-review/ui/src/tables/{seo-review-table.tsx,seo-review.columns.tsx,seo-review-filters.tsx}`                                                                                      |
| SEO review: feature     | `libs/admin/seo-review/feature/src/{pages/seo-review-page.tsx,hooks/use-seo-review.ts,seo-review.routes.tsx}`                                                                                   |
| Admin composition       | `apps/admin/src/app/router/app-router.tsx`, `libs/admin/core/shell/src/navigation/menu/navigation-groups.tsx` (menu split into `menu/` and `drawer/` to stay within the folder and size limits) |
| Site redirects          | `libs/site/core/redirects/src/lib/{redirect-lookup.ts,redirect-list.ts}`, `apps/site/src/proxy.ts`, `apps/site/next.config.mjs`                                                                 |

## Verification

- Focused Vitest suites pass: admin site-redirects (model, data-access, ui, feature), admin seo-review (model, data-access, ui, feature), admin core shell, site core redirects.
- `typecheck` and `lint` of the changed projects (with `admin` and `site`), `npm run architecture:structure`, `npm run architecture:boundaries`, `npm run docs:check` pass.
- Contract synced from the backend branch; `contracts:drift` stays red until the KedrStore pull request merges, then the branch re-syncs from `master`.
- Not run (needs separate permission): browser, build, E2E.
- Final architecture audit: [code-audit/audit.md](code-audit/audit.md).
