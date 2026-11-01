# site-core-shell

Layout frame of `apps/site`: header, footer, theme, and language switch. Server Components by default; `'use client'` only in `controls/` (theme, language, phone copy) and the mobile menu. See the [site architecture](../../../../docs/architecture/site/README.md).

- `SiteShell` — skip link, sticky header, `<main id="content">`, footer. Its optional `catalogNavigation` prop (`CatalogNavigation`: mega menu and section links) comes from the catalog feature through the app layout, because the shell cannot import a domain.
- `NotFoundView` — 404 message used by the app's `not-found.tsx` and `global-not-found.tsx`; `ErrorView` (client, imported from `@site/core/shell/error` so the client bundle skips the cached server parts) — data failure message with a retry, used by the app's `error.tsx`.
- `header/` — `bars/`: top bar (city, information pages, UA/RU, theme), main bar (logo, catalog, search, phone with Telegram/Viber/map, cabinet, cart), category bar (sections, regions, cooperation); `menus/`: catalog and regions dropdowns, mobile sheet menu.
- `footer/` — catalog, company, and buyer links, contacts.
- `navigation/site-navigation.ts` — locale-free paths and the fallback catalog sections; `navigation/catalog-navigation.ts` — the `CatalogNavigation` type and the fallback rule.
- `i18n/shell-dictionary.ts` — shell text in `uk` and `ru`.
- `ThemeProvider` — light and dark themes via the `dark` class.

The header search sends `?q=` to `/{locale}/search`. Without catalog navigation (API unavailable) the catalog dropdown and category row use the fixed sections. Cabinet and cart are plain links until their features add client islands.

Tests: `npx nx run site-core-shell:vite:test -- --run`.
