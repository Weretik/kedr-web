# Next.js design

## Route and rendering

| Route                                                  | Type           | Index policy                                          | Rendering                                                        | Freshness / params                                                                   | Status                                                                    |
| ------------------------------------------------------ | -------------- | ----------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `/uk/delivery-and-payment`, `/ru/delivery-and-payment` | Public content | Eligible only under existing production indexing gate | Static Server Components; main text and metadata in initial HTML | Repository-owned dictionary changes at deployment; reuse locale layout/static params | 200 for supported locales; existing invalid-locale/unknown-route handling |

Cache Components remains enabled. This static feature has no data fetch or request-time API and does not need a cache directive, tags, revalidation handler, `revalidate`, `dynamicParams` or `unstable_cache`. No Suspense/streaming boundary for substantive content. The route awaits locale params, validates with existing locale helpers, exports metadata via domain SEO and renders the feature. Do not create a second root layout or shell.

All feature/UI content remains server-renderable. Existing shell islands own theme/menu controls; no `'use client'` is introduced for static terms or anchor navigation. No Server Actions or personal data.

## Data boundary and states

Copy the delivery dictionary into site content/ui from the specified Angular source; no runtime imports across app scope. No API/DTO/schema change or data-access/model library is needed. Locale copy and known phone are deterministic; no new loading, empty or data-error state is needed. Existing route/layout errors and 404 handling remain in effect.

Use current font loading from the locale layout. No raster hero, added third-party scripts, CDN font, or external payment widget. Buttons/anchors and icons reuse existing primitives and installed lucide. Local anchors have sufficient scroll margin for the existing responsive sticky header.

## Verification

Read locally installed Next documentation for route params, metadata, Link and sitemap APIs before editing those boundaries. Affected projects: generated `site-content-ui`, `site-content-seo`, `site-content-feature`, plus thin app integration. Focused Vitest component/unit/integration tests; app typecheck only for a concrete route/type integration risk. Architecture boundary and docs checks cover generated library wiring and documentation. Build/HTML/browser/E2E validation remains outside authorization unless requested separately.
