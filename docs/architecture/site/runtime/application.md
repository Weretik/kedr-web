# Site application and routing

**Checked:** 2026-10-29. **Sources:** `apps/site/src/app/**`, `apps/site/next.config.ts`, `libs/site/core/shell/src/lib/site-shell.tsx`.

## Composition point

`app/[locale]/layout.tsx` is the root layout. It validates the locale, sets `<html lang="uk-UA|ru-UA">`, loads Onest and JetBrains Mono through `next/font`, wraps the page in `ThemeProvider` and `SiteShell`, and renders Organization JSON-LD. Metadata defaults come from `buildRootMetadata`. Route files hold no JSX trees of their own beyond calling a feature (the home placeholder is the only temporary exception until step 2).

## Routes

| Path                          | Entry                             | Owner                    | Locale and indexing              | Status      |
| ----------------------------- | --------------------------------- | ------------------------ | -------------------------------- | ----------- |
| `/`                           | `next.config.ts` redirect         | app                      | 308 to `/uk`                     | exists      |
| `/uk`, `/ru`                  | `app/[locale]/page.tsx`           | app (home feature later) | static, `generateStaticParams`   | placeholder |
| unmatched URL                 | `app/global-not-found.tsx`        | app                      | 404, `noindex`, both languages   | exists      |
| `notFound()` inside a page    | `app/[locale]/not-found.tsx`      | app                      | 404, `noindex`, inside the shell | exists      |
| `/robots.txt`, `/sitemap.xml` | `app/robots.ts`, `app/sitemap.ts` | `core/seo`               | static                           | exists      |

`dynamicParams = false` in the locale layout limits `[locale]` to `uk` and `ru`. Paths have no trailing slash; `/uk/` redirects to `/uk` (Next.js default).

Known framework behavior (Next.js 16.4): a page that calls `notFound()` returns status 404 with the shell rendered on the client, while unmatched URLs get a fully server-rendered `global-not-found` page. Both carry `noindex`. Re-check after Next.js upgrades.

## Client islands

Server Components by default. `'use client'` exists only in:

- `core/shell/controls/` — `ThemeProvider`, `ThemeToggle`, `LocaleSwitch` (needs `usePathname`), `CopyPhoneButton`;
- `core/shell/header/mobile-menu.tsx` — Radix Sheet;
- `shared/ui/sheet.tsx`;
- `app/[locale]/not-found.tsx` — reads the locale from the URL.

The catalog dropdown and the regions list use `<details>`, so every navigation link is in the server HTML. The search box is a plain GET form to `/{locale}/catalog/products?search=`.

## Verification

- `npx nx run site:typecheck`, `npx nx run site:lint`, `npx nx run site:build` (route table shows `/uk` and `/ru` as SSG).
- `npm run test:site` — unit and component tests of all site libraries.
- Rendered-output check after `npx nx run site:build && (cd apps/site && npx next start)`: `curl` for status codes, `<title>`, canonical, `hreflang`, robots meta, and JSON-LD on `/uk`, `/ru`, an unknown path, `/robots.txt`, `/sitemap.xml`.
