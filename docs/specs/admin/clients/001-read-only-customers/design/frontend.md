# Customers — frontend design

## Verified baseline as of 2026-10-19

| Area    | Fact and source                                                                                                                                        | Goal                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Modules | `libs/admin/clients/{feature,data-access,ui,model}/project.json` already exist; [domain rules](../../../../../architecture/admin/structure/domains.md) | extend existing modules without cross-domain imports                                                           |
| Router  | `apps/admin/src/app/router/app-router.tsx` connects clientsRoutes                                                                                      | preserve existing routes and list URL context                                                                  |
| Menu    | `libs/admin/core/shell/src/components/navigation/admin-navigation.tsx`                                                                                 | keep the existing «Клієнти» item unchanged                                                                     |
| API     | [Admin state/API](../../../../../architecture/admin/runtime/state-and-api.md)                                                                          | `baseApi.injectEndpoints` in clients data-access; runtime validation, mapper, and types from generated OpenAPI |
| UI      | `libs/admin/clients/ui/src/tables/customers-data-grid.tsx`, `package.json`                                                                             | one MUI quick search in the table toolbar, with no column filters or sorting                                   |
| Tests   | `package.json`, [testing rules](../../../../../standards/shared/testing-rules.md)                                                                      | automated tests for this feature; browser journey only with separate approval                                  |

The existing domain already has Nx projects and routes. `feature` owns `/customers` and `/customers/:counterpartyId`, search and pagination in the URL, and page composition; `data-access` owns RTK Query list/detail, runtime validation, and mapping; `ui` owns the table and read-only fields without HTTP/router dependencies. `model` normalizes the query; obsolete column-filter parameters are not restored from the URL. An invalid ID never reaches HTTP. A `404` means not found; other errors offer retry. After implementation, compare the actual [feature page](../../../../../features/admin/clients.md) and Admin index.

**Update 2026-10-20:** The table sends `sort` to the server API for name, phone, and ID in both directions. `feature` stores `sort` in the URL and resets the page to 1 when it changes; `model` accepts only provider enum values. The table uses `sortingMode="server"`. The goals above and the decision to disable sorting describe the 2026-10-19 baseline and are superseded by this update.

The detail page uses the [shared list/detail format](../../../../../standards/admin/list-detail-pages.md): the same MUI Link with `ArrowBackIcon` as product details, and a neutral page heading. `CustomerDetailsContent` composes three separate Cards: name and ID, contact details, and price types. Each child component owns its card, while `CustomerDetailField` provides consistent label/value presentation. Details use no tables; phone, tablet, and wide layouts use the current Admin theme breakpoints and colors without a custom palette.

## Responsibility audit

| File                   | Current role              | Decision                                                                                    |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------------------------- |
| `app-router.tsx`       | route composition         | existing `clientsRoutes` remain; page JSX does not belong here                              |
| `admin-navigation.tsx` | menu configuration/render | existing item and nested active state remain without customer logic                         |
| customers Data Grid    | quick search in toolbar   | one `searchTerm` and page/pageSize are sent to API; column filters and sorting are disabled |

No new packages are needed: MUI, `@mui/x-data-grid`, RTK Query, and React Router are already in `package.json`/lockfile. Customer data is not moved into a shared Redux slice because RTK Query owns the server cache. Contact fields are not logged.

## Responsive layout and themes

Verified as of 2026-10-19: `apps/admin/src/app/theme/admin-theme.ts` defines `xs: 0`, `sm: 600`, `md: 900`, `lg: 1200`, `xl: 1440`, and `light`/`dark` schemes; `apps/admin/src/app/providers/app-providers.tsx` applies this theme through MUI `ThemeProvider` with `defaultMode="system"`. [Admin UI rules](../../../../../standards/admin/admin-ui.md) require existing MUI patterns/theme and checks of narrow and wide layouts.

The Data Grid, card, and its states must use colors and typography from the Admin theme. Do not introduce locally hard-coded light colors. Verify in code that `light`/`dark` are connected, all columns can be reached by horizontal scrolling on phones and tablets, row actions and pagination are accessible, and loading/empty/error states are covered. Do not treat actual browser layout, overlap, or focus as verified without asking separately and receiving the user's direct approval for that specific inspection.
