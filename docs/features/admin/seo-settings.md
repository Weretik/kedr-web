# Admin «Налаштування SEO сайту»

**Status:** implemented. Route: `/seo-settings` (menu «Сайт» → «Налаштування SEO сайту», all staff: Manager, Seo, Admin). Backend: KedrStore Content module, contract [site SEO settings](../../contracts/openapi/content/seo-settings.openapi.yaml).

- The page is read-only: the Google Analytics 4 id, the Google Tag Manager id, the Google Search Console and Bing Webmaster verification codes («Не вказано» when empty) and the picture for link previews, with «Змінено: хто, коли». A picture deleted from the media library is the only mark: the site then shows its own picture.
- «Редагувати» opens the right side panel with the four codes and the picture (from the media library, an upload, or «Прибрати фото»). Ids are upper-cased; for a verification code the whole meta tag may be pasted and only its `content` is kept. An id or code of another shape is refused before saving. An empty field adds nothing to the site.
- The SEO specialist connects the services; the page only stores the codes. Google and Bing verification already done by DNS keeps working.

## Site

[site-shared-seo-settings](../../../libs/site/shared/seo-settings/src/index.ts) reads `GET /api/content/seo-settings` (`'use cache'`, tags `content`, `content:seo-settings`, ten-minute life); a failed read gives no codes and the default picture. The `[locale]` layout adds the `google-site-verification` and `msvalidate.01` meta tags (`buildVerificationMetadata`) and renders `SiteAnalytics` (GA4 and GTM through `next/script`, only for ids of the right shape) from `@site/core/seo`. Each route's `generateMetadata` passes through `withSiteSharePicture()`, which replaces the site default picture (`DEFAULT_OG_IMAGE` in `@site/core/config`) with the admin one; products and articles with their own picture keep it.

## Code structure

```text
libs/admin/seo-settings/
├── model/src/entities/seo-settings.ts              # settings, draft, picture
├── model/src/validators/seo-settings-rules.ts      # id shapes, meta tag → code
├── data-access/src/api/admin-seo-settings.api.ts   # get, save (replaces the cached settings)
├── data-access/src/{contracts,validators,mappers}/
├── ui/src/view/                                    # read-only codes and picture
├── ui/src/panel/seo-settings-panel.tsx             # codes and picture in one form
└── feature/src/                                    # seoSettingsRoutes, page, picture picker hook, error message
libs/site/shared/seo-settings/src/lib/              # loader, cache tags, applySharePicture
libs/site/core/seo/src/lib/{analytics,metadata/site-codes.ts}  # SiteAnalytics, verification metadata
```

## Tests

- `npx nx run admin-seo-settings-model:vite:test -- --run` — id shapes, meta tag, empty allowed.
- `npx nx run admin-seo-settings-data-access:vite:test -- --run` — answer mapping, normalized request with null for empty.
- `npx nx run admin-seo-settings-feature:vite:test -- --run` — read-only view, save from the panel, refused id.
- `npx nx run site-shared-seo-settings:vite:test -- --run` — loader, fallback, picture replacement.
- `npx nx run site-core-seo:vite:test -- --run` — verification tags and id checks.
