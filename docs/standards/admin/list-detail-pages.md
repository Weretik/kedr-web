# Admin list and detail page standard

**Current rule for React Admin.** Sources: [Admin UI](admin-ui.md), [code organization](admin-code-organization.md), [Admin architecture](../../architecture/admin/README.md). Checked against product and customer code on 2026-10-19. This document defines composition; each feature's SDD defines its fields and actions.

## Lists

- Use a short page heading. The MUI Card containing the list includes mode tabs when needed and the MUI X Data Grid. Tabs have internal Card padding.
- Place search in the Data Grid toolbar. Sorting, filters, and pagination follow the server contract and apply before the page is fetched. Do not repeat the result count below the table.
- Use consistent row heights, Card styling, empty/loading/error states, and a non-sortable, non-filterable “Actions” column with an eye icon, tooltip, and accessible name. Data sets and supported filters vary by feature.
- The Ukrainian MUI and Data Grid locale is connected centrally through the Admin theme. A narrow table keeps all columns and scrolls inside the Card; check toolbar, action, and pagination usability on phones and tablets against the code.

## Details

- Above the content, place a text MUI Link with a back arrow to the list, followed by a neutral `h1` such as «Деталі товару» / «Деталі клієнта». Preserve list state in the URL when the feature supports it.
- Show the entity name once in the main information block and its ID below. Group data by meaning: use compact cards with labels and values, or tables when tabular comparison helps. Standalone media or other large areas may have their own Card. Do not repeat the name in the page heading.
- On a wide screen, product details follow this order: **photo → main information → diagram** (only when available). On phones, stack blocks in one column; on tablets, use two columns at the theme breakpoints. Customer details use the same heading, back link, Card, spacing, and typography, with three cards: main information across the full width, then contacts and price types in one row from the `md` breakpoint. Keep both rows and the cards in the lower row equal in height. Below `md`, stack the cards in one column with content-based height.
- Use colors, surfaces, text, and focus from the current Admin theme in both light and dark modes. Use `sx` for one-off layouts and a separate component in the relevant `ui` or shared layer for repeated behavior, following dependency rules. Do not copy business fields between domains.

## Before a new feature

Check the code for an existing page of this type, the theme, locale, breakpoints, and this standard. In the SDD, state what is reused and how the new feature's data and contract differ. Run only automated tests for the changed feature; open a browser only after separate direct user permission for that specific check.
