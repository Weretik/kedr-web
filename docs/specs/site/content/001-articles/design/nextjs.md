# Next.js

Installed guides read: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md, 08-caching.md, API page.md, image.md, redirects.md. Async params/searchParams; Cache Components is enabled and retained.

List: thin route reads locale only; feature owns static header and Suspense around searchParams-dependent results, with accessible loading state. Server results filter local source and render actual card HTML (no browser-only fetch). No whole-page 'use client'. Detail: server lookup by slug, full text in HTML; generateStaticParams for known localized slugs if useful; unknown → notFound. No dynamicParams/revalidate/unstable_cache/fetch-next options.

Immutable synchronous local source needs no artificial use-cache wrapper; its freshness is deployment-time. No HTTP operation, token, clock or mutable store. Future API adapter will move to the same data-access boundary and use project cache rules.

Client controls receive query/path/labels only. Search is native GET, Enter or submit icon; page size can use router transition. Preserve q and omit page for new search/size. Navigation/metadata share normalized listing resolution, without duplicated filter semantics. Error handling is inherited from locale error boundary.

Images: existing local covers, next/image with dimensions/sizes and fixed aspect; first above-fold image eager/preload as appropriate, other covers lazy. Next.js current preload replaces deprecated priority where needed.
No framework config changes except redirect map. No server actions or new packages.

Verification: focused unit/component suites + site:typecheck for route/server-client boundaries. Build/HTTP/browser checks are not authorized and must remain unrun in evidence.
