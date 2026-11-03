# Site content data access

Server-only, immutable temporary source for the six existing localized storefront articles.
The owner approved this local migration while the database/admin article API remains a later step.
Full source texts stay here; content/model owns filtering, paging and stable slugs.
Only getArticles and getArticle are exported. There are no network operations or mutable caches.

Focused tests: npx nx run site-content-data-access:vite:test -- --run
The tests verify ordered UK/RU source integrity, slug lookup, immutability and exact cover copies.
