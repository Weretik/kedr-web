# Admin list and detail page standard

**Current rule for React Admin.** Sources: [Admin UI](admin-ui.md), [code organization](admin-code-organization.md), [Admin architecture](../../architecture/admin/README.md). Checked against product and customer code on 2026-10-19. This document defines composition; each feature's SDD defines its fields and actions.

## Lists

- Use a short page heading. The MUI Card containing the list includes mode tabs when needed and the MUI X Data Grid. Tabs have internal Card padding.
- Place search in the Data Grid toolbar. Sorting, filters, and pagination follow the server contract and apply before the page is fetched. Do not repeat the result count below the table.
- Use consistent row heights, Card styling, empty/loading/error states, and a non-sortable, non-filterable “Actions” column with an eye icon, tooltip, and accessible name. When the row can be edited by the current role, the column also has a pencil (`RowEditAction`) that opens the [edit panel](#editing-in-the-right-panel) over the list. Data sets and supported filters vary by feature.
- The Ukrainian MUI and Data Grid locale is connected centrally through the Admin theme. A narrow table keeps all columns and scrolls inside the Card; check toolbar, action, and pagination usability on phones and tablets against the code.

## Details

- Above the content, use `AdminDetailHeader` from `@admin/shared/ui`: a text link with a back arrow to the list, a neutral `h1` such as «Деталі товару» / «Деталі клієнта», and the page actions. Preserve list state in the URL when the feature supports it.
- Build blocks with `SectionCard` (a labelled `section`, or an `article` for the main entity) and `DetailField`/`DetailFieldList` for label and value pairs; show loading with `PageLoader` and a load error as an `Alert` with «Повторити».
- Show the entity name once in the main information block and its ID below. Group data by meaning: use compact cards with labels and values, or tables when tabular comparison helps. Standalone media or other large areas may have their own Card. Do not repeat the name in the page heading.
- On a wide screen, product details follow this order: **photo → main information → diagram** (only when available). On phones, stack blocks in one column; on tablets, use two columns at the theme breakpoints. Customer details use the same heading, back link, Card, spacing, and typography, with three cards: main information across the full width, then contacts and price types in one row from the `md` breakpoint. Keep both rows and the cards in the lower row equal in height. Below `md`, stack the cards in one column with content-based height.
- Use colors, surfaces, text, and focus from the current Admin theme in both light and dark modes. Use `sx` for one-off layouts and a separate component in the relevant `ui` or shared layer for repeated behavior, following dependency rules. Do not copy business fields between domains.

## Editing in the right panel

**Project design rule (product owner, 2026-11-04).** Everything that can be edited in Admin is edited in one place: a panel that slides in from the right (`AdminEditPanel` from `@admin/shared/ui`).

- **The detail page is read-only.** It shows values only, never fields or inline save buttons. When the current role may edit something on it, `AdminDetailHeader` has one contained «Редагувати» button with a pencil icon; managers who may not edit see no button.
- **The list opens the same panel.** The pencil in the «Дії» column opens the same panel component over the list, so the person does not have to open the details first. The eye icon still opens the details page.
- **One panel per entity.** The panel title says what is edited («Редагування категорії», «Редагування товару») and its subtitle names the row. Inside, each block is a `SectionCard` on the panel ground; blocks that the server saves separately (address, texts per language, photos) keep their own «Зберегти». Values that come from 1С (names, prices, stock) are not in the panel.
- **Closing does not lose work.** While a save runs the panel cannot be closed. The page keeps the last edited entity after closing, so unsaved drafts (for example category texts) survive a reopen of the same row.
- **Size and phones.** The panel is 560 px wide, 640 px from `lg`, and full width on phones. It uses the theme surface, divider, and motion; no local tokens.
- **Dialogs stay only for short questions**: confirmations of a destructive step, picking files from the library, or a preview. A centered dialog with an edit form is not used for new work. A long document with its own versions (articles, legal documents) may keep its full editor page.

Shared parts: `AdminEditPanel` (panel frame; `actions` pins «Скасувати»/«Зберегти» to the bottom and `onSubmit` makes the whole panel one form), `SlugEditCard` (address block of a catalog item), `RowEditAction` (pencil in a table). Current panels: [categories](../../features/admin/categories.md), [products](../../features/admin/products.md), [gallery](../../features/admin/gallery.md) (video, titles), [home page](../../features/admin/home-content.md) (FAQ, brands), [users](../../features/admin/users.md) (new user, name, email, password) and [profile](../../features/admin/profile.md).

## Before a new feature

Check the code for an existing page of this type, the theme, locale, breakpoints, and this standard. In the SDD, state what is reused and how the new feature's data and contract differ. Run only automated tests for the changed feature; open a browser only after separate direct user permission for that specific check.
