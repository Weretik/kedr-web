# 003 — Category table and category page (Admin)

**Application:** Admin (React, MUI). **Status:** accepted 2026-11-26 (owner chose concept A of the [concepts page](https://claude.ai/artifact/QWGaMKrNcnfkURfEJodNW5), plus «Що бракує» and «Як у Google» from concept C, then «делай»). **Backend:** KedrStore #283 adds `modelCount` and `proposedModelCount` to the active admin category list.

## Goal and boundaries

«Категорії» becomes a table like «Моделі»: one tree table with an arrow on each parent, so a person who sees it for the first time can compare categories, find one, show or hide it on the site, and open its page. The category page shows everything about one category in blocks and is edited right on the page, with no right side panel (owner, 2026-11-26: «убрать боковую панель при редактировании»). This replaces spec 001/002 layout (tree + overview card + edit panel); their rules for texts, slugs, site names, search settings, placement, deleting and models stay.

**Out of scope:** drag and drop, bulk actions, a checkbox column, other admin pages (they keep the right panel rule).

## Rules

- **R-001. Tree table.** `/categories` shows every active category in one Data Grid in tree order. Columns: arrow (parents only), «Назва на сайті» (site name, Russian site name under it), «Повний шлях» (names of the ancestors, `—` at the top), «Назва в 1С», «ID», «На сайті», «Товарів», «Моделей», «Чого бракує», «Дії» (open). Top-level categories start open; the arrow opens and closes a parent; «Розгорнути все» / «Згорнути все» toggles all. Clicking a row (not a control in it) or «Відкрити» opens `/categories/:id`. More than 100 visible rows page by 100.
- **R-002. Search and filters.** One search field matches the Ukrainian and Russian names, the site names, the 1C name, the address and the exact ID; filter chips «Без тексту · N», «Сховані · N», «Закриті від пошуку · N», «Створені вручну · N» (N counts all categories). With a search or a chip, matching rows are shown with their ancestors and every parent is open.
- **R-003. «На сайті» in the row.** A switch shows whether the category is on the site. Administrators can flip it; the confirmation of spec 001 opens (how many subcategories follow) and only «Сховати» / «Показати» changes it. Managers see the switch disabled.
- **R-004. «Чого бракує».** Only problems, never an «all good» mark: «Немає тексту» (both languages empty) or «Немає тексту UK» / «Немає тексту RU», «Немає моделей» (a final category without models), «Не перевірено моделей: N». A parent shows only its own text problems. Empty cell when nothing is missing.
- **R-005. Category page header.** Path links (Категорії › ancestors), the site name as h1, «Створена вручну» and «Сховано з сайту» / «Закрито від пошуку» marks when they apply, and actions: «Відкрити на сайті» (`https://classkedr.com.ua/uk/catalog/{slug}`, new tab), and for administrators «Перемістити», «Сховати з сайту» / «Показати на сайті» (R-003 dialog) and «Видалити» (manual categories, spec 002 R-004).
- **R-006. «Основне».** A card with four columns: site name UK and RU, 1C name, ID, path, address, products, models. Administrators get «Редагувати» on the card: the card turns into the site names form and the address form (spec 001/011 behaviour); each saves on its own and «Готово» returns to the view.
- **R-007. «Що бракує».** Under «Основне», when R-004 finds problems: a short list, each item a button that opens the tab where it is fixed. No card when nothing is missing.
- **R-008. Tabs.** «Моделі · N» for a final category (spec 002 R-006 list, «Додати моделі» opens a dialog) or «Підкатегорії · N» for a parent (links to the subcategory pages); «SEO та тексти»; «Пошук і поширення»; «Розташування». One tab at a time; the tab is kept in `?tab=`.
- **R-009. «SEO та тексти».** Two columns, «Українська» and «Русский». Each starts with «Як у Google» (address, title, description cut where Google cuts: 60 and 160 characters, with a note when the site builds the title or description itself), then the texts read-only. Administrators get «Редагувати» per language: the column turns into the content form of spec 001; «Скасувати» or a successful save returns to the view.
- **R-010. «Пошук і поширення».** Read-only: whether the category is closed from search and the share picture. «Редагувати» turns it into the form of spec 011 (switch, media library picker); a save or «Скасувати» returns to the view.
- **R-011. «Розташування».** Read-only «Вкладена в» and the place among neighbours («2 з 5»), with «Вище» / «Нижче» for administrators (immediate, spec 002 R-003) and «Перемістити», which opens a dialog with the parent picker (spec 002 R-005) and «Перемістити» / «Скасувати».
- **R-012. Dialogs instead of panels.** «Нова категорія» (spec 002 R-001, preset parent: none on the list) and «Додати моделі в категорію» (spec 002 R-006) are dialogs. The category edit panel is removed. Success of «Нова категорія» opens the new category page.

**Repeated submits:** every action keeps the pending lock of specs 001/002; no endpoint here takes an `Idempotency-Key`.

**Rule change:** for categories the [right panel rule](../../../../standards/admin/list-detail-pages.md#editing-in-the-right-panel) is replaced by editing on the page (owner, 2026-11-26); the standard and the obsidian `mui-admin-ui` skill record the exception.

## API

`getAdminCategories` (`GET /api/categories?deleted=false`) with `modelCount` and `proposedModelCount` (null for deleted rows and the by-id read). Everything else as in specs 001 and 002.

## File-role map

```text
libs/admin/categories/
├── data-access/src/validators, mappers/admin-category.mapper.ts   # modelCount, proposedModelCount
├── model/src/entities/admin-category.ts                            # counts; siteNameOf
├── model/src/mappers/tree/        # tree order, nodes, family, table rows (R-001), list filter (R-002)
├── model/src/mappers/page/        # placement, problems (R-004), google preview (R-009)
├── ui/src/tables/tree/            # tree grid, columns, name/expand cells, site switch, toolbar (R-001…R-004)
├── ui/src/tables/deleted/         # deleted grid (unchanged)
├── ui/src/details/main/           # main view, problems card, children list
├── ui/src/details/sections/       # google preview, content view, place view, search view
├── ui/src/components/             # form dialog, problem pills (plus manual chip, parent picker, models card)
├── ui/src/forms/                  # content form, FAQ, site names form, search form (no cards)
├── ui/src/dialogs/                # visibility, delete, new category, add models, move
└── feature/src/
    ├── pages/categories-page.tsx, category-details-page.tsx
    ├── components/list/           # tree table, new category flow
    ├── components/page/           # header actions, tabs, body (move, visibility, delete)
    ├── components/sections/       # main, seo, search, placement, site models
    └── hooks/                     # editing/, page/ (page data), tree/ (table view, site visibility), placement/
libs/admin/shared/ui/src/lib/slug/slug-edit-form.tsx                # the address form without a card
```

## Scenarios and tests

- **SC-001 (R-001, R-002).** Rows in tree order with depth, parents open and close, search by 1C name and ID keeps ancestors, chips count and filter — `category-table-rows.spec.ts`, `category-list-filter.spec.ts`, `category-tree-grid.spec.tsx`.
- **SC-002 (R-003).** The row switch opens the confirmation; the confirmed change hides it — `categories-page.spec.tsx`, `use-category-site-visibility.spec.ts`.
- **SC-003 (R-004, R-007).** Problems per language, final category without models, unaccepted models; none for a complete category — `category-problems.spec.ts`, `category-problems-card.spec.tsx`.
- **SC-004 (R-005, R-006, R-008).** The page shows the header, «Основне», tabs; «Редагувати» on «Основне» shows the forms; managers get no edit buttons; a row opens the page — `category-details-page.spec.tsx`, `categories-page.spec.tsx`; «Що бракує» opens the SEO tab and the Ukrainian text saves — `category-details-page.spec.tsx`, E2E `apps/stack-e2e/src/admin/category-texts.spec.ts`.
- **SC-005 (R-009).** Google preview cuts long text and says when the site builds the title — `category-google-preview.spec.ts`, `category-google-preview.spec.tsx`.
- **SC-006 (R-011, R-012).** Move dialog excludes the category itself; the new category and add models dialogs keep spec 002 behaviour — `category-move-dialog.spec.tsx`, `category-new-dialog.spec.tsx`, `category-add-models-dialog.spec.tsx`.

## Audit

[Final feature audit](code-audit/audit.md): no open findings in scope.
