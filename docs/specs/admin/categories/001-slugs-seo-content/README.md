# 001 — Categories page, stable slugs, SEO text and FAQ

- **Application:** Admin React (`apps/admin`)
- **Status:** Implemented 2026-10-30 (branch `claude/project-thread-mr1vpf`)
- **Backend:** KedrStore spec `catalog/005-stable-urls-and-category-content` (merged in KedrStore #144)
- **Source:** owner decisions of 2026-10-30 for site step 3 (category page)

## Goal and scope

Staff can browse catalog categories in the Admin. An administrator edits the public address (slug) of a category or product, writes the SEO title, meta description, H1, text, and FAQ of a category in Ukrainian and Russian, and sees products and categories the 1C import has soft-deleted. Managers see everything except the deleted lists, read-only.

**Out of scope:** creating, moving, or deleting categories (the 1C import owns the tree); restoring deleted rows by hand; image upload in the text editor; the public site page itself.

## Product rules

- **R-001.** The menu has «Категорії» (`/categories`) for every staff member. The list shows the category tree in display order with name, public address, and level, a search over name and address, and an eye action to the details page.
- **R-002.** The «Видалені» tab on the categories list and on the products list is visible to administrators only. It lists rows the 1C import soft-deleted, newest first, with the deletion date, and has no details action.
- **R-003.** The category details page shows names (uk, ru, 1C source), ID, 1C key, level, and the public address `/uk/catalog/{slug}`.
- **R-004.** An administrator changes the address of a category (details page) or a product (details page) in a dialog: either types a new one (a–z, 0–9, single hyphens, at most 80 characters, checked before sending) or presses «Згенерувати з назви». The dialog says that the old address keeps redirecting. A taken address shows «Ця адреса вже використовується або використовувалась раніше». After a product address change, the page moves to the new address.
- **R-005.** The category content block has «Українська» and «Русский» tabs. Each tab has SEO title (≤ 70), meta description (≤ 160), H1 (≤ 120) with counters, a rich-text editor (paragraphs, bold, italic, H2, H3, bulleted and numbered lists, links), and an FAQ list (≤ 20 items, question ≤ 200, plain-text answer ≤ 2000) with add, remove, and move up/down. «Зберегти» replaces the content of that language only; the editor then shows what the server stored (sanitized).
- **R-006.** Managers see the content and address read-only, without edit controls. Server `403` shows «Недостатньо прав для цієї дії».
- **R-007.** Unsaved changes in one language survive switching tabs; «Скасувати зміни» returns the stored values.

## Acceptance scenarios

| ID         | Scenario                                                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **SC-001** | A manager opens «Категорії», searches «завіс», opens a category, and sees its address and content without edit buttons or the «Видалені» tab. |
| **SC-002** | An administrator types an invalid address and sees the rule without a request; a valid one saves and the card shows the new address.          |
| **SC-003** | An administrator fills the Ukrainian SEO fields, text, and two FAQ items, saves, and sees the success notice; the Russian tab is unchanged.   |
| **SC-004** | An administrator opens «Видалені» on categories and on products and sees deleted rows with dates.                                             |
| **SC-005** | An administrator changes a product address on its details page and lands on the new address.                                                  |

## Design

- `@admin/shared/ui` — `ChangeSlugDialog` (presentational; type or regenerate), `validateSlug`, `slugChangeErrorMessage`, and `PublicAddressCard`, reused by categories and products.
- `@admin/categories/model` — `AdminCategory`, `CategoryContent`, `CategoryFaqItem`, `ContentLanguage`, field limits and `validateCategoryContent`, `flattenCategoryTree` order helper.
- `@admin/categories/data-access` — `getAdminCategories(deleted)`, `getAdminCategory(id)`, `getCategoryContent(id)`, `saveCategoryContent`, `changeCategorySlug`; tag `Categories`.
- `@admin/categories/ui` — `CategoriesDataGrid`, `CategoryInformationCard`, `CategoryContentForm` (fields + `RichTextEditor` + `FaqListEditor`), `CategoryContentView` (read-only).
- `@admin/categories/feature` — `CategoriesPage`, `CategoryDetailsPage`, `useCategoryContentEditor`, `useCategorySlugChange`, `categoryContentErrorMessage`; routes `createCategoriesRoutes({ useCanEditCatalog })`.
- `@admin/products/*` — `deleted` query flag and «Видалені» tab; `changeProductSlug` mutation; product details slug row with the dialog. `createProductsRoutes` takes `useCanEditCatalog`.
- App router passes `useCanEditCatalog` (role Admin) to both route factories; navigation adds «Категорії».
- Rich text uses Tiptap 3 (`@tiptap/react`, `@tiptap/starter-kit`) limited to the server's allowed tags; the server sanitizes anyway.

## Planned file map

| Path                                                                                                                                                                               | State        | Responsibility                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------- |
| `libs/admin/shared/ui/src/lib/change-slug-dialog.tsx`, `slug-rules.ts`, `public-address-card.tsx`                                                                                  | New          | Address dialog and rule                   |
| `libs/admin/categories/model/src/entities/*`, `content/category-content-rules.ts`, `tree/category-tree-order.ts`                                                                   | New          | Types, limits, validation, tree order     |
| `libs/admin/categories/data-access/src/api/admin-categories.api.ts`, `contracts/*`, `mappers/*`                                                                                    | New          | Categories API                            |
| `libs/admin/categories/ui/src/tables/*`, `cards/*`, `content/{category-content-form,category-content-view,faq-list-editor}.tsx`, `editor/{rich-text-editor,rich-text-toolbar}.tsx` | New          | Presentational parts                      |
| `libs/admin/categories/feature/src/{categories.routes.tsx,pages/*,hooks/*,errors/*}`                                                                                               | New          | Pages and flows                           |
| `libs/admin/products/{model,data-access,ui,feature}`                                                                                                                               | Change       | Deleted tab, slug change                  |
| `libs/admin/core/shell/.../admin-navigation.tsx`, `apps/admin/src/app/router/app-router.tsx`                                                                                       | Change       | Menu item and routes                      |
| `libs/mobile/catalog/data-access/src/contracts/admin-categories.schema.ts`                                                                                                         | Change       | Accept new `isDeleted`/`deletedAt` fields |
| `docs/features/admin/categories.md`, `docs/features/README.md`, `docs/contracts/catalog/*`                                                                                         | New / Change | Feature card and consumer contract        |

## Tests

- Model: content validation limits, slug rule, tree order.
- Data access: mappers (tree rows, content items, save body trims empty to null).
- UI: `ChangeSlugDialog` validation and regenerate; `FaqListEditor` add/move/remove; `CategoryContentForm` counters and read-only mode.
- Feature: categories page hides «Видалені» for managers; details page saves content and shows the notice (mocked API).
