# Site code rules

**Applies to:** `apps/site` and `libs/site/**`.

The shared [frontend code organization rules](../shared/code-organization.md) apply in full, including the [public site libraries](../shared/code-organization.md#public-site-libraries-nextjs) folder table, [one responsibility per file](../shared/code-organization.md#one-responsibility-per-file), and [tests](../shared/code-organization.md#tests). Route files, caching, and SEO follow the [site architecture](../../architecture/site/README.md) and the [SEO rules](seo-rules.md). This file adds what is specific to the Site.

## Site specifics

- Libraries are created with `npx nx g @nx/react:library libs/site/<domain>/<layer> --bundler=none --unitTestRunner=vitest` and keep the generator's `src/lib/` level.
- `libs/site/content/*` serves several pages (contacts, requisites, returns, privacy, public offer, wholesale, delivery and payment, gallery, articles), so each of its libraries uses one subfolder per page inside the folders of the table.
- UI primitives come from `npx shadcn@latest add <component>` in `libs/site/shared/ui`.

## Known deviations

Existing code that does not follow these rules yet; `npm run architecture:structure` lists every one in [the baseline](../../../tools/architecture/structure-baseline.json). Fix an entry when the code is next changed or in the frontend restructure; do not copy these layouts into new code.

| Path under `libs/site/`                                                                                                                                                         | Deviation                                            | Target                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `content/{feature,model,seo}/src/lib/*`                                                                                                                                         | Page files loose in `src/lib/` (up to 14 per folder) | `feature/<page>/`, `model/copy/<page>/` and `model/entities/`, `seo/metadata/<page>/` and `seo/json-ld/<page>/` |
| `content/ui/src/lib/{articles,contacts,gallery,requisites,returns}/`, `catalog/ui/src/lib/{listing,product}/`                                                                   | Eight or more files in one block folder              | Sub-blocks per section                                                                                          |
| `cart/ui/src/lib/{shared,types}/`, `product/data-access/src/lib/crawling/product-index.types.ts`                                                                                | Catch-all names                                      | Formatting into `cart/model`, props next to their components, index type named by owner                         |
| `catalog/ui/src/lib/navigation/mega-menu.tsx`, `catalog/feature/src/lib/{category/category-page,listing/product-listing}.tsx`, `content/ui/src/lib/gallery/gallery-browser.tsx` | State, search, and several blocks in one component   | Controller hook plus one component per block                                                                    |
| `catalog/model/src/lib/listing/listing-query.ts`, `cart/feature/src/lib/state/cart-client-store.ts`                                                                             | Over the line limit                                  | Split parsing, building, and defaults; split store actions                                                      |
| `core/shell/src/lib/site-shell.tsx`                                                                                                                                             | Loose file in a library with more than eight files   | `layout/site-shell.tsx`                                                                                         |
