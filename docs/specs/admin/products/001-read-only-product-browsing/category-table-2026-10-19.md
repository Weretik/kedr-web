# Category in the products table — 2026-10-19

**Goal.** In all three table modes, show the Ukrainian category name, allow selection from a tree, and support server sorting by category.

## Rules and scenarios

- **R-CAT-01.** The «Категорія» column displays `categoryName` from the Admin API or a clear fallback when the name is unavailable. The column is sorted on the server by Ukrainian name, not within the current page.
- **R-CAT-02.** The table's built-in toolbar contains an MUI Autocomplete with search and a category tree from `GET /api/categories`. Any level, including root and intermediate nodes, can be selected by clicking its name. Levels are distinguished by indentation in the list; the visible label contains only a clear Ukrainian name without an ID. A separate arrow beside a parent node expands/collapses descendants without selecting the category. Search includes ancestor names and temporarily shows them alongside a matching child category regardless of the branch's expanded state. Categories from the public Angular catalog use the same Ukrainian labels; other categories use API `shortNameUk`. Clearing removes the filter.
- **R-CAT-03.** The selected `categoryId` is sent to the server before pagination on every tab. The server includes the selected category and all its descendants. Changing category returns to the first page; each tab's separate state is stored in the URL.
- **R-CAT-04.** There is no «На сайті» column: the same-named tab represents that property.
- **SC-CAT-01.** When the user searches for a category and selects any tree level, the list shows nested indentation and short Ukrainian names without technical IDs; the request contains the selected category ID and `page=1`, and the Data Grid shows the server `rowCount`.
- **SC-CAT-02.** When the user sorts the category column, the request contains `CategoryAsc` or `CategoryDesc`; pages retain the global order.
- **SC-CAT-03.** When the user switches tabs and returns from details, each tab's category selection is restored.

## Boundaries and decisions

`@admin/products/data-access` consumes `getAdminCategories` and list operations; generated DTOs remain at the transport boundary. `model` stores category ID, name, and depth, `feature` owns URL/query state, and `ui` owns the selection control and table without HTTP/router. Ukrainian labels for known categories were checked against `apps/storefront/src/app/localization/translations/catalog.translation.ts` and mapped to public-tree IDs from `libs/storefront/data-access/src/lib/catalog/config/catalog-category-slugs.constants.ts`; other names come from the API. MUI [Autocomplete](https://mui.com/material-ui/react-autocomplete/) supports controlled selection; indentation and a separate arrow button on parent nodes convey hierarchy in the list. The `getAdminCategories` response is ordered depth-first; an empty list or directory error does not block the products list. No browser checks were performed.

**Name source checked 2026-10-19:** static Angular Storefront code and the OpenAPI Admin categories contract. Current server data was not checked.

**Addendum 2026-10-20 — table display:** in all three modes, the product column shows only `nameUk`; the category name and path are built from the `getAdminCategories` directory, from parent to child through `parentId`. Long text wraps and row height follows its content. If a category is missing from the directory, use `categoryName` from the list; if that is empty, show the category ID. According to backend code, an empty API `categoryName` occurs when the category is not found by the projection ID; actual server data was not checked. The previous requirement to show «Назва недоступна» for this case has been replaced. The targeted Red test `products-data-grid.spec.tsx` reproduced the old display; the final UI run passed 6/6 and UI TypeScript checks passed. The browser was not opened.

**Addendum 2026-10-20 — category filter:** branches are collapsed initially; the arrow button separately toggles descendant visibility, while clicking a name selects the parent or child node. Ancestors expand for a category restored from the URL. Search temporarily shows matches with their ancestors. The targeted test `products-grid-toolbar.spec.tsx` covers collapsing, expanding, selecting a parent, and searching for a child node.

During the static audit of this increment, the toolbar, boolean-filter header, and view action were extracted from `products-data-grid.tsx` into separate components; the table retains composition of columns and the controlled MUI Data Grid. The style reference for the table is the [shared Admin standard](../../../../standards/admin/list-detail-pages.md). The audit does not cover other domains or the whole application.

| Task                          | Scenario     | Evidence                                          |
| ----------------------------- | ------------ | ------------------------------------------------- |
| TS-CAT-01 — API and model     | SC-CAT-01–03 | category and query mappers, targeted tests        |
| TS-CAT-02 — URL and UI        | SC-CAT-01–03 | targeted state, control, and sorting tests        |
| TS-CAT-03 — feature documents | SC-CAT-01–03 | current feature description and consumer contract |

Lists use colors from the current light/dark theme, the `uk-UA` locale, and Admin responsive rules. Code checks cover phone and tablet breakpoints, focus, and accessible names; browser checks and a full run require separate authorization.
