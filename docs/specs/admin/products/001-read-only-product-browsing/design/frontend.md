# Products — frontend design

## Verified baseline as of 2026-10-19

| Area   | Fact and source                                                                                                                          | Goal                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| App    | `apps/admin/project.json`, `apps/admin/src/app/router/app-router.tsx`                                                                    | add the detail route to `productsRoutes`; the root router contains no page code.                    |
| Layers | `libs/admin/products/{feature,data-access,model,ui}/project.json`, [rules](../../../../../architecture/admin/structure/dependencies.md)  | extend the existing domain; DTO remains in data-access and UI receives the model.                   |
| List   | `libs/admin/products/feature/src/pages/products-page.tsx`, `libs/admin/products/ui/src/tables/products-data-grid.tsx`                    | server-side search, filtering, sorting, and pagination in Data Grid without the old separate panel. |
| API    | `libs/admin/products/data-access/src/api/admin-products.api.ts`, [state/API](../../../../../architecture/admin/runtime/state-and-api.md) | new RTK Query queries through `baseApi.injectEndpoints`, runtime validation, and mapping.           |
| Menu   | `libs/admin/core/shell/src/components/navigation/admin-navigation.tsx`                                                                   | rename “Catalog” to «Товари» and extend active state to nested details.                             |
| Tests  | `package.json`, [testing rules](../../../../../standards/shared/testing-rules.md)                                                        | automated tests for this feature; build and browser journey only with separate approval.            |

The current list uses server-side sorting and pagination only for «Усі товари»; it does not provide local filtering across the full server result set. The old SDD is retained as implementation history. A static review is not a full project audit.

## Decisions

### List update, 2026-10-19

`ProductsUrlState` has a separate `siteQuery` and `site` mode. `ProductsPage` uses the same `useGetProductsListQuery` as «Усі товари», but forces `exportToSite: true` for the «На сайті» tab; the regular tab omits this condition. `missingQuery` and its separate endpoint are unchanged. `ProductsDataGrid` leaves the flag column without a header filter, and the Data Grid footer remains the only place showing the count. The initial decision below about two modes and four boolean column filters is historical and superseded by this update.

- `feature` owns the mode, routes, context restoration, and page composition. For all three modes, the URL stores search, supported filters, sort/page/pageSize; changing conditions resets the page. Invalid URL values are normalized without sending unsupported conditions.
- `model` stores the tri-state `undefined|true|false` for the four flags. Do not convert `false` to “no filter”, especially for `inStock`.
- `data-access` consumes the extended `getAdminProducts` and `getAdminProductsWithUnavailablePhotos` operations and the new Admin detail by slug; it validates responses and maps them to owned models. Public detail remains the historical path until the switch. DTOs do not leave data-access.
- `ui` extends the existing Data Grid with an accessible view action shared by all three modes. Internal navigation remains in `feature`, not `ui`.
- The detail route is `/catalog/:productSlug`. A non-empty slug is validated before the request; a `404` from public details is not replaced with row data, which could give the impression of a complete card.
- Product detail query: new `GET /api/admin/products/by-slug/{productSlug}` after synchronizing provider OpenAPI. The `/catalog/:productSlug` route remains, so existing direct links do not change. The photo has a fallback; omit the scheme section when its URL is empty or loading fails.
- For the regular list, support category/price range only as defined by its contract; for «Без фото», support search, four booleans, and sort. On return, restore the full list state from the URL. Data Grid sorting is available only for ID/name/price fields supported by the server.
- The public URL must use the configurable storefront address, `uk` locale, `/catalog/product/:productSlug` route, and URI-encoded slug; show it only when `exportToSite=true` and the slug is non-empty. The `exportToSite` value from the Admin response is authoritative.
- After implementation, update the [feature description](../../../../../features/admin/products.md) and index if the route or purpose changed. The old SDD remains historical.

## Responsibility audit

| File                     | Current role                       | Decision                                                                         |
| ------------------------ | ---------------------------------- | -------------------------------------------------------------------------------- |
| `products-page.tsx`      | query, tabs, and table composition | server-side filter/search/sort for all three modes, split between feature and UI |
| `products-data-grid.tsx` | rows, states, pagination           | controlled Data Grid; do not add HTTP/router imports                             |
| `admin-navigation.tsx`   | menu configuration and rendering   | local label and active-state change; do not move domain rules                    |

No new packages are needed: `@mui/x-data-grid` and MUI are already installed (`package.json`, lockfile). `React Router`, RTK Query, and Axios follow the current [Admin rules](../../../../../architecture/admin/README.md).

## Responsive layout and themes

Verified as of 2026-10-19: `apps/admin/src/app/theme/admin-theme.ts` defines `xs: 0`, `sm: 600`, `md: 900`, `lg: 1200`, `xl: 1440` and `light`/`dark` schemes; `apps/admin/src/app/providers/app-providers.tsx` applies this theme through MUI `ThemeProvider` with `defaultMode="system"`. [Admin UI rules](../../../../../standards/admin/admin-ui.md) require existing MUI patterns/theme and checks of narrow and wide layouts.

Tabs, Data Grid, card, states, and image fallbacks must use colors and typography from the Admin theme. Do not introduce locally hard-coded light colors. Verify in code that `light`/`dark` are connected, `< sm` is used for phones, `sm`–`md` for tablets, row actions and pagination are accessible, and loading/empty/error and image fallback states are covered. Do not treat actual browser layout, overlap, or focus as verified without asking separately and receiving the user's direct approval for that specific inspection.
