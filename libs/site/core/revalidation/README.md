# site-core-revalidation

Checks a cache refresh request from KedrStore («Оновити сайт зараз» in the admin): the `x-revalidate-secret` header
against `KEDR_REVALIDATE_SECRET`, then drops the allowed cache tags (`content`, `catalog`). The route
`apps/site/src/app/api/revalidate/route.ts` passes Next.js `revalidateTag`.

Tests: `npx nx run site-core-revalidation:vite:test -- --run`.
