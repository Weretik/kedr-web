# Mobile order history — visual references

| Question              | Chosen pattern                          | Evidence/reference                                                      | Rejected alternative             | Reason                                       |
| --------------------- | --------------------------------------- | ----------------------------------------------------------------------- | -------------------------------- | -------------------------------------------- |
| History hierarchy     | Vertical summary cards                  | [User screenshot](order-history-reference.png)                          | Desktop table                    | Fits compact touch browsing                  |
| List pagination       | Explicit load-more footer and refresh   | `libs/mobile/catalog/feature/src/components/catalog-results.tsx`        | Infinite scroll                  | Matches agreed/current catalog behavior      |
| Query-control split   | Filter controls separate from results   | `libs/mobile/catalog/feature/src/components/catalog-query-controls.tsx` | API/filter logic inside list     | Matches current feature responsibility split |
| Customer filter       | Searchable bottom sheet plus all option | Existing `libs/mobile/cart/ui/src/lib/customer-selector-sheet.tsx`      | Inline long dropdown             | Reuses learned flow for 30–50 clients        |
| Detail composition    | Cart-like read-only lines and summary   | Existing Mobile cart screen/rows                                        | Editable cart controls           | Order detail is authoritative read-only      |
| Colors and typography | Central Paper theme                     | `libs/mobile/core/shell/src/theme/app-theme.ts`                         | Screenshot red/local font tokens | Corporate application theme is authoritative |
| Status presentation   | Compact semantic chip plus text         | Existing order status vocabulary and Paper components                   | Color-only badge                 | Accessible and localized                     |

## Reference inventory

| Reference                     | Applies to                        | Authority                              | Date/version |
| ----------------------------- | --------------------------------- | -------------------------------------- | ------------ |
| `order-history-reference.png` | Card hierarchy and density        | User-provided; composition only        | 2026-09-17   |
| Current Mobile catalog        | Pagination, refresh, footer retry | Repository behavior                    | 2026-09-17   |
| Current Mobile cart           | Customer selection/detail rows    | Repository behavior, adapted read-only | 2026-09-17   |
| Current Mobile shell/theme    | Navigation, colors, typography    | Repository authority                   | 2026-09-17   |

The reference screenshot does not authorize its status tabs, red palette,
font, hamburger menu, tracking number, Details button or bottom navigation.
