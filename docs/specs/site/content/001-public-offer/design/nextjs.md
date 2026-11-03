# Next.js design

## Routes and rendering

| Address                                | Type                        | Index policy             | Rendering / freshness                                         | Params                                                        | Status                    |
| -------------------------------------- | --------------------------- | ------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------- |
| `/uk/public-offer`, `/ru/public-offer` | public static content       | existing production gate | Complete document prerendered; source changes require rebuild | Existing parent locale generation; no new dynamic entity list | 200 for supported locales |
| Unsupported locale                     | existing not-found boundary | noindex                  | existing route/proxy handling                                 | validate with core isLocale                                   | 404                       |

Thin route awaits `params`, validates locale, calls `PublicOfferPage` and exports metadata through content SEO. Follow the existing returns route. Do not create another layout, replace the shell or add a parallel unlocalized page.

Cache Components is already enabled. The offer uses static imported constants, not remote data: no `use cache` wrapper, tags, cache lifetime, revalidation hook or `data-access` addition is needed for its own content. Existing shell/catalog reads keep their current policies. Do not add legacy `revalidate`, `dynamicParams`, `unstable_cache` or fetch cache options.

## Server/client boundary

Server: route, feature, heading/breadcrumb, full document/note, contact composition, metadata and JSON-LD. Main content is in initial HTML; no Suspense fallback, delayed legal text or client-only fetching.

Client leaves: contents active-section lifecycle and print invocation. They receive narrow mapped props; neither imports the legal dictionary, a loader or Angular. Native contents and anchors are already usable in the rendered HTML. Print starts disabled until hydration and has a localized no-JS browser-print hint.

No cookies/headers, Server Action, authorization, form submission, API operation, personal data or shared-cache privacy issue is introduced.

## Platform integration

Use existing Onest and lucide assets; the concept PNG stays in docs and is not served as page content or OG image. No image/font/third-party script is added.

Language switching keeps the same page using existing shell logic; hash/scroll preservation is not promised. Unique section IDs are identical across languages. Keyboard focus is not programmatically moved on ordinary scrolling.

The installed Next guides for layouts/pages and Cache Components were checked during specification work. Before implementation, consult the matching installed guide for any framework API being changed; do not copy older Next patterns.

## Verification

Use the existing content projects and focused commands in [tasks](../tasks/README.md). No production build, running server, curl/HTTP output, browser, visual or actual print-preview evidence exists for this SDD. Such execution is separate from documentation readiness and requires the repository's explicit authorization where applicable.
