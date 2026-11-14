# Admin code rules

**Applies to:** `apps/admin` and `libs/admin/**`.

The rules are the shared [frontend code organization rules](../shared/code-organization.md): libraries and dependencies, [role folders](../shared/code-organization.md#role-folders), [nesting and size](../shared/code-organization.md#nesting-and-size), [one responsibility per file](../shared/code-organization.md#one-responsibility-per-file), [tests](../shared/code-organization.md#tests), the [application folder](../shared/code-organization.md#application-folder), forbidden names, state, and [pages, routes, and links](../shared/code-organization.md#pages-routes-and-links). This file adds only what is specific to Admin.

## Admin specifics

- `@admin/shared/routing` provides the router-aware `LinkBehavior` and `routerLinkComponents`. The Admin theme spreads them; page tests that render without the app pass `routerLinkComponents` to `createTheme`.
- `no-restricted-imports` in the root `eslint.config.cjs` blocks `react-router`, `react-router-dom`, and `@admin/shared/routing` in `libs/admin/*/ui` and `libs/admin/shared/ui`.
- `libs/admin/shared/ui` keeps the generator's `src/lib/` level: groups live in `src/lib/<category>/`.

- Feature `hooks/` hold controllers for RTK Query: one hook per page or block owns its queries, mutations, and panel state (for example `use-my-tasks-board.ts`), and the component only renders.
- App-injected cross-domain components live in `apps/admin/src/app/slots/` (for example the customer picker that the orders feature receives from the app).

## Known deviations

Existing code that does not follow these rules yet; `npm run architecture:structure` lists every one in [the baseline](../../../tools/architecture/structure-baseline.json). Fix an entry when the code is next changed or in the [frontend restructure](#restructure-plan); do not copy these layouts into new code.

| Path under `libs/admin/` or `apps/admin/`                             | Deviation                                                  | Target                                                                                                         |
| --------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `products/data-access`, `users/data-access`, `categories/data-access` | No runtime response validation; mappers read DTOs as typed | `validators/` with zod schemas, as in `orders` and `clients` (restructure stage 7)                             |
| `apps/admin/src/app/theme/components.ts`                              | Over the line limit                                        | keep: one MUI component override table, split only when it grows                                               |
| `products/ui/src/tables/products-data-grid.tsx`                       | Four lines over the limit                                  | keep: only wires the MUI DataGrid props; columns, filters, and the panel width already live in their own hooks |

### Restructure plan

The frontend restructure of 2026-11-14 fixes these entries stage by stage (Admin, then Mobile, then Site, then missing tests and validators) and removes each fixed line from the table and the baseline. Stage 4 (Admin) is done: the remaining rows are the zod validators of stage 7 and two `keep` decisions.
