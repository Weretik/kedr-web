# 002 — Managing the category tree by hand (Admin)

**Application:** Admin (React, MUI). **Status:** accepted 2026-11-26 (owner: «да» to the plan, then «поменяй вообще управление категориями…», «изменения на сайте приоритетнее, чем 1С», «не надо, чтобы оно писало, как оно в 1С»). **Backend:** KedrStore spec `docs/sdd/specs/catalog/011-manual-categories` (MC-01…MC-10).

## Goal and boundaries

On «Категорії» a person who may edit categories (Admin, Seo) creates a category by hand and chooses where it sits, moves any category (1C or manual) under another one or to the top, moves it up or down among its neighbours, deletes a manual category while it is empty, and puts site models into a final category. What the admin sets wins over 1C; the admin never says where 1C keeps a category or a product.

**Out of scope:** deleting 1C categories (hiding from the site does that), single products without a model, the public site (it already shows any category shown on the site), drag and drop in the tree.

## Rules

- **R-001. «Нова категорія».** A contained button in the page header (active tab, editors only) opens the right panel «Нова категорія»: «Назва українською» and «Назва російською» (required, up to 100 characters), «Вкласти в» (the parent picker of R-005; preset to the category selected in the tree), «Показувати на сайті» (preset to the parent's mark). «Створити» has a pending lock. Success closes the panel, selects the new category in the tree and says «Категорію створено». 409 shows «Категорія з такою назвою вже є тут» in the panel; 400 for a parent with models shows «У цій категорії є моделі: оберіть іншу».
- **R-002. «Створена вручну».** A manual category carries the chip «Створена вручну» next to its title in the tree overview and on the category page. No 1C mark of any kind is shown for any category (owner, 2026-11-26).
- **R-003. «Розташування».** The edit panel of every category has the block «Розташування»: «Вкласти в» (the picker without the category itself and its subcategories) with «Зберегти», and «Вище» / «Нижче» that move it among its neighbours at once (disabled at the ends). Success says «Категорію переміщено» or «Порядок змінено»; 400 for a parent with models shows the R-001 message.
- **R-004. «Видалити».** Only a manual category has «Видалити» (outlined, error colour) at the bottom of its edit panel, with the dialog «Видалити категорію «…»?». 409 shows «Спочатку приберіть моделі та підкатегорії». Success closes the panel, selects the parent (or the first category) and says «Категорію видалено».
- **R-005. Parent picker.** An autocomplete over active categories by Ukrainian name, each option with its path («Фурнітура / Ручки»), plus «Верхній рівень» first; the excluded ids are not offered.
- **R-006. «Моделі на сайті».** A final category (no subcategories) shows the card «Моделі на сайті» under its overview: the models placed in it (name with «Не перевірена» for a proposal, products count), each a link to the model page, and for editors «Додати моделі». The button opens the panel «Додати моделі в категорію»: a search over all models by name (server-side), a list with checkboxes where the models already here are checked and locked, and «Додати (N)» with a pending lock. Success closes the panel and says «Моделі додано».
- **R-007. Model pages.** «Категорія на сайті» shows only the site category: the «У 1С: …» note under it is removed from the model page, the «Моделі» table and the panels (owner, 2026-11-26). Manual final categories appear in the model category picker like any other (same query).

**Repeated submits:** every action has a pending lock; none of the endpoints takes an `Idempotency-Key` (backend spec 011 idempotency note: a repeated create answers 409 on the same name, the rest set a state).

## API

`createAdminCategory` (`POST /api/categories`), `moveAdminCategory` (`PUT /api/categories/{id}/parent`), `reorderAdminCategory` (`PUT /api/categories/{id}/order`), `deleteAdminCategory` (`DELETE /api/categories/{id}`), `addAdminCategorySiteModels` (`POST /api/categories/{id}/site-models`); `AdminCategoryResponse.isManual`. «Моделі на сайті» reads `getAdminSiteModels` with `categoryId`. Every mutation invalidates `Categories` and `SiteModels`.

## File-role map

```text
libs/admin/categories/
├── data-access/src/api/category-placement.api.ts          # five mutations
├── data-access/src/mappers/admin-category.mapper.ts        # isManual
├── model/src/entities/admin-category.ts                     # isManual; CategorySiteModel
├── model/src/mappers/category-placement.ts                 # parent options, neighbour position, name rule
├── ui/src/components/category-parent-picker.tsx, category-manual-chip.tsx, category-site-models-card.tsx
├── ui/src/forms/category-place-card.tsx                     # «Розташування»
├── ui/src/panels/category-new-panel.tsx, category-add-models-panel.tsx
├── ui/src/dialogs/category-delete-dialog.tsx
└── feature/src/
    ├── components/placement/category-placement-section.tsx, new-category-flow.tsx
    ├── components/explorer/category-explorer.tsx, category-site-models-section.tsx
    ├── components/panels/                                  # the edit panel and its sections (moved)
    ├── hooks/placement/use-new-category.ts, use-category-placement.ts, use-category-delete.ts, use-category-site-models.ts
    ├── hooks/editing/, hooks/tree/                         # existing hooks, split by role (moved)
    └── errors/category-placement-error-message.ts
libs/admin/site-models/ (R-007)                               # «У 1С: …» removed
tools/architecture/project-boundary-rules.mjs                 # categories feature → site models data-access and model
```

## Scenarios and tests

- **SC-001 (R-001).** Create under the selected category with required names; 409 message — `use-new-category.spec.ts`, `category-new-panel.spec.tsx`.
- **SC-002 (R-002, R-004).** A manual category shows the chip and «Видалити»; a 1C one shows neither; delete 409 message — `category-place-card.spec.tsx`, `use-category-delete.spec.ts`, `categories-pages.spec.tsx`.
- **SC-003 (R-003, R-005).** Picker options leave out the category and its subcategories; «Вище» is disabled for the first neighbour — `category-placement.spec.ts`, `category-place-card.spec.tsx`.
- **SC-004 (R-006).** The models card lists models and the panel adds two, keeping the present ones locked — `category-add-models-panel.spec.tsx`, `use-category-site-models.spec.ts`.
- **SC-005 (R-007).** No «У 1С» under a model's category — `site-model-category-cell.spec.tsx`, `site-model-main-card.spec.tsx`, `site-models-data-grid.spec.tsx`.
