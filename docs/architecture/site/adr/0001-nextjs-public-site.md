# ADR-0001: Next.js App Router for the public storefront

**Status:** accepted
**Decision date:** 2026-10-29
**Owners:** product owner, frontend
**Applications:** new `apps/site`; replaces `apps/storefront` after cutover
**Related:** [design idea](../../../ideas/storefront-nextjs/README.md), [migration plan](../../../specs/site/migration/README.md), [SEO architecture](../platform/seo-architecture.md)

## Context

The Angular 21 storefront prerenders category pages at build time and renders product pages only in the browser: on Cloudflare Pages a Worker serves `index.csr.html` for `/uk|ru/catalog/product/{slug}`, so crawlers get an empty template. Every page has the same `<title>Class Kedr</title>`, `<html lang="en">`, no description, no `robots.txt`, no sitemap, and no structured data; unknown URLs redirect to `/uk/404` instead of answering 404. The owner wants a modern, minimal design (shadcn/ui) and strong SEO, and Admin and Mobile already use React.

## Options

| Option                                                | Complexity     | Apps and boundaries                                   | Performance                                       | Team familiarity                   | Risks                                             | Evidence                                           |
| ----------------------------------------------------- | -------------- | ----------------------------------------------------- | ------------------------------------------------- | ---------------------------------- | ------------------------------------------------- | -------------------------------------------------- |
| Keep Angular, add SSR for products, metadata, sitemap | medium         | Storefront only                                       | good with SSR; PrimeNG bundle stays               | Angular only in this app           | two UI stacks remain; design rebuild still needed | current code                                       |
| Next.js App Router, new `apps/site`                   | high (rebuild) | new app and `libs/site/*`; Angular kept until cutover | Server Components, ISR, `next/image`, `next/font` | React shared with Admin and Mobile | parallel apps during migration; hosting choice    | `nextjs-seo-site` rules, owner decision 2026-10-26 |
| Vite React SPA                                        | low            | —                                                     | poor for SEO without SSR                          | high                               | crawlers see empty pages                          | —                                                  |

## Decision and reason

Build the public storefront as a new Next.js App Router application `apps/site` with shadcn/ui on Radix UI and Tailwind CSS v4, server-rendered pages, and the same OpenAPI contract mechanism as other clients. Migrate features one by one into it, keep the current URLs, and switch the domain only when every indexed page type exists. One React stack across clients and first-class SEO primitives (metadata API, sitemaps, ISR, structured data in server HTML) outweigh the cost of the rebuild.

## Consequences and verification

- Simpler: per-route rendering and metadata, real 404 status, React skills shared with Admin and Mobile.
- Harder: two storefronts live in the repository until cutover; shared business data (category slugs, contacts) must not drift between them.
- Code: `apps/site`, `libs/site/*`, Nx tags `scope:site`/`scope:site-shared`, `@nx/next` plugin, CI `test:site` and `site` build.
- Reversibility: the Angular app keeps serving the domain until cutover; the switch is a DNS/hosting change.
- Compliance: `@nx/enforce-module-boundaries` rules for `scope:site`, `npm run architecture:boundaries`, SEO checks in [seo-rules](../../../standards/site/seo-rules.md).

## History

| Date       | Change                                         | Source                                             |
| ---------- | ---------------------------------------------- | -------------------------------------------------- |
| 2026-10-26 | Owner approved the design idea (v3, shadcn/ui) | [idea](../../../ideas/storefront-nextjs/README.md) |
| 2026-10-29 | Accepted; shell created                        | this ADR                                           |
