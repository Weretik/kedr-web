# Frontend design

## Verified baseline before implementation, 2026-10-21

Before this change, `apps/admin/src/app/router/app-router.tsx` connected dashboard/products/clients, and `libs/admin/core/shell/src/components/navigation/admin-navigation.tsx` had no orders item. Products and Clients established the UI composition described by the [standard](../../../../../standards/admin/list-detail-pages.md). Admin used RTK Query in domain data-access, generated OpenAPI types at the transport boundary, and runtime validation. The orders domain was created in this implementation.

## Planned boundaries

- Create `libs/admin/orders/{model,data-access,ui,feature}` with only the required Nx projects/exports, following the [domain rules](../../../../../architecture/admin/structure/domains.md). `feature` owns routes `/orders`, `/orders/new`, `/orders/:orderId`, `/orders/drafts/:draftId`, `/orders/drafts/:draftId/edit`; determine exact route order to avoid collisions.
- `orders/data-access` injects endpoints through `baseApi.injectEndpoints` and performs runtime validation/mapping; `feature` orchestrates requests and URL state; `ui` renders tables/cards/forms without HTTP. Customer search uses the existing Admin customer query through an allowed boundary; define cross-domain imports and ownership in EN-001 without weakening Nx boundaries.
- The current local set belongs to `orders/feature/state` or app orchestration. Versioned `localStorage` stores only productId/quantity, is read during bootstrap, and discards a corrupt payload with a message; write after each change. Tabs coordinate state through the `storage` event or explicitly report a conflict, without silently losing data.
- Product buttons cannot import the orders feature directly under the [dependency rules](../../../../../architecture/admin/structure/dependencies.md). The direction selected for EN-001: an app-level route factory passes an add-product callback to the products feature; the callback in `apps/admin` invokes the orders state action. Products does not import orders, and no shared event bus is needed. EN-001 checks this direction against the actual Nx graph before code is written.
- The URL contains tab, page, pageSize, search, sort, and counterpartyId separately for each tab. Debounce search and cancel stale requests; RTK Query cache keys include all criteria, and mutations invalidate the required lists/details.
- Before a write, the UI obtains a quote; it does not calculate prices from the product list price. Changing the customer/quantity invalidates the quote; submission stays blocked until a new quote is available. If the backend reports a quote change, show the current total and ask for confirmation again.
- Tables/details use the current Admin theme, locale, Card, Data Grid, back arrow, and accessible action icons. The delete dialog identifies the draft and has an explicit destructive action. Do not copy product or customer components without demonstrated reuse.
- Automate tests for state/persistence changes, mapper, URL, both tables, confirmation, and errors; browser checks require separate explicit permission.

**EN-001:** record the route factory signature, callback, and public exports; the customer picker uses the existing customer search through an allowed public data-access contract after checking Nx constraints.

**EN-001 decision after implementation:** `createProductsRoutes({ onAddProduct })` accepts an app-level callback; `createOrdersRoutes({ CustomerPicker, ProductPicker })` accepts app-owned adapters; `CustomerOrdersPanel({ counterpartyId, returnTo })` is a public export for `createClientsRoutes({ renderOrdersPanel })`. `apps/admin/src/app/router/app-router.tsx` connects these boundaries. App adapters use public clients/products data-access; the orders domain imports no other domains. The four orders libraries have separate Nx project tags and aliases.

`DraftDetail` with `pricingStatus=Unavailable` displays nullable prices as unavailable. `Quote` has strict non-null fields; its key depends on the customer and lines. After those data change, the previous quote does not enable submission. A price conflict is tied to the current key and requires new confirmation.

## Architecture baseline and target Nx boundaries

At the start of 2026-10-21, `apps/admin/project.json` had tags `scope:admin,type:app`, while `products/feature` and `clients/feature` had `scope:admin,domain:<name>,type:feature`; orders Nx projects did not exist. The four orders libraries now have tags `scope:admin,domain:orders,type:<layer>`, aliases `@admin/orders/<layer>`, and public `src/index.ts` files. Existing `@nx/enforce-module-boundaries` and the project boundary script remain in place; validation passed for 71 projects.
