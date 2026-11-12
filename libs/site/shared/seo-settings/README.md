# Site shared SEO settings

Server-only loader of the admin «Налаштування SEO сайту»: the Google Analytics 4 and Tag Manager ids, the Google Search Console and Bing verification codes, and the link-preview picture.

- `getSiteSeoSettings()` reads `GET /api/content/seo-settings` with `'use cache'`, tags `content` and `content:seo-settings`, and a ten-minute life. When the API cannot be reached it returns empty settings: no codes, the default picture.
- The app layout passes the codes to `SiteAnalytics` and `buildVerificationMetadata` from `@site/core/seo`, and the root metadata to `applySharePicture()`.
- Each route's `generateMetadata` passes through `withSiteSharePicture()`, which puts the admin picture in place of the default one; pages with their own picture keep it.

Focused tests: `npx nx run site-shared-seo-settings:vite:test -- --run`
