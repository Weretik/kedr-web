# site-core-shell

Layout frame of `apps/site`: header, footer, theme, and language switch. Server Components by default; `'use client'` only in `controls/` (theme, language, phone copy) and the mobile menu. See the [site architecture](../../../../docs/architecture/site/README.md).

- `SiteShell` — skip link, sticky header, `<main id="content">`, footer.
- `NotFoundView` — 404 message used by the app's `not-found.tsx` and `global-not-found.tsx`.
- `header/` — `bars/`: top bar (city, information pages, UA/RU, theme), main bar (logo, catalog, search, phone with Telegram/Viber/map, cabinet, cart), category bar (sections, regions, cooperation); `menus/`: catalog and regions dropdowns, mobile sheet menu.
- `footer/` — catalog, company, and buyer links, contacts.
- `navigation/site-navigation.ts` — locale-free paths, the same URLs as the current storefront.
- `i18n/shell-dictionary.ts` — shell text in `uk` and `ru`.
- `ThemeProvider` — light and dark themes via the `dark` class.

The catalog dropdown and the category row use a static list of sections until the catalog feature brings the category tree from the API. Cabinet and cart are plain links until their features add client islands.

Tests: `npx nx run site-core-shell:vite:test -- --run`.
