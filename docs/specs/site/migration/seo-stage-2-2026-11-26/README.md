# SEO stage 2: search closing, site names, article SEO, share pictures, local business, lastmod

**Status:** implemented 2026-11-26. Backend: KedrStore specs `catalog/010-site-search-settings` and `content/012-article-seo-and-store-address` (KedrStore #276). Stage 1 of the same owner request is kedr-web #151; stage 3 («Переадресації», «SEO-огляд») waits for the owner.

## Owner decisions (2026-11-26)

- Category names in Ukrainian and Russian are admin fields that win over 1C on the site; nothing is asked of the 1C programmer.
- The shop for `LocalBusiness`: «Крамниця Дверна фурнітура CLASS», вул. Ахієзерів, 46, Харків, Харківська обл., 61038; phone 068 713 5049; Mon–Fri 9:00–16:00, weekends closed. It is edited in «Контакти».
- Code only: no texts are written for the owner.

## Requirements

| ID   | Requirement                                                                                                                                                                                                                                                      | Where                   |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| R-01 | Admin category edit panel: «Назва на сайті» (uk, ru) saves `PUT /api/categories/{id}/site-names`; an empty field returns to the 1C name.                                                                                                                         | Admin categories        |
| R-02 | Admin category edit panel: «Пошук і поширення» with the «Закрити від пошуку» switch and a share picture from the media library, saved by `PUT /api/categories/{id}/search-settings`; the card and overview mark a closed category.                               | Admin categories        |
| R-03 | A closed category (itself or through a parent) is `noindex, follow` on every page and value page; its canonical stays its own. Its models and own product pages are `noindex, follow` too.                                                                       | Site catalog, product   |
| R-04 | The main sitemap leaves out closed categories with their subtrees and value pages; the product sitemap leaves out models whose category is closed or under a closed one. A missing category tree fails the sitemap instead of publishing closed pages.           | Site catalog, product   |
| R-05 | `lastmod`: a category entry carries the category `updatedAt` (it already includes text changes); a model entry carries the model card `updatedAt` of that language. Nothing is invented when the API gives none.                                                 | Site sitemaps           |
| R-06 | A category with an admin share picture uses it as `og:image` instead of the site default.                                                                                                                                                                        | Site catalog            |
| R-07 | Admin article texts get «SEO-заголовок» (70) and «Meta description» (160) per language; empty means none. The site uses them for the article title and description, else the title and the excerpt.                                                              | Admin and site articles |
| R-08 | Admin «Контакти» get «Магазин» (name, street uk/ru, region uk/ru, postal code) and «Години роботи» (Mon–Fri, Saturday, Sunday; a day without hours is a day off), with the backend rules: five-digit postal code, both times or neither, opening before closing. | Admin company contacts  |
| R-09 | The contacts page renders a `HardwareStore` (`LocalBusiness`) JSON-LD with address, region, postal code, phone, email, map, opening hours and a link to the organization, only while the street is filled in. The code fallback holds the owner's shop.          | Site contacts           |

## File-role map

| Role                             | Files                                                                                                                                                                                                                                                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin categories: model and data | `libs/admin/categories/model/src/entities/admin-category.ts`, `data-access/src/{validators,mappers,api}`                                                                                                                                                                                                    |
| Admin categories: state and UI   | `feature/src/hooks/use-category-site-names.ts`, `use-category-search-settings.ts`, `feature/src/components/category-search-section.tsx`, `ui/src/forms/category-site-names-form.tsx`, `category-search-form.tsx`, `ui/src/details/category-site-visibility.tsx`                                             |
| Shared media picker              | `libs/admin/media/data-access/src/api/use-media-picker.ts` (also behind `use-texture-picker.ts`)                                                                                                                                                                                                            |
| Admin articles                   | `libs/admin/articles/model/src/{entities,forms,validators}`, `data-access/src/{validators,mappers}`, `ui/src/forms/article-text-fields.tsx`                                                                                                                                                                 |
| Admin contacts                   | `libs/admin/company/model/src/entities/company-store.ts`, `validators/company-store-rules.ts`, `forms/company-contacts-draft.ts`, `data-access/src/{validators,mappers}`, `ui/src/forms/company-store-fields.tsx`                                                                                           |
| Site catalog                     | `libs/site/catalog/model/src/lib/tree/catalog-crawl.ts`, `data-access/src/lib/{mappers/category-tree.mapper.ts,mappers/category-details.mapper.ts,loaders/catalog-loaders.ts}`, `seo/src/lib/metadata/category-metadata.ts`, `feature/src/lib/routing/category-routing.ts`                                  |
| Site product                     | `libs/site/product/model/src/lib/entities/{site-model,product-index}.ts`, `data-access/src/lib/mappers/{site-model,model-index}.mapper.ts`, `seo/src/lib/{inputs/product-seo-input,metadata/product-metadata}.ts`, `feature/src/lib/model/{model-metadata,model-response}.ts`, `feature/src/lib/crawling/*` |
| Site articles                    | `libs/site/content/model/src/lib/entities/article-types.ts`, `data-access/src/lib/articles/article.mapper.ts`, `seo/src/lib/metadata/articles/*`                                                                                                                                                            |
| Local business                   | `libs/site/core/config/src/lib/company/company-store.ts`, `libs/site/shared/company/src/lib/contacts/company-store.mapper.ts`, `libs/site/core/seo/src/lib/json-ld/local-business-json-ld.ts`, `libs/site/content/feature/src/lib/contacts/contacts-page.tsx`                                               |

## Verification

- Focused Vitest suites of every changed project pass (admin categories, articles, company, media, catalog attributes; site catalog, product, content, core config and SEO, shared company).
- `typecheck` and `lint` of the changed projects, `npm run architecture:structure`, `npm run architecture:boundaries` pass. The new cross-domain flow `admin-categories-feature → admin-media-*` is documented in `tools/architecture/project-boundary-rules.mjs`.
- Contract synced from the backend branch; `contracts:drift` stays red until KedrStore #276 merges.
- Not run (needs separate permission): browser, build, E2E.
- Final architecture audit: [code-audit/audit.md](code-audit/audit.md) (AF-01…AF-03 fixed and verified, AF-04 deferred, AF-05 open until KedrStore #276 merges).
