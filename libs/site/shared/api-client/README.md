# site-shared-api-client

Server-only `fetch` wrapper for `apps/site` over the KedrStore OpenAPI contract (`@shared/api-contracts`, same snapshot as Admin and Mobile). See [data access](../../../../docs/architecture/site/platform/rendering-and-caching.md#data-access).

- `siteApiGet(path, { path, query, tags, revalidate })` — typed GET limited to public `/api/catalog/*` operations; base URL from `site-core-config`; sorted query for stable cache keys; Next.js cache tags.
- `ApiResult` — `ok`, `not-found`, `gone`, `unavailable`; features turn these into `notFound()`, 410, or an error state.

Domain `data-access` libraries call it and map DTOs to their `model`; generated types never leave `data-access`. The module imports `server-only`, so a client component that imports it fails the build.

Tests: `npx nx run site-shared-api-client:vite:test -- --run`.
