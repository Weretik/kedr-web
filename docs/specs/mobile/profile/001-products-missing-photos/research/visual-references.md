# Товари без фотографій у профілі — visual references

| Question             | Chosen pattern                                                   | Evidence/reference                                                 | Rejected alternative                    | Reason                                                                        |
| -------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------------------- |
| Product presentation | reuse current Mobile catalog card/list hierarchy                 | `libs/mobile/catalog/ui/src/components/products/`; catalog SDD 003 | new Profile-specific card               | product identity and missing-image fallback already exist                     |
| Empty state          | context-specific positive completion message                     | Mobile UI state rules + feature goal                               | generic «Товарів поки немає»            | generic copy implies unavailable catalog rather than completed photo coverage |
| Long-list rendering  | existing `FlashList` list pattern                                | `CatalogList`; `docs/standards/mobile-ui.md`                       | nested `ScrollView` or desktop table    | preserves performance and one scroll owner                                    |
| Details interaction  | existing `/product/[productSlug]` only when contract supports it | product-details SDD 004 and route implementation                   | new detail screen or guessed identifier | explicitly out of scope                                                       |
| Refresh/pagination   | native refresh plus current footer pattern                       | `CatalogResults`, `CatalogListFooter`                              | hidden auto-pagination                  | explicit recovery and accessibility are already established                   |

## Reference inventory

| Reference                                             | Applies to                                         | Authority                      | Date/version               |
| ----------------------------------------------------- | -------------------------------------------------- | ------------------------------ | -------------------------- |
| `docs/specs/mobile/catalog/003-catalog-discovery-ui/` | card/list hierarchy, spacing, theme, accessibility | related implemented feature    | inspected 2026-10-03       |
| `docs/specs/mobile/catalog/004-product-details/`      | supported detail route and Back behavior           | current scenario-first feature | inspected 2026-10-03       |
| `libs/mobile/catalog/ui/src/components/products/`     | actual reusable primitives                         | repository implementation      | workspace state 2026-10-03 |
| `apps/mobile/src/app/(tabs)/profile.tsx`              | current Profile baseline                           | repository implementation      | workspace state 2026-10-03 |

No external screenshot or Figma frame was provided. The repository's current
Mobile product patterns are therefore authoritative for structure, while
canonical OpenAPI remains authoritative for data.
