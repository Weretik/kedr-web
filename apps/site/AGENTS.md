<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Site (Next.js public storefront)

New public ClassKedr storefront that replaces `apps/storefront` by the [migration plan](../../docs/specs/site/migration/README.md). Read the [site architecture](../../docs/architecture/site/README.md), the [SEO rules](../../docs/standards/site/seo-rules.md), and the [design system](../../docs/standards/site/design-system.md) before changing it.

- Routes in `src/app` stay thin: read `params`, call a feature, export metadata through `@site/core/seo`.
- New domain libraries: `npx nx g @nx/react:library libs/site/<domain>/<layer> --bundler=none --unitTestRunner=vitest --tags=scope:site,...`; new UI primitives: `npx shadcn@latest add <component>` from `libs/site/shared/ui`.
- Commands: `npx nx run site:dev`, `npx nx run site:build`, `npx nx run site:typecheck`, `npm run test:site`.
- Indexing stays off unless `SITE_ENV=production` and `SITE_INDEXING=true`.
