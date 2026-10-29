# site-core-i18n

Locales and localized paths for `apps/site`. Framework-neutral: no React, no Next.js imports. See the [SEO architecture](../../../../docs/architecture/site/platform/seo-architecture.md#locales).

- `LOCALES`, `DEFAULT_LOCALE`, `isLocale` — `uk` (default) and `ru`.
- `LOCALE_LANGUAGE_TAGS`, `OPEN_GRAPH_LOCALES` — `uk-UA`/`ru-UA` for `hreflang` and `<html lang>`, `uk_UA`/`ru_UA` for Open Graph.
- `localizedPath`, `localizedPaths`, `stripLocale`, `switchLocalePath` — the only way to build site links; paths have no trailing slash.

UI text lives with its owner (for example the shell dictionary in `site-core-shell`), not here.

Tests: `npx nx run site-core-i18n:vite:test -- --run`.
