# 002 — Full-stack E2E in CI

- **Surfaces:** React Admin, Next.js site, KedrStore API (test database)
- **Status:** implemented; first green run in GitHub Actions is the acceptance evidence
- **Owner:** frontend
- **Updated:** 2026-11-16

Unit, component and contract tests prove each side alone. Nothing proved that the Admin and the site still work
against the real API and database: a renamed field, a broken migration or a cookie change could pass every check
and still leave an empty page. This feature adds a small set of browser tests that run the whole chain in GitHub
Actions, without Claude and without touching production.

## Requirements

| ID  | Requirement                                                                                                                                                            |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-1 | Tests run in GitHub Actions only, against an API built from KedrStore source and an empty PostgreSQL in the job.                                                       |
| R-2 | No production data or service: no 1C, Telegram, CDN/FTP or production database settings are given to the API.                                                          |
| R-3 | At most 6–10 tests, critical journeys only; anything checkable at a lower level stays there ([testing rules](../../../standards/shared/testing-rules.md)).             |
| R-4 | A failure keeps a screenshot, a video, a Playwright trace and the API log as a downloadable artifact.                                                                  |
| R-5 | The check does not slow ordinary pull requests: it runs only when the Admin, the site, shared libraries, the contract or the tests change, plus nightly and on demand. |
| R-6 | A backend change that breaks a frontend is found within a day even when no frontend pull request is open.                                                              |

## Scenarios

| ID   | Journey                                                                                                                                 | Test                                |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| SC-1 | A manager is refused with a wrong password and reaches the dashboard with the right one.                                                | `src/admin/sign-in.spec.ts`         |
| SC-2 | A manager changes a product's site address in the right-side panel.                                                                     | `src/admin/product-address.spec.ts` |
| SC-3 | A category heading saved in the Admin appears on the site after «Оновити сайт зараз» (Admin → API → database → site revalidation).      | `src/admin/category-texts.spec.ts`  |
| SC-4 | A manager creates a site model from a product that has none.                                                                            | `src/admin/site-model.spec.ts`      |
| SC-5 | A visitor goes from the catalog to a category, sees prices, and the «Тільки в наявності» filter hides the product that is out of stock. | `src/site/catalog.spec.ts`          |
| SC-6 | A visitor adds a product to the cart from its page and sends a quick order without signing in.                                          | `src/site/quick-order.spec.ts`      |

## Design

- **Project.** `apps/stack-e2e` (Nx, Playwright, Chromium). Three Playwright projects: `admin-session` signs in once
  and saves the cookies, `admin` reuses them, `site` runs after `admin` because SC-3 refreshes the site cache.
  One worker and no retries: all tests share one database, and a retry would meet data the first attempt changed.
- **Servers.** Playwright starts the Admin (`admin:serve`, `VITE_API_BASE_URL` points at the API) and the site
  (`next start` of a production build, `KEDR_API_URL` points at the API). The API listens on
  `http://localhost:5081`; Chromium treats localhost as secure, so the production cookie settings work unchanged,
  only the CSRF cookie domain is emptied.
- **Data.** KedrStore `Host.Jobs --job=migrate` creates the schema and the administrator from
  `ADMIN_DEFAULT_PASSWORD`. Products normally come only from 1C, so `fixtures/catalog.sql` inserts two categories and
  two products (ids 700001+, one in stock, one not) with their prices and list projection. The fixture follows the
  KedrStore schema; a schema change that breaks it fails the «Seed the test catalog» step with a clear SQL error.
- **Workflow.** [`.github/workflows/e2e.yml`](../../../../.github/workflows/e2e.yml): Postgres service container →
  checkout KedrStore (`master`, or `backend-ref` on a manual run) → `dotnet publish` of `Host.Jobs` and `Host.Api` →
  migrate → fixture → API in the background → `nx build site` → `npm run test:stack:e2e` → artifact on failure.
  Triggers: pull requests with the paths of R-5, nightly at 01:30 UTC (R-6), and manual. It is not a required check
  yet; make it required in the branch rules once it has stayed green for a while.

## Run locally

Start PostgreSQL, run the KedrStore migrate job with `ADMIN_DEFAULT_PASSWORD` on an empty database, apply
`apps/stack-e2e/fixtures/catalog.sql`, start `Host.Api` on `http://localhost:5081` with the settings of the
«Start the API» step, build the site with `KEDR_API_URL=http://localhost:5081 npx nx build site`, then
`E2E_ADMIN_PASSWORD=<the same password> npm run test:stack:e2e`. A second run needs a fresh database.

## Evidence

- 2026-11-16, local, fresh database: all 7 tests (setup + SC-1…SC-6) passed in about 30 s.
- First GitHub Actions run: see the pull request that added this feature.

## Findings while writing the tests

- The site product page asks for price type 11 while lists and the catalog use the retail price type 12
  (`Catalog:Pricing:RetailPriceTypeId`). With only type 12 a product shows a price in the list and «Ціна за запитом»
  on its page. The fixture seeds both; whether type 11 is intended is a product question, not changed here.
