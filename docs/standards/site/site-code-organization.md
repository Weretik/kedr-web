# Site code rules

**Applies to:** `apps/site` and `libs/site/**`.

The shared [frontend code organization rules](../shared/code-organization.md) apply in full, including the [public site libraries](../shared/code-organization.md#public-site-libraries-nextjs) folder table, [one responsibility per file](../shared/code-organization.md#one-responsibility-per-file), and [tests](../shared/code-organization.md#tests). Route files, caching, and SEO follow the [site architecture](../../architecture/site/README.md) and the [SEO rules](seo-rules.md). This file adds what is specific to the Site.

## Site specifics

- Libraries are created with `npx nx g @nx/react:library libs/site/<domain>/<layer> --bundler=none --unitTestRunner=vitest` and keep the generator's `src/lib/` level.
- `libs/site/content/*` serves several pages (contacts, requisites, returns, privacy, public offer, wholesale, delivery and payment, gallery, articles), so each of its libraries uses one subfolder per page inside the folders of the table.
- UI primitives come from `npx shadcn@latest add <component>` in `libs/site/shared/ui`.

## Known deviations

None: the structure check has no Site entries in [the baseline](../../../tools/architecture/structure-baseline.json). A new violation fails `npm run architecture:structure`.
