# site-core-redirects

Old site addresses that the admin «Переадресації» sends to a new one with a 301 (spec content/013). The proxy
(`apps/site/src/proxy.ts`) keeps an in-memory copy of `GET /api/content/redirects` for 5 minutes, answers a stale
copy at once while a new one loads, keeps the last copy when the API fails, and never waits more than 1.5 seconds. Requests share only the
loaded list, never a pending load: on Cloudflare Workers a request cannot wait for a promise of another request
that has ended (a cancelled prefetch), and such a wait answered 500 (2026-11-27).
Lookup keys match the backend: decoded, lower case, no query, no trailing slash.

Tests: `npx nx run site-core-redirects:vite:test -- --run`.
