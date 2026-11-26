# Final architecture audit: SEO stage 2

- **Date:** 2026-11-26. **Scope:** the working-tree diff of this stage (admin categories, articles, company contacts, media picker; site catalog, product, content, core config and SEO, shared company; contract snapshot; docs).
- **Sources:** [code organization](../../../../../standards/shared/code-organization.md), [idempotency rules](../../../../../standards/shared/idempotency-rules.md), [contracts](../../../../../contracts/README.md), [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md), KedrStore `docs/sdd/architecture/overview/quality-targets.md`.
- **Method:** static review of every changed file, `npm run architecture:structure`, `npm run architecture:boundaries`, lint, typecheck and focused tests of the changed projects. No browser, build or E2E (not permitted without the owner's separate consent).

## Step 0: quality targets

The client targets live in KedrStore `quality-targets.md`. This stage adds no request on a hot path of the public site: the category tree for the sitemaps is the same cached request as the menu, the product sitemap adds that one cached read, and the contacts page renders one more JSON-LD block from data it already loads. No speed verdict is given beyond that.

## Findings

| ID    | Severity | Path and evidence                                                                                                                                                 | Rule                                                                                                                                                             | Owner              | Status                                                                                                         |
| ----- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------- |
| AF-01 | low      | `libs/admin/categories/feature/src/hooks/use-category-site-names.ts`, `use-category-search-settings.ts`: `submit` relied only on the disabled button while saving | Idempotency rules: every mutation has a pending lock; both are `PUT` with the same body, so a repeat changes nothing, but a second request is still sent         | categories feature | verified: `submit` returns while `isLoading`; categories feature tests pass                                    |
| AF-02 | low      | `libs/admin/media/data-access/src/hooks/use-media-picker.ts` sat in a `hooks` folder, which data access does not allow                                            | Code organization: role folders (`architecture:structure` reported `role-folder`)                                                                                | media data access  | verified: moved to `api/use-media-picker.ts`; structure check passes                                           |
| AF-03 | low      | `admin-categories-feature` imports `admin-media-data-access` and `admin-media-ui` without a documented flow                                                       | Project boundaries: cross-domain flows are documented                                                                                                            | categories feature | verified: flow added to `tools/architecture/project-boundary-rules.mjs` with its reason; boundary check passes |
| AF-04 | low      | No end-to-end test opens the category edit panel, «Контакти» or the sitemaps                                                                                      | Feature review list: main path covered by an end-to-end test; component and loader tests cover the forms, the noindex rules, the sitemap filtering and `lastmod` | owner decision     | deferred: E2E runs only with the owner's separate consent                                                      |
| AF-05 | low      | `contracts:drift` fails until KedrStore #276 merges: the snapshot is synced from the backend branch                                                               | Contracts follow backend `master` (ADR-0004)                                                                                                                     | delivery           | open until #276 merges; then re-sync from `master`                                                             |

## Review list

- Access: the new admin actions use the existing edit rights (`useCanEditCatalog` for categories, `CanManageContent` for articles and contacts); the backend checks the same policies (`CanManageSiteCatalog`, `CanManageContent`).
- Double submit: every new save has a pending lock (AF-01); no new mutation takes an idempotency key.
- Server/client boundary: all new site code is server-side (metadata, sitemaps, JSON-LD); no new client component.
- File size and folders: no changed production file over its limit; the structure check reports no new deviation.
- Feature cards and maps: admin categories, articles, company contacts; site catalog, product, articles, contacts, company contacts; SEO architecture updated.
