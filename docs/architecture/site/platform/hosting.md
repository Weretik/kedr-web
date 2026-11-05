# Hosting — site

**Checked:** 2026-11-05
**Sources:** `apps/site/open-next.config.ts`, `apps/site/wrangler.jsonc`, `apps/site/project.json`, `libs/site/core/config/src/lib/site-config.ts`

The public site runs on Cloudflare Workers through the OpenNext adapter (`@opennextjs/cloudflare`, owner decision 2026-10-30). It is a separate Worker, `kedr-site`. The Angular storefront keeps its Cloudflare Pages project `kedr-web` until the domain cutover, and the API proxy Worker on `api.classkedr.com.ua` is not touched.

## Build and deploy

| Target                               | Command (cwd `apps/site`)       | Use                                                                     |
| ------------------------------------ | ------------------------------- | ----------------------------------------------------------------------- |
| `npx nx run site:build-cloudflare`   | `opennextjs-cloudflare build`   | `next build` in standalone mode, then the Worker bundle in `.open-next` |
| `npx nx run site:preview-cloudflare` | `opennextjs-cloudflare preview` | build output in the local Workers runtime (`wrangler dev`, port 8787)   |
| `npx nx run site:deploy-cloudflare`  | `opennextjs-cloudflare deploy`  | fills the KV cache with prerendered data and deploys the Worker         |

- Cloudflare Workers Builds is connected to `Weretik/kedr-web`: root directory empty (workspace root), build command `npx nx run site:build-cloudflare`, deploy command `npx nx run site:deploy-cloudflare`. Node comes from `.nvmrc`.
- `apps/site` has no `package.json`, so `open-next.config.ts` sets `buildCommand` to run `next build` from `apps/site`.
- The build reads the live catalog API: `generateStaticParams` and sitemaps need real categories and products, so a build without API access fails.

## Cache

`'use cache'` data and prerendered pages need a persistent incremental cache on Workers. With the default dummy cache every page render hung until the runtime cancelled it (checked locally 2026-11-05).

| Part               | Binding                 | Store                       |
| ------------------ | ----------------------- | --------------------------- |
| Incremental cache  | `NEXT_INC_CACHE_KV`     | Workers KV                  |
| Tag cache          | `NEXT_TAG_CACHE_KV`     | Workers KV                  |
| Revalidation queue | `WORKER_SELF_REFERENCE` | in-memory queue per isolate |

KV fits the free plan. The namespaces are `kedr-site-cache` and `kedr-site-tags`; their IDs must be in `wrangler.jsonc` before the first deploy, because `deploy` writes the cache before it uploads the Worker. KV is eventually consistent (up to about 60 s between locations), which is acceptable for catalog data. R2 + D1 can replace it later without code changes.

Known risk: opennextjs-cloudflare issue #1464 reports hung requests from cross-request `'use cache'` dedupe on deployed Workers. Check the preview under parallel requests before the cutover.

## Images

`next/image` uses the `IMAGES` binding (Cloudflare Images transformations; the free plan includes 5,000 unique transformations a month). Remote hosts are limited by `images.remotePatterns` in `next.config.ts`.

## Environment

| Variable                 | Where             | Preview                                | Production after cutover                          |
| ------------------------ | ----------------- | -------------------------------------- | ------------------------------------------------- |
| `KEDR_API_URL`           | build and runtime | default `https://api.classkedr.com.ua` | same                                              |
| `SITE_URL`               | build and runtime | default `https://classkedr.com.ua`     | same                                              |
| `SITE_ENV`               | build and runtime | unset (development, noindex)           | `production`                                      |
| `SITE_INDEXING`          | build and runtime | unset                                  | `true`                                            |
| `KEDR_REVALIDATE_SECRET` | runtime secret    | optional                               | same value as KedrStore `SiteRevalidation:Secret` |

`robots.txt` and other prerendered output are built once, so indexing variables must be set for the build as well as for the runtime. `wrangler.jsonc` has `keep_vars: true`, so a deploy keeps variables set in the dashboard.

## Domain cutover

Step 9 of the [migration plan](../../../specs/site/migration/README.md): remove `classkedr.com.ua` (and `www`) from the Pages project's custom domains, add them to the `kedr-site` Worker, then set the production variables and redeploy. Rollback is the reverse move of the custom domain.
