# Site application and routing

**Checked:** 2026-10-30. **Sources:** `apps/site/src/app/**`, `apps/site/src/proxy.ts`, `apps/site/next.config.ts`, `libs/site/core/shell/src/lib/site-shell.tsx`.

## Composition point

`app/[locale]/layout.tsx` is the root layout. It validates the locale, sets `<html lang="uk-UA|ru-UA">`, loads Onest and JetBrains Mono through `next/font`, wraps the page in `ThemeProvider` and `SiteShell`, and renders Organization JSON-LD. Metadata defaults come from `buildRootMetadata`. Route files hold no JSX trees of their own beyond calling a feature.

## Routes

| Path                          | Entry                             | Owner          | Locale and indexing                 | Status |
| ----------------------------- | --------------------------------- | -------------- | ----------------------------------- | ------ |
| `/`                           | `next.config.ts` redirect         | app            | 308 to `/uk`                        | exists |
| `/uk`, `/ru`                  | `app/[locale]/page.tsx`           | `home/feature` | prerendered, `generateStaticParams` | exists |
| `/{locale}/categories`        | `next.config.ts` redirect         | app            | 308 to `/{locale}`                  | exists |
| path without a locale         | `src/proxy.ts` rewrite            | app            | 404 from `global-not-found`         | exists |
| unmatched URL                 | `app/global-not-found.tsx`        | app            | 404, `noindex`, both languages      | exists |
| `notFound()` inside a page    | `app/[locale]/not-found.tsx`      | app            | 404, `noindex`, inside the shell    | exists |
| `/robots.txt`, `/sitemap.xml` | `app/robots.ts`, `app/sitemap.ts` | `core/seo`     | static                              | exists |

Cache Components is on, so `dynamicParams` is not allowed. `generateStaticParams` prerenders `uk` and `ru`; any other first segment never reaches the layout: `src/proxy.ts` matches only paths that do not start with a locale, `_next/`, or a file name, and rewrites them to an unmatched path, which serves `global-not-found.tsx` with 404 and keeps the requested URL. The proxy matcher repeats the locale list as a static literal; keep it in sync with `LOCALES`. Paths have no trailing slash; `/uk/` redirects to `/uk` (Next.js default).

`app/[locale]/not-found.tsx` is a Server Component that reads the locale with `next/root-params`. All 404 responses carry `noindex`.

## Client islands

Server Components by default. `'use client'` exists only in:

- `core/shell/controls/` — `ThemeProvider`, `ThemeToggle`, `LocaleSwitch` (needs `usePathname`), `CopyPhoneButton`;
- `core/shell/header/mobile-menu.tsx` — Radix Sheet;
- `shared/ui/sheet.tsx`.

The catalog dropdown and the regions list use `<details>`, so every navigation link is in the server HTML. The search box is a plain GET form to `/{locale}/catalog/products?search=`.

## Verification

- `npx nx run site:typecheck`, `npx nx run site:lint`, `npx nx run site:build` (route table shows `/uk` and `/ru` as static and `Proxy`).
- `npm run test:site` — unit and component tests of all site libraries.
- Rendered-output check after `npx nx run site:build && (cd apps/site && npx next start)`: `curl` for status codes, `<title>`, canonical, `hreflang`, robots meta, and JSON-LD on `/uk`, `/ru`, `/uk/categories`, `/xx`, `/uk/foo`, `/robots.txt`, `/sitemap.xml`.
