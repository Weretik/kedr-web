# Final architecture audit: SEO stage 3

- **Date:** 2026-11-26. **Scope:** the working-tree diff of this stage (admin site-redirects and seo-review libraries, admin router and menu, site core redirects, site proxy and `next.config.mjs`, contract snapshot, docs).
- **Sources:** [code organization](../../../../../standards/shared/code-organization.md), [idempotency rules](../../../../../standards/shared/idempotency-rules.md), [list and detail pages](../../../../../standards/admin/list-detail-pages.md), [contracts](../../../../../contracts/README.md), [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md), KedrStore `docs/sdd/architecture/overview/quality-targets.md`.
- **Method:** static review of every changed file, `npm run architecture:structure`, `npm run architecture:boundaries`, lint, typecheck (also of the spec files) and focused tests of the changed projects. No browser, build or E2E (not permitted without the owner's separate consent).

## Step 0: quality targets

The client targets live in KedrStore `quality-targets.md`. The proxy now runs for every page path: a warm worker answers from memory, a stale copy is answered at once and refreshed in the background, and only the first request of a new worker waits for the list, at most 1.5 s (AF-03). The admin pages add two reads and the redirect list; nothing on the public render path changes otherwise.

## Findings

| ID    | Severity | Path and evidence                                                                                                                          | Rule                                                                             | Owner                  | Status                                                                                                         |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| AF-01 | low      | `libs/admin/site-redirects/feature/src/hooks/use-site-redirect-actions.ts`: `save` and `confirmDelete` relied only on the disabled buttons | Idempotency rules: every mutation has a pending lock                             | site-redirects feature | verified: both return while their request runs; feature tests pass                                             |
| AF-02 | low      | `libs/admin/core/shell/src/navigation/navigation-groups.tsx` reached 152 lines with the two new menu items, and the folder held six files  | Code organization: component files under 150 lines, at most six files per folder | admin core shell       | verified: split into `navigation/menu/` (items, item types) and `navigation/drawer/`; structure check passes   |
| AF-03 | low      | `apps/site/src/proxy.ts`: the first page request of a new worker waits for `GET /api/content/redirects` (timeout 1.5 s)                    | Quality targets: a public page must not wait on a slow API                       | site                   | accepted: needed so an old address never shows 404; a failure keeps no redirects for 30 s and the page renders |
| AF-04 | low      | No end-to-end test opens «Переадресації» or «SEO-огляд», or follows a 301 on the site                                                      | Feature review list: main path covered by an end-to-end test                     | owner decision         | deferred: E2E runs only with the owner's separate consent                                                      |
| AF-05 | low      | `contracts:drift` fails until the KedrStore pull request merges: the snapshot is synced from the backend branch                            | Contracts follow backend `master` (ADR-0004)                                     | delivery               | open until the backend merges; then re-sync from `master`                                                      |

## Review list

- Access: «Переадресації» is open to all staff, as `CanManageContent`; «SEO-огляд» sends the catalog request only for roles that may edit the catalog (`useCanEditCatalog`, backend `CanManageSiteCatalog`).
- Double submit: create, edit and delete have a pending lock (AF-01); edit sends the row version; no idempotency key is needed (natural key on the backend).
- Server/client boundary: the site change is the proxy and a server-free utility library (`site-core-redirects`) that does not import `server-only` modules; no client component.
- Boundaries: new libraries carry `scope:admin`/`scope:site` and `type:*` tags; the boundary check passes; no new cross-domain flow.
- File size and folders: no changed production file over its limit; the structure check reports no deviation.
- Feature cards and maps: admin «Переадресації» and «SEO-огляд», site shell, feature catalog, site modules and SEO architecture updated.
