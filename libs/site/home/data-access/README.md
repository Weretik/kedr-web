# Site home data access

Server-only read of the home page blocks the admin edits: the FAQ and the brands (`GET /api/content/{lang}/home`).
`getHomeBlocks(locale)` answers `ok` with both lists in site order, or `unavailable`; the home feature then shows
the texts and logos kept in `site-home-ui`, so the page never loses its FAQ.

Focused tests: npx nx run site-home-data-access:vite:test -- --run
