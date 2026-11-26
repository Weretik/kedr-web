# 001 — «Вітрина сайту» split into «Моделі», «Перевірка», «Ознаки та фільтри»

- **Client:** React Admin (`apps/admin`)
- **Domain:** site models (`libs/admin/site-models`), attributes dictionary (`libs/admin/catalog-attributes`), shell menu, «Огляд» links
- **Backend:** KedrStore spec `catalog/007-site-models` stage 9 (R-22–R-25; contract source of truth), PR Weretik/KedrStore#273
- **Status:** implemented 2026-11-26; audit: [code-audit/audit.md](code-audit/audit.md)
- **Source:** owner requests of 2026-11-26 in the thread «Улучшить UX страницы «Вітрина сайту»» and the concept canvas «Вітрина сайту — концепт» (https://claude.ai/artifact/72FnMkg3CRhiD87vYuBvnt); UX analysis https://claude.ai/artifact/UYweaxAdAAkCPC22eEv5FL

## Goal and scope

A person who opens the site part of the catalog first sees and manages the **models** (what is on the site, in which category, with which switchers and SEO), not a problem queue. Review work after a 1C sync lives on its own page, and the attributes dictionary on a third. Every action on models (create, edit, move to another category, add products) is one shared right panel that opens from any related page, so the person never has to look for the page where an action lives.

**Out of scope:** bulk accept (owner 2026-11-05), AI drafts (backend stage 8), the public site, mobile, a model's slug (stays on spec 006 routes), deleting a model.

## Rules

- **R-001. Menu.** «Каталог» shows, in this order: «Товари», «Моделі» (`/site-models`), «Перевірка» (`/site-review`), «Ознаки та фільтри» (`/site-attributes`), «Категорії», «Медіа». «Вітрина сайту» is gone from the menu.
- **R-002. «Моделі» list.** A server-paged Data Grid of all models like «Товари»: «Фото», «Модель» (name; a proposal carries the chip «Не перевірена»), «Категорія на сайті» (name only; where 1C keeps the products is not shown, owner 2026-11-26), «Товарів» (on-site count), «Перемикачі» (axis names, «—» without), «Чого бракує» (problem pills; empty cell when nothing is missing, no «all OK» badge), «Дії» (eye, pencil). No checkbox column. The toolbar has a search (name), the collapsible category tree filter, a status filter «Усі / Прийняті / Не перевірені» and a «Чого бракує» filter («SEO», «Перемикачі», «Фото», «Значення ознак»). Search, filters, page and the open panel live in the URL. The header has «+ Нова модель».
- **R-002a. Products under a model.** Each row of «Моделі» starts with an arrow (owner, 2026-11-26): it opens the model's products right under its row, across the whole table (photo, 1C name, code, retail price, «На сайті» / «Не на сайті»), read from the model (`getAdminSiteModel`); the arrow again closes them. Several models can be open; the list stays as it is. «Категорія на сайті» shows the full path («Фурнітура > Ручки > На планці») and wraps instead of widening the column.
- **R-003. Model page.** The eye opens `/site-models/:id`: `AdminDetailHeader` with the name, «Не перевірена» for a proposal, back link keeping the list state, «Редагувати» and, for a proposal, «Погодити». Read-only blocks: main card (category on the site, products count, problems; fields in a horizontal grid), then tabs with one section shown at a time (owner, 2026-11-26): «Товари» (product rows with photo, name, 1C code, axis values and «Чого бракує»; «Додати товар», «Прибрати», «Заповнити з назв»), «Характеристики», «SEO та опис» (summary per language). The axis value pickers in product rows stay inline (owner-accepted exception, variant A of the concept: a value is one click per product, a panel per value would be slower).
- **R-004. «Редагування моделі» panel** (pencil in the list, «Редагувати» on the page): blocks «Назва», «Категорія на сайті» (final categories only; the note says every product of the model moves on the site and 1C and «Товари» keep their category; a proposal is accepted with it), «Перемикачі», «SEO та опис» (UK/RU, own «Зберегти» per language). Each block saves on its own.
- **R-005. «Нова модель» panel** (from «Моделі», «Перевірка → Товари без моделі», and a product's «Додати в модель»): name, final site category, products searched by name or 1C code in the whole catalog with the switch «Вільні (без моделі) / Усі товари» (free first and default); a product of another accepted model shows «Уже в моделі «…»» and cannot be added. «Створити модель» needs a name and a category; a product that came with the panel is preselected. On success the model page opens.
- **R-006. «Додати в модель» panel** (from a model's «Додати товар», and from a product in no model): products of the whole catalog, free first, each with its 1C category; or for one product a model picker. Adding a product of another 1C category is allowed (backend R-23).
- **R-007. «Перевірка».** Tabs «Нові моделі · N» (the existing one-by-one review: queue with the open proposal, «Погодити і далі», «Пропустити», «Об’єднати сюди»), «Товари без моделі · N», «Коди з 1С · N» (the undecoded codes tab of the dictionary). Counts come from the health and codes data; a tab with 0 still shows. The tab is in the URL (`?tab=new|lone|codes`).
- **R-008. «Товари без моделі».** A table of on-site products in no model: photo, name with 1C code, 1C category, «Додати в модель» (a model picker prefilled with a similar model by name in the same category when there is one, with the note «Схожа модель за назвою — підставлено автоматично»; «Додати» saves) and «+ Нова модель» (opens R-005 with this product). After a save the row leaves the table.
- **R-009. «Ознаки та фільтри».** Tabs «Ознаки» and «Фільтри категорій» from the attributes feature with «Нова ознака» for Admin, as before.
- **R-010. Old addresses.** `/site-showcase` (no tab) → `/site-models`; `?view=review` → `/site-review?tab=new`; `?view=lone` → `/site-review?tab=lone`; `?view=problems` → `/site-models?problem=any`; `?item=m{id}` → `/site-models/{id}`; `?tab=attributes|filters` → `/site-attributes?tab=…`; `?tab=codes` → `/site-review?tab=codes`; `/catalog-attributes` → `/site-attributes` (`?tab=codes` → «Перевірка»). «Огляд» links point to the new pages.
- **R-011. Shared panel from any page.** A product in no model can be handled from «Перевірка», from «Моделі» panels, and from the product page in «Товари» («Модель на сайті»: the model name as a link, or «Без моделі» with «Додати в модель» / «Нова модель»), using the same panels.
- **R-012. States and look.** Loading, empty («Моделей ще немає» / «Нічого не знайдено» / «Усі товари в моделях»), error with «Повторити» follow the [list and detail standard](../../../../standards/admin/list-detail-pages.md); light and dark theme, phones, Ukrainian copy from the Admin theme and locale only. Mutations have a pending lock; the server sets values, so no `Idempotency-Key` ([idempotency rules](../../../../standards/shared/idempotency-rules.md)).

## Scenarios

| ID          | Scenario                                                                                                                                                                         | Test level       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| **SC-001**  | The menu shows «Моделі», «Перевірка», «Ознаки та фільтри» in «Каталог» and no «Вітрина сайту».                                                                                   | component        |
| **SC-002a** | An arrow opens the products of a model under its row and closes them — `site-models-page.spec.tsx`, `site-models-grid-rows.spec.ts`                                              | component        |
| **SC-002**  | «Моделі» maps the list: a moved model shows only its site category, never «У 1С: …»; a model without problems has an empty «Чого бракує» cell; a proposal shows «Не перевірена». | unit + component |
| **SC-003**  | Typing a search or picking a category, status or problem filter sends it and resets the page; the URL keeps it.                                                                  | unit + component |
| **SC-004**  | The pencil opens «Редагування моделі»; picking another final category saves it and the row shows the new category; a parent category cannot be picked; a server error is shown.  | component        |
| **SC-005**  | «+ Нова модель» with a name, a category and two free products creates the model and opens its page; without a name or category «Створити модель» is locked.                      | component        |
| **SC-006**  | The model page shows the read-only blocks; «Погодити» accepts a proposal; «Додати товар» opens the panel with free products first and adds one of another 1C category.           | component        |
| **SC-007**  | «Перевірка» opens on the tab from the URL with counts; «Нові моделі» keeps the review flow.                                                                                      | component        |
| **SC-008**  | «Товари без моделі»: a row with a similar model has it prefilled and «Додати» adds the product; «+ Нова модель» opens the panel with this product preselected.                   | unit + component |
| **SC-009**  | «Ознаки та фільтри» shows its two tabs and «Нова ознака» for Admin only.                                                                                                         | component        |
| **SC-010**  | Each old address of R-010 lands on the matching new page; «Огляд» links open the new pages.                                                                                      | unit             |
| **SC-011**  | The product page in «Товари» shows its model as a link, or «Без моделі» with both actions opening the shared panels.                                                             | component        |
| **SC-012**  | Loading, empty and error states on «Моделі», «Товари без моделі» and the model page; «Повторити» refetches.                                                                      | component        |

## Design

Reused: the site models data access and its tag `SiteModels` (every change refreshes all site models data), the category tree and picker, problem pills, product thumb, the axis value picker and products card, the SEO texts card, the review queue (now «Нові моделі»), `AdminEditPanel`, `AdminDetailHeader`, `RowEditAction`, the attributes feature's dictionary tabs. New contract parts: `GET /api/admin/site-models` (list, already in the contract, first used here), `PUT /api/admin/site-models/{id}/category`, `oneCCategories` on the list item and the model.

```text
libs/admin/site-models/
├── model/src/entities/models/site-model-list.ts        new: list row, list query
├── model/src/queries/                                  + list URL state (search, filters, page) and review tab
├── data-access/src/api/site-models.api.ts              + getSiteModels, changeSiteModelCategory
├── data-access/src/mappers/site-model-list.mapper.ts   new: list mapping and query params
├── ui/src/tables/                                      new: models data grid, columns, toolbar; lone products table
├── ui/src/panels/                                      existing add-products panel → free-first switch; + new model form blocks, edit model blocks
└── feature/src/
    ├── site-models.routes.tsx                          routes of the three pages, model page, old addresses
    ├── pages/                                          models list, model page, review, attributes and filters pages
    ├── components/panels/                              «Редагування моделі», «Нова модель», «Додати в модель» (one place, used by every page)
    ├── components/review/                              review tabs, lone products tab (the queue stays for «Нові моделі»)
    └── hooks/                                          list controller, panels controller, lone product actions
libs/admin/core/shell/src/navigation/navigation-groups.tsx   menu items
libs/admin/dashboard/model/src/mappers/catalog-attention.ts   new links
libs/admin/products/…                                        «Модель на сайті» block on the product page (R-011)
```

Each folder holds at most six production files, components stay under 150 lines and hooks/models under 200, every file has its spec; a split is planned before a file nears its limit ([code organization](../../../../standards/shared/code-organization.md)).

## Tasks

| ID         | Task                                                                                                                          | Depends on |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **EN-001** | Contract sync from the backend branch; model and data-access for the list, category change, `oneCCategories`                  | backend PR |
| **TS-001** | «Моделі» list page, model page, «Редагування моделі», «Нова модель», «Додати в модель» panels (SC-002…SC-006, SC-012)         | EN-001     |
| **TS-002** | «Перевірка» with «Товари без моделі», «Ознаки та фільтри», menu, old addresses, «Огляд» links (SC-001, SC-007…SC-010, SC-012) | EN-001     |
| **TS-003** | «Модель на сайті» on the product page in «Товари» (SC-011)                                                                    | TS-001     |
| **TS-004** | Feature cards and catalog, standards (shared panel rule, inline axis values exception), specification index                   | TS-001…003 |
| **TS-005** | Full feature audit, `architecture:structure`, `architecture:boundaries`; fix every finding                                    | TS-004     |

## Verification plan

`npx nx run <changed project>:vite:test -- --run`, lint and typecheck of the changed projects, `npm run architecture:structure`, `npm run architecture:boundaries`, `npm run docs:check`, `npm run contracts:check`. No browser or E2E without the owner's separate permission. After the backend PR merges, `npm run contracts:sync` from `master` before the frontend merge.
