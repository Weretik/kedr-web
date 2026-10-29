# site-core-seo

Site-wide SEO builders for `apps/site`. Route files call them; features add their own builders in a domain `seo` library. Rules: [SEO architecture](../../../../docs/architecture/site/platform/seo-architecture.md) and [SEO rules](../../../../docs/standards/site/seo-rules.md).

- `metadata/` — `buildRootMetadata` (URL base, title template, site robots), `buildPageMetadata` (self canonical, `hreflang` with `x-default`, Open Graph, robots), `buildRobotsMeta`.
- `json-ld/` — `JsonLd` (safe server rendering), `buildOrganizationJsonLd`, `buildWebSiteJsonLd`.
- `crawling/` — `buildRobotsFile` (everything blocked until indexing is enabled) and `buildSitemapEntries`.

Tests: `npx nx run site-core-seo:vite:test -- --run`.
